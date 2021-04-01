import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/navbar';
import './App.css';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import {reducer,initialState} from './reducers/userReducers';
import UserProfile from './components/screens/UserProfile';
import SubUserPost from './components/screens/SubUserPost';
 
export const UserContext = createContext(); 


const Routing = () =>{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"));

    if(user)
    {
      dispatch({type:"USER",payload:user});
      history.push('/');
    }
    else{
      history.push('/login');
    }
  },[]);

  return(
    <Switch>
       <Route exact path="/" >
          <Homex />
        </Route>
        <Route path="/login" >
          <Login />
        </Route>
        <Route path="/signup" >
          <Signup />
        </Route>
        <Route exact path="/profile" >
          <Profile />
        </Route>
        <Route path="/createpost" >
          <CreatePost />
        </Route>
        <Route path="/profile/:userid" >
          <UserProfile />
        </Route>
        <Route path="/myfollowingspost" >
          <SubUserPost />
        </Route>
    </Switch>
  );
}


const App = ()=>{
  
  const [state,dispatch] = useReducer(reducer,initialState);
  return(
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>  
  );
}

export default App;


// to do:
// image on post
// responsive navbar