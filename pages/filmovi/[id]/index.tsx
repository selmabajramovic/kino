import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import PageLayout from "../../../components/PageLayout";
import { DocumentData } from "firebase/firestore";
import { fetchMovie } from "../../../utils/helperFunctionsClient";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../utils/firebase";
import Link from "next/link";

export default function Index() {
  const router = useRouter();
  const { id } = router.query;
  const [movieData, setMovieData] = useState<DocumentData | undefined>(
    undefined
  );
  const [coverUrl, setCoverUrl] = useState("");
  const [movieUrl, setMovieUrl] = useState("");
  useEffect(() => {
    // @ts-ignore
    fetchMovie(id)
      .then((data) => setMovieData(data))
      .catch((err) => console.log(err));
  }, [id]);
  useEffect(() => {
    async function fetchData() {
      const cURL = await getDownloadURL(
        ref(storage, `filmovi/${id}/${movieData!.coverFile}`)
      );
      const mURL = await getDownloadURL(
        ref(storage, `filmovi/${id}/${movieData!.movieFile}`)
      );
      setMovieUrl(mURL);
      setCoverUrl(cURL);
    }
    if (movieData !== undefined) {
      fetchData();
    }
  }, [id, movieData]);
  return (
    <PageLayout>
      <Head>
        {movieData !== undefined ? (
          <title>{`Online kino - ${movieData.title}`}</title>
        ) : null}
      </Head>
      {movieData !== undefined ? (
        <>
          <motion.div
            id="title"
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center content-center space-y-2 mt-8 mb-8"
          >
            <motion.h1
              key="title-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white font-semibold mx-auto text-6xl uppercase flex overflow-hidden drop-shadow-black"
            >
              {movieData!.title}
            </motion.h1>
          </motion.div>
          <motion.div
            id="data"
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col content-center"
          >
            <motion.div
              id="cover-data"
              key="cover-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-row justify-between content-center my-4 space-x-8"
            >
              <div
                id="image"
                className="flex p-2 bg-silver-chalice-900 bg-opacity-50 rounded-lg"
              >
                <img src={coverUrl} alt="cover" width="400px" height="800px" />
              </div>
              <div
                id="description"
                className="flex flex-col space-y-4 justify-center content-center"
              >
                <div id="title" className="flex flex-col space-y-1">
                  <p className="uppercase">Naziv filma</p>
                  <p className="font-normal">{movieData.title}</p>
                </div>
                <div id="year" className="flex flex-col space-y-1">
                  <p className="uppercase">Godina izdanja</p>
                  <p className="font-normal">{movieData.year}</p>
                </div>
                <div id="description" className="flex flex-col space-y-1">
                  <p className="uppercase">Kratki opis</p>
                  <p className="font-normal">{movieData.description}</p>
                </div>
              </div>
              <div
                id="info"
                className="flex flex-col space-y-8 justify-center content-center"
              >
                <div id="imdb" className="flex flex-col space-y-1">
                  <p className="uppercase">IMDB</p>
                  <Link href={movieData.imdbUrl!}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1920px-IMDB_Logo_2016.svg.png"
                      alt="imdb logo"
                      width="75px"
                      height="50px"
                    />
                  </Link>
                </div>
                <div id="youtube" className="flex flex-col space-y-1">
                  <p className="uppercase">Trailer</p>
                  <iframe
                    width="600px"
                    height="300px"
                    src={movieData.trailerUrl!.replace("watch?v=", "embed/")}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>
            <div
              id="movieFile"
              className="flex flex-col justify-center content-center my-16 space-y-1 mx-auto"
            >
              <p className="uppercase mb-4">Video datoteka</p>
              <video src={movieUrl} height="800px" width="1200px" controls />
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          id="title"
          key="title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col justify-center content-center space-y-2 mt-8"
        >
          <h1 className="text-white font-semibold mx-auto text-6xl flex overflow-hidden drop-shadow-black">
            Film koji ste izabrali ne postoji!
          </h1>
        </motion.div>
      )}
    </PageLayout>
  );
}
