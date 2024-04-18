import { initializeApp } from 'firebase/app'
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    //read data from Firebase    
} from "firebase/auth"
//ref = reference to a "collection"
import {
    getDatabase,
    ref as firebaseDatabaseRef,
    set as firebaseSet,
    child,
    get,
    onValue,
} from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyDKVnctM3WbsCdosbKixQQe_Wk-g0udaMo",
    authDomain: "nckh-20a95.firebaseapp.com",
    databaseURL: "https://nckh-20a95-default-rtdb.firebaseio.com",
    projectId: "nckh-20a95",

    storageBucket: "nckh-20a95.appspot.com",
    appId: '1:18001948070:android:b25a383254ce88ddd0b367',
    messagingSenderId: "18001948070",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth() // xác thực account
const firebaseDatabase = getDatabase()

export {
    auth,
    firebaseDatabase,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged,
    getDatabase,
    firebaseDatabaseRef,
    firebaseSet,
    child,
    get,
    onValue,
}