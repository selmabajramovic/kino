import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

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

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    fetchAdminData()
      .then((res) => setIsAdmin(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Disclosure
      id="navbar"
      as="nav"
      className="flex flex-row absolute inset-x-0 top-0 justify-end content-center"
    >
      <h1>{isAdmin ? "Admin" : "Nije admin"}</h1>
    </Disclosure>
  );
}
