
import { Router, Request, Response } from 'express'

const PaymentRouter = Router()

PaymentRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from payment service" })
})

export default PaymentRouter
