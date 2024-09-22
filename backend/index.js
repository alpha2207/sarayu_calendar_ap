const express = require('express');
const bodyParser = require('body-parser');
const { admin } = require('./firebase');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Register a new user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });


    const userRef = admin.firestore().collection('users').doc(userRecord.uid);
    await userRef.set({
      email: userRecord.email,
      uid: userRecord.uid,
      createdAt: new Date().toISOString(),
      events: [],
    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: userRecord,
      uid: userRecord.uid,
      success: true,
    });

  } catch (error) {
    res.status(400).json({
      message: 'Error registering user. Please enter password and email correctly.',
      error: error.message,
      success: false,
    });
  }
});

// Login a user
app.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    res.status(200).send({
      message: 'Login successful',
      user: userRecord,
      uid: userRecord.uid,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error logging in user. Please enter password and email correctly.',
      error: error.message,
      success: false,
    });
  }
});

// Create a new event (Create operation)
app.post('/events/:userId', async (req, res) => {
  const { title, description, date, time } = req.body;
  const userId = req.params.userId;

  try {
    const userRef = admin.firestore().collection('users').doc(userId);


    await userRef.update({
      events: admin.firestore.FieldValue.arrayUnion({
        title,
        description,
        date,
        time,
        createdAt: new Date().toISOString(),
      }),
    });

    res.status(201).json({ message: 'Event created successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating event: ' + error.message });
  }
});

// Get all events for a user (Read operation)
app.get('/events/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const events = userDoc.data().events || [];
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events: ' + error.message });
  }
});

// Update an event (Update operation)
app.put('/events/:userId/:eventIndex', async (req, res) => {
  const { userId, eventIndex } = req.params;
  const { title, description, date, time } = req.body;

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const events = userDoc.data().events || [];


    if (eventIndex >= 0 && eventIndex < events.length) {
      events[eventIndex] = { title, description, date, time, createdAt: new Date().toISOString() };
      await userRef.update({ events });
      res.status(200).json({ message: 'Event updated successfully!' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating event: ' + error.message });
  }
});

// Delete an event (Delete operation)
app.delete('/events/:userId/:eventIndex', async (req, res) => {
  const { userId, eventIndex } = req.params;

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const events = userDoc.data().events || [];

    if (eventIndex >= 0 && eventIndex < events.length) {
      events.splice(eventIndex, 1);
      await userRef.update({ events });
      res.status(200).json({ message: 'Event deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event: ' + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
