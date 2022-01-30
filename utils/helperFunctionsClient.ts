import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

async function fetchAdminData() {
  return new Promise<boolean>(async (resolve, reject) => {
    const q = query(
      collection(db, "admins"),
      where(
        "email",
        "==",
        JSON.parse(sessionStorage.getItem("currentUser") || "").email
      )
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().email) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
}

export { fetchAdminData }