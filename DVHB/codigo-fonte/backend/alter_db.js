require('dotenv').config({ path: '../.env' });
const db = require('./src/utils/db');

(async () => {
    try {
        await db.authenticate();
        await db.query("ALTER TABLE usuarios ADD COLUMN tipo_conta ENUM('freelancer', 'empresa fornecedora', 'empresa consumidora', 'usuario') DEFAULT 'usuario'");
        console.log('Column tipo_conta added successfully!');
    } catch (err) {
        console.error('Error altering table:', err);
    } finally {
        await db.close();
    }
})();
