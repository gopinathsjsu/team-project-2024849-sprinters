import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session'; // adjust if your logout path is different
import { useHistory, NavLink } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import logo from '../../icons/logo.png';
import locationIcon from '../../icons/location-icon.ico';
import downCarrot from '../../icons/down-caret.ico';
import aboveNavDownCaret from '../../icons/nav-bar-down-caret.ico';
import './NavBar.css';

const NavBar = ({ loaded, showSignInModal, setShowSignInModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleBusinessClick = async () => {
    await dispatch(logout()); // logs out no matter what
    history.push('/restaurant-manager'); // redirects to restaurant manager dashboard
  };

  return (
      <nav className="navigation">
        <div className="above-nav">
          <div>
          <span
              className="above-nav-for-businesses"
              onClick={handleBusinessClick}
              style={{ cursor: 'pointer' }}
          >
            For Businesses
          </span>
          </div>
          <div className="above-nav-mobile">
          <span>
            Mobile
            <span>
              <img src={aboveNavDownCaret} className="above-nav-down-caret" alt="caret" />
            </span>
          </span>
          </div>
          <div className="above-nav-faqs">FAQs</div>
          <div className="above-nav-en">
          <span>
            EN
            <span>
              <img src={aboveNavDownCaret} className="above-nav-down-caret" alt="caret" />
            </span>
          </span>
          </div>
        </div>

        <div className="nav-bar">
          <div className="nav-bar-logo-location-container">
            <div className="nav-bar-logo">
              <NavLink to="/" exact className="nav-link">
                <img src={logo} className="logo" alt="ReserveTable logo" />
              </NavLink>
            </div>
            <div>
              <img src={locationIcon} className="location-icon" alt="location" />
            </div>
            <div className="nav-bar-location-city-text">Los Angeles</div>
            <div>
              <img src={downCarrot} className="down-carrot-icon" alt="down-caret" />
            </div>
          </div>

          {loaded && (
              <NavigationMenu
                  showSignInModal={showSignInModal}
                  setShowSignInModal={setShowSignInModal}
              />
          )}
        </div>
      </nav>
  );
};

export default NavBar;
