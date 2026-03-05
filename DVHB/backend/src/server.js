require('dotenv').config();
const app = require('./app');
const db = require('./db');

const PORT = process.env.PORT || 5000;

(async () => {
    try{
        await db.authenticate();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
    });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();