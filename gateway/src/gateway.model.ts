
import { Schema, model } from "mongoose";
import { GatewayInterface } from "./gateway.interface";

const gatewaySchema = new Schema<GatewayInterface>(
  {

  },
  { timestamps: true }
);

const GatewayModel = model<GatewayInterface>("Gateway",gatewaySchema);

export default GatewayModel;
