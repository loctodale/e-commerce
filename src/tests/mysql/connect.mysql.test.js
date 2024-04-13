const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "shopDEV",
});

const batchSize = 100000; // adjut batch size
const totalSize = 10000000; // adjust total size

console.time(":::::::::::::TIMER");
let currentId = 1;
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name - ${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }
  if (!values.length) {
    console.timeEnd(":::::::::::::TIMER");
    pool.end((err) => {
      if (err) {
        console.log(`error occurred while running batch` + err);
      } else {
        console.log(`batch completed`);
      }
    });
    return;
  }

  const sql = `INSERT INTO test_table(id, name, age, address) VALUES ?`;
  pool.query(sql, [values], async (err, result) => {
    if (err) throw err;
    console.log(`insert ${result.affectedRows} records`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);
