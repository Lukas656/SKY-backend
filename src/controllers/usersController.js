/* eslint-disable linebreak-style */
const userModels = require('../models/usuario');

async function create(req, res) {
	try {
		if (!req.body.nome) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o nome)' });
		if (!req.body.email) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o email)' });
		if (!req.body.senha) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta a senha)' });
		if (req.body.telefones[0].numero == undefined) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o NUMERO)' });
		if (req.body.telefones[0].ddd == undefined) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o DDD)' });

		const data = req.body;
		let newData = await userModels.criarUsuario(data);

		if (newData == false) {
			return res.status(403).send({ 'menssagem': 'E-mail já Existente!' });
		}
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.status(200).send(newData);


	} catch (error) {
		res.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}
async function logar(req, res) {
	const { email, senha } = req.body;
	try {
		if (!email) return res.status(400).send({ 'menssagem': 'Não Foi possivel logar (Ainda falta o email)' });
		if (!senha) return res.status(400).send({ 'menssagem': 'Não Foi possivel logar (Ainda falta a senha)' });

		const data = req.body;


		let newData = await userModels.autenticacao(data);
		if (newData == false) {
			return res.status(401).send({ 'menssagem': 'Usuário e/ou senha inválidos' });
		}
		res.status(200).send(newData);


	} catch (error) {
		res.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}

async function readUser(req, res) {
	const user = req.params.id;
	try {
		if (!user) return res.status(400).send({ 'menssagem': 'Não encontrado (Ainda falta o digitar o id)' });

		const data = req.params.id;
		let userID = await userModels.userID(data);

		res.status(200).send(userID);

	} catch (error) {
		res.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}
async function updateUser(req, res) {
	let filter = req.params.id;
	let newDate = req.body;
	try {

		if (!newDate.nome) return res.status(400).send({ 'menssagem': 'Não Foi possivel Atualizar este usuário (Ainda falta o nome)' });
		if (!newDate.senha) return res.status(400).send({ 'menssagem': 'Não Foi possivel atualizar este usuário (Ainda falta a senha)' });
		if (newDate.telefones == false) return res.status(400).send({ 'menssagem': 'Não Foi possivel atualizar este usuário (Ainda falta o telefone)' });
		if (newDate.telefones[0].numero == undefined) return res.status(400).send({ 'menssagem': 'Não Foi possivel atualizar este usuário (Ainda falta o NUMERO)' });
		if (newDate.telefones[0].ddd == undefined) return res.status(400).send({ 'menssagem': 'Não Foi possivel atualizar este usuário (Ainda falta o DDD)' });

		let user = await userModels.atualiza(filter, newDate);

		res.status(200).send({ success: true, user });


	} catch (error) {
		res.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}
async function deleteUser(req, res) {
	let filter = req.params.id;
	try {

		if (!filter) return res.status(400).send({ 'menssagem': 'Não Foi possivel deletar este usuário (Ainda falta o digitar o ID)' });
		let user = await userModels.deleta(filter);
		if (user == false) {
			return res.status(403).send({ 'menssagem': 'ID não existente!' });
		}
		res.status(200).send({ success: true, user });


	} catch (error) {
		res.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
}

module.exports = { create, logar, readUser, updateUser, deleteUser };