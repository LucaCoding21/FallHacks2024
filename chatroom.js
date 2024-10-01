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
console.log(userID);
const userDocRef = db.collection('users').doc(userID);

const otherUserID = 'JNj1ee6Pr2XJIFzftx4e1CxN3iB3';  // Replace with the other user's UI


const getChatId = async (user1Uid, user2Uid) => {
  const chatQuery = await db.collection('chats')
    .where('users', 'array-contains', user1Uid)
    .get();

  let chatId = null;
  chatQuery.forEach((doc) => {
    if (doc.data().users.includes(user2Uid)) {
      chatId = doc.id;
    }
  });


  if (!chatId) {
    const newChat = await db.collection('chats').add({
      users: [user1Uid, user2Uid]
    });
    chatId = newChat.id;
  }

  return chatId;
};
const loadMessages = (chatId) => {
      db.collection('chats').doc(chatId).collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          const messages = document.getElementById('messages');
          messages.innerHTML = '';  // Clear current messages
          snapshot.forEach((doc) => {
            const messageData = doc.data();
            const li = document.createElement('li');
            console.log(messageData)
            li.textContent = `${messageData.senderId}: ${messageData.message}`;
            messages.appendChild(li);
          });
        });
};
const sendMessage = (chatId, message, senderId) => {
  db.collection('chats').doc(chatId).collection('messages').add({
    message: message,
    senderId: senderId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
};
getChatId(userID, otherUserID).then(chatId => {
  loadMessages(chatId);

  // Send message on button click
  document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
      sendMessage(chatId, message, userID);
      messageInput.value = '';  // Clear input
    }
  });
});


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
    Promise.all(temparray)
      .then((resolvedData) => {
          console.log(resolvedData); // This will log the resolved values from the promises
          document.getElementById("allMatches").innerHTML = resolvedData.join(", "); // If resolvedData is an array of strings
        })
        .catch((error) => {
          console.error("Error:", error); // Handle any errors
        });
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





