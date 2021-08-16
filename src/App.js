import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button ,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import FlipMove from "react-flip-move";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 324,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
}));

function App() {
	const classes = useStyles();
	const [ modalStyle ] = React.useState(getModalStyle);
	const [ posts, setPosts ] = useState([]);
    const [open, setopen] = useState(false);
    const [openSignIn,setOpenSignIn] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null)
    
    useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                
                setUser(authUser);
                
              
                // if (authUser.displayName) {
                //     //dont update displayname
                // }
                // else {
                    console.log("setting username",authUser);
                    // return authUser.updateProfile({
                        
                    //     displayName: username
                    // });
                    
                // }
            }
            else {
                setUser(null);
            }

            
        })
        return () => {
            unsubscribe();
        }
    }, [user,username])

	useEffect(() => {
		db.collection('posts').orderBy("timestamp","desc").onSnapshot((snapshot) => {
			setPosts(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					post: doc.data()
				}))
			);
		});
    }, []);
    
    const signUp = (event) => {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                console.log("signup >>", authUser);
                authUser.user.updateProfile({
                        
                    displayName: username
                });
                return setUser(authUser);
                // console.log(">>>>", user);
                
                
            })
            .catch((error) => alert(error.message));
        setopen(false);
    }

    const signIn = (event) => {
        event.preventDefault();
        
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message));
        setOpenSignIn(false);
    }

	return (
        <div className="app">
                  
			<Modal
				open={open}
				onClose={() => setopen(false)}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img
                            src="https://i.pinimg.com/originals/57/6c/dd/576cdd470fdc0b88f4ca0207d2b471d5.png"
                            alt=""
                            className="app__headerImage"
                            />
                        </center>
                        <Input
                            type="text"
                            placeholder="(*Must) Add username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                             
                            />
                        <Input
                            type="text"
                            placeholder="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                        <Button onClick={signUp}>Sign Up</Button>
                        </form>
				</div>
            </Modal>
            <Modal
				open={openSignIn}
				onClose={() => setOpenSignIn(false)}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img
                            src="https://i.pinimg.com/originals/57/6c/dd/576cdd470fdc0b88f4ca0207d2b471d5.png"
                            alt=""
                            className="app__headerImage"
                            />
                        </center>
                        
                        <Input
                            type="text"
                            placeholder="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                        <Button onClick={signIn}>Sign In</Button>
                        </form>
				</div>
			</Modal>
			<div className="app__header">
				<img
					src="https://i.pinimg.com/originals/57/6c/dd/576cdd470fdc0b88f4ca0207d2b471d5.png"
					alt=""
					className="app__headerImage"
                />
                {user ?
                    (<div className="app__Rightheader">
                        {console.log("USER:",user?.displayName)}
                        <p className="displayName">Hello, <strong>@{user?.displayName}<span></span></strong></p>
                        
                        <Button onClick={() => auth.signOut()}>LogOut</Button>
                        
                        
                    </div>
                    )
                    :
                    (
                        <div className="app__loginContainer">
                            <Button  onClick={() => setOpenSignIn(true)}>Sign In</Button>
                            <Button  onClick={() => setopen(true)}>Sign Up</Button>
                        </div> 
                    )
               }
            </div>

            {user ?
                (
                <ImageUpload username={user.displayName} />
                )
                : (<div className="footer__warning">
                    <h3>Sign Up first for Uploading and Comments</h3>
                   </div>
                 )
            }
            
            <div className="app__posts">
                <div className="app__postsLeft">
                    <FlipMove>
                        {posts.map(({ post, id }) => (
                            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
                        ))}
                    </FlipMove>
                   
                </div>
                <div className="app__postsRight">
                        <InstagramEmbed
                        url='https://www.instagram.com/p/CEUWI1apWpK/'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                    <InstagramEmbed
                        url='https://www.instagram.com/p/CDgKUDkpq8I/'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                    <InstagramEmbed
                        url='https://www.instagram.com/p/CE6-1SXJ_r2/'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                       />
                </div>
                
            </div>
            
			
            
            

		</div>
	);
}

export default App;
