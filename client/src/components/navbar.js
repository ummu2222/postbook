import React,{useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App';

const NavBar = () => {
    
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);

    const renderList = () =>{
        if(state)
        {
            return [
                <li key="1"><Link to="/profile">Profile</Link></li>,
                <li key="2"><Link to="/createpost">Create Post</Link></li>,
                <li key="10"><Link to="/myfollowingspost">Following's Post</Link></li>,
                <li key="3">
                    <button onClick={()=>{
                        localStorage.clear();
                        dispatch({type:"CLEAR"});
                        history.push('/login');
                    }} className="btn waves-effect waves-light #b71c1c red darken-4">
                        Logout
                    </button>
                </li>
            ];
        }
        else{
            return [
                <li key="4"><Link to="/login">Login</Link></li>,
                <li key="5"><Link to="/signup">Signup</Link></li>
            ];
        }
    }


    return (
        <nav>
            <div className="nav-wrapper #1a237e indigo darken-4">
                <Link to={state?"/":"/login"} className="brand-logo left">PostBook</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;