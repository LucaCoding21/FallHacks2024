

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
// const userId = firebase.auth().currentUser.uid;

const storedUserData = localStorage.getItem('userData');

// Parse the data back to an object (since it's stored as a string)
const user = JSON.parse(storedUserData);

// Console log the parsed object

const userDocRef = db.collection('users').doc(user.uid);
      userDocRef.get().then((doc) => {

        if (doc.exists) {
          // User exists, check for biography
          const userData = doc.data();
          console.log(userData)
          let currentUserName = userData.name;
          console.log(currentUserName)
          console.log(userData.biography);
    // Get a random document and ensure it's not the same as the current user's name
          let randomName = getRandomDocument().then((randomDoc) => {
            let randomName = randomDoc.name;

            // Continue fetching random documents until the name is different
            while (randomName === currentUserName) {
              randomName = getRandomDocument().then(doc => doc.name);
            }
            // Now that we have a valid random name, you can proceed with any further logic
          });

          if (!userData.biography) {
            // Show biography form if biography is not present
            window.location.href = "userform.html"
            
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
    
    
  
  // Handling the biography form submission

  // Sign Out
  // document.getElementById('signOut').addEventListener('click', () => {
  //   auth.signOut().then(() => {
  //     document.getElementById('user-info').innerText = '';
  //     document.getElementById('googleSignIn').style.display = 'block';
  //     document.getElementById('signOut').style.display = 'none';
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  // });



function getRandomDocument() {
  db.collection('users').get().then((snapshot) => {
    const totalDocs = snapshot.size;

    if (totalDocs === 0) {
      console.log("No documents found in the collection");
      return;
    }

    let randomDoc;
    let randomIndex;
    
    do {
      randomIndex = Math.floor(Math.random() * totalDocs);
      randomDoc = snapshot.docs[randomIndex].data();

    } while (randomDoc.name == firebase.auth().currentUser.displayName); // Ensure it doesn't show the current user

    console.log("Random Document: ", randomDoc.name);
    

    // Display the random document in the HTML
    document.getElementById('user-data1').innerText = randomDoc.name;
    document.getElementById('user-data2').innerText = randomDoc.age;
    document.getElementById('user-data3').innerText = randomDoc.exp;
    document.getElementById('user-data4').innerText = randomDoc.biography;
    document.getElementById('user-data5').innerText = randomDoc.likeListening;
    document.getElementById('user-data6').innerText = randomDoc.proudAchievement;

    document.getElementById('fortnite'),innerText = randomDoc.uid;
    localStorage.setItem('randomdoc.uid', randomDoc.uid);

    console.log("UID stored:", randomDoc.uid);
    document.getElementById('picture').src = randomDoc.imgLink;
    
    // document.getElementById('fortnite').innerText = randomDoc.biography;
    // document.getElementById('uid').innerText = randomDoc.uid
  }).catch((error) => {
    console.error("Error fetching documents: ", error);
  });
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
  console.log(storedUID);

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
      console.log(storedUIDMatches);
      if (storedUIDMatches[currentUser] === "yes" && response === "yes") {
        alert("It's a Match!");
        // You can show a message or perform other actions here
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
  // Call the function to get the next random user profile
  getRandomDocument();
}
