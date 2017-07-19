module.exports.fail = function (res, msg) {
	console.log('RES-UTIL exports.fail');
    res.status(200);
    if (!msg) {
        return res.send(JSON.stringify({
            flag: false,
            message: ''
        }));
    }
    if('Error' === typeof msg){
        return res.send(JSON.stringify({
            flag: false,
            message: msg.message
        }));
    }

    res.send(JSON.stringify({
        flag: false,
        message: msg.toString()
    }));


}


module.exports.success = function (res, msg) {
	console.log('RES-UTIL exports.success');
    res.status(200);
    if (!msg) {
        return res.send(JSON.stringify({
            flag: true,
            message: ''
        }));
    }


    return res.send(JSON.stringify({
        flag: true,
        message: msg
    }));


}