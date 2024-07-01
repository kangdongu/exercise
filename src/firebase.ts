import { initializeApp } from "firebase/app";
import { GithubAuthProvider, GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore, writeBatch } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBQPdHUF_Y0YASjNy8MQXlFVo2hL54l5LM",
    authDomain: "exercise-fc810.firebaseapp.com",
    projectId: "exercise-fc810",
    storageBucket: "exercise-fc810.appspot.com",
    messagingSenderId: "1048685897333",
    appId: "1:1048685897333:web:5f9f4e0e015a27ac61fa3c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const githubProvider = new GithubAuthProvider();
export const googleProvider = new GoogleAuthProvider();

export const storage = getStorage(app);

export const db = getFirestore(app);
export const batch = writeBatch(db); 