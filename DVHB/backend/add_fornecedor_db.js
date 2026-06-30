require('dotenv').config({ path: '../.env' });
const db = require('./src/utils/db');

(async () => {
    try {
        await db.authenticate();
        await db.query("ALTER TABLE produtos ADD COLUMN fornecedor_id INT");
        console.log('Column fornecedor_id added to produtos successfully!');
    } catch (err) {
        console.error('Error altering table:', err);
    } finally {
        await db.close();
    }
})();
