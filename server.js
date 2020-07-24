

const express = require('express'); //chama express para a variavel
const nunjucks = require('nunjucks');
const routes = require('./routes')
const server = express(); //executa variavel anterior, que virou funcao
const methodOverride = require('method-override'); // chama o method override possibilitando put e delete nos forms

server.use(express.urlencoded({ extended: true })); //recebe os dados mandados para o 'routes.post' do /create
server.use(express.static('public')); //observa a pasta public por arquivos estaticos
server.use(methodOverride('_method'));  //precisa estar antes das rotas
server.use(routes);


server.set("view engine", "njk"); //escolhe qual engine de view será usada

nunjucks.configure("views", {       //configura nunjucks. primeiro o caminho da pasta
    express:server,                  //segundo é options com a variavel a ser usada
    // autoescape: false
    noCache: true
});

server.listen(5000, function(){              //escolhe porta onde servidor escutará, seguida por um callback 
    console.log('server is running');       //que será executado quando a porta escutar algo
});

