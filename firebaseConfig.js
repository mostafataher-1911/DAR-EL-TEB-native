// ✅ Firebase v9+ modular SDK
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAeBd7Xzmn9_h6CRb6_otDg68jSVtBQS3g",
  authDomain: "dar-el-teb.firebaseapp.com",
  projectId: "dar-el-teb",
  storageBucket: "dar-el-teb.appspot.com",
  messagingSenderId: "863920819195",
  appId: "1:863920819195:web:dd15ae6f3bb2246e61d95e",
  measurementId: "G-LWGD7VRWMK"
};

export const app = initializeApp(firebaseConfig);
