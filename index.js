require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const Note = require('./models/note');

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

// app.use(morgan('tiny'));

morgan.token('reqData', (request, response) => {
    return JSON.stringify(request.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'));

// let notes = [
//     {
//       id: "1",
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: "2",
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: "3",
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     }
//   ]

app.get('/', (request, response) => {
    response.send('<h1>Backend Example</h1>');
});

// app.get('/api/notes', (request, response) => {
//     response.json(notes);
// });

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    });
});

// app.get('/api/notes/:id', (request, response) => {
//     const id = request.params.id;
//     const note = notes.find(note => note.id === id);

//     if (note) {
//         response.json(note);
//     } else {
//         response.status(404).end();
//     }
// });

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id).then(note => {
        response.status(204).end();
    });
});

// app.delete('/api/notes/:id', (request, response) => {
//     const id = request.params.id;
//     notes = notes.filter(note => note.id !== id);

//     response.status(204).end();
// });

// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => Number(n.id)))
//         : 0;

//     return String(maxId + 1);
// };

app.post('/api/notes', (request, response) => {
    const body = request.body;
    
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    }
    
    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    note.save().then(savedNote => {
        response.json(savedNote);
    });

    // const note = {
    //     content: body.content,
    //     important: Boolean(body.important) || false,
    //     id: generateId(),
    // };

    // notes = notes.concat(note);
    // // console.log(note);
    // response.json(note);
});
        
// const PORT = 3001;
// const PORT = process.env.PORT || 3001;
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);