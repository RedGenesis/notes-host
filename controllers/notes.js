const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
});

// notesRouter.get('/', (request, response) => {
//     Note.find({}).then(notes => {
//         response.json(notes);
//     });
// });

notesRouter.get('/:id', async (request, response) => {
    const note = await Note.findById(request.params.id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    };
});

// eliminate the try-catch blocks using express-async-errors
// notesRouter.get('/:id', async (request, response, next) => {
//     try {
//         const note = await Note.findById(request.params.id);
//         if (note) {
//             response.json(note);
//         } else {
//             response.status(404).end();
//         }
//     } catch (exception) {
//         next(exception);
//     };
// });

// notesRouter.get('/:id', (request, response, next) => {
//     Note.findById(request.params.id)
//         .then(note => {
//             if (note) {
//                 response.json(note);
//             } else {
//                 response.status(404).end();
//             }
//         })
//         .catch(error => next(error));
// });

notesRouter.post('/', async (request, response) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    const savedNotes = await note.save();
    response.status(201).json(savedNotes);
});

// eliminate the try-catch blocks using express-async-errors
// notesRouter.post('/', async (request, response, next) => {
//     const body = request.body;

//     const note = new Note({
//         content: body.content,
//         important: body.important || false,
//     });

//     try {
//         const savedNotes = await note.save();
//         response.status(201).json(savedNotes);    
//     } catch(exeception) {
//         next(exeception);
//     };    
// });

// notesRouter.post('/', (request, response, next) => {
//     const body = request.body;

//     const note = new Note({
//         content: body.content,
//         important: body.important || false,
//     });

//     note.save()
//         .then(savedNote => {
//             response.status(201).json(savedNote);
//         })
//         .catch(error => next(error));
// });

notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

// eliminate the try-catch blocks using express-async-errors
// notesRouter.delete('/:id', async (request, response, next) => {
//     try {
//         await Note.findByIdAndDelete(request.params.id);
//         response.status(204).end();
//     } catch(exception) {
//         next(exception);
//     };
// });

// notesRouter.delete('/:id', (request, response, next) => {
//     Note.findByIdAndDelete(request.params.id)
//         .then(() => {
//             response.status(204).end();
//         })
//         .catch(error => next(error));
// });

notesRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important,
    };
    
    const updatedNote = await Note.findByIdAndUpdate(
        request.params.id,
        note,
        { new: true, runValidators: true, content: 'query' }
    );

    response.json(updatedNote);
});

// notesRouter.put('/:id', (request, response, next) => {
//     const body = request.body;

//     const note = {
//         content: body.content,
//         important: body.important,
//     };

//     Note.findByIdAndUpdate(
//         request.params.id,
//         note,
//         { new: true, runValidators: true, context: 'query' }
//     )
//         .then(updatedNote => {
//             response.json(updatedNote);
//         })
//         .catch(error => next(error));
// });

module.exports = notesRouter;