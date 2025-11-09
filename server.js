const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// if you already have config/database.js, keep using it:
const configDB = require('./config/database.js');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// CONNECT TO MONGO AND START APP
mongoose
  .connect(configDB.url)
  .then(() => {
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // HOME PAGE: show all affirmations
    app.get('/', async (req, res) => {
      try {
        const messages = await db.collection('messages').find().toArray();
        res.render('index.ejs', { messages });
      } catch (err) {
        console.log('Error loading messages:', err);
        res.status(500).send('Error loading messages');
      }
    });

    // CREATE affirmation
    app.post('/messages', async (req, res) => {
      try {
        await db.collection('messages').insertOne({
          name: req.body.name || 'Anonymous',
          msg: req.body.msg,
          thumbUp: 0,
          thumbDown: 0
        });
        console.log('saved to database');
        res.redirect('/');
      } catch (err) {
        console.log('Error saving message:', err);
        res.status(500).send('Error saving message');
      }
    });

    // LIKE (thumb up)
    app.put('/messages', async (req, res) => {
      try {
        const result = await db.collection('messages').findOneAndUpdate(
          { name: req.body.name, msg: req.body.msg },
          {
            $set: {
              thumbUp: req.body.thumbUp + 1
            }
          },
          {
            sort: { _id: -1 },
            upsert: true,
            returnDocument: 'after'
          }
        );
        res.send(result);
      } catch (err) {
        console.log('Error in thumb up:', err);
        res.status(500).send(err);
      }
    });

    // DISLIKE (thumb down)
    app.put('/messagesDown', async (req, res) => {
      try {
        const result = await db.collection('messages').findOneAndUpdate(
          { name: req.body.name, msg: req.body.msg },
          {
            $set: {
              thumbUp: req.body.thumbUp - 1
            }
          },
          {
            sort: { _id: -1 },
            upsert: true,
            returnDocument: 'after'
          }
        );
        res.send(result);
      } catch (err) {
        console.log('Error in thumb down:', err);
        res.status(500).send(err);
      }
    });

    // DELETE
    app.delete('/messages', async (req, res) => {
      try {
        await db.collection('messages').findOneAndDelete({
          name: req.body.name,
          msg: req.body.msg
        });
        res.send('Message deleted!');
      } catch (err) {
        console.log('Error deleting message:', err);
        res.status(500).send(err);
      }
    });

    // START SERVER
    app.listen(port, () => {
      console.log('The magic happens on port ' + port);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

