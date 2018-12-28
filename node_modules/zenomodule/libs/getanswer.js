// This module is actucally created by Zeno.
const fs = require("fs");
const js2xmlparser = require("js2xmlparser");

module.exports = function (XMLData, msg, status) {
    msg = msg.toLowerCase();
    if (status.search('train') != -1) {
        if (msg == 'เพิ่มคำถาม') {
            fs.writeFile('./current.json', JSON.stringify({ current: 'trainQuestion' }), (err) => {
                if (err) throw err;
                console.log('The system has changed to -> ' + 'trainQuestion');
            });
            return ['trainQuestion', "[เทรน] " + msg + " รับทราบ"];
        }
        else if (msg == 'เพิ่มคำตอบ') {
            fs.writeFile('./current.json', JSON.stringify({ current: 'trainAnswer' }), (err) => {
                if (err) throw err;
                console.log('The system has changed to -> ' + 'trainAnswer');
            });
            for (j = 0; j < XMLData["index"][0].res.length; j++) {
                if (XMLData["index"][0].ans[j] == 'undefine') {
                    return ['trainAnswer', "[เทรน] " + XMLData["index"][0].res[j] + " ควรตอบว่า?"];
                }
            }
            return ['trainAnswer', "[เทรน] เพิ่มคำถามก่อนน้า"];
        }
        else if (msg == 'หยุดเทรน') {
            fs.writeFile('./current.json', JSON.stringify({ current: 'normal' }), (err) => {
                if (err) throw err;
                console.log('The system has changed to -> ' + 'normal');
            });
            return ['normal', 'หยุดเทรนแล้ว'];
        }
        else {
            if (status == 'trainQuestion') {
                for (j = 0; j < XMLData["index"][0].res.length; j++) {
                    if ((XMLData["index"][0].res[j] == msg)) {
                        return ['trainQuestion', "[เทรน] ไม่สามารถเพิ่มได้ (ซ้ำ)"];
                    }
                }
                XMLData.index[0].res.push(msg);
                XMLData.index[0].ans.push("undefine");
            }
            else if (status == 'trainAnswer') {
                var first = 1;
                for (j = 0; j < XMLData["index"][0].res.length; j++) {
                    if ((XMLData["index"][0].ans[j] == 'undefine') && (first == 1)) {
                        XMLData.index[0].ans[j] = msg;
                        first = 0;
                    }
                    else if (XMLData["index"][0].ans[j] == 'undefine' && first == 0) {
                        return [status, "[เทรน] " + XMLData["index"][0].res[j] + " ควรตอบว่า?"];
                    }
                }
                fs.writeFile('./message.xml', js2xmlparser.parse("almight", XMLData), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                return [status, "[เทรน] เพิ่มคำถามก่อนน้า"];
            }
            fs.writeFile('./message.xml', js2xmlparser.parse("almight", XMLData), (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            return [status, "[เทรน] เพิ่ม " + msg + " แล้ว"];
        }
    }
    else if ((msg.search('ซีโน่') != -1) || (msg.search('zeno') != -1) || (msg.search('phakhawat') != -1) || (msg.search('ภควัต') != -1)) return ['ZENO', 'ซีโน่เก่งที่สุดในสามโลก สุดจัดปลัดบอกเลยแหละ'];
    else if (msg == 'เทรนบอท' || msg == 'train bot') {
        fs.writeFile('./current.json', JSON.stringify({ current: 'train' }), (err) => {
            if (err) throw err;
            console.log('The system has changed to -> ' + 'train');
        });
        return ['train', 'CALL TRAIN'];
    }
    for (i = 0; i < XMLData["index"].length; i++) {
        let type = XMLData["index"][i].type;
        for (j = 0; j < XMLData["index"][i].res.length; j++) {
            if (typeof (XMLData["index"][i].res) == 'string') {
                if (msg.search(XMLData["index"][i].res.toLowerCase()) != -1) {
                    if (typeof (XMLData["index"][i].ans) == 'string') return [XMLData["index"][i].name, XMLData["index"][i].ans];
                    else {
                        if (type == 'fix') return [XMLData["index"][i].name, XMLData["index"][i].ans[j]];
                        else if (type == 'random') return [XMLData["index"][i].name, XMLData["index"][i].ans[Math.floor(Math.random() * XMLData["index"][i].ans.length)]];
                    }
                }
            }
            else {
                if (msg.search(XMLData["index"][i].res[j].toLowerCase()) != -1) {
                    if (typeof (XMLData["index"][i].ans) == 'string') return [XMLData["index"][i].name, XMLData["index"][i].ans];
                    else {
                        if (type == 'fix') return [XMLData["index"][i].name, XMLData["index"][i].ans[j]];
                        else if (type == 'random') return [XMLData["index"][i].name, XMLData["index"][i].ans[Math.floor(Math.random() * XMLData["index"][i].ans.length)]];
                    }
                }
            }
        }
    }
    return [undefined, undefined];
};