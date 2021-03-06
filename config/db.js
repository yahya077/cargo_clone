const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        .then(() => {
            console.log("database connection successful");
            require('./../schema/ShipmentActivity');
        })
        .catch((err) => {
            console.log("database connection error " + err);
        })
    }
}

module.exports = new Database();