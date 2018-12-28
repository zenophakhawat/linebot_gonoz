# Line Bot Demo with B-LO72Z LoRa board LED ON/OFF by Zeno (Thai version).
The good point to study line bot development.  
In the near future I will add the international version.

## How it work
Start express server to handle webhook from LINE

# Install
Clone this project by run the command
```
$ git clone https://github.com/zenophakhawat/gonoz.git
```

Go to this directory and run
```
$ npm install
```

Modify `config.json`
```json
{
  "port" : "3000",
  "channelAccessToken": "YOUR_CHANNEL_ACCESS_TOKEN",
  "channelSecret": "YOUR_CHANNEL_SECRET"
}
```

Modify `loraconfig.json`
```json
{
    "cattelecom": {
        "url": "https://loraiot.cattelecom.com/portal/iotapi/auth/token",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        "body": "{ \"username\" : \"YOUR_USERNAME\", \"password\" : \"YOUR_PASSWORD\" }"
    },
    "DevEUI": "YOUR_DEVICE_EUI"
}
```
Run
```
npm start
```
then you can access [http://localhost:3000](http://localhost:3000)

Use [ngrok](https://ngrok.com/) to expose your local url
```
path/to/ngrok http 3000
```
config webhook url in developer console then enjoy your bot!

## Adding new words
Open message.xml to add new words or new category. Follow the structure in that file
```
<?xml version='1.0'?>
<almight>
    <index>
        <name>userdefine</name>
        <type>fix</type>
        <res>ทดสอบ1</res>
        <res>ทดสอบ2</res>
        <ans>ทดสอบสมบูรณ์1</ans>
        <ans>ทดสอบสมบูรณ์2</ans>
    </index>
    <index>
        <name>YOUR_NEW_CATEGORY</name>
        <type>YOUR_TYPE_(FIX)_(RANDOM)</type>
        <res>YOUR_QUESION</res>
        <ans>YOUR_ANSWER</ans>
    </index>
```

## Bot Training
Type เทรนบอท in the bot chat to start training.  
Type หยุดเทรน in the bot chat to stop training.

## Author
Phakhawat Chullamonthon
