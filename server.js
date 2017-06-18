var express = require('express'),
    app = express(),
    server = require('http').createServer(app).listen(4555),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

var emitir = function(req, res, next){

  var msgDeNotificacao = 'nao definido';

  if (typeof req.query.info != 'undefined') {
    msgDeNotificacao = {
      'type': 'info',
      'msg': req.query.info
    };
  }

  if (typeof req.query.error != 'undefined') {
    msgDeNotificacao = {
      'type': 'error',
      'msg': req.query.error
    }
  }

  if (typeof req.query.success != 'undefined') {
    msgDeNotificacao = {
      'type': 'success',
      'msg': req.query.success
    }
  }

  if(msgDeNotificacao != '')	 {
  	io.emit('notificacao', msgDeNotificacao);
  	next();
  } else {
    next();
  }
}

app.listen(port);

app.use(emitir);
app.use('/api', router);

router.route('/notificar')
  .get(function(req, res){
  //aqui vamos receber a mensagem
  res.json({message: "testando essa rota"})
  });


console.log('Conectado a porta ' + port);