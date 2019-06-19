const mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
const Observable = require('object-observer/dist/node/object-observer').Observable;
var date = require('./modules/date');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

var dbconn=false;
var newmsg={"127.0.0.1": true};
var obsNewMsg = Observable.from(newmsg);

const User = require('./models/users');
const Message = require('./models/message');

mongoose.connect('mongodb://localhost/testdb', { useNewUrlParser: true });

mongoose.connection.once('open', ()=>{
  //connecetd!
  dbconn=true;
}).on('error', (err)=>{
  //error (=err)
});

app.get('/', (req, res)=>{
  if(dbconn)
  {
    User.findOne({ip: req.ip.split(":")[3]}).then((result)=>{
      if(result == null)
        res.render('home-no-acc');
      else
        res.render('home', {name: result.name});

    });
  }
  else {
    res.end("DB error");
  }
});

app.post('/setnn', (req, res)=>{
  if(dbconn)
  {
    var user = new User({name: req.body.nn, ip: req.ip.split(":")[3]});
    user.save().then(()=>{
      if(!user.isNew)
        return res.redirect('/');
    })
  }else {
    res.end("DB error");
  }
});

app.post('/remnn', (req, res)=>{
  if(dbconn)
  {
    User.deleteOne({ip: req.ip.split(":")[3]}, (err)=>{
      if(err){
        res.end('err');
      }
    });
    Message.deleteMany({to: req.ip.split(":")[3]}, (err)=>{
      if(!err)
        res.redirect('/');
      else {
        res.end('err');
      }
    });
  }else {
    res.end("DB error");
  }
});

app.post('/msg', (req, res)=>{
  var message = new Message({
    from: req.ip.split(":")[3],
    to: req.body.toip,
    msg: req.body.msg,
    time: date()
  });
  message.save().then(()=>{
    obsNewMsg[req.body.toip] = true;
    res.redirect('/');
  });
});

app.get('/change', (req, res)=>{
  obsNewMsg[req.ip.split(":")[3]] = 2;
    console.log(obsNewMsg[req.ip.split(":")[3]]);
});

app.get('/newmsg', (req, res)=>{
  if(newmsg[req.ip.split(":")[3]] != null)
  {
    obsNewMsg.observe(changes=>{
      Message.find({to: req.ip.split(":")[3]}).sort('time').exec((err, result)=>{
        var x={};
        var i=0;
        result.forEach(ress=>{x[i]={from: ress.from, msg: ress.msg, time: ress.time};i++;});
        res.end(JSON.stringify(x));
      });
      newmsg[req.ip.split(":")[3]] = false;
    });
  }else{newmsg[req.ip.split(":")[3]] = false;}
});

app.get('/getmsgs', (req, res)=>{
  Message.find({to: req.ip.split(":")[3]}).sort('time').exec((err, result)=>{
    var x={};
    var i=0;
    result.forEach(ress=>{x[i]={from: ress.from, msg: ress.msg, time: ress.time};i++;});
    res.end(JSON.stringify(x));
  });
      });



if(app.listen(80))
  console.log("listening on port 80");
