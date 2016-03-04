var express = require('express'),
    quoter  = require('./quoter'),
    RBTree = require("functional-red-black-tree");


var app = module.exports = express.Router();

app.get('/api/random-quote', function(req, res) {
  res.status(200).send(quoter.getRandomOne());
});

var msg = [];
var lastTimestamp;
var tree = RBTree(function(a, b) { return a - b; });

function listMsg(lastTimestamp) {
    var out = msg.filter(function (item) {
        return item.timestamp > lastTimestamp
    });
    return out;
}

function listByTree(lastTimestamp){
    var out = [];
    var it = tree.gt(lastTimestamp);
    while(it.node !== null) {
        out.push(it.node.value);
        it.next();
    }
    return out;
}

app.get('/api/message/list', function(req, res) {
    lastTimestamp = req.query.timestamp || 0;
    //uncomment to use search by filter
    /*var time = process.hrtime();
    var out = listMsg(lastTimestamp);
    console.log('RBTree: Message list time: '
        + process.hrtime(time)[1] / 1e6 + 'ms');
*/
    //uncomment to use search by RBtree
    var time = process.hrtime();
    var out = listByTree(lastTimestamp);
    console.log('RBTree: Message list time: '
        + process.hrtime(time)[1] / 1e6 + 'ms');

    res.status(200).send(out);
});

app.post('/api/message/send', function(req, res){
    var message = req.body;
    msg.push(message);
    res.status(201).send(message)
});

app.post('/api/message/create', function(req, res){
    var amount = req.body.num;
    createMsgs(amount);
    res.status(201).send('Created, msg: ' + amount)
});


var createMsgs = function (num) {
    for (var i = 1; i <= num; i++) {
        var mess = {};
        if (i % 2 === 0) {
            mess.user = "Olga";
            mess.msg = "I am Olga";
        } else {
            mess.user = "Vasya";
            mess.msg = "I am Vasya";
        }
        mess.timestamp = i;
        msg.push(mess);
    }

    tree = RBTree(function(a, b) { return a - b; });
    if(msg.length > 0) {
        for (var a in msg) {
            tree = tree.insert(msg[a].timestamp, msg[a]);
        }
    }
};
createMsgs(7);
