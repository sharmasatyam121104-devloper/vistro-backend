import chalk from 'chalk';
import dotenv from 'dotenv'
dotenv.config()


import express, { Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = process.env.PORT || 8080;
const app = express()
app.listen(PORT, ()=>{
 console.log(chalk.yellow.bold("gateway" + " - Server running on port http://localhost:" + PORT));
})

app.use(cors({
  origin: process.env.CLIENT,
  credentials: true
}))
app.use(morgan('dev'))


app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:4001',
  changeOrigin: true
}));

app.use('/bucket', createProxyMiddleware({
  target: 'http://localhost:4002',
  changeOrigin: true
}));

app.use('/video', createProxyMiddleware({
  target: 'http://localhost:4003',
  changeOrigin: true
}));

app.use('/notification', createProxyMiddleware({
  target: 'http://localhost:4004',
  changeOrigin: true
}));
