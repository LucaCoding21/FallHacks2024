
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


// real time collection data


// Reference to Firebase auth
const auth = firebase.auth();
// const userId = firebase.auth().currentUser.uid;

// Google Sign-In
document.getElementById('googleSignIn').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      document.getElementById('user-info').innerText = `Hello, ${user.displayName}`;
      document.getElementById('googleSignIn').style.display = 'none';
      document.getElementById('signOut').style.display = 'block';




      


      // Check if user exists in Firestore
      const userDocRef = db.collection('users').doc(user.uid);
      userDocRef.get().then((doc) => {
        
        if (doc.exists) {
          // User exists, check for biography
          const userData = doc.data();
          let currentUserName = userData.name;

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
            document.getElementById('biographyForm').style.display = 'block';
          }
          biographyForm.style.display = 'none'; // Hide form after submission
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
    });
  
  // Handling the biography form submission

  biographyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = firebase.auth().currentUser.uid; // Get current user ID

    const biographyText = biographyForm.biography.value;
    console.log(biographyText)
    const nameText = biographyForm.name.value;
    console.log(nameText)
    const ageText = biographyForm.age.value;
    console.log(ageText)
    const expText = biographyForm.exp.value;
    console.log(expText)
    const imgURL = biographyForm.imageURL.value;
    console.log(imgURL)
    
    // Update the user's biography in Firestore
    db.collection('users').doc(userId).update({
      uid:userId,
      name:nameText,
      biography: biographyText,

      age:ageText,
      exp:expText,
      img:imgURL
      
    }).then(() => {
      biographyForm.reset();
      biographyForm.style.display = 'none'; // Hide form after submission
      console.log("Biography successfully updated!");







      
    }).catch((error) => {
      console.error("Error updating biography: ", error);
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
});


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
    document.getElementById('randomDoc').innerText = randomDoc.name;
    document.getElementById('myImage').src = randomDoc.img;
    document.getElementById('fortnite').innerText = randomDoc.biography;
    document.getElementById('uid').innerText = randomDoc.uid
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
  
  const viewedUser = document.getElementById('uid').innerText; // The random user's name or ID
  
  // Save the current user's response to the viewed user
  db.collection('users').doc(currentUser).update({
    [`matches.${viewedUser}`]: response
  }).then(() => {
    // Check if the viewed user also said "Yes"
    db.collection('users').doc(viewedUser).get().then(doc => {
      if (doc.exists) {
        const viewedUserMatches = doc.data().matches || {};
        console.log(doc.data().matches)
        if (viewedUserMatches[currentUser] === "yes" && response === "yes") {
          alert("It's a Match!");
          // You can show a message or perform other actions here
        } else {
          console.log("No Match yet.");
        }
      } else {

      }
    });
  }).catch(error => {
    console.error("Error saving match response: ", error);
  });
}


function getNextProfile() {
  // Call the function to get the next random user profile
  getRandomDocument();
}
