
var requestOnOff = require('request');

module.exports = function (access_token, DevEUI, payload) {

    var headerOnOff = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + access_token
    };

    var optionOnOff = {
        url:
            "https://loraiot.cattelecom.com/portal/iotapi/core/devices/" + DevEUI + "/downlinkMessages",
        method: "POST",
        headers: headerOnOff,
        body: payload
    };

    function callbackOnOff(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }

    requestOnOff(optionOnOff, callbackOnOff);
};