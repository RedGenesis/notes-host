const app = require('./app'); // the actual Express application
const config = require('./utils/config');
const logger = require('./utils/logger');

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// // const morgan = require('morgan');
// const app = express();
// const Note = require('./models/note');

// app.use(cors());
// app.use(express.static('dist'));
// app.use(express.json());

// // app.use(morgan('tiny'));

// // morgan.token('reqData', (request, response) => {
// //     return JSON.stringify(request.body);
// // });

// // app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'));

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method);
//     console.log('Path:  ', request.path);
//     console.log('Body:  ', request.body);
//     console.log('---');
//     next();
// };

// app.use(requestLogger);

// // let notes = [
// //     {
// //       id: "1",
// //       content: "HTML is easy",
// //       important: true
// //     },
// //     {
// //       id: "2",
// //       content: "Browser can execute only JavaScript",
// //       important: false
// //     },
// //     {
// //       id: "3",
// //       content: "GET and POST are the most important methods of HTTP protocol",
// //       important: true
// //     }
// //   ]

// app.get('/', (request, response) => {
//     response.send('<h1>Backend Example</h1>');
// });

// // app.get('/api/notes', (request, response) => {
// //     response.json(notes);
// // });

// app.get('/api/notes', (request, response) => {
//     Note.find({}).then(notes => {
//         response.json(notes);
//     });
// });

// app.get('/api/notes/:id', (request, response, next) => {
//     Note.findById(request.params.id)
//         .then(note => {
//             if (note) {
//                 response.json(note);
//             } else {
//                 response.status(404).end();
//             }
//         })
//         .catch(error => next(error));
//         // .catch(error => {
//         //     console.log(error);
//         //     response.status(400).send({ error: 'malformatted id' });
//         // });
// });

// // app.get('/api/notes/:id', (request, response) => {
// //     const id = request.params.id;
// //     const note = notes.find(note => note.id === id);

// //     if (note) {
// //         response.json(note);
// //     } else {
// //         response.status(404).end();
// //     }
// // });

// app.delete('/api/notes/:id', (request, response, next) => {
//     Note.findByIdAndDelete(request.params.id)
//         .then(result => {
//             response.status(204).end();
//         })
//         .catch(error => next(error));
// });

// // app.delete('/api/notes/:id', (request, response) => {
// //     const id = request.params.id;
// //     notes = notes.filter(note => note.id !== id);

// //     response.status(204).end();
// // });

// // const generateId = () => {
// //     const maxId = notes.length > 0
// //         ? Math.max(...notes.map(n => Number(n.id)))
// //         : 0;

// //     return String(maxId + 1);
// // };

// app.post('/api/notes', (request, response, next) => {
//     const body = request.body;
    
//     if (!body.content) {
//         return response.status(400).json({
//             error: 'content missing'
//         });
//     }
    
//     const note = new Note({
//         content: body.content,
//         important: body.important || false,
//     });

//     note.save()
//         .then(savedNote => {
//             response.json(savedNote);
//         })
//         .catch(error => next(error));

//     // const note = {
//     //     content: body.content,
//     //     important: Boolean(body.important) || false,
//     //     id: generateId(),
//     // };

//     // notes = notes.concat(note);
//     // // console.log(note);
//     // response.json(note);
// });

// app.put('/api/notes/:id', (request, response, next) => {
//     const { content, important } = request.body;
//     // const body = request.body;

//     // const note = {
//     //     content: body.content,
//     //     important: body.important,
//     // };

//     Note.findByIdAndUpdate(
//         request.params.id,
//         { content, important },
//         { new: true, runValidators: true, context: 'query' }
//     )
//         .then(updatedNote => {
//             response.json(updatedNote);
//         })
//         .catch(error => next(error));
//     // Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     //     .then(updatedNote => {
//     //         response.json(updatedNote);
//     //     })
//     //     .catch(error => next(error));
// });

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' });
// };

// app.use(unknownEndpoint);

// // handler of requests with unknown endpoint
// const errorHandler = (error, request, response, next) => {
//     console.error(error.message);

//     if (error.name === 'CastError') {
//         return response.status(400).send({ error: 'malformatted id' });
//     } else if (error.name === 'ValidationError') {
//         return response.status(400).json({ error: error.message });
//     };

//     next(error);
// }

// // this has to be the last loaded middleware, also all the routes should be registered before this!
// // handler of request with result to errors
// app.use(errorHandler);
        
// // const PORT = 3001;
// // const PORT = process.env.PORT || 3001;
// const PORT = process.env.PORT;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}`);