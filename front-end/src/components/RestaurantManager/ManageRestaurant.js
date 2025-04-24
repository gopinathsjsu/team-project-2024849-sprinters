import React from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from './RestaurantNavBar';
import './ManageRestaurant.css';
import editRestaurantIcon from './icons/edit-restaurant-icon.png';
import editMenuIcon from './icons/edit-menu-icon.png';
import addItemIcon from './icons/add-item-icon.png';
import previewRestaurantIcon from './icons/preview-restaurant-icon.png'

const ManageRestaurant = () => {
    const history = useHistory();

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <h1 className="dashboard-heading">Manage Your Restaurant</h1>
                <div className="dashboard-grid">

                    <div className="dashboard-card" onClick={() => history.push('/restaurant-manager/preview')}>
                        <img src={previewRestaurantIcon} alt="Preview"/>
                        <p>Preview Restaurant</p>
                    </div>

                    <div className="dashboard-card" onClick={() => history.push('/restaurant-manager/edit-details')}>
                        <img src={editRestaurantIcon} alt="Edit Restaurant"/>
                        <p>Edit Restaurant Details</p>
                    </div>

                    <div className="dashboard-card" onClick={() => history.push('/restaurant-manager/edit-menu')}>
                        <img src={editMenuIcon} alt="Edit Menu"/>
                        <p>Edit Menu</p>
                    </div>
                    <div className="dashboard-card" onClick={() => history.push('/restaurant-manager/add-menu-item')}>
                        <img src={addItemIcon} alt="Add Menu Item"/>
                        <p>Add Item To Menu</p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ManageRestaurant;
