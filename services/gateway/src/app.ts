import chalk from 'chalk';
import dotenv from 'dotenv'
dotenv.config()


import express, { Request, Response } from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware';
import { CORS_CONFIG } from './gatway.constant';
import Redis from 'ioredis'
const subscriber = new Redis()

const PORT = process.env.PORT || 8080;
const app = express()
const server = createServer(app)
server.listen(PORT, ()=>{
 console.log(chalk.yellow.bold("gateway" + " - Server running on port http://localhost:" + PORT));
})

app.use(cors(CORS_CONFIG))
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

const io = new Server(server, {cors: CORS_CONFIG})

io.on('connection', (socket)=>{
  console.log("user connected - ", socket.id );
})

subscriber.subscribe("video-transcoding", (error)=>{
  if(error) {
    console.log("Failed to subscribe video-transcoding cahnel");
    return
  }
  console.log("Successfully subscribe video-transcoding cahnel");
})

subscriber.on('message', (channel, message)=>{
  io.emit("video-transcoding", message)
})