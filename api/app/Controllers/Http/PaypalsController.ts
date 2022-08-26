import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//app/Controllers/Http/PaypalController.js 
import Env from '@ioc:Adonis/Core/Env'

'use strict'

const rp = require('request-promise')

const client_id= Env.get('PAYPAL_CLIENT_ID');
const client_secret= Env.get('PAYPAL_CLIENT_SECRET');
const base = "https://api.sandbox.paypal.com";
export default class PaypalsController {
idOrder = ""
 
  async  createOrder({request}:HttpContextContract) {
    const accessToken = await this.getToken();
    const url = `${base}/v2/checkout/orders`;
    const currency = request.input('currency')
    const getAmount = request.input('amount')
    const response = await rp(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value:getAmount,
            },
          },
        ],
      }),
    });
    //this.idOrder = JSON.parse(response).id 
   
    //return (JSON.parse(response).id)
    return JSON.parse(response);
    
  }

  

   
  async getToken() {
    const auth = Buffer.from(client_id + ":" + client_secret).toString('base64')
    const result = await rp(`${base}/v1/oauth2/token`, {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }).then((res)=>{
      return res
    })
    
  
  return (JSON.parse(result).access_token)
  }

  // async approvateOrder({params}:HttpContextContract){
  //   //const accessToken = await this.getToken();
  //   const {orderId} = params.id
  //   const url = `${base}/checkoutnow/?token=${orderId}`;
  //   const response = await rp(url);
  //  console.log(orderId)
  
  //   return response ;
  // }

  async capturePayment( {params}:HttpContextContract) {
    const orderId = params.orderID
    const accessToken = await this.getToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await rp(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
    return (JSON.parse(response));
  }
    
   
}



