// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHByoiyiFXi5V08vRuY2CEY_l1aPL3lUU",
  authDomain: "daeliminsta-8264b.firebaseapp.com",
  projectId: "daeliminsta-8264b",
  storageBucket: "daeliminsta-8264b.appspot.com",
  messagingSenderId: "136881288742",
  appId: "1:136881288742:web:c7cff3b23fde77f92758e7",
  measurementId: "G-50Z8EFCYDJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication (인증 관련)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//firebase의 DB인 firestore 초기화 및 가져오기
export const firestore = getFirestore(app);
// firebase 대용량 미디어 파일 Storage 초기화 및 가져오기
export const storage = getStorage(app);
