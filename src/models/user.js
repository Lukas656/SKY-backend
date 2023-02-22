/* eslint-disable linebreak-style */
require('dotenv').config();
const repository = require('../repository/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { v4: uuidv4 } = require('uuid');

const COLLETION_USUARIO = process.env.COLLETION_USUARIO;

function getDate() {
	// adicionar a hora do Ultimo login 
	const hora = new Date().toLocaleTimeString();
	return moment().startOf('day').format(`DD/MM/YYYY ${hora}`);
}
const createTokenJWT = (newUser) => {
	const secret = process.env.TOKEN_SECRET;
	const token = jwt.sign(
		{
			id: newUser.id,
			nome: newUser.nome,
			email: newUser.email
		}, secret, { expiresIn: '30m' });

	return token;
};

// create
async function create(newUser) {
	const result = await repository.findByFilter(COLLETION_USUARIO, { email: newUser.email });
	if (!result) {
		// criptografando password
		const salt = await bcrypt.genSalt(8);
		const passwordHash = await bcrypt.hash(newUser.senha, salt);
		newUser.id = uuidv4();
		newUser.senha = passwordHash;
		newUser.data_criacao = getDate();
		newUser.token = createTokenJWT(newUser);

		await repository.insertOne(COLLETION_USUARIO, newUser);
		delete newUser._id;
		return newUser;
	}
	return false;
}

// authenticate
async function authentication(validaUser) {
	let result = await repository.findByFilter(COLLETION_USUARIO, { email: validaUser.email });
	if (!result) {
		return false;
	}
	const checkPass = await bcrypt.compare(validaUser.senha, result.senha);
	if (!checkPass) {
		return false;
	}

	const newToken = createTokenJWT(result);
	const date = getDate();


	await repository.updateOne(COLLETION_USUARIO, { id: result.id }, { $set: { token: newToken, ultimo_login: date } });
	result.token = newToken;
	result.ultimo_login = date;

	delete result.senha;
	delete result._id;

	return result;

}

async function getUserById(id) {
	let result = await repository.findByFilter(COLLETION_USUARIO, { id: id });
	if (result) {
		delete result.senha;
		delete result.token;
	}

	return result;
}

// update from ID  63f4cfccde9791ad588c90ad
async function updateById(id, newData) {
	// adicionar a hora do login 
	const ultima_atualizacao = getDate();

	newData.data_atualizacao = ultima_atualizacao;
	// criptografando a nova senha
	const salt = await bcrypt.genSalt(8);
	const passwordHash = await bcrypt.hash(newData.senha, salt);
	newData.senha = passwordHash;


	await repository.updateOne(COLLETION_USUARIO, { id: id }, { $set: { nome: newData.nome, senha: newData.senha, telefones: [{ numero: newData.telefones[0].numero, ddd: newData.telefones[0].ddd }], data_atualizacao: ultima_atualizacao } });

	delete newData.senha;
	delete newData._id;

	return newData;
}

// delete from ID
async function deleteById(id) {
	const resultDelete = await repository.deleteOne(COLLETION_USUARIO, { id: id });
	let result = { mensagem: null };
	if (resultDelete && resultDelete.deletedCount && resultDelete.deletedCount > 0) {
		result.mensagem = 'O Usuario foi deletado com sucesso!!';
	} else {
		result.mensagem = 'Não encontramos o usuario na base';
	}

	return result;
}

const usuarioController = {
	create,
	authentication,
	updateById,
	deleteById,
	getUserById
};

module.exports = usuarioController;