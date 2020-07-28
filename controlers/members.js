

const fs = require('fs'); // utiliza o fs (file system) do node.js
const data = require('../data.json'); //json nao precisa de module.exports
const { age, date } = require('../utils');  //desestrutura o objeto do utils e pega o age e o date
const Intl = require('intl');   //substitui o intl do node que nao estava funcionando


//index

exports.index = function(req,res){
    const members = data.members;
    return res.render('members/index', { members: members });
};

//create

exports.create = function(req,res){
    res.render('members/create')
};

//post

exports.post = function(req,res){
    
    const keys = Object.keys(req.body)  // constructor que faz um array com as chaves do objeto, sem os valores
                                        // ["avatar_url","name","birth","gender","services"] 
    
    for (key of keys) {
        //req.body.avatar_url , req.body.name, ....
        //req.body.key == ""
        if (req.body[key] == ""){
            return res.send('Please, fill all fields.')
        }
    }


    let {avatar_url, email, goal, weight, height, birth, created_at, services, name, gender} = req.body; //desestrutura o req.body para acessar apenas as variaveis selecionadas
    
    let id = 1;
    const lastMember = data.members[data.members.length - 1]; //pega o ultimo elemento do array, remove um (porque array comeaça do 0) e tira o id

    if(lastMember) {
        id = lastMember.id + 1;
    }
    
    birth = Date.parse(req.body.birth); // pega o birth e coloca no mesmo formato do created_at

    data.members.push({
        id,
        email,
        goal,
        weight,
        height,
        name,
        avatar_url,
        birth,
        gender,
        services,
        created_at
    });

    fs.writeFile('data.json', JSON.stringify(data,null,2), function(err){  //transforma o req.body em um JSON e salva no data.json e prepara para caso de erro
        if(err) {
            return res.send('File write error!'); //caso tenha erro
        }
        return res.redirect('/members');         //caso nao tenha erro
    }); 

    // return res.send(req.body);
};

//show

exports.show = function(req,res){
    //req.query.id   ---- pega o ?id=
    //req.body       ---- pega o corpo atraves do post
    //req,params.id  ---- pega o www.[...]/id

    const { id } = req.params;
    const foundMember = data.members.find(function(member){
        return member.id == id;         //retorna true se encontrar instrutor com aquele id
    });

    if (!foundMember) {
        return res.send('Member not found!');
    }



    const member = {
        ...foundMember,         //coloca no objeto tudo que tem no found member
        age: age(foundMember.birth),                     //corrige (sobrescreve) age
        birth: date(foundMember.birth).birthDay
    }

    return res.render('members/show', {member : member});
}

//edit

exports.edit = function(req,res){
    
    const { id } = req.params;
    const foundMember = data.members.find(function(member){
        return member.id == id;         //retorna true se encontrar instrutor com aquele id
    });

    if (!foundMember) {
        return res.send('Member not found!');
    }

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    }

    // console.log(member)
    return res.render('members/edit' , {member: member })
}

//update

exports.put = function(req,res){

    const { id } = req.body;    //pega o id enviado pelo body
    let index = 0;

    const foundMember = data.members.find(function(member, foundIndex){ //foundIndex mostra o indice da repetiçao
        if (id == member.id) {
            index = foundIndex; //atualiza valor do index para o index do instrutor encontrado
            return true;        //diz que foi encontrado o instrutor
        }

    });

    if (!foundMember) {
        return res.send('Member not found!');
    }

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    };

    data.members[index] = member;   //pega o member atualizado e coloca no array data.member na posição do index

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Update Error!');
        return res.redirect(`members/${id}`)
    });

}

//delete

exports.delete = function(req,res) {
    const { id } = req.body;

    const filteredMembers = data.members.filter(function(member){ //roda para cada instrutor, tudo que retornar true ele poe no array, tudo que retornar falso é retirado do array
        return member.id != id //se o id encontrado for diferente, retorna true e mantem no array, senao, retira do array
    });

    data.members = filteredMembers;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("File write error!");

        return res.redirect('/members')
    });
}

