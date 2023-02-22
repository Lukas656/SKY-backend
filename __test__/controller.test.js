/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-mixed-spaces-and-tabs */


const obj = {
	nome: 'John Doe',
	email: 'johndoe@example.com',
	senha: 'myPassword123',
	telefone: [{
		numero: '123456789',
		ddd: '11'
	}]
};


describe('Teste da função que recebe um objeto com nome, email, senha e telefone', () => {
	it('Deve receber um objeto com os campos corretos', () => {
	  expect(typeof obj).toBe('object');
	  expect(obj.nome).toBeDefined();
	  expect(typeof obj.nome).toBe('string');
	  expect(obj.email).toBeDefined();
	  expect(typeof obj.email).toBe('string');
	  expect(obj.senha).toBeDefined();
	  expect(typeof obj.senha).toBe('string');
	  expect(obj.telefone).toBeDefined();
	  expect(Array.isArray(obj.telefone)).toBeTruthy();
	  expect(obj.telefone[0].numero).toBeDefined();
	  expect(typeof obj.telefone[0].numero).toBe('string');
	  expect(obj.telefone[0].ddd).toBeDefined();
	  expect(typeof obj.telefone[0].ddd).toBe('string');
	});
});