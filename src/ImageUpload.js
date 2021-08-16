import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import firebase from 'firebase';
import { storage, db } from './firebase';
import './ImageUpload.css';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';


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
		maxWidth: 300,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
}));

function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setopen] = useState(false);
    const classes = useStyles();

    
    
    
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                    //post image inside db
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username:username
                        })

                        setProgress(0);
                        setCaption('');
                        setImage(null);
                        setopen(false);

                })
            }
        )
    }
    const style = {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: "20px",
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        border:"none",
        color: 'white',
        height: 48,
        padding: '0 30px',
        borderDecoration:"none",
        
           };
    

    return (
        <div className="imageupload">        
            <Modal
				open={open}
				onClose={() => setopen(false)}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
                <div style={modalStyle} className={classes.paper}>
                    <div className="post__upload">
                        <center>
                        <h3>Add a Post</h3>
                        </center>
                        
                        
                        <textarea onChange={event => setCaption(event.target.value)} value={caption} placeholder="Enter a caption..."></textarea>
                        <input  className="post__fileButton"type="file" onChange={handleChange} />
                        <Button color="secondary" variant="contained"onClick={handleUpload}>
                            Upload
                        </Button>
                        
                        <progress className="imageupload__progress" value={progress} max="100" />
                    </div>
                </div>
               
            </Modal>
            
            <Button style={style} onClick={()=>setopen(true)}>Upload Post</Button>
            
            
        </div>
    )
}

export default ImageUpload
