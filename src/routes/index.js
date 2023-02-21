/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const swagger = require('../../swagger');
const userControll = require('../controllers/usersController');
const checkToken = require('../helpers/Authorization');
const bodyParser = require('body-parser');

const router = express();
router.use(bodyParser.json());
router.use(cors());


// Exibe mensagem se esta funcionando a conexao
router.get('/', async (req, res) => res.status(200).send({ success: true, message: 'System Operating!' }));

// Conecta Com A Documentação Swagger
router.use('/docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerDocs));

// // Sign up
router.post('/SignUp', userControll.create);
// Sign in
router.post('/SigIn',  userControll.authentic);
// Find a user
router.get('/user/:id', checkToken, userControll.readUser);
// update user
router.put('/user/:id', checkToken, userControll.updateUser);
// delete from id
router.delete('/user/:id', checkToken, userControll.deleteUser);


module.exports = router;



// https://youtu.be/xXjyqcDTkD0