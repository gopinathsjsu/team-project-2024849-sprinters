import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ShowMyRestaurants.css';

const ShowMyRestaurants = () => {
    const history = useHistory();
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('restaurantToken');

        if (!token) {
            history.push('/restaurant-manager/login');
            return;
        }

        fetch('/api/restaurant-manager/my-restaurants', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setRestaurants(data);
                setIsLoading(false);
            })
            .catch(() => {
                localStorage.clear();
                history.push('/restaurant-manager/login');
            });
    }, [history]);

    if (isLoading) {
        return (
            <div className="restaurant-list-page">
                <h2>Loading your restaurants...</h2>
            </div>
        );
    }

    return (
        <div className="restaurant-list-page">
            <h2>My Restaurants</h2>
            {restaurants.length === 0 ? (
                <p>No restaurants registered yet!</p>
            ) : (
                <div className="restaurant-list-grid">
                    {restaurants.map((rest) => (
                        <div key={rest.id} className="restaurant-card">
                            <h3>{rest.name}</h3>
                            <p>{rest.location}</p>
                            <p>Status: <strong>{rest.status}</strong></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowMyRestaurants;
