require("dotenv").config()
const fs = require('fs')
const path = require('path')
const express = require('express')
const emailValidator = require('deep-email-validator')
const { messageModel } = require("./messagemodel")
const { mailer } = require('./messagingFacility') 
const app = express()

async function isEmailValid(email) {
    return emailValidator.validate(email)
}

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/', express.static('static'))
app.use('/teams',express.static('static'))
app.use('/events', express.static('static'))
app.use('/initiatives', express.static('static'))

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/teams', (req, res)=>{
    res.sendFile(path.join(__dirname, 'teams.html'))
})

app.get('/events', (req, res)=>{
    res.sendFile(path.join(__dirname, 'events.html'))
})

app.get('/initiatives', (req, res)=>{
    res.sendFile(path.join(__dirname, 'initiatives.html'))
})

app.post('/message', async (req, res)=>{
    console.log(req.body)
    let validity = (await emailValidator.validate(req.body["E-Mail"]))
    let created_message = await messageModel.create({
        name: req.body.Name,
        email: req.body['E-Mail'],
        email_validity: validity.valid,
        subject: req.body.Subject,
        message: req.body.Message
    })
    if(created_message.email_validity){
        mailer.sendMail({
            from: process.env.USER,
            to: process.env.RECEIVER,
            subject: created_message.subject,
            text: created_message.message
        }, (err, info)=>{
            if(err){
                console.log(err)
                return;
            }
            console.log('Successfully create-found mailed to', process.ENV.RECEIVER)
        })
    }
    res.redirect('/')
})

app.listen(process.env.PORT, ()=>{
    console.log(`App listening on port-${process.env.PORT}`);
})