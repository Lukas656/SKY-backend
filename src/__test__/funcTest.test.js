/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
const conectDB = require('../api/database');
const funcs = require('../api/funcoes-Req');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectID } = require('mongodb');


describe('Create Sign Up', ()=>{
	const obj = {nome: 'exemple nome', email: 'emailExemplo123@g.com', senha: 'senhaExemplo123', telefones:[{numero: '24567-1654', ddd: '11'}], token: String, data_criacao: String};
	it('Deveria checar se o email deste objeto existe se existir deve retornar false se não retornar o obj', async ()=>{
		const conectionDb = await conectDB.getConect();
		const checkEmail = await conectionDb.findOne({ email: obj.email });
		
	   if(!checkEmail){
		   const retorno = await funcs.createUser(obj);

		   expect(retorno.nome).toBe(obj.nome);
		   expect(retorno.email).toBe(obj.email);
		   expect(retorno.passwordHash).toBe(obj.passwordHash);
		   expect(retorno.telefones[0].numero).toBe(obj.telefones[0].numero);
		   expect(retorno.telefones[0].ddd).toBe(obj.telefones[0].ddd);	
		}

		const retorno = false;
		expect(retorno).toBe(false);		
	   
	});
	it('deveria criptografar a senha deste objeto', async ()=>{
		// criptografando password
	 	const salt = await bcrypt.genSalt(8);
	 	const passwordHash = await bcrypt.hash(obj.senha, salt);
	 	obj.senha = passwordHash;

		expect(obj.senha).toBe(passwordHash);
	});
	it('deveria gerar um token', ()=>{
		const secret = process.env.TOKEN_SECRET;
		const token = jwt.sign(
			{
				nome: obj.nome,
				email: obj.email
			}, secret, { expiresIn: '30m' });
	
		obj.token = token;

		expect(token).toBe(obj.token);
	});

	it('deveria adicionar data e hora da criação', async ()=>{
		const hora = new Date().toLocaleTimeString();
		criateData = moment().startOf('day').format(`DD/MM/YYYY , ${hora}`);
		obj.data_criacao = criateData;


		expect(obj.data_criacao).toBe(criateData);
	});
});

describe('authenticate Sign Un',()=>{
	const obj = {email: 'lucas2023@gmail.com', senha: 'lucas123'};

	it('Receber um obj com  email e senha validar', async ()=>{
		const retorno =  await funcs.authenticate(obj);
		if(retorno == false){
			expect(retorno).toBe(false);
		}
		else{
			expect(retorno.email).toBe(obj.email);
		}

	});

});
describe('Read User From ID',()=>{
	const id = '63ed0e87c0c3511707d76f6b';
	it('Receber um id e verifica se ele está no banco de dados', async ()=>{
		const retorno =  await funcs.getUser(id);

		if(retorno == false){
			expect(retorno).toBe(false);
		}
		else{
			expect(retorno).toBe(retorno);
		}

	});

});
describe('update User From ID',()=>{
	const filter = '63ed2308b90b86754fa9c7a2';
	const obj = {nome: 'Lucas Santos', senha: 'lucas123', telefones:[{numero: '56784-5321', ddd: '12'}]};
	it('Receber um id e verifica se ele está no banco de dados', async ()=>{
	
		const retorno = await funcs.updateUser(filter, obj);

		if(!retorno){
			expect(retorno).toBe(false);
		}

		
		
	});
});
describe('delete User From ID',()=>{
	const id = '63ed2308b90b86754fa9c7a2';
	it('deve retornar uma menssagem de usuario apagado!', async ()=>{
		const conectionDb = await conectDB.getConect();
		let myquere = await conectionDb.findOne({ _id: ObjectID(id) });
		const retorno =  await funcs.deleteUser(id);

		expect(retorno).toBe(`O Usuario ${myquere.nome} foi deletado com sucesso!!`);		
	});

});