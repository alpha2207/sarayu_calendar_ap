// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { database } = require('./firebase'); // Import the Firebase database instance

const app = express();
const port = 3000;

app.use(bodyParser.json());

pp.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    res.status(201).send({
      message: 'User registered successfully!',
      user: userRecord,
    });
  } catch (error) {
    res.status(400).send({
      message: 'Error registering user',
      error: error.message,
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
    });
  } catch (error) {
    res.status(400).send({
      message: 'Login failed',
      error: error.message,
    });
  }
});

// Create a new event (Create operation)
app.post('/events', (req, res) => {
  const { userId, title, description, date } = req.body;
  const eventRef = database.ref('events/' + userId).push();

  eventRef.set({
    title,
    description,
    date
  })
    .then(() => res.status(200).json({ message: 'Event created successfully!' }))
    .catch(error => res.status(500).json({ error: 'Error creating event: ' + error }));
});

// Get all events for a user (Read operation)
app.get('/events/:userId', (req, res) => {
  const userId = req.params.userId;
  const eventRef = database.ref('events/' + userId);

  eventRef.once('value')
    .then(snapshot => {
      const data = snapshot.val();
      const events = [];
      for (let id in data) {
        events.push({ id, ...data[id] });
      }
      res.status(200).json(events);
    })
    .catch(error => res.status(500).json({ error: 'Error fetching events: ' + error }));
});

// Update an event (Update operation)
app.put('/events/:userId/:eventId', (req, res) => {
  const { userId, eventId } = req.params;
  const { title, description, date } = req.body;
  const eventRef = database.ref('events/' + userId + '/' + eventId);

  eventRef.update({
    title,
    description,
    date
  })
    .then(() => res.status(200).json({ message: 'Event updated successfully!' }))
    .catch(error => res.status(500).json({ error: 'Error updating event: ' + error }));
});

// Delete an event (Delete operation)
app.delete('/events/:userId/:eventId', (req, res) => {
  const { userId, eventId } = req.params;
  const eventRef = database.ref('events/' + userId + '/' + eventId);

  eventRef.remove()
    .then(() => res.status(200).json({ message: 'Event deleted successfully!' }))
    .catch(error => res.status(500).json({ error: 'Error deleting event: ' + error }));
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
