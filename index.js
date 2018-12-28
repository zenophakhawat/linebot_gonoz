'use strict';

// line SDK Tools
const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');

// zeno Module and Request Curl
const gonoz = require("zenomodule");
const request = require('request');

// file System and XML2JSON
const fs = require("fs");
const parser = require("xml2json");

// essential Variables
var XML;
var banned;
var access_token;
var options = JSON.parse(fs.readFileSync('./loraconfig.json'));
var DevEUI = options.DevEUI;
options = options.cattelecom;

// get all banned user Id
fs.readFile("./banned.json", function (err, data) {
  banned = JSON.parse(data);
  console.log("Banned ID ->", banned);
});

// get all message models from XML
fs.readFile("./message.xml", function (err, data) {
  XML = JSON.parse(parser.toJson(data)).almight;
  console.log("XML to JSON ->", XML);
});

// create LINE SDK client
const client = new line.Client(config);
const app = express();

// request the access_token for device
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    access_token = JSON.parse(body).access_token;
    console.log('access_token: ' + access_token);
  }
}
request(options, callback);

// webhook callback
app.post('/webhook', line.middleware(config), (req, res) => {

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(event => {
    console.log('event', event);
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }
    // check all banned Id
    for (var j = 0; j < banned.Id.length; j++) {
      if (event.source.userId == banned.Id[j]) return replyText(event.replyToken, 'ผู้ใช้คนนีถูกแบนแล้ว');
    }
    // handle reply event
    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  // get line status (normal, train, trainQuestion, trainAnswer)
  var status = JSON.parse(fs.readFileSync('./current.json')).current;
  // get answer from the message
  var answer = gonoz.getAnswer(XML, texts, status);
  // create a body for line reply
  var body;
  if (answer[0] == undefined) {
    texts = Array.isArray(texts) ? texts : [texts];
    body = texts.map((text) => ({ type: 'text', text }))
  }
  else body = gonoz.getLinebody(answer);

  // simple post payload function
  if (answer[0] == 'onlight') {
    gonoz.payloadPost(access_token, DevEUI, '{ "payloadHex" : "01", "targetPorts" : "02" }');
  }
  else if (answer[0] == 'offlight') {
    gonoz.payloadPost(access_token, DevEUI, '{ "payloadHex" : "00", "targetPorts" : "02" }');
  }

  // reply the message
  console.log(answer);
  return client.replyMessage(
    token,
    body
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      return replyText(event.replyToken, `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken) {
  return replyText(replyToken, message.text);
}

function handleImage(message, replyToken) {
  return replyText(replyToken, 'ได้รับรูปภาพแล้วครับผม');
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, 'ได้รับวิดิโอแล้วจ้า');
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, 'ได้รับเสียงแล้วนะ');
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, 'ได้รับตำแหน่งแล้วค้าบ');
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, message.stickerId);
}

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
