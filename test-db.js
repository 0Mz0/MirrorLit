// test-db.js
const mysql = require('mysql2/promise');
async function testConnection() { try { const connection = await mysql.createConnection({ host: '34.64.71.18', user: 'myuser', password: 'mypassword', database: 'mirrorlit_db', port: 3306 }); console.log('DB 연결 성공!'); await connection.end(); } catch (err) { console.error('DB 연결 실패:', err.message); } } testConnection();
