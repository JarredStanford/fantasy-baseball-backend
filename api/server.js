const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const session = require("express-session")
const axios = require('axios')
const qs = require('qs');
const YahooFantasy = require("yahoo-fantasy");

const client_id = 'dj0yJmk9b2s1SElHWlhnNW9VJmQ9WVdrOWR6RkROV1ZxTjJzbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTRm';
const client_secret = '715ae4395b403ff6d47c66aaaa6adf7c0cd5b43a';


let server = express();

//Middleware
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(cors())
server.use(express.json());


server.get('/', (req, res) => {
    res.status(200).json('Welcome to Yahoo Fantasy!')
})

server.post('/auth', async (req, res) => {

    const auth_header = Buffer.from(`${client_id}:${client_secret}`, `binary`).toString(`base64`)
    const { code } = req.body

    const getAuth = () => {
        return axios({
            url: 'https://api.login.yahoo.com/oauth2/get_token',
            method: 'post',
            headers: {
                'Authorization': `Basic ${auth_header}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
            },
            data: qs.stringify({
                redirect_uri: 'oob',
                code: code,
                grant_type: 'authorization_code'
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    const newToken = await getAuth()

    res.status(200).json(newToken.data)
})



module.exports = server;


