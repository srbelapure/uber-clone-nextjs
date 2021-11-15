import { initializeApp } from "firebase/app";

//GoogleAuthProvider -->> to get a popup
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQLJ3d6cIFQOnmBDmVhWT0ZLF-tp9aWas",
  authDomain: "uber-nextjs-clone-5f9e6.firebaseapp.com",
  projectId: "uber-nextjs-clone-5f9e6",
  storageBucket: "uber-nextjs-clone-5f9e6.appspot.com",
  messagingSenderId: "105144095503",
  appId: "1:105144095503:web:fb65785b4cb36d2906a47a",
  measurementId: "G-F5MM36J138",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();

export { app, provider, auth };
