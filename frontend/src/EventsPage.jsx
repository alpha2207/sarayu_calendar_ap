import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import './EventsPage.css'
import { getEvents, createEvent, deleteEvent } from './api';
import { MdDelete, MdEdit } from "react-icons/md";


function EventsPage({ userId }) {
    const [value, onChange] = useState(new Date());
    const [events, setEvents] = useState([{
        title: "Event #1",
        description: "This is desc",
        date: '9 sep 2024'
    }]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        // Fetch all events for the logged-in user
        getEvents(userId)
            .then((response) => {
                setEvents(response.data);
                console.log(response);

            })
            .catch((error) => console.error('Error fetching events:', error));
    }, [userId]);

    // Create a new event
    const handleCreateEvent = () => {
        const newEvent = { userId, title, description, date };
        createEvent(newEvent)
            .then((response) => {
                // Add the newly created event to the existing list of events
                setEvents([...events, response.data]);
            })
            .catch((error) => console.error('Error creating event:', error));
    };

    // Delete an event
    const handleDeleteEvent = (eventId) => {
        deleteEvent(userId, eventId)
            .then(() => {
                // Remove the deleted event from the events list
                setEvents(events.filter((event) => event.id !== eventId));
            })
            .catch((error) => console.error('Error deleting event:', error));
    };

    return (
        <div className='main-wrapper'>
            <div className='cal-container'>
                <Calendar onChange={onChange} value={value} />
                <button onClick={() => document.getElementById('my_modal_1').showModal()} className="btn btn-outline btn-info mt-4">Add Event on {value && value.toLocaleDateString('en-GB')}</button>
            </div>
            <div>
                <h1 className='text-2xl font-bold'>Your Events</h1>
                <div className="divider m-1"></div>
                <ul className='min-w-[25rem]'>
                    {events.map((event) => (
                        <li key={event.id}>

                            <div className="collapse collapse-arrow bg-base-200 p-2">
                                <input type="radio" name="my-accordion-2" defaultChecked />
                                <div className="collapse-title text-xl font-medium">{event.title}</div>
                                <div className="collapse-content">
                                    <p>{event.description}</p>
                                </div>
                                <div className='flex justify-end'>
                                    <button className="btn"><MdEdit style={{ color: "yellow", fontSize: '1rem' }} /> Edit</button>
                                    <button className="btn" onClick={() => handleDeleteEvent(event.id)}><MdDelete style={{ color: "red", fontSize: '1.3rem' }} /> Delete</button>
                                </div>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>

            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h2>Create a New Event</h2>
                    <div className='divider'></div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Event Title</span>
                        </div>
                        <input type="text"
                            placeholder="Event Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full" />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Event Title</span>
                        </div>
                        <input type="text"
                            placeholder="Event Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} className="input input-bordered w-full" />
                    </label>


                    <div className="modal-action">
                        <form method="dialog">
                            <button className='btn mr-4' onClick={handleCreateEvent}>Create Event</button>
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </div >
    );
}
EventsPage.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default EventsPage;
