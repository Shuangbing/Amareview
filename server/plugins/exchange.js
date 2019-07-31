const axios = require('axios')
const schedule = require('node-schedule')
const Exchange = require('../models/ExChange')
const date = new Date();
date.setDate(date.getDate() - 1);

const exChangeUpdate = () => {
    schedule.scheduleJob('* 0 * * * *', () => {
        updateExChange()
    });
}

exChangeUpdate()
updateExChange()
//setExChange(0.0630000)

function updateExChange() {
    axios.post('https://www.unionpayintl.com/cardholderServ/serviceCenter/rate/search', 'curDate=' + dateFtt('yyyy-MM-dd', date) + '&baseCurrency=CNY&transactionCurrency=JPY')
        .then(res => {
            if (res.data.exchangeRate > 0) {
                console.log('Newest ExchangeRate - ' + res.data.exchangeRate)
                setExChange(res.data.exchangeRate)
            } else {
                console.log('ExChange Updated Faild.' + new Date())
            }
        })
        .catch(err => {
            console.log('ExChange Updated Faild.(ERROR)' + new Date())
        })
}

function setExChange(rate) {
    Exchange.findOne({ tag: 1 }, function (err, doc) {
        if (doc == null) {
            Exchange.create({ rate: rate })
        } else {
            doc.rate = rate
            doc.save()
        }
    })
}


function dateFtt(fmt, date) { //author: meizz   
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
} 
