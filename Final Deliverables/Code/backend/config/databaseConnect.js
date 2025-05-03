const mongoose = require('mongoose');

const ConnectDB = async (retries = 5, delay = 8000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(process.env.DB_URL, { dbName: 'MinarMarket',
                serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
                 });
            console.log('DB CONNECTED');
            return;
        } catch (err) {
            console.log(`Error Connecting to the DB. Attempt ${i + 1} of ${retries}, log: ${err}`);
            if (i < retries - 1) {
                console.log(`Retrying connection in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    console.log('Failed to connect to the database after multiple attempts.');
}

module.exports = ConnectDB;
