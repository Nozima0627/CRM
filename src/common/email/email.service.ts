import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService{
    constructor(private readonly mailerservice: MailerService){}

    async sendEmail(email: string, login: string, password: string){
        await this.mailerservice.sendMail({
            to: email,
            from: process.env.EMAIL,
            subject: "Assalomu alaykum it is for test",
            template: 'index',
            context:{
                text: `login: ${login} and password: ${password}`
            }
        })
    }
}