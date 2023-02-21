const Joi = require('joi');

const schema = {
    body: Joi.object().keys({
        nome: Joi.string().min(3).required()
            .messages({
                'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta o nome)`
            }),
        email: Joi.string().email().required().messages({
            'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta o email)`
        }),
        senha: Joi.string().min(3).required()
            .messages({
                'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta a senha)`
            }),
        telefones: Joi.array()
            .items({
                numero: Joi.string().min(9).messages({
                    'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta o Numero)`
                }),
                ddd: Joi.string().min(2).messages({
                    'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta o DDD)`
                }),
            })
    }),
    bodySignin: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'any.required': `"Menssagem:" Digite o Email!!`
        }),
        senha: Joi.string().min(3).required()
            .messages({
                'any.required': `"Menssagem:" Digite a Senha!!`
            }),
    }),
    bodyPut: Joi.object().keys({
        nome: Joi.string().min(3).required()
            .messages({
                'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta o Novo nome)`
            }),
        senha: Joi.string().min(3).required()
            .messages({
                'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta a Nova senha)`
            }),
        telefones: Joi.array()
            .items({
                numero: Joi.string().min(9).messages({
                    'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta o Novo  Numero)`
                }),
                ddd: Joi.string().min(2).messages({
                    'any.required': `"Menssagem:" Não Foi possivel criar este usuário (Ainda falta o Novo  DDD)`
                }),
            })
    }),
    params: Joi.object().keys({
        id: Joi.string().min(3).required().messages({
            'any.required': `"Menssagem:" Digite o ID deste usuario`
        }),
    })

};

module.exports = schema;


