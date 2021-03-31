import React ,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");
    const history=useHistory("");

    useEffect(()=>{
        
        if(url)
        {
            
        fetch("/createpost",{
            method:"post",
            headers:{
                "content-type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
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
                    M.toast({html:"Created Post successfully",classes:"#1de9b6 teal accent-3"});
                    history.push('/');
                }
        }).catch(err=>{
            console.log(err);
        });
        }

    },[url]);

    const postDetails = () =>{
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

    return (
        <div className="card input-field"  style={{margin:"100px auto",maxWidth:"700px",padding:"20px",textAlign:"center",backgroundColor:" rgb(253, 253, 255)"}} >
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={e=>setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="body"
                value={body}
                onChange={e=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
                    <span>Upload image</span>
                    <input type="file" onChange={e=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button onClick={postDetails} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                Upload
            </button>
        </div>
    );
}

export default CreatePost;