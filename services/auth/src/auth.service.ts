import {v4 as uuid} from "uuid"
import axios from "axios"
import moment from "moment"
import { AuthInterface, MessageInterface, VerifyOtpInterface } from "./auth.interface.js"
import jwt, { SignOptions } from 'jsonwebtoken'
import AuthModel from "./auth.model.js"


axios.defaults.baseURL = process.env.MSG_SERVER

const getAccessToken = async (auth: AuthInterface): Promise<string> => {

    const payload = {
    id: auth._id,
    mobile: auth.mobile,
    }

    const secret = process.env.AUTH_SECRET
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY

    if (!secret) {
        throw new Error("Auth secret is missing.")
    }

    if (!expiresIn) {
        throw new Error("Access token expiry is missing.")
    }

    const options: SignOptions = {
        expiresIn: expiresIn as SignOptions["expiresIn"]
    }

    const token = jwt.sign(payload, secret, options)

    return token
}

export const sendOtp = async(body: any):Promise<MessageInterface> =>{
    const authPayload = {
        mobile: body.mobile,
        refreshToken: uuid(),
        refreshTokenExpiredAt: moment().add(1, 'M').toDate()
    }

    await AuthModel.findOneAndUpdate({mobile: body.mobile}, {$set: authPayload}, {upsert: true, new: true})

    //this is disable 
    // const {data} = await axios.post(`/otp?otp_expiry=10&template_id=${process.env.OTP_TEMPLATE_ID}&mobile=${body.mobile}&authkey=${process.env.MSG_AUTH_KEY}`)
    
    // if(data.type !== "success") {
    //     throw new Error("Failed to send OTP")
    // }

    return {message: "OTP send successfully.!"}
}


export const verifyOtp = async(body: any):Promise<VerifyOtpInterface> =>{
    //this is disable 
    // const {data} = await axios.post(`/otp/verify?mobile=${body.mobile}&authkey=${process.env.MSG_AUTH_KEY}&otp=${body.otp}`)
    
    // if(data.type !== "success") {
    //     throw new Error("Failed to verify OTP")
    // }

    const auth = await AuthModel.findOne({email: body.email}).lean()

    if(!auth) {
        throw new Error("User dosen't exists")
    }

    if(Number(body.otp) !== 1234) {
       throw new Error("Failed to verify OTP") 
    }

    const accessToken = await getAccessToken(auth)

    return {message: "OTP verified successfully.!", accessToken, refreshToken: auth.refreshToken}
}


export const resendOtp = async(body: any):Promise<MessageInterface> =>{
    // const {data} = await axios.post(`/otp/retry?mobile=${body.mobile}&authkey=${process.env.MSG_AUTH_KEY}&retryType=text`)
    
    // if(data.type !== "success") {
    //     throw new Error("Failed to resend OTP")
    // }

    const auth = await AuthModel.findOne({email: body.email})

    if(!auth) {
        throw new Error("User dosen't exists")
    }

    return {message: "OTP resend successfully.!"}
}