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

const storedUserData = localStorage.getItem('userData');
// Parse the data back to an object (since it's stored as a string)
const user = JSON.parse(storedUserData);
console.log(user)
// document.getElementById("username-variable").innerHTML = user.displayName;
const userDocRef = db.collection('users').doc(user.uid);
userDocRef.get().then((doc) => {
  if (doc.exists) {
    // User exists, check for biography
    const userData = doc.data();
    let currentUserName = userData.name;
    if (!userData.biography) {
      // Show biography form if biography is not present
      window.location.href = "userform.html";
    } else {
      // Fetch a random profile, ensuring it's not the current user's profile
      getRandomDocument(currentUserName).then((randomDoc) => {
        displayUserProfile(randomDoc);
      });
    }
  } else {
    // If user doesn't exist, create a new user document
    userDocRef.set({
      displayName: user.displayName,
      email: user.email,
      biography: "" // Initialize biography as empty
    }).then(() => {
      // Show biography form for new users
      document.getElementById('biographyForm').style.display = 'block';
    }).catch((error) => {
      console.error("Error creating user document: ", error);
    });
  }
}).catch((error) => {
  console.error("Error fetching user document: ", error);
});

// Fetch a random document from the collection, ensuring it's not the current user
function getRandomDocument(currentUserName) {
  return db.collection('users').get().then((snapshot) => {

    const totalDocs = snapshot.size;
    if (totalDocs === 0) {
      console.log("No documents found in the collection");
      return null;
    }

    let randomDoc = null;
    let attemptLimit = totalDocs; // Just in case all documents are the current user (though unlikely)
    while (attemptLimit-- > 0) {
      const randomIndex = Math.floor(Math.random() * totalDocs);
      const doc = snapshot.docs[randomIndex];
      if (doc.data().name !== currentUserName) {
        randomDoc = doc.data();
        break;
      }
    }

    if (!randomDoc) {
      console.log("Did not find a different user profile.");
    }
    return randomDoc;
  }).catch((error) => {
    console.error("Error fetching documents: ", error);
  });
}

function displayUserProfile(randomDoc) {
  if (!randomDoc) return; // Exit if there is no random document

  document.getElementById('user-data1').innerText = randomDoc.name;
  document.getElementById('user-data2').innerText = randomDoc.age;
  document.getElementById('user-data3').innerText = randomDoc.exp;
  document.getElementById('user-data4').innerText = randomDoc.biography;
  document.getElementById('user-data5').innerText = randomDoc.likeListening;
  document.getElementById('user-data6').innerText = randomDoc.proudAchievement;
  localStorage.setItem('randomdoc.uid', randomDoc.uid);
  document.getElementById('picture').src = randomDoc.imgLink;
}


document.getElementById('yesBtn').addEventListener('click', () => {
  handleMatchResponse("yes");
  getNextProfile();
});

document.getElementById('noBtn').addEventListener('click', () => {
  getNextProfile();
});

function handleMatchResponse(response) {
  const currentUser = firebase.auth().currentUser.uid; // Current logged-in user
  const storedUID = localStorage.getItem('randomdoc.uid');
  if (!storedUID) {
    console.error("Viewed user is invalid or empty.");
    return; // Exit the function if viewedUser is invalid
  }

  // Ensure matches field exists for the current user before updating
  db.collection('users').doc(currentUser).get().then(doc => {
    if (!doc.exists) {
      // If the document doesn't exist, create it with an empty matches object
      return db.collection('users').doc(currentUser).set({
        matches: {}
      }, { merge: true });
    }
  }).then(() => {
    // Save the current user's response to the viewed user
    return db.collection('users').doc(currentUser).update({
      [`matches.${storedUID}`]: response
    });
  }).then(() => {
    // Check if the viewed user also said "Yes"
    return db.collection('users').doc(storedUID).get();
  }).then(doc => {
    if (doc.exists) {
      const storedUIDMatches = doc.data().matches || {};
      if (storedUIDMatches[currentUser] === "yes" && response === "yes") {
        alert("It's a Match!");
      } else {
        console.log("No Match yet.");
      }
    } else {
      console.log("Viewed user not found.");
    }
  }).catch(error => {
    console.error("Error saving match response: ", error);
  });
}

function getNextProfile() {
  const currentUserName = firebase.auth().currentUser.displayName;
  getRandomDocument(currentUserName).then((randomDoc) => {
    displayUserProfile(randomDoc);
  });
}

document.getElementById('signOut').addEventListener('click', () => {
  localStorage.clear();
  window.location.href ="index.html"
});

document.getElementById('viewMatches').addEventListener('click',() =>{
  window.location.href ="chatroom.html"
})