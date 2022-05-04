import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

//GoogleAuthProvider -->> to get a popup
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAQLJ3d6cIFQOnmBDmVhWT0ZLF-tp9aWas",
  authDomain: "uber-nextjs-clone-5f9e6.firebaseapp.com",
  projectId: "uber-nextjs-clone-5f9e6",
  storageBucket: "uber-nextjs-clone-5f9e6.appspot.com",
  messagingSenderId: "105144095503",
  appId: "1:105144095503:web:fb65785b4cb36d2906a47a",
  measurementId: "G-F5MM36J138",
  });

const provider = new GoogleAuthProvider();
const db = firebaseApp.firestore()
const auth = getAuth();
const authWithEmail = firebase.auth();

export { provider, auth ,db,authWithEmail};
