

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
          // let randomName = getRandomDocument().then((randomDoc) => {
          //   let randomName = randomDoc.name;

          //   // Continue fetching random documents until the name is different
          //   while (randomName === currentUserName) {
          //     randomName = getRandomDocument().then(doc => doc.name);
          //   }
          //   // Now that we have a valid random name, you can proceed with any further logic
          // });

          if (userData.biography) {
            // Show biography form if biography is not present
            window.location.href = "userpage.html"
            
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
    const likeListeningText = biographyForm.likeListening.value;
    const proudAchievementText = biographyForm.proudAchievement.value;
    const imgLinkText = biographyForm.imgLink.value;
    console.log(likeListeningText);
    console.log(proudAchievementText)
    // const imgURL = biographyForm.imageURL.value;
    // console.log(imgURL)
    
    // Update the user's biography in Firestore
    db.collection('users').doc(userId).update({
      uid:userId,
      name:nameText,
      biography: biographyText,
      age:ageText,
      exp:expText,
      likeListening:likeListeningText,
      proudAchievement:proudAchievementText,
      imgLink : imgLinkText,

      
    }).then(() => {
      window.location.href="userpage.html";
      console.log("Biography successfully updated!");

    }).catch((error) => {
      console.error("Error updating biography: ", error);
    });
  });


