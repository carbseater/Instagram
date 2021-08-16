import firebase from 'firebase';
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBEUmLPBkSpQK73EFuoy_jZBmST6h_3dDY",
    authDomain: "instagram-clone-react-6dd14.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-6dd14.firebaseio.com",
    projectId: "instagram-clone-react-6dd14",
    storageBucket: "instagram-clone-react-6dd14.appspot.com",
    messagingSenderId: "101961547985",
    appId: "1:101961547985:web:b6e4384fe51b921fd705f0",
    measurementId: "G-ELNG4XXG66"
});
  
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };