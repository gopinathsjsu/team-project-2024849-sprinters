import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ManagerDashboard.css';
import { FaPlus, FaClipboardList, FaUtensils } from 'react-icons/fa';
import { refreshAccessToken } from './authHelpers';

const ManagerDashboard = () => {
    const history = useHistory();
    const [managerName, setManagerName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const managerId = localStorage.getItem('restaurantManagerId');
        const token = localStorage.getItem('restaurantAccessToken');

        if (!token || !managerId) {
            history.push('/restaurant-manager/login');
            return;
        }

        const fetchManagerData = async () => {
            try {
                const response = await fetch(`/api/restaurant-manager/${managerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    const refreshed = await refreshAccessToken();
                    if (refreshed) {
                        const newToken = localStorage.getItem('restaurantAccessToken');
                        const retryResponse = await fetch(`/api/restaurant-manager/${managerId}`, {
                            headers: { Authorization: `Bearer ${newToken}` }
                        });
                        const retryData = await retryResponse.json();
                        setManagerName(retryData.name);
                        return;
                    } else {
                        return;
                    }
                }

                const data = await response.json();
                setManagerName(data.name);
            } catch (error) {
                console.error('Error fetching manager data:', error);
                history.push('/restaurant-manager/login');
            } finally {
                setLoading(false);
            }
        };

        fetchManagerData();
    }, [history]);

    if (loading) {
        return <div className="dashboard-page">Loading...</div>;
    }

    return (
        <div className="dashboard-page">
            <h1 className="dashboard-heading">
                Welcome {managerName}! <br/><br/>
                Let's help you manage your restaurants
            </h1>
            <div className="dashboard-grid">
                <div className="dashboard-card" onClick={() => history.push('/restaurant-manager/my-restaurants')}>
                    <FaClipboardList size={40} />
                    <p>Show My Restaurants</p>
                </div>
                <div className="dashboard-card" onClick={() => history.push('/restaurant-manager/manage-restaurants')}>
                    <FaPlus size={40} />
                    <p>Add/Manage Restaurant</p>
                </div>
                <div className="dashboard-card" onClick={() => history.push('/restaurant-manager/manage-menu')}>
                    <FaUtensils size={40} />
                    <p>Add/Manage Menu</p>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
