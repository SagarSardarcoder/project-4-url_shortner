const mongoose = require('mongoose');
const config = reqiure('config');
const db = config.get('mongoURI')


const connectdb = async () => {
    try{
        await mongoose.connect(db, {
            useNewUrlParser:true
        });
        console.log('mongoDB is connected / Gp 48 / project 4')
    } catch (err){
        console.error(err.message)
        process.exit(1)
    }
}


module.exports = connectdb







