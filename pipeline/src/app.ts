import chalk from 'chalk';
import prompts from 'prompts';
import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs';
import path from 'path';
import { exec } from "child_process";
import { appCode, interfaceCode, modelCode, routerCode } from "./utils/boilerPlate"
import { startLoader } from './utils/loader';

/*
 * Check service name entered by user
 * - should not be empty
 * - only letters, numbers and "-" allowed
*/
const validateService = (service: string)=>{
  if(!service || service.length === 0) {
    throw new Error('Service name is required!')
  }

  const regex = /^[a-zA-Z0-9-]+$/;  
  const isValidServiceName = regex.test(service)
  
  if(!isValidServiceName) {
    throw new Error('Service name must not contain spaces or symbols (only "-" allowed).')
  }

  // convert service name to lowercase
  return service.toLowerCase()
}

// *Exit the app with a message
const exitApp = (message: string | null = null) => {
  console.log('\n' + chalk.red('─'.repeat(40)));
  console.log(`${chalk.bgRed.white.bold(' EXIT ')} ${chalk.red(message || 'Process terminated by user.')}`);
  console.log(chalk.red('─'.repeat(40)) + '\n');
  process.exit(0); 
};

/*
 * Create a folder
 * Throw error if folder already exists
*/
const makeFolder = (path: string) => {
  const isFolderExist = fs.existsSync(path)
  if(isFolderExist) {
    throw new Error(`${path.split('\\').pop()}: service alredy exists !`)
  }

  fs.mkdirSync(path)
}


// * Copy files from pipeline folder to service folder
 
const copyFiles = (files: string[], inputPath: string, outputPath: string)=>{
  files.forEach((file)=>{
    fs.copyFileSync(
      path.join(`${inputPath}`, file),
      path.join(`${outputPath}`, file)
    )
  })
}

const getBoilerPlateFileData = (file: string, serviceName: string) => {
  if (file.endsWith("router.ts")) {
    return routerCode(serviceName)
  }

  if (file.endsWith("model.ts")) {
    return modelCode(serviceName)
  }

  if (file.endsWith("interface.ts")) {
    return interfaceCode(serviceName)
  }
  
  return ""
}

// *Create empty files inside src folder
const createFiles = (files: string[], serviceName: string, srcPath: string)=>{
  files.forEach((file)=>{
    const fileName = `${serviceName}${file}`
    const filePath = path.join(srcPath, fileName)
    fs.writeFileSync(filePath, getBoilerPlateFileData(file, serviceName))
  })
}

// * Increase LAST_PORT value in pipeline .env file
const updateLastPort = (pipeLinePath: string)=>{
  const envFilePath = path.join(pipeLinePath, ".env")
  const envData = fs.readFileSync(envFilePath, "utf-8")
  let lines = envData.split("\n")

  lines = lines.map(line => {

    if (line.trim().startsWith("LAST_PORT")) {
      const [key, value] = line.split("=")
      const newPort = parseInt(value.trim()) + 1
      return `${key.trim()} = ${newPort}`
    }

    return line
  })

  fs.writeFileSync(envFilePath, lines.join("\n"), "utf-8")
}


//  * Create .env file for new service
//  * Use LAST_PORT as PORT
const createEnvForNewService = (pipeLinePath: string, servicePath: string) => {
  const envFilePath = path.join(pipeLinePath, ".env")
  const serviceEnvPath = path.join(servicePath, ".env")

  const envData = fs.readFileSync(envFilePath, "utf-8")
  let lines = envData.split("\n")

  let lastPort: string | null = null

  lines = lines.filter(line => {
    if (line.trim().startsWith("LAST_PORT")) {
      const [, value] = line.split("=")
      lastPort = value.trim()
      return false
    }
    return true
  })

  if (!lastPort) {
    throw new Error("LAST_PORT not found in pipeline .env file")
  }

  lines = lines.map(line => {
    if (line.trim().startsWith("PORT")) {
      const [key] = line.split("=")
      return `${key.trim()} = ${lastPort}`
    }

    if (line.trim().startsWith("SERVER")) {
      return line.replace(/:\d+/, `:${lastPort}`)
    }

    return line
  })

  fs.writeFileSync(serviceEnvPath, lines.join("\n"), "utf-8")
}

const createDockerFileForService = (pipelinePath: string, servicePath: string, newPort: number) => {
  const pipelineDockerFilePath = path.join(pipelinePath, "Dockerfile")
  const newDockerFilePath = path.join(servicePath, "Dockerfile")

  const dockerFileData = fs.readFileSync(pipelineDockerFilePath, "utf-8")

  const replacedWithDocker = dockerFileData.replace(
    /EXPOSE\s*\d+/,
    `EXPOSE ${newPort}`
  )

  fs.writeFileSync(newDockerFilePath, replacedWithDocker)
  console.log(fs.readFileSync(newDockerFilePath).toString());
}


const app = async()=>{
  try {
    const msg = " WELCOME TEAM ! ";
    const line = "═".repeat(msg.length);
  
    console.log(chalk.blue(`╔${line}╗`));
    console.log(chalk.blue("║") + chalk.bgBlue.white.bold(msg) + chalk.blue("║"));
    console.log(chalk.blue(`╚${line}╝`));
  
    // Ask user for service name
    const res = await prompts({
      type: 'text',
      name: 'service',
      message: `${chalk.yellow('⚙')} ${chalk.white.bold('Service Configuration')}\n  ${chalk.gray('└─')} ${chalk.blue.bold('Enter service name || To exit app write :q\n')}`,
      format: val => val.trim()
    })

    if(res.service === ":q") {
      exitApp()
    }

    if(res.service === "pipline") {
      exitApp("Pipeline name is not allowed !")
    }

    // validate service name 
    const serviceName = validateService(res.service)

    // set all required paths
    const appPath = __dirname
    const pipeLinePath = path.resolve(appPath, "../")
    const rootPath = path.resolve(appPath, "../../")
    const servicePath = path.join(rootPath, serviceName)
    const srcPath = path.join(servicePath, "src")
    const appFilePath = path.join(srcPath, "app.ts")

    // files to copy from pipeline
    const fileListForCopy = [
      "package.json",
      "tsconfig.json",
      ".gitignore",
      "example.env",
    ]

    // files to create in src folder
    const filesListForCreate = [
      ".controller.ts",
      ".service.ts",
      ".interface.ts",
      ".enum.ts",
      ".middleware.ts",
      ".dto.ts",
      ".router.ts",
      ".model.ts"
    ]

    // create folders
    makeFolder(servicePath)
    makeFolder(srcPath)

    // create empty app.ts
    fs.writeFileSync(appFilePath, appCode(serviceName))

    // update port and create env file
    updateLastPort(pipeLinePath)
    createEnvForNewService(pipeLinePath, servicePath)

    // update port and crete new docker file
    const lastPort = parseInt(process.env.LAST_PORT!)
    const newPort = lastPort+1
    createDockerFileForService(pipeLinePath, servicePath, newPort);

    // copy config files
    copyFiles(fileListForCopy, pipeLinePath, servicePath)

    // create src files
    createFiles(filesListForCreate, serviceName, srcPath)
    
    console.log(
      `\n${chalk.green('✨')} ${chalk.white.bold('Generation Complete')}\n` +
      `${chalk.gray('│')}\n` +
      `${chalk.gray('└──')} ${chalk.green.bold('Service:')}  ${chalk.white(serviceName)}\n` +
      `${chalk.gray('└──')} ${chalk.green.bold('Status:')}   ${chalk.cyan('Created Successfully')}\n` +
      `${chalk.gray('└──')} ${chalk.green.bold('Time:')}     ${chalk.gray(new Date().toLocaleTimeString())}\n`
    );


    console.log(chalk.cyan.bold("\n ⚡ SYSTEM UPDATE "));
    console.log(chalk.black.bgCyan(" PHASE ") + chalk.cyan(" ❯ Synchronizing Packages..."));
    console.log(chalk.dim(" ———————————————————————————————————— "));

    startLoader()

      console.log(
        chalk.bgWhite.black.bold(" AUTHOR ") + 
        chalk.bgHex('#6272a4').white.bold(" Satyam Sharma ") + 
        chalk.cyan(" ❯❯ ") + 
        chalk.hex('#12c2e9').underline("https://github.com/sharmasatyam121104-devloper")
      );

    exec("npm install", {cwd: servicePath}, (err)=>{
      if(err && err instanceof Error)
      {
        throw new Error(`Failed during dependency installation - ${err.message}`)
      }

      console.log("\n"); 
      const line = "━".repeat(serviceName.length + 50);
      console.log(chalk.yellow(line));
      console.log(
        chalk.yellow("  ✨ ") + 
        chalk.bold.white(serviceName.toUpperCase()) + 
        chalk.green(" dependency install  successfully! 🛰️")
      );
      console.log(chalk.yellow(line));

      // --- NEXT STEPS SECTION ---
      console.log("\n" + chalk.cyan.bold("  👉 NEXT STEPS:"));
      
      console.log(
        chalk.white("  1. Go back  : ") + chalk.bold.magenta("cd ..")
      );
      console.log(
        chalk.white("  2. Enter Dir: ") + chalk.bold.magenta(`cd ${serviceName}`)
      );
      console.log(
        chalk.white("  3. Launch   : ") + chalk.bold.bgHex('#FF8C00').black(" npm run dev ")
      );
      
      exitApp()
    })

  } 
  catch (error) {
    if(error instanceof Error) {
      console.log(`\n\n${chalk.bgRed.white.bold(' ERROR ')} ${chalk.red(error)}\n`);
      setTimeout(()=>{
        app()
      },500)
    }
  }
}

app()

