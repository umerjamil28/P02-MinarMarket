const databaseConnect = require('./config/databaseConnect');
const dotEnv = require('dotenv');
const server = require('./app');

// Setting upp the environment variables
dotEnv.config({ path: './config/config.env' });

// Connect to the database
databaseConnect();

server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on PORT: ${process.env.SERVER_PORT}`);
});