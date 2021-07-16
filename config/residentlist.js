const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const conn = 'mongodb+srv://wanhoyinjoshua:8sr^3B=81@cluster0.tbpnd.mongodb.net/goldsoul_scalabrini?retryWrites=true&w=majority';

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    residentname: String,
    residentfacility: String,
    residentcompany:String,
    interest: String,
    avoid: String,
    organization:String

   
});


const ResidentList = connection.model('ResidentList', UserSchema);

// Expose the connection
module.exports = connection;
