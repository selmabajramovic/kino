import { motion } from "framer-motion";
import { useState, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { BsPower } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md"

interface IIconProps {
  icon: JSX.Element;
  text?: string;
  onClick?: MouseEventHandler;
}

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
  const [bgNav, setBgNav] = useState("");
  useEffect(() => {
    fetchAdminData()
      .then((res) => setIsAdmin(res))
      .catch((err) => console.log(err));
    function onScroll() {
      let done = false;
      if (window.scrollY > 0 && !done) {
        setBgNav("bg-black");
        done = true;
      } else {
        setBgNav("");
        done = false;
      }
    }
    window.addEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.nav
      className={`flex flex-row sticky inset-x-0 top-0 py-4 pr-8 z-20 justify-between content-center transition-colors duration-500 ${bgNav}`}
      transition={{ duration: 1 }}
    >
      <motion.div key="title" className="flex content-center ml-8">
        <motion.h1
          key="title-h1"
          className="my-auto text-white font-semibold text-xl"
        >
          Online kino
        </motion.h1>
      </motion.div>
      <motion.div key="navbar-icons" className="flex flex-row space-x-8">
          {isAdmin ? <SidebarIcon
          text="Upravljačka ploča"
          icon={
            <MdOutlineManageAccounts
              size="40"
              className="bg-gray-900 rounded-full text-white p-1"
            />
          }
        /> : null}
        <SidebarIcon
          text="Odjava"
          icon={
            <BsPower
              size="40"
              className="bg-gray-900 rounded-full text-white p-1"
            />
          }
          onClick={() => {
              sessionStorage.removeItem("currentUser")
              router.reload()
          }}
        />
      </motion.div>
    </motion.nav>
  );
}

function SidebarIcon({ icon, text, onClick }: IIconProps) {
  return (
    <div className="sidebar-icon group" onClick={onClick}>
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
}
