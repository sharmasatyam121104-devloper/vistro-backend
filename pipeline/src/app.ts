import chalk from 'chalk';
import prompts from 'prompts';
import fs from 'fs';
import path from 'path';

const validateService = (service: string)=>{
  if(!service || service.length === 0) {
    throw new Error('Service name is required!')
  }

  const regex = /^[a-zA-Z0-9-]+$/;  
  const isValidServiceName = regex.test(service)
  
  if(!isValidServiceName) {
    throw new Error('Service name must not contain spaces or symbols (only "-" allowed).')
  }

  return service.toLowerCase()
}

const exitApp = (message: string | null = null) => {
  console.log('\n' + chalk.red('─'.repeat(40)));
  console.log(`${chalk.bgRed.white.bold(' EXIT ')} ${chalk.red(message || 'Process terminated by user.')}`);
  console.log(chalk.red('─'.repeat(40)) + '\n');
  process.exit(0); 
};

const makeFolder = (path: string) => {
  const isFolderExist = fs.existsSync(path)
  if(isFolderExist) {
    throw new Error(`${path.split('\\').pop()}: service alredy exists !`)
  }

  fs.mkdirSync(path)
}

const app = async()=>{
  try {
    const msg = " WELCOME TEAM ! ";
    const line = "═".repeat(msg.length);
  
    console.log(chalk.blue(`╔${line}╗`));
    console.log(chalk.blue("║") + chalk.bgBlue.white.bold(msg) + chalk.blue("║"));
    console.log(chalk.blue(`╚${line}╝`));
  
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

  
    const serviceName = validateService(res.service)
    const appPath = __dirname
    const rootPath = path.resolve(appPath, "../..")
    const servicePath = path.join(rootPath, serviceName)
    makeFolder(servicePath)
    
    console.log(
      `\n${chalk.green('✨')} ${chalk.white.bold('Generation Complete')}\n` +
      `${chalk.gray('│')}\n` +
      `${chalk.gray('└──')} ${chalk.green.bold('Service:')}  ${chalk.white(serviceName)}\n` +
      `${chalk.gray('└──')} ${chalk.green.bold('Status:')}   ${chalk.cyan('Created Successfully')}\n` +
      `${chalk.gray('└──')} ${chalk.green.bold('Time:')}     ${chalk.gray(new Date().toLocaleTimeString())}\n`
    );
    exitApp()

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

