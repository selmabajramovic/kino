import { useEffect, useState } from "react";
import Movie from "../../components/Movie";
import PageLayout from "../../components/PageLayout";
import Head from "next/head";
import { DocumentData } from "firebase/firestore";
import { fetchMovies } from "../../utils/helperFunctionsClient";
import { motion } from "framer-motion";

export default function Filmovi() {
  const [movieData, setMovieData] = useState<DocumentData | undefined>(
    undefined
  );
  useEffect(() => {
    fetchMovies()
      .then((data) => setMovieData(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <PageLayout>
      <Head>
        <title>Online kino - Svi filmovi</title>
      </Head>
      <motion.div
        id="title"
        key="title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col justify-center content-center space-y-2 mt-8"
      >
        <h1 className="text-white font-semibold mx-auto text-6xl flex overflow-hidden drop-shadow-black mb-16">
          Svi filmovi
        </h1>
      </motion.div>
      <motion.div
        id="filmovi"
        key="filmovi"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-row justify-evenly content-center"
      >
        {movieData !== undefined
          ? // @ts-ignore
            movieData?.map((data, idx) => {
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
    </PageLayout>
  );
}
