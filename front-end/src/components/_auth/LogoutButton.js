import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
// import { resetReservations } from '../../store/reservations';
// import { resetReviews } from '../../store/reviews';
// import { resetSavedRestaurants } from '../../store/savedRestaurants';
import './LogoutButton.css';

const LogoutButton = ({ setShowSignInModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    await dispatch(resetReservations());
    await dispatch(resetReviews());
    await dispatch(resetSavedRestaurants());
    await dispatch(logout());
    navigate('/');
  };

  return (
    <div className="profile-drop-logout-button" onClick={onLogout}>
      Sign out
    </div>
  );
};

export default LogoutButton;
