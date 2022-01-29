import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Head from "next/head";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    try {
      if (
        Object.keys(JSON.parse(sessionStorage.getItem("currentUser") || "{}"))
          .length === 0
      ) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, [router]);

  return (
    <motion.div
      key="check"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {loading ? (
        <motion.div
          key="bg"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          id="bg"
          className="login-bg"
        />
      ) : (
        <Content />
      )}
    </motion.div>
  );
}

function Content() {
  return (
    <motion.div
      id="home"
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      <Navbar />
      <Head>
        <title>Kino - Početna</title>
      </Head>
      <div id="bg" className="login-bg filter brightness-[25%]" />
      <div id="content" className="flex flex-col relative mt-1 overflow-auto z-[5]">
          
      </div>
    </motion.div>
  );
}
