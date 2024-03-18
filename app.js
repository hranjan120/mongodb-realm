const express = require('express');

const { initRealmConnection, writeNewData } = require('./realmConnection');

const app = express();

/*
*---------------------------------
*/
(async () => {
    initRealmConnection();
})();


app.get('/', async (req, res) => {
    await writeNewData();
    res.send('Data Inserted to Mongodb')
});

/*
*---------------------------------
*/
const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});