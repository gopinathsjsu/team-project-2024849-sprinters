import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ManageRestaurants.css';

const ManageRestaurants = () => {
    const history = useHistory();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [restaurantToDelete, setRestaurantToDelete] = useState(null);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        const token = localStorage.getItem('restaurantAccessToken');

        const response = await fetch('/api/restaurant-manager/manage-restaurants', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        setRestaurants(data);
        setLoading(false);
    };

    const confirmDelete = (id) => {
        setRestaurantToDelete(id);
        setShowConfirm(true);
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('restaurantAccessToken');

        const res = await fetch(`/api/restaurant/${restaurantToDelete}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            fetchRestaurants(); // refresh list
            setShowConfirm(false);
            setRestaurantToDelete(null);
        }
    };

    if (loading) return <div className="manage-restaurants-page">Loading...</div>;

    return (
        <div className="manage-restaurants-wrapper">

            <div className="manage-restaurants-page">
                <div className="header-section">
                    <h2>Your Restaurants</h2>

                </div>

                <table className="restaurant-table">
                    <thead>
                    <tr>
                        <th>Restaurant Name</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {restaurants.length === 0 ? (
                        <tr><td colSpan="4">No restaurants yet.</td></tr>
                    ) : (
                        restaurants.map((rest) => (
                            <tr key={rest.id}>
                                <td>{rest.name}</td>
                                <td>{rest.location || rest.neighborhood}</td>
                                <td>{rest.status}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => history.push(`/restaurant-manager/edit-restaurant/${rest.id}`)}>Edit</button>
                                    <button className="delete-btn" onClick={() => confirmDelete(rest.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <button className="add-restaurant-btn" onClick={() => history.push('/restaurant-manager/add-restaurant')}>
                    Add Restaurant
                </button>

                {showConfirm && (
                    <div className="confirm-modal">
                        <div className="confirm-box">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete this restaurant?</p>
                            <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
                            <button className="cancel-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageRestaurants;
