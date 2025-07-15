import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export async function renderBreadexItems() {
  const querySnapshot = await getDocs(collection(db, "breadex-items"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
