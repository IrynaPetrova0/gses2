const config = require("../../config.json");
const RateService = require('../services/rate.service')
const SubscribeService = require('../services/subscribe.service')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(config.mailing.sendGridApi)

class SendEmailsService {
    async sendToSubscribers() {
        const emails = await SubscribeService.readFile()
        RateService.getCurrentRate().then(result => {
            console.log(result)
            for (const email of emails) {
                try {
                    this.sendToSelectedEmail(email, result)
                } catch (e) {
                    console.error(e)
                   throw new Error(e)
                }
            }
        })


    }

     sendToSelectedEmail(email, rate) {
        let msg = {
            to: email,
            from: config.mailing.from,
            subject: config.mailing.subject,
            text: '1 BTC = ' + rate + ' UAH.'
        }

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
               throw new Error(error)
            })
    }

}

module.exports = new SendEmailsService()