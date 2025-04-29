
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './AddEditRestaurantForm.css';

const EditRestaurantForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState(null);
    const [message, setMessage] = useState('');

    const expectedFields = [
        'name', 'neighborhood', 'cuisines', 'cost',
        'operation_hours', 'dining_style', 'dress_code',
        'parking_details', 'payment_options', 'cross_street',
        'phone', 'executive_chef', 'description', 'website', 'preview_img'
    ];

    useEffect(() => {
        const token = localStorage.getItem('restaurantAccessToken');

        fetch(`/api/restaurant/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const filteredData = {};
                expectedFields.forEach(field => {
                    filteredData[field] = data[field] || '';
                });
                setFormData(filteredData);
            })
            .catch(() => history.push('/restaurant-manager/manage-restaurants'));
    }, [id, history]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('restaurantAccessToken');

        const response = await fetch(`/api/restaurant/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            setMessage('Restaurant updated successfully!');
            setTimeout(() => history.push('/restaurant-manager/manage-restaurants'), 1000);
        } else {
            setMessage('Failed to update restaurant.');
        }
    };

    if (!formData) return <p>Loading...</p>;

    return (
        <div className="add-edit-restaurant-form-page">
            <h1 className="add-edit-restaurant-heading"> Edit Restaurant</h1>
            <form className="add-edit-restaurant-form" onSubmit={handleSubmit}>
                {expectedFields.map((key) => (
                    <div className="form-group-left" key={key}>
                        <label className="form-label">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            required={key !== 'executive_chef'}
                        />
                    </div>
                ))}
                <button type="submit">Save Changes</button>
                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
};

export default EditRestaurantForm;
