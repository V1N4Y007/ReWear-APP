const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./backend/models/Item');
const User = require('./backend/models/User');

dotenv.config({ path: './backend/.env' });

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rewear-db');
        const items = await Item.find().populate('uploader', 'name email');
        console.log(JSON.stringify(items, null, 2));
        process.exit(0);
    } catch(e) {
        console.log(e);
        process.exit(1);
    }
}
checkDb();
