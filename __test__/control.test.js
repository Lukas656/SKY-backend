/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const funcs = require('../src/controllers/controll');

describe('create', ()=>{
	it('Deveria receber um objeto',async ()=>{
		const obj = {nome: 'lucas', email: 'lucas23@gmail.com', senha: 'lucas123', telefones:[{numero: '24567-1654', ddd: '11'}], token: String};

		const retorno = await funcs.createUser(obj);
	

		expect(retorno.nome).toBe(obj.nome);
		expect(retorno.email).toBe(obj.email);
		expect(retorno.senha).toBe(obj.senha);
		expect(retorno.telefones[0].numero).toBe(obj.telefones[0].numero);
		expect(retorno.telefones[0].ddd).toBe(obj.telefones[0].ddd);

	});
//	it('Deveria checar se o email deste objeto existe se existir deve retornar false', async ()=>{
//		
//	});
//	it('deveria criptografar a senha deste objeto');
//	it('deveria gerar um token');
//	it('deveria gerar um token e adicionar no objeto');
//	it('deveria criar o usuario retornar ele mesmo');
});