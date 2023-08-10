import firebase from 'firebase/app';
import 'firebase/storage'; // Import the storage module

const firebaseConfig = {
  apiKey: "AIzaSyDqeaNNeUadFydePmmvCotBFr5FQEe8NKY",
  authDomain: "coderage-mern.firebaseapp.com",
  projectId: "coderage-mern",
  storageBucket: "coderage-mern.appspot.com",
  messagingSenderId: "88494782033",
  appId: "1:88494782033:web:aba77c15a511357b94ea70",
  measurementId: "G-H23G4CTZTV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a storage reference
const storage = firebase.storage();

export { storage };
