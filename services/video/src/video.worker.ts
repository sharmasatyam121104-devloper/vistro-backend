import { Job, Worker } from "bullmq";
import { upadteVideoStatus } from "./video.service";
import Redis from 'ioredis'
const publisher = new Redis()


const processWebhookQ = async (job: Job) => {
    try {
        const update = await upadteVideoStatus(job.data.videoId, job.data.status)
        await publisher.publish('video-transcoding', JSON.stringify(upadteVideoStatus))
        return update
    } 
    catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }    
    }
};

const webhookWorker = new Worker("webhook-queue", processWebhookQ, {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
});

webhookWorker.on('failed', (job, error)=>{
    console.log(`job failed - ${error.message}`);
})

webhookWorker.on('completed', (job, message)=>{
    console.log(`job completed`, message);
})