import React, { useEffect, useState } from 'react';
import './ShowMyRestaurants.css';

const ShowMyRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const token = localStorage.getItem('restaurantAccessToken');

    useEffect(() => {
        fetch('/api/restaurant-manager/approved-restaurants', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setRestaurants(data));
    }, [token]);

    return (
        <div className="show-my-restaurants-page">
            <h2>My Approved Restaurants</h2>

            <table className="my-restaurants-table">
                <thead>
                <tr>
                    <th>Restaurant Name</th>
                    <th>Location</th>
                    <th>Preview</th>
                </tr>
                </thead>
                <tbody>
                {restaurants.length === 0 ? (
                    <tr><td colSpan="4">No approved restaurants yet.</td></tr>
                ) : (
                    restaurants.map(r => (
                        <tr key={r.id}>
                            <td>{r.name}</td>
                            <td>{r.location}</td>
                            <td>
                                <a href={`/restaurants/${r.id}`} target="_blank" rel="noopener noreferrer">
                                    <button className="preview-btn">Preview</button>
                                </a>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ShowMyRestaurants;
