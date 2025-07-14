import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

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
export const db = getFirestore(app);
export default app;

const testConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "breadex-items"));
    console.log("Firebase เชื่อมได้แล้วเย่");
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Firebase ไม่อยากุยกับเรา: ", error);
  }
};

//เอาไว้เทสเซิฟพิมพ์ testConnection(); ใน console เพิ่อดูการตอบกลับ
window.testConnection = testConnection;
