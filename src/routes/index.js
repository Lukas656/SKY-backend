/* eslint-disable linebreak-style */
const express = require('express');
const cors = require('cors');
const swagger = require('../../swagger');
//controllers 
const userControll = require('../controllers/usersController');
const bodyParser = require('body-parser');
// helpers
const validationMiddleware = require('../helpers/ValidateRequest');
const Authorization = require('../helpers/Authorization');
//Schemas
const usuarioSchema = require('../schemas/userSchema');

const router = express();
router.use(bodyParser.json());
router.use(cors());



// Exibe mensagem se esta funcionando a conexao
router.get('/', async (req, res) => res.status(200).send({ success: true, message: 'System Operating!' }));

// Conecta Com A Documentação Swagger
router.use('/docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerDocs));

// // Sign up
router.post('/SignUp',validationMiddleware(usuarioSchema.body, 'body'), userControll.createUser);
// Sign in
router.post('/SigIn',validationMiddleware(usuarioSchema.bodySignin, 'body'), userControll.authentication);
// Find a user
router.get('/user/:id', validationMiddleware(usuarioSchema.params, 'params'), Authorization, userControll.getUserById);
// update user
router.put('/user',validationMiddleware(usuarioSchema.bodyPut, 'body'), Authorization,  userControll.updateUser);
// delete from id
router.delete('/user', Authorization, userControll.deleteUser);


module.exports = router;


