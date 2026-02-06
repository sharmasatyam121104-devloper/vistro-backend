const toPascalCase = (str: string) =>
  str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")


export const appCode = (serviceName: string) => `
import chalk from 'chalk';
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
const DB_URI = process.env.DB;
if (!DB_URI) {
  throw new Error("DB environment variable is not defined");
}

mongoose.connect(DB_URI)
.then(() => {
  console.log(
    chalk.bold.green("[ DATABASE ] ") + 
    chalk.white("${serviceName.padEnd(12)}") + 
    chalk.gray(" | ") + 
    chalk.bgGreen.black.bold(" OK ") + 
    chalk.green(" Connected Successfully")
  );
})
.catch(() => {
  console.log(
    chalk.bold.red("[ DATABASE ] ") + 
    chalk.white("${serviceName.padEnd(12)}") + 
    chalk.gray(" | ") + 
    chalk.bgRed.black.bold(" FAIL ") + 
    chalk.red(" Connection Rejected")
  );
});

import express, { Request, Response } from 'express'
import ${toPascalCase(serviceName)}Router from './${serviceName}.router'
import morgan from 'morgan'
import cors from 'cors'

const PORT = process.env.PORT || 5000;
const app = express()
app.listen(PORT, ()=>{
 console.log(chalk.yellow.bold("${serviceName}" + " - Server running on port http://localhost:" + PORT));
})

app.use(cors({
  origin: process.env.CLIENT,
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/${serviceName}", ${toPascalCase(serviceName)}Router)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from ${serviceName} service!");
});

`
export const routerCode = (serviceName: string) => `
import { Router, Request, Response } from 'express'

const ${toPascalCase(serviceName)}Router = Router()

${toPascalCase(serviceName)}Router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from ${serviceName} service" })
})

export default ${toPascalCase(serviceName)}Router
`

export const interfaceCode = (serviceName: string) => `
import { Document } from "mongoose";

export interface ${toPascalCase(serviceName)}Interface extends Document {
    
}
`
export const modelCode = (serviceName: string) => `
import { Schema, model } from "mongoose";
import { ${toPascalCase(serviceName)}Interface } from "./${serviceName}.interface";

const ${toPascalCase(serviceName).charAt(0).toLowerCase() + toPascalCase(serviceName).slice(1)}Schema = new Schema<${toPascalCase(serviceName)}Interface>(
  {

  },
  { timestamps: true }
);

const ${toPascalCase(serviceName)}Model = model<${toPascalCase(serviceName)}Interface>("${toPascalCase(serviceName)}",${toPascalCase(serviceName).charAt(0).toLowerCase() + toPascalCase(serviceName).slice(1)}Schema);

export default ${toPascalCase(serviceName)}Model;
`;
