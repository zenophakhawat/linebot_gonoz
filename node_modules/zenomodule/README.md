Zeno Module - The module for good searching algorithm from XML. Mostly integrate with Line Development.

The function for line bot communication
```js
const gonoz = require("zenomodule");

XML = JSON.parse(JSON string);   // you can import XML from XML file using another module.
texts = 'This is sample message';  // you can import msg from LINE application.
status = 'normal';               // the status can be normal, train, trainQuestion, trainAnswer.
var answer = gonoz.getAnswer(XML, texts, status); // getAnswer will return the answer analyzed from XML.
var body = gonoz.getLinebody(answer); // getLinebody will return the body used to reply command.
```

The function for LoRa device communication provided by CAT Telecommunication
```js
var access_token = 'xxxxxxxxxx';  // declare the access_token.
var DevEUI = 'yyyyy';             // declare the device EUI.
var payload = 'zzz';              // declare the payload structure.
gonoz.payloadPost(access_token, DevEUI, payload);   // payloadPost will sending payload to the LoRa device.
```

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 6.4.0 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install zenomodule
```

Follow [my github](https://github.com/zenophakhawat/zenomodule)
for more information.
