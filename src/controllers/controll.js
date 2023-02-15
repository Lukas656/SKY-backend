/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const conectDB = require('../model/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectID } = require('mongodb');



// create
async function createUser(newUser) {
	const obj = {
		nome: newUser.nome,
		email: newUser.email,
		senha: newUser.senha,
		telefones:[{
			numero: newUser.telefones[0].numero,
			ddd: newUser.telefones[0].ddd}],
		token: String
	}; 

    
	return obj;
}



const funcReq = {
	createUser,

};

module.exports = funcReq;