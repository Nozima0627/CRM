import { MailerModule } from "@nestjs-modules/mailer";
import { Global, Module } from "@nestjs/common";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import strict from "assert/strict";
import { EmailService } from "./email.service";


console.log(process.env.EMAIL)
@Global()
@Module({
    imports:[
        MailerModule.forRoot({
            transport:{
                service: 'gmail',
                auth: {
                    user: 'nozimaabdugapparova9@gmail.com',
                    pass: 'geks jpsd pgoh jimx'
                }
            },
            defaults:{
                from: '"Nozima" <nozimaabdugapparova9@gmail.com>'
            },
            template:{
                dir: join(process.cwd(), 'src', 'templates'),
                adapter: new HandlebarsAdapter(),
                options:{
                    strict: true
                }
            }
        })
    ],
    providers: [
        EmailService
    ],
    exports:[ EmailService]
})

export class EmailModule{}