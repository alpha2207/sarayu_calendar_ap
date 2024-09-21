// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Create a new event
export const createEvent = (eventData) => {
  return axios.post(`${API_URL}/events`, eventData);
};

// Get all events for a user
export const getEvents = (userId) => {
  return axios.get(`${API_URL}/events/${userId}`);
};

// Update an event
export const updateEvent = (userId, eventId, updatedEventData) => {
  return axios.put(`${API_URL}/events/${userId}/${eventId}`, updatedEventData);
};

// Delete an event
export const deleteEvent = (userId, eventId) => {
  return axios.delete(`${API_URL}/events/${userId}/${eventId}`);
};
