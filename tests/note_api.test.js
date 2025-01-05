const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

mongoose.set("bufferTimeoutMS", 30000);

const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Note = require('../models/note');

// initial database state moved to test_helper module
// const initialNotes = [
//     {
//         content: 'HTML is easy',
//         important: false,
//     },
//     {   content: 'Browser can execute only JavaScript',
//         important: true,
//     },
// ];

// use insertMany method
beforeEach(async () => {
    await Note.deleteMany({});
    await Note.insertMany(helper.initialNotes);
});

// use Promise.all method:
// beforeEach(async () => {
//     await Note.deleteMany({});

//     const noteObjects = helper.initialNotes
//         .map(note => new Note(note));
//     const promiseArray = noteObjects.map(note => note.save());
//     await Promise.all(promiseArray);
// });

// better way of saving multiple objects to the database:
// the test execution begins before the database is initialized
// beforeEach(async () => {
//     await Note.deleteMany({});
//     console.log('cleared');

//     helper.initialNotes.forEach(async (note) => {
//         let noteObject = new Note(note);
//         await noteObject.save();
//         console.log('saved');
//     });
//     console.log('done');
// });

// beforeEach(async () => {
//     await Note.deleteMany({});
//     let noteObject = new Note(helper.initialNotes[0]);
//     // let noteObject = new Note(initialNotes[0]);
//     await noteObject.save();
//     noteObject = new Note(helper.initialNotes[1]);
//     // noteObject = new Note(initialNotes[1]);
//     await noteObject.save();
// });

describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all notes are returned', async () => {
        console.log('entered test');
        const response = await api.get('/api/notes');

        expect(response.body).toHaveLength(helper.initialNotes.length);
        // expect(response.body).toHaveLength(initialNotes.length);
    });

    // test('there are two notes', async () => {
    //     const response = await api.get('/api/notes');

    //     expect(response.body).toHaveLength(2);
    // });

    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes');

        const contents = response.body.map(r => r.content);
        expect(contents).toContain(
            'Browser can execute only JavaScript'
        );
    });

    // test('the first note is about HTTP methods', async () => {
    //     const response = await api.get('/api/notes');

    //     expect(response.body[0].content).toBe('HTML is easy');
    // });
});

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb();

        const noteToView = notesAtStart[0];

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
            
        expect(resultNote.body).toEqual(noteToView);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId();

        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404);
    });
    
    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445';

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400);
    });
});

describe('addition of a new note', () => {
    test('a valid note can be added', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        };

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const notesAtEnd = await helper.notesInDb();
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

        const contents = notesAtEnd.map(n => n.content);
        expect(contents).toContain(
            'async/await simplifies making async calls'
        );

        // const response = await api.get('/api/notes');

        // const contents = response.body.map(r => r.content);

        // expect(response.body).toHaveLength(initialNotes.length + 1);
        // expect(contents).toContain(
        //     'async/await simplifies making async calls'
        // );
    });

    test('a note without content is not added', async () => {
        const newNote = {
            important: true
        };

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400);

        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length);

        // const response = await api.get('/api/notes');

        // expect(response.body).toHaveLength(initialNotes.length);
    });
});

// test('a specific note can be viewed', async () => {
//     const notesAtStart = await helper.notesInDb();

//     const noteToView = notesAtStart[0];

//     const resultNote = await api
//         .get(`/api/notes/${noteToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/);
    
//         expect(resultNote.body).toEqual(noteToView);
// });

describe('delete of a note', () => {
    test('a note can be deleted', async () => {
        const notesAtStart = await helper.notesInDb();
        const noteToDelete = notesAtStart[0];

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204);

        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(
            helper.initialNotes.length - 1
        );

        const contents = notesAtEnd.map(r => r.content);

        expect(contents).not.toContain(noteToDelete.content);
    });
});

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const userAtStart = await helper.usersInDb();
        
        const newUser = {
            username: 'mluukai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(userAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(result.body.error).toContain('expected `username` to be unique');

        expect(usersAtEnd).toEqual(usersAtStart);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});