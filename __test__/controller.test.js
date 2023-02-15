/* eslint-disable no-undef */
const funcs = require('../src/controllers/controllers');

describe('create', ()=>{
	it('Deveria receber um objeto',async ()=>{
		const obj = {nome: 'lucas', email: 'lucas2002@gmail.com', senha: 'lucas123', telefones:[{numero: '24567-1654', ddd: '11'}], token: String};

		const retorno = await funcs.createUser(obj);
	

		expect(retorno.nome).toBe(obj.nome);
		expect(retorno.email).toBe(obj.email);
		expect(retorno.senha).toBe(obj.senha);
		expect(retorno.telefones[0].numero).toBe(obj.telefones[0].numero);
		expect(retorno.telefones[0].ddd).toBe(obj.telefones[0].ddd);

	});
	// it('Deveria checar se o email deste objeto existe se existir deve retornar false', async ()=>{
	// 	const obj = {nome: 'lucas', email: 'lucas2023@gmail.com', senha: 'lucas123', telefones:[{numero: '24567-1654', ddd: '11'}], token: String};
		
	// 	const checkEmail = await conectionDb.findOne({ email: obj.email });
	// 	if(!checkEmail){
	// 		expect(retorno).toBe(true);		
	// 	}
	// 	const retorno = await funcs.createUser(obj);
	// 	expect(retorno).toBe(false);		
		
	// });
//	it('deveria criptografar a senha deste objeto');
//	it('deveria gerar um token');
//	it('deveria gerar um token e adicionar no objeto');
//	it('deveria criar o usuario retornar ele mesmo');
});