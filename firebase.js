import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD1ftgbIvVBJF4fNnmrhsX_ClcTj2afmDw",
  authDomain: "reminder-7bf2c.firebaseapp.com",
  databaseURL: "https://reminder-7bf2c-default-rtdb.firebaseio.com",
  projectId: "reminder-7bf2c",
  storageBucket: "reminder-7bf2c.appspot.com",
  messagingSenderId: "844192082682",
  appId: "1:844192082682:web:8851db228b91ee9f093743",
  measurementId: "G-RSX799CNJX"
};

const app = initializeApp(firebaseConfig);

export default app;