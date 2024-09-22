import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import './EventsPage.css'
import { getEvents, createEvent, deleteEvent, updateEvent } from './api';
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


function EventsPage({ userId }) {
    const [value, onChange] = useState(new Date());
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [time, onTimeChange] = useState('10:00');

    const [updateTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    console.log(events);


    useEffect(() => {
        // Fetch all events for the logged-in user
        // if (!userId) navigate('/login');
        if (!userId) navigate('/login');


        getEvents(userId)
            .then((response) => {
                setEvents(response.data);
                console.log(response);
            })
            .catch((error) => console.error('Error fetching events:', error));
    }, [userId, navigate]);

    // Create a new event
    const handleCreateEvent = () => {
        const date = value;
        const newEvent = { userId, title, description, date, time };
        createEvent(newEvent, userId)
            .then((response) => {
                // Add the newly created event to the existing list of events
                console.log(response);

                setEvents([...events, newEvent]);
            })
            .catch((error) => console.error('Error creating event:', error));
    };

    // Update an Event 
    const handleUpdateEvent = (eventIndex, date, time) => {
        updateEvent(userId, eventIndex, { title: updateTitle, description: updatedDescription, date, time })
            .then(() => {
                // Remove the deleted event from the events list
                setEvents((prevEvents) =>
                    prevEvents.map((event, index) =>
                        index === eventIndex ? { title: updateTitle, description: updatedDescription, date } : event
                    )
                );
            })
            .catch((error) => console.error('Error deleting event:', error));
    };

    // Delete an event
    const handleDeleteEvent = (eventIndex) => {
        deleteEvent(userId, eventIndex)
            .then(() => {
                // Remove the deleted event from the events list
                setEvents(events.filter((_, index) => index !== eventIndex));
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
                    {events.length > 0 ? events.map((event, index) => (
                        <>
                            <li key={index} className='mb-4'>

                                <div className="collapse collapse-arrow bg-base-200 p-2">
                                    <input type="radio" name="my-accordion-2" defaultChecked />
                                    <div className="collapse-title text-xl font-medium">{event.title}</div>
                                    <div className="collapse-content">
                                        <p>{event.description}</p>
                                    </div>
                                    <div className='flex items-center'>
                                        <p className='mr-auto p-[1rem] text-sm'>{new Date(event.date).toLocaleDateString('en-GB')} - {event.time}</p>
                                        <button onClick={() => {
                                            setUpdatedTitle(event.title);
                                            setUpdatedDescription(event.description);
                                            document.getElementById(`edit_modal_${index}`).showModal();
                                        }} className="btn"><MdEdit style={{ color: "yellow", fontSize: '1rem' }} /> Edit</button>
                                        <button className="btn" onClick={() => handleDeleteEvent(index)}><MdDelete style={{ color: "red", fontSize: '1.3rem' }} /> Delete</button>
                                    </div>
                                </div>


                                <dialog id={`edit_modal_${index}`} className="modal">
                                    <div className="modal-box">
                                        <h2>Update the Event</h2>
                                        <div className='divider'></div>
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <span className="label-text">Event Title</span>
                                            </div>
                                            <input type="text"
                                                placeholder="Event Title"
                                                value={updateTitle}
                                                onChange={(e) => setUpdatedTitle(e.target.value)} className="input input-bordered w-full" />
                                        </label>
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <span className="label-text">Event Title</span>
                                            </div>
                                            <input type="text"
                                                placeholder="Event Description"
                                                value={updatedDescription}
                                                onChange={(e) => setUpdatedDescription(e.target.value)} className="input input-bordered w-full" />


                                        </label>


                                        <div className="modal-action">
                                            <form method="dialog">
                                                <button className='btn mr-4' onClick={() => handleUpdateEvent(index, event.date, event.time)}>Update Event</button>
                                                {/* if there is a button in form, it will close the modal */}
                                                <button className="btn">Close</button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>
                            </li>

                        </>

                    )) : "No Events!"}
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
                            <span className="label-text">Event Description</span>
                        </div>
                        <input type="text"
                            placeholder="Event Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} className="input input-bordered w-full" />

                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Event Time</span>
                        </div>
                        <input type="time"
                            placeholder="Event Description"
                            value={time}
                            onChange={(e) => onTimeChange(e.target.value)} className="input input-bordered w-full" />

                    </label>



                    <div className="modal-action">
                        <button className='btn mr-4' onClick={handleCreateEvent}>Create Event</button>
                        <form method="dialog">
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
