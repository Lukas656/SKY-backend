require('dotenv').config();
const userModels = require('../models/user');
const jwt = require('jsonwebtoken');

async function createUser(req, resp) {
	try {
		const data = req.body;
		let newData = await userModels.create(data);

		if (newData == false) {
			return resp.status(403).send({ 'menssagem': 'E-mail já Existente!' });
		}
		
		resp.status(200).send(newData);


	} catch (error) {
		resp.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}

async function authentication(req, resp) {
	try {
		const data = req.body;
		let newData = await userModels.authentication(data);
		if (newData == false) {
			return resp.status(401).send({ 'menssagem': 'Usuário e/ou senha inválidos' });
		}
		resp.status(200).send(newData);


	} catch (error) {
		resp.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}

async function getUserById(req, resp) {
	try {
		const data = getTokenAuthorization(req);
		if (data.id === req.params.id) {
			const result = await userModels.getUserById(data.id)
			resp.status(200).send(result);	
		}
		else {
			resp.status(401).send({ mensagem: "Não autorizado"});
		}

	} catch (error) {
		resp.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}
async function updateUser(req, resp) {
	let newDate = req.body;
	try {
		const data = getTokenAuthorization(req);
		await userModels.updateById(data.id, newDate);

		resp.status(200).send({ mensagem: 'Usuário alterado com sucesso'});

	} catch (error) {
		resp.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}

async function deleteUser(req, resp) {
	try {
		const data = getTokenAuthorization(req);
		let result = await userModels.deleteById(data.id);
		if (result == false) {
			return resp.status(403).send({ 'menssagem': 'ID não existente!' });
		}
		resp.status(200).send(result);


	} catch (error) {
		resp.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}

const getTokenAuthorization = (req) => {
	return jwt.verify(req.headers['authorization'].split(" ")[1], process.env.TOKEN_SECRET);
}

module.exports = { createUser, authentication, getUserById, updateUser, deleteUser };