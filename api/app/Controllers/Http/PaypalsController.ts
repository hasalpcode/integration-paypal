import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

'use strict'
const Config = require('Config')
const Paypal = require('paypal-rest-sdk')
// We configure the PayPal SDK with our configuration
Paypal.configure(Config.get('paypal.configure'));
export default class PaypalsController {

    async getSuccessUrl() {
        return Config.get('paypal.url_success')
    }

    async getErrorUrl() {
        return Config.get('paypal.url_error')
    }

    async createPay(payment) {
        return new Promise((resolve,reject)=> {
            Paypal.payment.create(payment,function (err,payment) {
                if (err) {
                    reject
                }else{
                    resolve(payment)
                }
            })
        })
    }

    async getPay ( paymentId ) {
        return new Promise( ( resolve, reject ) => {
          Paypal.payment.get( paymentId, function( err, payment ) {
            if ( err ) {
              reject(err);
            }
            else {
              resolve(payment);
            }
          });
        });
      }


}
