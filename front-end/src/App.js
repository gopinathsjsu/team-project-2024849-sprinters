import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { authenticate } from './store/session';

import LoginForm from './components/_auth/LoginForm';
import SignUpForm from './components/_auth/SignUpForm';

import NavBar from './components/Navigation/NavBar';
import RestaurantNavBar from './components/RestaurantManager/RestaurantNavBar';

import SearchBar from './components/Search/SearchBar';
import DisplayAllRestaurants from './components/AllRestaurants/AllRestaurants';
import RestaurantProfile from './components/RestaurantProfile/RestaurantProfile';
import ReservationConfirmation from './components/Reservations/ReservationConfirmation';
import ModifyReservation from './components/Reservations/ModifyReservation';
import DiningDashboard from './components/DiningDashboard/DiningDashboard';
import Footer from './components/Footer/Footer';
import NavigationLocalCity from './components/Navigation/NavigationLocalCity';
import SearchResults from './components/Search/SearchResults';
import Reviews from './components/Reviews/Reviews';
import Reservations from './components/Reservations/Reservations';

import RestaurantManager from './components/RestaurantManager/LandingPage';
import RestaurantLoginForm from './components/RestaurantManager/LoginManager';
import RegisterForm from './components/RestaurantManager/RegisterManager';
import ManagerDashboard from './components/RestaurantManager/ManagerDashboard';


import './index.css';
import ShowMyRestaurants from "./components/RestaurantManager/ShowMyRestaurants";
import ManageRestaurants from "./components/RestaurantManager/ManageRestaurants";
import AddRestaurantForm from "./components/RestaurantManager/AddRestaurantForm";
import EditRestaurantForm from "./components/RestaurantManager/EditRestaurantForm";
import ManageMenu from "./components/RestaurantManager/ManageMenu";
import SupportPage from "./components/RestaurantManager/SupportRestaurant";
import AboutPage from "./components/RestaurantManager/AboutPage";

function AppWrapper() {
  return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [userReservationTime, setUserReservationTime] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) return null;

  const isRestaurantManagerRoute = location.pathname.startsWith('/restaurant-manager');

  return (
      <>
        {!isRestaurantManagerRoute ? (
            <NavBar
                loaded={loaded}
                setShowSignInModal={setShowSignInModal}
                showSignInModal={showSignInModal}
            />
        ) : (
            <RestaurantNavBar />
        )}

        <Switch>
          <Route path="/login" exact>
            <LoginForm />
          </Route>

          <Route path="/sign-up" exact>
            <SignUpForm />
          </Route>

          <Route path="/" exact>
            <NavigationLocalCity />
            <SearchBar />
            <DisplayAllRestaurants setUserReservationTime={setUserReservationTime} />
          </Route>

          <Route path="/restaurants/:restaurantId" exact>
            <NavigationLocalCity />
            <RestaurantProfile
                userReservationTime={userReservationTime}
                setShowSignInModal={setShowSignInModal}
                showSignInModal={showSignInModal}
            />
          </Route>

          <Route path="/restaurants/:restaurantId/reviews" exact>
            <Reviews />
          </Route>

          <Route path="/restaurants/:restaurantId/reservations" exact>
            <Reservations />
          </Route>

          <Route path="/reservations/:reservationId" exact>
            <ReservationConfirmation />
          </Route>

          <Route path="/reservations/:reservationId/modify" exact>
            <ModifyReservation />
          </Route>

          <Route path="/users/:userId/dining-dashboard" exact>
            <DiningDashboard />
          </Route>

          <Route path="/search-results" exact>
            <NavigationLocalCity />
            <SearchResults />
          </Route>

          {/* Restaurant Manager routes */}
          <Route path="/restaurant-manager" exact>
            <RestaurantManager />
          </Route>
          <Route path="/restaurant-manager/login" exact>
            <RestaurantLoginForm />
          </Route>
          <Route path="/restaurant-manager/register" exact>
            <RegisterForm />
          </Route>
          <Route  path="/restaurant-manager/dashboard" exact>
            <ManagerDashboard/>
          </Route>
          <Route path="/restaurant-manager/my-restaurants" exact>
            <ShowMyRestaurants/>
          </Route>

          <Route path="/restaurant-manager/manage-restaurants" exact>
            <ManageRestaurants/>
          </Route>

          <Route path="/restaurant-manager/add-restaurant" exact>
            <AddRestaurantForm/>
          </Route>

          <Route path="/restaurant-manager/edit-restaurant/:id" exact>
            <EditRestaurantForm/>
          </Route>

          <Route path="/restaurant-manager/manage-menu" exact>
            <ManageMenu/>
          </Route>

          <Route path="/restaurant-manager/support" exact>
            <SupportPage/>
          </Route>

          <Route path="/restaurant-manager/about" exact>
            <AboutPage/>
          </Route>



          {/*<Route path="/restaurant-manager/add" exact>*/}
          {/*  <AddRestaurantForm/>*/}
          {/*</Route>*/}
          {/*<Route path="/restaurant-manager/edit/:id" exact >*/}
          {/*  <EditRestaurantForm/>*/}
          {/*</Route>*/}


          {/* 404 fallback */}
          <Route>
            <h1>PAGE NOT FOUND</h1>
          </Route>
        </Switch>

        <Footer />
      </>
  );
}

export default AppWrapper;
