/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const conectDB = require('../database/database');
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
		telefones: [{
			numero: newUser.telefones[0].numero,
			ddd: newUser.telefones[0].ddd
		}],
		token: newUser.token,
		data_criacao: String,
	};

	const checkEmail = await conectionDb.findOne({ email: obj.email });
	if (!checkEmail) {
		// criptografando password
		const salt = await bcrypt.genSalt(8);
		const passwordHash = await bcrypt.hash(obj.senha, salt);
		obj.senha = passwordHash;

		const secret = process.env.TOKEN_SECRET;
		const token = jwt.sign(
			{
				nome: newUser.nome,
				email: newUser.email
			}, secret, { expiresIn: '30m' });

		obj.token = token;

		const hora = new Date().toLocaleTimeString();
		const criateData = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
		obj.data_criacao = criateData;
	
		await conectionDb.insertOne(obj);
	
		return obj;
	}
	return false;
}

// authenticate
async function authenticate(validaUser) {
	const conectionDb = await conectDB.getConect();
	
	const checkEmail = await conectionDb.findOne({email: validaUser.email });
	if (!checkEmail) {
		return false;

	}
	const checkPass = await bcrypt.compare(validaUser.senha, checkEmail.senha);
	if (!checkPass) {
		return false;
	}

	// adicionar a hora do Ultimo login 
	const hora = new Date().toLocaleTimeString();
	const newData= moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
	
	const ultimo_login = checkEmail.ultimo_login;

	let newValues = { $set: {ultimo_login: newData} };
	let resp = await conectionDb.updateOne(checkEmail,newValues);
	
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
	// criptografando a nova senha
	const salt = await bcrypt.genSalt(8);
	const passwordHash = await bcrypt.hash(newDate.senha, salt);
	newDate.senha = passwordHash;
	// adicionar a hora do login 
	const hora = new Date().toLocaleTimeString();
	const  ultima_atualizacao = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
	
	let newValues = { $set: { nome: newDate.nome,  senha: newDate.senha, telefones: [{ numero: newDate.telefones[0].numero, ddd: newDate.telefones[0].ddd }], data_atualizacao: ultima_atualizacao  } };
	let resp = await conectionDb.updateOne(myquere, newValues);
	
	return newValues;
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