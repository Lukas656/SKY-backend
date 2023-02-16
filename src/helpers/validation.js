require('dotenv').config();
const jwt = require('jsonwebtoken');

// valida  Token
async function checkToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if(!token){
		return res.status(401).send({Menssagem: 'Token invalido!'});
	}
	try{
		const secret = process.env.TOKEN_SECRET;

		jwt.verify(token, secret);

		next();

	}catch(error){
		res.status(400).send({Menssagem: 'Sessão inválida , seu token expirou!'});
	}
    
}

module.exports = checkToken;