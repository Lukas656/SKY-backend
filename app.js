const express = require('express');
const routers = require('./src/routes');
const port = 5000;

const app = express();
app.use(routers);







app.listen(port, () => {
	console.log(`Running application on port:  http://localhost:${port}`);
});