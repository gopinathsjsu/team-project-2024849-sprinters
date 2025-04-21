import { csrfFetch } from './csrf';
const BASE_API_URL = process.env.REACT_APP_API_URL || '';


/* ------------------------------ Action Types -------------------------- */
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

/* ---------------------------- Action Creators -------------------------- */
const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER,
});

/* ---------------------------- Thunk Action Creators ----------------------- */

export const authenticate = () => async (dispatch) => {
  const response = await csrfFetch('/api/auth/');
  
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }
    dispatch(setUser(data));
  }
};

export const login = (email, password) => async (dispatch) => {
  console.log('here')
  try {
    const response = await csrfFetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data));
      return null;
    } else {
      const errorData = await response.json();
      return errorData.errors || ['Login failed'];
    }
  } catch (error) {
    console.error('Login error:', error);
    return ['Network error occurred'];
  }
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/auth/logout', {
    method: 'POST'
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

export const signUp = (username, email, firstName, lastName, password) => async (dispatch) => {
  const response = await csrfFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }
};

/* -------------------------------- Reducer ---------------------------- */
const initialState = { user: null };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload };
    case REMOVE_USER:
      return { user: null };
    default:
      return state;
  }
}