import React, { useEffect, useState } from 'react';
import './ManageMenu.css';

const ManageMenu = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '' });
    const [editItem, setEditItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const token = localStorage.getItem('restaurantAccessToken');

    useEffect(() => {
        fetch('/api/restaurant-manager/manage-restaurants', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setRestaurants(data));
    }, [token]);

    const fetchMenuItems = (restaurantId) => {
        fetch(`/api/menu-items/${restaurantId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMenuItems(data));
    };

    const handleRestaurantSelect = (e) => {
        const id = e.target.value;
        setSelectedRestaurant(id);
        setShowAddForm(false);
        setEditItem(null);
        fetchMenuItems(id);
    };

    const handleAddChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/menu-items', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...newItem, restaurant_id: selectedRestaurant })
        });
        fetchMenuItems(selectedRestaurant);
        setNewItem({ name: '', description: '', price: '' });
        setShowAddForm(false);
    };

    const handleDelete = async (id) => {
        await fetch(`/api/menu-items/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchMenuItems(selectedRestaurant);
    };

    const startEditItem = (item) => {
        setEditItem({ ...item });
        setShowAddForm(false);
    };

    const handleEditChange = (e) => {
        setEditItem({ ...editItem, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/menu-items/${editItem.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editItem)
        });
        fetchMenuItems(selectedRestaurant);
        setEditItem(null);
    };

    return (
        <div className="manage-menu-page">
            <h2>Manage Menu</h2>

            <div className="restaurant-select">
                <label>Select Restaurant:</label>
                <select value={selectedRestaurant} onChange={handleRestaurantSelect}>
                    <option value="">-- Select --</option>
                    {restaurants.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
            </div>

            {selectedRestaurant && (
                <>
                    <h3>Menu Items</h3>
                    <table className="menu-table">
                        <thead>
                        <tr>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {menuItems.length === 0 ? (
                            <tr><td colSpan="4">No menu items yet.</td></tr>
                        ) : (
                            menuItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>${item.price}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => startEditItem(item)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {!editItem && !showAddForm && (
                        <button className="add-menu-btn" onClick={() => setShowAddForm(true)}>Add New Item</button>
                    )}

                    {showAddForm && (
                        <form className="menu-form" onSubmit={handleAddSubmit}>
                            <input name="name" placeholder="Name" value={newItem.name} onChange={handleAddChange} required />
                            <input name="description" placeholder="Description" value={newItem.description} onChange={handleAddChange} required />
                            <input name="price" placeholder="Price" value={newItem.price} onChange={handleAddChange} type="number" required />
                            <button type="submit">Add Item</button>
                            <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </form>
                    )}

                    {editItem && (
                        <form className="menu-form" onSubmit={handleEditSubmit}>
                            <h3>Edit Item</h3>
                            <input name="name" value={editItem.name} onChange={handleEditChange} required />
                            <input name="description" value={editItem.description} onChange={handleEditChange} required />
                            <input name="price" value={editItem.price} onChange={handleEditChange} type="number" required />
                            <button type="submit">Save Changes</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditItem(null)}>Cancel</button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageMenu;
