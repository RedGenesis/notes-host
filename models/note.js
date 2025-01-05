const mongoose = require('mongoose');

// The responsibility of establishing the connection to the database has been
// givien to the app.js module.  The note.js file under the models directory only
// defines the Mongoose schema for notes.

// mongoose.set('strictQuery', false);

// const url = process.env.MONGODB_URI;

// console.log('connecting to', url);

// mongoose.connect(url)
//     .then(result => {
//         console.log('connected to MongoDB')
//     })
//     .catch(error => {
//         console.log('error connecting to MongoDB:', error.message);
//     });
    
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;    
    }
});

module.exports = mongoose.model('Note', noteSchema);