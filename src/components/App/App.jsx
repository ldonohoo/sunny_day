import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AboutPage from '../AboutPage/AboutPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import Lists from '../Lists/Lists';
import ListItems from '../ListItems/ListItems';
import Recommendations from '../Recommendations/Recommendations';

import './App.css';

function App() {
  const dispatch = useDispatch();

  const user = useSelector(store => store.user);

  useEffect(() => {
    dispatch({ type: 'GET_USER' });
  }, []);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from="/" to="/home" />
          {/* Visiting localhost:5173/about will show the about page. */} 
          <Route exact path="/about">
            {/* // shows AboutPage at all times (logged in or not) */}
            <AboutPage />
          </Route>
          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:5173/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:5173/user */}
          <ProtectedRoute exact path="/lists/:initial_load">
            <Lists />
          </ProtectedRoute>
          <ProtectedRoute exact path="/list_items/:list_id/:list_item">
            <ListItems />
          </ProtectedRoute>
          <ProtectedRoute exact path="/recommendations/:list_id">
            <Recommendations />
          </ProtectedRoute>
          {/* logged in shows InfoPage else shows LoginPage */}
          <ProtectedRoute exact path="/info"> 
            <InfoPage />           
          </ProtectedRoute>
          <Route exact path="/login">
            {user.id ?
              // If the user is already logged in, 
              // redirect to the /user page
              <Redirect to="/lists/true" />
              :
              // Otherwise, show the login page
              <LoginPage />
            }
          </Route>
          {/* // If the user is already logged in, 
              // redirect them to the /user page */}
                            {/* // Otherwise, show the registration page */}
          <Route exact path="/registration">
            {user.id ? <Redirect to="/lists/false" /> : <RegisterPage />
            }
          </Route>
          {/* // If the user is already logged in, 
              // redirect them to the /user page
              // Otherwise, show the Landing page */}
          <Route exact path="/home">
            {user.id ? <Redirect to="/lists/false" />  : <LandingPage /> }
          </Route>
          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
