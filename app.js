const express = require('express');
const routers = require('./src/routes/router');
const port = 8000;

const app = express();
app.use(routers)







app.listen(port, () => {
    console.log(`Running application on port:  http://localhost:${port}`)
});