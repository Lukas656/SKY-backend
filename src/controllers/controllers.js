require('dotenv').config();
const { ObjectID } = require('mongodb');
const conectDB = require("../model/database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');



// create
async function createUser(newUser, res) {
    const conectionDb = await conectDB.getConect();
    const checkEmail = await conectionDb.findOne({email: newUser.email});

    if(!checkEmail){
            // criptografando password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(newUser.senha, salt)
    newUser.senha = passwordHash
    
    const secret = process.env.TOKEN_SECRET
    const token = jwt.sign(
    {
        senha: newUser.senha
    },secret,
    )
    
    newUser.token = token
    const hora = new Date().toLocaleTimeString();
    newUser.data_criacao = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
    newUser.data_atualizacao = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
    newUser.ultimo_login = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
    

    await conectionDb.insertOne(newUser)
     
    return newUser
}

   return false
};



const funcReq = {
    createUser

}

module.exports = funcReq;