var express = require('express'),
    quoter  = require('./quoter'),
    messenger = require('./messenger');

var app = module.exports = express.Router();
var msg = [
  {
    "user": "Olga",
    "msg": "Hi!",
    "timestamp": 1456651674675
  },
  {
    "user": "Vasya",
    "msg": "Hello!",
    "timestamp": 1456651694675
  },
  {
    "user": "Olga",
    "msg": "How are you?",
    "timestamp": 1456651784675
  },
  {
    "user": "Olga",
    "msg": "Where are you?",
    "timestamp": 1456651814675
  },
  {
    "user": "Vasya",
    "msg": "Here!",
    "timestamp": 1456651674675
  },
  {
    "user": "Olga",
    "msg": "Where? Where? Where? Where? Where? Where? Where? Where? Where? Where? Where? Where? Where? Where? Where?",
    "timestamp": 1456651674675
  },
  {
    "user": "Vasya",
    "msg": "In front of you! Wait a minute!",
    "timestamp": 1456651674675
  }
];

app.get('/api/random-quote', function(req, res) {
  res.status(200).send(quoter.getRandomOne());
});

app.get('/api/message/list', function(req, res){
    var ts = req.query.timestamp || 0;
    //istMsg();
    console.log('Message list time: ' + bench(listMsg) + 'ms' );
    function listMsg() {
        var out = msg.filter(function (item) {
            return item.timestamp > ts
        });
        res.status(200).send(out)
    }

});

app.post('/api/message/send', function(req, res){
    var message = req.body;
    msg.push(message);
    res.status(201).send(message)
});

app.post('/api/message/create', function(req, res){
    var amount = req.body.num;
    createMsgs(amount);
    console.log('MSG length', msg.length);

    res.status(201).send(amount)
});

function createMsgs(num) {
    for (var i = 0; i < num; i++) {
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
}

function bench(f) {
  var date = new Date();
      f();
  return new Date() - date;
}