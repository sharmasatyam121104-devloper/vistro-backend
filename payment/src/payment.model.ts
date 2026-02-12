
import { Schema, model } from "mongoose";
import { PaymentInterface } from "./payment.interface";

const paymentSchema = new Schema<PaymentInterface>(
  {

  },
  { timestamps: true }
);

const PaymentModel = model<PaymentInterface>("Payment",paymentSchema);

export default PaymentModel;
