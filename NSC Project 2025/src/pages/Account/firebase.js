import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA66w2jbm4ySC_a8frCPxdhUYxLBmlgSpo",
  authDomain: "nsc-server.firebaseapp.com",
  projectId: "nsc-server",
  storageBucket: "nsc-server.firebasestorage.app",
  messagingSenderId: "13678340649",
  appId: "1:13678340649:web:b4fb89bbb1b1810506ca38",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
