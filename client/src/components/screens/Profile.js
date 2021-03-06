import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile = () => {

    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");


    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setPics(result.mypost);
            })
    }, []);

    useEffect(()=>{
        if(image)
        {
            const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "postbook1");
        data.append("cloud_name", "postbook");
        //     console.log(data);

        fetch("https://api.cloudinary.com/v1_1/postbook/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url);
               
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json()).then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
                    dispatch({type:"UPDATEPIC",payload:result.pic});

                })

    //            window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });

        }
    },[image]);

    const updatePhoto = (file) => {
        setImage(file);
        
    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{ margin: "18px 0px", borderBottom: "2px solid grey" }}>
                <div
                    style={{ display: "flex", justifyContent: "space-around" }}>
                    <div>
                        <img
                            style={{ height: "160px", width: "160px", borderRadius: "80px" }}
                            src={state ? (state.pic) : ("loading..")}
                        />


                    </div>

                    <div style={{color:"white"}}>
                        <h4>{state ? state.name : "loading..."}</h4>
                        <h5>{state ? state.email : "loading..."}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{state ? mypics.length : ".."} posts</h6>
                            <h6>{state ? state.followers.length : ".."} followers</h6>
                            <h6>{state ? state.following.length : ".."} following</h6>
                        </div>
                    </div>

                </div>

                <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
                        <span>Update Pic</span>
                        <input type="file" onChange={e => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        );
                    })
                }

            </div>
        </div>
    );

}

export default Profile;