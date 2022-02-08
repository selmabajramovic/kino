import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  doc,
  getDoc
} from "firebase/firestore";
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

async function fetchMovies() {
  try {
    const querySnapshot = await getDocs(collection(db, "filmovi"));
    let data: object[] = [];
    return new Promise<Array<DocumentData>>((resolve, reject) => {
      try {
        querySnapshot.forEach((doc) => {
          data = [...data, { id: doc.id, data: doc.data() }];
        });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function fetchMovie(id: string) {
  return new Promise<DocumentData | undefined>((resolve, reject) => {
    try {
      const movieRef = doc(db, "filmovi", id)
      getDoc(movieRef).then(doc => {
        const data = doc.data()
        resolve(data)
      }).catch(err => reject(err))
    } catch (err) {
      reject(err)
    }
  })
}

export { fetchAdminData, fetchMovies, fetchMovie };
