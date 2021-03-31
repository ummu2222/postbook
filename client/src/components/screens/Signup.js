import React ,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Signup = () =>{

    const history = useHistory();
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);

    useEffect(()=>{
        if(url)
        {
            uploadFields();
        }
    },[url]);

    const uploadPic =()=>{
        
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","postbook1");
        data.append("cloud_name","postbook");
   //     console.log(data);

        fetch("https://api.cloudinary.com/v1_1/postbook/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>setUrl(data.url))
        .catch(err=>{
            console.log(err);
        });

    }

    const uploadFields = ()=>{
        
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        {
            return M.toast({html: "invalid Email",classes:"#d50000 red accent-4"});
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        })
        .then(res=>res.json())
        .then(data=>{
                if(data.error)
                {
                    M.toast({html: data.error,classes:"#d50000 red accent-4"});
                }
                else{
                    M.toast({html:data.message,classes:"#1de9b6 teal accent-3"});
                    history.push('/login');
                }
        }).catch(err=>{
            console.log(err);
        });
    }

    // connection to backend
    const PostData =()=>{

        if(image)
        {
            uploadPic();
        }
        else{
            uploadFields();
        }

    }

    return (
        
        <div className="mycard">
        <div className="card auth-card input-field">
            <h3 className="#1565c0-text blue-text text-darken-3">PostBook</h3>
            <input
                type="text"
                placeholder="user name"
                value={name}
                onChange={e=>setName(e.target.value)}
            />
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
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
                    <span>Upload Profile Pic</span>
                    <input type="file" onChange={e=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button onClick={()=>PostData()} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                Signup
            </button>

            <h5>
                <Link to="/login">Already have an account ?</Link>
            </h5>
        </div>
    </div>

    );

}

export default Signup;