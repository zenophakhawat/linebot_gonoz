module.exports = function (answer) {
    let body = answer.slice();
    if (body[0] == 'sticker') {
        body.shift();
        body = body.map((body) => ({ type: 'sticker', packageId: '1', stickerId: body }))
    }
    else if (body[0] == 'image') {
        body.shift();
        body = body.map((body) => ({ type: 'image', originalContentUrl: body, previewImageUrl: body }))
    }
    else if (body[0] == 'location') {
        var LocationVal = body[1].split("|", 4);
        body = { type: 'location', title: LocationVal[0], address: LocationVal[1], latitude: parseFloat(LocationVal[2]), longitude: parseFloat(LocationVal[3]) };
    }
    else if (body[0] == 'train') {
        var LocationVal = body[1].split("|", 4);
        body = {
            type: "template",
            altText: "คลิ้กเพื่อเทรนบอท",
            template: {
                type: "buttons",
                actions: [
                    {
                        type: "message",
                        label: "เพิ่มคำถาม",
                        text: "เพิ่มคำถาม"
                    },
                    {
                        type: "message",
                        label: "เพิ่มคำตอบ",
                        text: "เพิ่มคำตอบ"
                    },
                    {
                        type: "message",
                        label: "หยุดเทรน",
                        text: "หยุดเทรน"
                    }
                ],
                title: "เทรนบอท",
                text: "Train Bot"
            }
        };
    }
    else {
        body.shift();
        body = body.map((body) => ({ type: 'text', text: body }))
    }
    return body;
};