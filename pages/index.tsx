import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { fetchMovies } from "../utils/helperFunctionsClient";
import PageLayout from "../components/PageLayout";
import Head from "next/head";
import { DocumentData } from "firebase/firestore";
import Movie from "../components/Movie";

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
        <>
          <Head>
            <title>Učitavanje...</title>
          </Head>
          <motion.div
            key="bg"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            id="bg"
            className="login-bg"
          />
        </>
      ) : (
        <Content />
      )}
    </motion.div>
  );
}

function Content() {
  const [movieData, setMovieData] = useState<DocumentData | undefined>(
    undefined
  );
  useEffect(() => {
    fetchMovies()
      .then((data) => setMovieData(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <PageLayout id="home">
      <Head>
        <title>Online kino - Početna</title>
      </Head>
      <motion.div
        id="title"
        key="title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col justify-center content-center space-y-2 mt-8"
      >
        <h1 className="text-white font-semibold mx-auto text-6xl flex overflow-hidden drop-shadow-black">
          Dobro došli u online kino!
        </h1>
        <p className="text-white mx-auto text-2xl flex overflow-hidden drop-shadow-black-sm">
          Uživajte u raznim filmovima!
        </p>
      </motion.div>
      <motion.div
        id="latest"
        key="latest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col mt-32"
      >
        <p className="uppercase text-white text-xl drop-shadow-black-sm mb-16">
          Najnoviji filmovi
        </p>
        <motion.div
          id="filmovi"
          key="filmovi"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-row justify-evenly content-center"
        >
          {movieData !== undefined
          // @ts-ignore
            ? movieData?.map((data, idx) => {
                return (
                  <Movie
                    key={idx}
                    title={data.data.title}
                    year={data.data.year}
                    coverFile={data.data.coverFile}
                    objectID={data.id}
                  />
                );
              })
            : null}
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
