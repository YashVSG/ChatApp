import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyADcrI8_TGF1B4ngzmJFiQLLyPoDVUk2Zs",
  authDomain: "yvsg-chat-app.firebaseapp.com",
  projectId: "yvsg-chat-app",
  storageBucket: "yvsg-chat-app.appspot.com",
  messagingSenderId: "718076161194",
  appId: "1:718076161194:web:5c3a7ef28e726dd31474d3"
};


export const app = initializeApp(firebaseConfig);