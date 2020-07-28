
//faz as rotas fora do server.js

//HTTP VERBS
    //GET: Receber RESOURCE
    //POST: Criar um novo RESOURCE com dados enviados
    //PUT: Atualizar RESOURCE
    //DELETE: Deletar RESOURCE

const express = require('express');
const routes = express.Router(); //faz com que a variavel fique responsavel pelas rotas

const instructors = require('./controlers/instructors') //chama as funçoes do instructor.js para usar nas rotas
const members = require('./controlers/members') //chama as funçoes do members.js para usar nas rotas


routes.get('/', function(req, res){
    return res.redirect('/instructors');
});



routes.get('/instructors', instructors.index);
routes.get('/instructors/create', instructors.create);
routes.post('/instructors', instructors.post ); //usa o metodo post do instructors.js
routes.get('/instructors/:id', instructors.show);
routes.get('/instructors/:id/edit', instructors.edit);
routes.put('/instructors', instructors.put);
routes.delete('/instructors', instructors.delete);



routes.get('/members', members.index);
routes.get('/members/create', members.create);
routes.post('/members', members.post ); //usa o metodo post do members.js
routes.get('/members/:id', members.show);
routes.get('/members/:id/edit', members.edit);
routes.put('/members', members.put);
routes.delete('/members', members.delete);


module.exports = routes; //exporta as rotas