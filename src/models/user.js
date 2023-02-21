/* eslint-disable linebreak-style */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const repository = require('../repository/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectID } = require('mongodb');
const COLLETION_USUARIO = process.env.COLLETION_USUARIO;


function getDate(){
	// adicionar a hora do Ultimo login 
	const hora = new Date().toLocaleTimeString();
	return moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
}
const getToken=(newUser)=>{
	const secret = process.env.TOKEN_SECRET;
	const token = jwt.sign(
		{
			nome: newUser.nome,
			email: newUser.email
		}, secret, { expiresIn: '30m' });

	return  token;
};


// create
async function createUser(newUser) {
	const result = await repository.findByFilter(COLLETION_USUARIO,{ email: newUser.email });
	if (!result) {
		// criptografando password
		const salt = await bcrypt.genSalt(8);
		const passwordHash = await bcrypt.hash(newUser.senha, salt);
		newUser.senha = passwordHash;

		newUser.token = getToken(result);
		newUser.data_criacao = getDate();

		await repository.insertOne(COLLETION_USUARIO,newUser);
		return newUser;
	}
	return false;
}

// authenticate
async function Authentication(validaUser) {
	const result = await repository.findByFilter(COLLETION_USUARIO,{ email: validaUser.email });
	if (!result) {
		return false;
	}
	const checkPass = await bcrypt.compare(validaUser.senha, result.senha);
	if (!checkPass) {
		return false;
	}



	await repository.updateOne(result, { $set: { ultimo_login: getDate() } });
	return result;

}


// update from ID
async function updateById(filter, newData) {

	let myquery = { _id: ObjectID(filter) };
	// criptografando a nova senha
	const salt = await bcrypt.genSalt(8);
	const passwordHash = await bcrypt.hash(newData.senha, salt);
	newData.senha = passwordHash;
	// adicionar a hora do login 
	const hora = new Date().toLocaleTimeString();
	const ultima_atualizacao = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);

	let newValues = { $set: { nome: newData.nome, senha: newData.senha, telefones: [{ numero: newData.telefones[0].numero, ddd: newData.telefones[0].ddd }], data_atualizacao: ultima_atualizacao } };
	let resp = await repository.updateOne(myquery, newValues);

	return newValues;
}
// update from ID
async function deleteById(filter) {

	let myquere = await repository.findOne({ _id: ObjectID(filter) });
	let menssagem = `O Usuario ${myquere.nome} foi deletado com sucesso!!`;
	let result = repository.deleteOne(myquere);
	return menssagem;
}

const usuarioController = {
	createUser,
	Authentication,
	updateById,
	deleteById
};

module.exports = usuarioController;