import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom';

const UserProfile = () =>{

    const [userProfile,setProfile] = useState(null);
    
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
  //  console.log(userid);
  const [showFollow,setShowFollow]=useState(state? (!state.following.includes(userid)):(true));

    

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result =>{
            setProfile(result);
        })
    },[]);


    const followUser = ()=>{

        fetch('/follow',{
            method:"put",
            headers:{
                "Content-type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data =>{
            //console.log(data);
            dispatch({type:"UPDATE",payload:{following:data.following , followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            });
            setShowFollow(false);
        })

    }

    
    const unfollowUser = ()=>{

        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data =>{
            //console.log(data);
            
            dispatch({type:"UPDATE",payload:{following:data.following , followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data))
            
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item => item !=data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            });
            setShowFollow(true);
        })

    }




    return (
        <>
        {userProfile ?(
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div
                 style={{display:"flex",justifyContent:"space-around",margin:"18px 0px",borderBottom:"2px solid grey"}}>
                <div>
                    <img
                        style={{height:"160px",width:"160px",borderRadius:"80px"}}
                        src={userProfile.user.pic} 
                    />
                </div>
                <div style={{color:"white"}}>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {
                        showFollow?(
                        <button style={{margin:"20px"}} onClick={()=>followUser()} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                            follow
                        </button>):(
                            
                        <button style={{margin:"20px"}} onClick={()=>unfollowUser()} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                            unfollow
                        </button>
                        )
                    }
                </div>
            </div>

            <div className="gallery">
                {
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        );
                    })
                }
               
            </div>
        </div>) :<h2 style={{color:"white"}}>Loading...</h2>}
        </>
    );

}

export default UserProfile;