/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const swagger = require('../../swagger');
const controller = require('../controllers/controller');
const checkToken = require('../helpers/validation');
const bodyParser = require('body-parser');
const router = express();
router.use(bodyParser.json());
router.use(cors());



// Exibe mensagem se esta funcionando a conexao
router.get('/', async (req, res) => {
	res.status(200).send({ success: true, message: 'System Operating!' });
});


// Conecta Com A Documentação Swagger
router.use('/docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerDocs));



// Sign up
router.post('/SignUp', async (req, res) => {
	// eslint-disable-next-line no-unused-vars
	const { nome, email, senha, telefones=[{numero, ddd }], token} = req.body;

	try {
		if (!nome) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o nome)' });
		if (!email) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o email)' });
		if (!senha) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta a senha)' });
		if (telefones == false) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o telefone)' });
		if (telefones[0].numero == undefined) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o NUMERO)' });
		if (telefones[0].ddd == undefined) return res.status(400).send({ 'menssagem': 'Não Foi possivel criar este usuário (Ainda falta o DDD)' });

		const data = req.body;
		let newData = await controller.createUser(data);

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

});

// Sign in
router.post('/SigIn', checkToken, async (req, res) => {
	const { email, senha} = req.body;
	try {
		if (!email) return res.status(400).send({ 'menssagem': 'Não Foi possivel logar (Ainda falta o email)' });
		if (!senha) return res.status(400).send({ 'menssagem': 'Não Foi possivel logar (Ainda falta a senha)' });

		const data = req.body;


		let newData = await controller.authenticate(data);
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
});

// Find a user
router.get('/user/:id', checkToken, async (req, res) => {
	const user = req.params.id;

	try {
		if (!user) return res.status(400).send({ 'menssagem': 'Não encontrado (Ainda falta o digitar o id)' });

		const data = req.params.id;
		let userID = await controller.getUser(data);

		res.status(200).send(userID);


	} catch (error) {
		res.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
});
// update user
router.put('/user/:id', checkToken, async (req, res) => {
	let filter = req.params.id;
	let newDate = req.body;
	try {

		if (!newDate.nome) return res.status(400).send({ 'menssagem': 'Não Foi possivel Atualizar este usuário (Ainda falta o nome)' });
		if (!newDate.senha) return res.status(400).send({ 'menssagem': 'Não Foi possivel atualizar este usuário (Ainda falta a senha)' });
		if (newDate.telefones == false) return res.status(400).send({ 'menssagem': 'Não Foi possivel atualizar este usuário (Ainda falta o telefone)' });
		if (newDate.telefones[0].numero == undefined) return res.status(400).send({ 'menssagem': 'Não Foi possivel atualizar este usuário (Ainda falta o NUMERO)' });
		if (newDate.telefones[0].ddd == undefined) return res.status(400).send({ 'menssagem': 'Não Foi possivel atualizar este usuário (Ainda falta o DDD)' });

		let user = await controller.updateUser(filter, newDate);

		res.status(200).send({ success: true, user });


	} catch (error) {
		res.status(500).send({
			error: 'Error',
			message: error.message
		});
	}
});
// delete from id
router.delete('/user/:id', checkToken, async (req, res) => {
	let filter = req.params.id;
	try {

		if (!filter) return res.status(400).send({ 'menssagem': 'Não Foi possivel deletar este usuário (Ainda falta o digitar o ID)' });

		let user = await controller.deleteUser(filter);

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
});




module.exports = router;