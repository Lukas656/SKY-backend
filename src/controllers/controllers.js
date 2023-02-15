/* eslint-disable no-unused-vars */
require('dotenv').config();
const conectDB = require('../model/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectID } = require('mongodb');



// create
async function createUser(newUser) {
	const conectionDb = await conectDB.getConect();
	const obj = {
		nome: newUser.nome,
		email: newUser.email,
		senha: newUser.senha,
		telefones:[{
			numero: newUser.telefones[0].numero,
			ddd: newUser.telefones[0].ddd}],
		token: String
	}; 
		
	const checkEmail = await conectionDb.findOne({ email: obj.email });
	if(checkEmail=== true){
		return false;
	}


	return obj;
	

	// if (!checkEmail) {
	// 	// criptografando password
	// 	const salt = await bcrypt.genSalt(8);
	// 	const passwordHash = await bcrypt.hash(newUser.senha, salt);
	// 	newUser.senha = passwordHash;

	// 	const secret = process.env.TOKEN_SECRET;
	// 	const token = jwt.sign(
	// 		{
	// 			nome: newUser.nome,
	// 			email: newUser.email
	// 		}, secret, { expiresIn: '30m' });

	// 	newUser.token = token;
	// 	const hora = new Date().toLocaleTimeString();
	// 	newUser.data_criacao = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
	// 	newUser.data_atualizacao = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
	// 	newUser.ultimo_login = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);


	// 	await conectionDb.insertOne(newUser);

	// 	return newUser;
	// }

	// return false;
}

// authenticate
async function authenticate(validaUser) {
	const conectionDb = await conectDB.getConect();
	const checkEmail = await conectionDb.findOne({ email: validaUser.email });
	if (!checkEmail) {
		return false;
	}
	const checkPass = await bcrypt.compare(validaUser.senha, checkEmail.senha);
	if (!checkPass) {
		return false;
	}

	// adicionar a hora do login 
	const hora = new Date().toLocaleTimeString();
	checkEmail.ultimo_login = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);


	return checkEmail;
}

// read from ID
async function getUser(id) {
	const conectionDb = await conectDB.getConect();

	const user = await conectionDb.findOne({ _id: ObjectID(id) });
	return user;
}

// update from ID
async function updateUser(filter, newDate) {
	const conectionDb = await conectDB.getConect();

	let myquere = { _id: ObjectID(filter) };

	const checkEmail = await conectionDb.findOne({ email: newDate.email });
	if (!checkEmail) {
		let newValues = { $set: { nome: newDate.nome, email: newDate.email, senha: newDate.senha, telefones: [{ numero: newDate.telefones[0].numero, ddd: newDate.telefones[0].ddd }] } };
		let resp = await conectionDb.updateOne(myquere, newValues);
		return newValues;
	}

	return false;

}
// update from ID
async function deleteUser(filter) {
	const conectionDb = await conectDB.getConect();

	let myquere = await conectionDb.findOne({ _id: ObjectID(filter) });
	let menssagem = `O Usuario ${myquere.nome} foi deletado com sucesso!!`;
	let resp = conectionDb.deleteOne(myquere);
	return menssagem;
}


const funcReq = {
	createUser,
	authenticate,
	getUser,
	updateUser,
	deleteUser
};

module.exports = funcReq;