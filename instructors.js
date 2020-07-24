

const fs = require('fs'); // utiliza o fs (file system) do node.js
const data = require('./data.json'); //json nao precisa de module.exports
const { age, date } = require('./utils');  //desestrutura o objeto do utils e pega o age e o date
const Intl = require('intl');   //substitui o intl do node que nao estava funcionando


//create

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

    req.body.created_at = Date.now(); // contructor que indica a data da criação do obj
    req.body.birth = Date.parse(req.body.birth); // pega o birth e coloca no mesmo formato do created_at
    req.body.id = Number(data.instructors.length + 1); //constructor que cria um id, pega o length do instructors no data.json e adicona um

    const {avatar_url, birth, created_at, id, name, services, gender} = req.body; //desestrutura o req.body para acessar apenas as variaveis selecionadas

    data.instructors.push({
        id,
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
        return res.redirect('/instructors');         //caso nao tenha erro
    }); 

    // return res.send(req.body);
};

//show

exports.show = function(req,res){
    //req.query.id   ---- pega o ?id=
    //req.body       ---- pega o corpo atraves do post
    //req,params.id  ---- pega o www.[...]/id

    const { id } = req.params;
    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id;         //retorna true se encontrar instrutor com aquele id
    });

    if (!foundInstructor) {
        return res.send('Instructor not found!');
    }



    const instructor = {
        ...foundInstructor,         //coloca no objeto tudo que tem no found instructor
        age: age(foundInstructor.birth),                     //corrige (sobrescreve) age
        services: foundInstructor.services.split(','),  //corrige (sobrescreve) services, quebrando na virgula e pondo em array
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at)              //corrige (sobrescreve) created_at
    }

    return res.render('instructors/show', {instructor : instructor});
}

//edit

exports.edit = function(req,res){
    
    const { id } = req.params;
    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id;         //retorna true se encontrar instrutor com aquele id
    });

    if (!foundInstructor) {
        return res.send('Instructor not found!');
    }

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    }

    // console.log(instructor)
    return res.render('instructors/edit' , {instructor: instructor })
}

//update

exports.put = function(req,res){

    const { id } = req.body;
    let index = 0;

    const foundInstructor = data.instructors.find(function(instructor, foundIndex){ //foundIndex mostra o indice da repetiçao
        if (id == instructor.id) {
            index = foundIndex; //atualiza valor do index para o index do instrutor encontrado
            return true;        //diz que foi encontrado o instrutor
        }

    });

    if (!foundInstructor) {
        return res.send('Instructor not found!');
    }

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth)
    };

    data.instructors[index] = instructor;   //pega o instructor atualizado e coloca no array data.instructor na posição do index

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Update Error!');
        return res.redirect(`instructors/${id}`)
    });

}

//delete

exports.delete = function(req,res) {
    const { id } = req.body;

    const filteredInstructors = data.instructors.filter(function(instructor){ //roda para cada instrutor, tudo que retornar true ele poe no array, tudo que retornar falso é retirado do array
        return instructor.id != id //se o id encontrado for diferente, retorna true e mantem no array, senao, retira do array
    });

    data.instructors = filteredInstructors;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("File write error!");

        return res.redirect('/instructors')
    });
}

