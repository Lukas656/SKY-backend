const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocs = require('../swagger.json');
const funcReq = require('../controllers/controllers');
//const checkToken = require('../controller/mindware');
const router = express();
router.use(bodyParser.json())
router.use(cors())



// Exibe mensagem se esta funcionando a conexao
router.get('/', async (req, res) => {
    res.status(200).send({ success: true, message: "System Operating!" })
});


// Conecta Com A Documentação Swagger
//router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));




// Sign up
router.post('/SignUp', async (req, res) => {
    const { nome, email, senha, telefones = [{ numero, ddd }], token } = req.body

    try {
        if (!nome) return res.status(400).send({ "menssagem": "Não Foi possivel criar este usuário (Ainda falta o nome)" });
        if (!email) return res.status(400).send({ "menssagem": "Não Foi possivel criar este usuário (Ainda falta o email)" });
        if (!senha) return res.status(400).send({ "menssagem": "Não Foi possivel criar este usuário (Ainda falta a senha)" });
        if (telefones == false) return res.status(400).send({ "menssagem": "Não Foi possivel criar este usuário (Ainda falta o telefone)" });
        if (telefones[0].numero == undefined) return res.status(400).send({ "menssagem": "Não Foi possivel criar este usuário (Ainda falta o NUMERO)" });
        if (telefones[0].ddd == undefined) return res.status(400).send({ "menssagem": "Não Foi possivel criar este usuário (Ainda falta o DDD)" });

        const data = req.body
        let newData = await funcReq.createUser(data);
        
        if (newData == false){
            return res.status(403).send({ "menssagem": "E-mail invalido" });
        };
        res.status(200).send(newData)


    } catch (error) {
        res.status(500).send({
            error: 'Error',
            message: error.message
        })
    }

});






module.exports = router;