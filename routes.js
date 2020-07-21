
//faz as rotas fora do server.js

const express = require('express');
const routes = express.Router(); //faz com que a variavel fique responsavel pelas rotas

const instructors = require('./instructors') //chama as funçoes do instructor.js para usar nas rotas


routes.get('/', function(req, res){
    return res.redirect('/instructors');
});

routes.get('/instructors', function(req, res){
    return res.render('instructors/index');
});

routes.get('/instructors/create', function(req,res){
    res.render('instructors/create')
});

routes.post('/instructors', instructors.post ); //usa o metodo post do instructors.js

routes.get('/instructors/:id', instructors.show)

routes.get('/instructors/:id/edit', instructors.edit)

routes.get('/members', function(req, res){
    return res.send('members');
});

module.exports = routes; //exporta as rotas