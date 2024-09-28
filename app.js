
// Your Firebase configuration object 
const firebaseConfig = {
  apiKey: "AIzaSyD8NKIfZ-fDhaRjCXH4D6SR9exegWtcMOY",
  authDomain: "matchmyspeed-154a5.firebaseapp.com",
  projectId: "matchmyspeed-154a5",
  storageBucket: "matchmyspeed-154a5.appspot.com",
  messagingSenderId: "33660047199",
  appId: "1:33660047199:web:11e5150aea888f3c4670ea"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to Firebase auth
const auth = firebase.auth();

// Google Sign-In
document.getElementById('googleSignIn').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      document.getElementById('user-info').innerText = `Hello, ${user.displayName}`;
      document.getElementById('googleSignIn').style.display = 'none';
      document.getElementById('signOut').style.display = 'block';
    })
    .catch((error) => {
      console.error(error);
    });
});

// Sign Out
document.getElementById('signOut').addEventListener('click', () => {
  auth.signOut().then(() => {
    document.getElementById('user-info').innerText = '';
    document.getElementById('googleSignIn').style.display = 'block';
    document.getElementById('signOut').style.display = 'none';
  }).catch((error) => {
    console.error(error);
  });
});
