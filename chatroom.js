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
const auth = firebase.auth();

// Get user from localStorage
const storedUserData = localStorage.getItem('userData');
const user = JSON.parse(storedUserData);
const userID = user.uid;
const userName = user.displayName;
let currentChatRoomId = null;
console.log(userID);
const userDocRef = db.collection('users').doc(userID);

const otherUserID = 'JNj1ee6Pr2XJIFzftx4e1CxN3iB3';  // Replace with the other user's UID

// Function to get the chat ID
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

  // If no chat exists, create a new one
  if (!chatId) {
    const newChat = await db.collection('chats').add({
      users: [user1Uid, user2Uid]
    });
    chatId = newChat.id;
  }

  return chatId;
};

// Function to load messages
const loadMessages = (chatId) => {
  db.collection('chats').doc(chatId).collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot((snapshot) => {
      const messages = document.getElementById(`messages-${chatId}`);
      messages.innerHTML = '';  // Clear current messages
      snapshot.forEach((doc) => {
        const messageData = doc.data();
        const li = document.createElement('li');
        li.textContent = `${messageData.senderName}: ${messageData.message}`;
        messages.appendChild(li);
      });
    });
};

// Function to send a message
const sendMessage = async (chatId, message, senderId) => {
  const senderDoc = await db.collection('users').doc(senderId).get();
  const senderName = senderDoc.data().name;

  console.log(senderName);

  db.collection('chats').doc(chatId).collection('messages').add({
    senderName: senderName,
    message: message,
    senderId: senderId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

const hideCurrentChatRoom = () => {
  if (currentChatRoomId) {
    const currentChatRoom = document.getElementById(`chatRoom-${currentChatRoomId}`);
    if (currentChatRoom) {
      currentChatRoom.style.display = 'none'; // Hide the current chat room
    }
  }
};

// Get user matches and display as buttons
userDocRef.get().then((doc) => {
  if (doc.exists) {
    const userData = doc.data();
    let currentUserMatches = userData.matches || {};
    let uidArray = Object.keys(currentUserMatches);

    // Display match buttons
    document.getElementById("allMatches").innerHTML = "";
    uidArray.forEach((uid) => {
      const clickableItem = document.createElement("button");
      getMatchesName(uid).then(username => {
        clickableItem.textContent = username || 'User not found'; // Set the text content
      });
      clickableItem.style.cursor = "pointer";

      // When button is clicked, open respective chatroom
      clickableItem.addEventListener("click", () => {
        console.log("Clicked UID:", uid);
        getChatId(userID, uid).then(chatId => {
          console.log("Chat ID retrieved:", chatId);
          hideCurrentChatRoom();
          
          // Load messages in real-time
          loadMessages(chatId);
          
          // Create chat room elements dynamically
          const chatRoomDiv = document.createElement("div");
          chatRoomDiv.id = `chatRoom-${chatId}`;
          
          const messagesList = document.createElement("ul");
          messagesList.id = `messages-${chatId}`;
          
          const messageInput = document.createElement("input");
          messageInput.type = "text";
          messageInput.id = `messageInput-${chatId}`;
    
          const sendButton = document.createElement("button");
          sendButton.id = `sendButton-${chatId}`;
          sendButton.textContent = "Send";
    
          // Append elements to the chat room
          chatRoomDiv.appendChild(messagesList);
          chatRoomDiv.appendChild(messageInput);
          chatRoomDiv.appendChild(sendButton);
          
          // Append the chat room to the body or a specific container
          document.body.appendChild(chatRoomDiv); // or any specific container
          currentChatRoomId = chatId;
          // Now you can safely add the event listener
          sendButton.addEventListener('click', () => {
            const message = messageInput.value;
            if (message) {
              sendMessage(chatId, message, userID);
              messageInput.value = '';  // Clear input
            }
          });
        }).catch(error => {
          console.error("Error getting chat ID:", error);
        });
      });

      // Append the button to the UI
      document.getElementById("allMatches").appendChild(clickableItem);
    });
  } else {
    console.error("No such document!");
  }
}).catch((error) => {
  console.error("Error getting user document:", error);
});

// Function to get matched user's name
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
