// Updated AddRestaurantForm.js with left-aligned form layout
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AddEditRestaurantForm.css';

const AddRestaurantForm = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: '', neighborhood: '', cuisines: '', cost: '',
        operation_hours: '', dining_style: '', dress_code: '',
        parking_details: '', payment_options: '', cross_street: '',
        phone: '', executive_chef: '', description: '', website: '', preview_img: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('restaurantAccessToken');

        const response = await fetch('/api/restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            setMessage('Restaurant added successfully!');
            setTimeout(() => history.push('/restaurant-manager/manage-restaurants'), 1000);
        } else {
            setMessage('Failed to add restaurant.');
        }
    };

    return (
        <div className="add-edit-restaurant-form-page">
            <h1 className="add-edit-restaurant-heading"> Add Restaurant</h1>
            <form className="add-edit-restaurant-form" onSubmit={handleSubmit}>
                {Object.entries(formData).map(([key, value]) => (
                    <div className="form-group-left" key={key}>
                        <label className="form-label">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                        <input
                            type="text"
                            name={key}
                            value={value}
                            onChange={handleChange}
                            required={key !== 'executive_chef'}
                        />
                    </div>
                ))}
                <button type="submit">Add Restaurant</button>
                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
};

export default AddRestaurantForm;
