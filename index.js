const express = require("express");
const {default: mongoose, connect}  = require("mongoose");
const {HOST,PORT,ENV, DB} = require("./config/server");
const dbConfig = require("./config/db") [ENV];
const masterRouter = require("./routers");
const crons = require("./crons");

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(masterRouter);

// mongoose.connect(dbConfig.uri, dbConfig.options).catch(err=>{
//     process.stdout.write(`Error connecting to DB ${dbConfig.uri}: ${err}\n`);
// });

// mongoose.connection.on('connected', ()=>{
//     process.stdout.write(`connected to DB ${dbConfig.uri}\n`);
// });

mongoose.connect(`mongodb://${HOST}/${DB}`, {family: 4}, (err) => {
    if(err){
        console.log('Error occurred');
    }
    else {
        console.log('connected');
    }
});

app.listen(PORT, ()=>{
    process.stdout.write(`server started at ${HOST}:${PORT}  ${ENV}\n`);
    // crons.start();
});

module.exports = {
    app
};