import {Queue} from 'bullmq'

export const webhookQ = new Queue("webhook-queue")