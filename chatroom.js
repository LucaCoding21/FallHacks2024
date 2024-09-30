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

const storedUserData = localStorage.getItem('userData');
// Parse the data back to an object (since it's stored as a string)
const user = JSON.parse(storedUserData);
const userID = user.uid;

const userDocRef = db.collection('users').doc(userID);

userDocRef.get().then((doc) => {

  if (doc.exists) {
    // User exists, check for biography
    let temparray= []
    const userData = doc.data();
    let currentUserMatches = userData.matches;//this is an object
    // const length = Object.keys(myObject).length;

  
    for (let i = 0; i < Object.keys(currentUserMatches).length; i++) {
      temparray.push(getMatchesName(Object.keys(currentUserMatches)[i]))

    }

    console.log(temparray);
  }})


async function getMatchesName(uid) {
    try {
      const matchedDocRef = db.collection('users').doc(uid);
      const doc = await matchedDocRef.get();
  
      if (doc.exists) {
        const userData = doc.data();
        return userData.name; // Return the username
      } else {
        return null; // Handle case where user does not exist
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      return null; // Handle error case
    }
  }