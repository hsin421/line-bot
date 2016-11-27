var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('../config');

const app = express();
const port = process.env.PORT || '7123';
var CHANNEL_ID = config.CHANNEL_ID;
var CHANNEL_SECRECT = config.CHANNEL_SECRECT;
var CHANNEL_TOKEN = config.CHANNEL_TOKEN;
const LINE_API = 'https://api.line.me/v2/bot/message/push';
var crypto = require('crypto');
var hmac = crypto.createHmac('sha256', CHANNEL_SECRECT);
var digestValue = hmac.digest('base64');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/callback', (req, res) => {
  console.log(req.headers);
  console.log(JSON.stringify(req.body));
  console.log(digestValue);
  res.send(200);
  // const result = req.body.result;
  // for(let i=0; i<result.length; i++){
  //   const data = result[i]['content'];
  //   console.log('receive: ', data);
  //   sendTextMessage(data.from, data.text);
  // }
});

app.listen(port, () => console.log(`listening on port ${port}`));

function sendTextMessage(sender, text) {

  const data = {
    to: [sender],
    toChannel: CHANNEL_ID,
    eventType: '138311608800106203',
    content: {
      contentType: 1,
      toType: 1,
      text: text
    }
  };

  console.log('send: ', data);

  request({
    url: LINE_API,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      // 'X-Line-ChannelID': CHANNEL_ID,
      // 'X-Line-ChannelSecret': CHANNEL_SERECT,
      'Authorization': CHANNEL_TOKEN,
      // 'X-Line-Trusted-User-With-ACL': MID
    },
    method: 'POST',
    body: JSON.stringify(data) 
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
    console.log('send response: ', body);
  });
}