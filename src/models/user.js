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
const createTokenJWT=(newUser)=>{
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

		newUser.token = createTokenJWT(newUser);
		newUser.data_criacao = getDate();

		await repository.insertOne(COLLETION_USUARIO,newUser);
		return newUser;
	}
	return false;
}

// authenticate
async function Authentication(validaUser) {
	let result = await repository.findByFilter(COLLETION_USUARIO,{ email: validaUser.email });
	if (!result) {
		return false;
	}
	const checkPass = await bcrypt.compare(validaUser.senha, result.senha);
	if (!checkPass) { 
		return false;
	}

	const newToken = createTokenJWT(result);
	const date = getDate();
	await repository.updateOne(COLLETION_USUARIO, {_id: ObjectID(result._id)}, { $set: { token: newToken, ultimo_login: date } });
	result.token = newToken;
	result.ultimo_login = date;

	return result;

}


// update from ID
async function updateById(id, newData) {
	// adicionar a hora do login 
	const ultima_atualizacao = getDate();	
	result = await repository.updateOne(COLLETION_USUARIO, {_id: ObjectID(id)},  { $set: { nome: newData.nome, senha: newData.senha, telefones: [{ numero: newData.telefones[0].numero, ddd: newData.telefones[0].ddd }], data_atualizacao: ultima_atualizacao } });
	
	newData.data_atualizacao = ultima_atualizacao;

	// criptografando a nova senha
	const salt = await bcrypt.genSalt(8);
	const passwordHash = await bcrypt.hash(newData.senha, salt);
	newData.senha = passwordHash;
	
	return newData;
}

// delete from ID
async function deleteById(id) {
	result = await repository.deleteOne(COLLETION_USUARIO, {_id: ObjectID(id)});
	let menssagem = `O Usuario foi deletado com sucesso!!`;

	return menssagem;
}

const usuarioController = {
	createUser,
	Authentication,
	updateById,
	deleteById
};

module.exports = usuarioController;