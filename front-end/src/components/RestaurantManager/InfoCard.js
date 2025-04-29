import React from 'react';
import './InfoCard.css'; // make sure to create this file

const InfoCard = ({ title, description, image, icon }) => {
    return (
        <div className="info-card">
            <img src={image} alt="Info background" className="info-card-img" />

            <div className="info-overlay">
                {icon && <img src={icon} alt="Icon" className="info-icon" />}
                <h2 className="info-title">{title}</h2>
                <p className="info-description">{description}</p>
            </div>
        </div>
    );
};

export default InfoCard;
