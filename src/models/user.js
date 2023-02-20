/* eslint-disable linebreak-style */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const conectDB = require('../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectID } = require('mongodb');


// create
async function crieteUser(newUser) {
	const conectionDb = await conectDB.conect();
	const checkEmail = await conectionDb.findOne({ email: newUser.email });
	if (!checkEmail) {
		// criptografando password
		const salt = await bcrypt.genSalt(8);
		const passwordHash = await bcrypt.hash(newUser.senha, salt);
		newUser.senha = passwordHash;

		const secret = process.env.TOKEN_SECRET;
		const token = jwt.sign(
			{
				nome: newUser.nome,
				email: newUser.email
			}, secret, { expiresIn: '30m' });


		newUser.token = token;

		const hora = new Date().toLocaleTimeString();
		const criateData = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
		newUser.data_criacao = criateData;

		await conectionDb.insertOne(newUser);
		return newUser;
	}
	return false;
}

// authenticate
async function Authentication(validaUser) {
	const conectionDb = await conectDB.conect();

	const checkEmail = await conectionDb.findOne({ email: validaUser.email });
	if (!checkEmail) {
		return false;
	}
	const checkPass = await bcrypt.compare(validaUser.senha, checkEmail.senha);
	if (!checkPass) {
		return false;
	}

	// adicionar a hora do Ultimo login 
	const hora = new Date().toLocaleTimeString();
	const newData = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);

	const ultimo_login = checkEmail.ultimo_login;

	let newValues = { $set: { ultimo_login: newData } };
	let resp = await conectionDb.updateOne(checkEmail, newValues);

	return checkEmail;

}

// read from ID
async function userById(id) {
	const conectionDb = await conectDB.conect();

	const user = await conectionDb.findOne({ _id: ObjectID(id) });


	return user;
}
// update from ID
async function updateById(filter, newDate) {
	const conectionDb = await conectDB.conect();

	let myquere = { _id: ObjectID(filter) };
	// criptografando a nova senha
	const salt = await bcrypt.genSalt(8);
	const passwordHash = await bcrypt.hash(newDate.senha, salt);
	newDate.senha = passwordHash;
	// adicionar a hora do login 
	const hora = new Date().toLocaleTimeString();
	const ultima_atualizacao = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);

	let newValues = { $set: { nome: newDate.nome, senha: newDate.senha, telefones: [{ numero: newDate.telefones[0].numero, ddd: newDate.telefones[0].ddd }], data_atualizacao: ultima_atualizacao } };
	let resp = await conectionDb.updateOne(myquere, newValues);

	return newValues;
}
// update from ID
async function deleteById(filter) {
	const conectionDb = await conectDB.conect();

	let myquere = await conectionDb.findOne({ _id: ObjectID(filter) });
	let menssagem = `O Usuario ${myquere.nome} foi deletado com sucesso!!`;
	let resp = conectionDb.deleteOne(myquere);
	return menssagem;
}

const usuarioController = {
	crieteUser,
	Authentication,
	userById,
	updateById,
	deleteById
};

module.exports = usuarioController;