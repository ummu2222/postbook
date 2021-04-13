import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const NavBar = () => {

    const [search, setSearch] = useState("");
    const searchModal = useRef(null);
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    const [userDetails,setUserDetails] = useState([]);

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, []);

    const renderList = () => {
        if (state) {
            return [
                <li key="11"><i data-target="modal1" className="large material-icons modal-trigger" >search</i></li>,
                <li key="1"><Link to="/profile">Profile</Link></li>,
                <li key="2"><Link to="/createpost">Create Post</Link></li>,
                <li key="10"><Link to="/myfollowingspost">Following's Post</Link></li>,
                <li key="3">
                    <button onClick={() => {
                        localStorage.clear();
                        dispatch({ type: "CLEAR" });
                        history.push('/login');
                    }} className="btn waves-effect waves-light #b71c1c red darken-4">
                        Logout
                    </button>
                </li>
            ];
        }
        else {
            return [
                <li key="4"><Link to="/login">Login</Link></li>,
                <li key="5"><Link to="/signup">Signup</Link></li>
            ];
        }
    }

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
           // console.log(results);
          setUserDetails(results.user)
        })
     }

    return (
        <nav>
            <div className="nav-wrapper #1a237e indigo darken-4">
                <Link to={state ? "/" : "/login"} className="brand-logo left">PostBook</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{ color: 'black' }} >
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="search user"
                        value={search}
                        onChange={e => fetchUsers(e.target.value)}
                    />

                    <ul className="collection" style={{color:"black"}} >
                        {
                            userDetails.map(item=>{
                                return(                       
                                    <Link to={item._id!==state._id ? `/profile/${item._id}` : "/profile/"} 
                                        onClick={()=>{
                                            
                                            M.Modal.getInstance(searchModal.current).close();
                                            setSearch("");
                                            setUserDetails([]);
                                        }}
                                    ><li key={item._id} className="collection-item" style={{color:"black"}}>{item.email}</li></Link>
                                );
                            })
                        }
                       
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("")} >close</button>
                </div>
            </div>
        </nav>


    );
}


export default NavBar;