require('dotenv').config();
const { MongoClient, ServerApiVersion} = require('mongodb');


// Credenciais 
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

// funçao que conecta no Banco de dados Mongobd 
async function getConect() {
    const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.pryykts.mongodb.net/test`;
    const user = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await user.connect();
    const db = user.db("User");
    return db.collection("test-backend");
};


const  conectaBD= {
    getConect,

}

module.exports = conectaBD;