
const biographyForm = document.getElementById('biographyForm');
// Your Firebase configuration object 
const firebaseConfig = {
  apiKey: "AIzaSyD8NKIfZ-fDhaRjCXH4D6SR9exegWtcMOY",
  authDomain: "matchmyspeed-154a5.firebaseapp.com",
  projectId: "matchmyspeed-154a5",
  storageBucket: "matchmyspeed-154a5.appspot.com",
  messagingSenderId: "33660047199",
  appId: "1:33660047199:web:11e5150aea888f3c4670ea"
};


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Reference to Firebase auth
const auth = firebase.auth();

// Google Sign-In
document.getElementById('googleSignIn').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      
    const user = result.user;
  
  // Storing the user data in localStorage
  localStorage.setItem('userToken', user.getIdToken());
  localStorage.setItem('userData', JSON.stringify({
    uid: user.uid,
    displayName: user.displayName,
    email: user.email
  }));

  // Redirect to userform.html
  console.log(user)
  window.location.href = "userform.html";
})})