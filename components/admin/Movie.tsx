import { Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebase";

interface IDataProps {
  title: string;
  year: number;
  description: string;
  imdbUrl?: string;
  trailerUrl?: string;
  coverFile: string;
  movieFile: string;
  dateCreated: Timestamp;
}

interface IMovieProps {
  id: string;
  data: IDataProps;
  index: number;
}

export default function Movie({ index, id, data }: IMovieProps) {
  const [movieUrl, setMovieUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  useEffect(() => {
    async function fetch() {
      try {
        const cURL = await getDownloadURL(
          ref(storage, `filmovi/${id}/${data?.coverFile}`)
        );
        const mURL = await getDownloadURL(
          ref(storage, `filmovi/${id}/${data?.movieFile}`)
        );
        setCoverUrl(cURL);
        setMovieUrl(mURL);
      } catch (err) {
        console.log(err);
      }
    }
    fetch();
  }, [id, data?.movieFile, data?.coverFile]);
  return (
    <motion.div
      id="movie"
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row"
    >
      <h1>{data.movieFile}</h1>
    </motion.div>
  );
}
