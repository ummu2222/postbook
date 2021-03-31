import React ,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App'

const Login = () => {

    const {state,dispatch} = useContext(UserContext);

    const history = useHistory();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");


    // connection to backend
    const PostData =()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        {
            return M.toast({html: "invalid Email",classes:"#d50000 red accent-4"});
        }
        fetch("/login",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
                if(data.error)
                {
                    M.toast({html: data.error,classes:"#d50000 red accent-4"});
                }
                else{
                    localStorage.setItem("jwt",data.token);
                    localStorage.setItem("user",JSON.stringify(data.user));
                    dispatch({type:"USER",payload:data.user});
                    M.toast({html:"logged in successfully",classes:"#1de9b6 teal accent-3"});
                    history.push('/');
                }
        }).catch(err=>{
            console.log(err);
        });
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h3 className="#1565c0-text blue-text text-darken-3">PostBook</h3>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                />
                <button onClick={PostData} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                    Login
                </button>
                
                <h5>
                    <Link to="/signup">Create new account?</Link>
                </h5>
            </div>
        </div>
    );

}

export default Login;