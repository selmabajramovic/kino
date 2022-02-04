import { Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { useState, useEffect, MouseEventHandler } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebase";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";

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
  handleDelete: MouseEventHandler<SVGElement>
}

export default function Movie({ index, id, data, handleDelete }: IMovieProps) {
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
      key={`movie-${index}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col space-y-4 justify-center content-center"
    >
      <div id="index" className="flex flex-row justify-between content-center">
        <p className="font-bold">{index + 1}.</p>
        <AiOutlineClose
          size="28"
          className="text-[#ff1e56] hover:bg-silver-chalice-700 transition duration-100"
          onClick={handleDelete}
        />
      </div>
      <div
        id="wrapper"
        className="flex flex-row content-center justify-between"
      >
        <div
          id="cover"
          className="flex"
        >
          <img src={coverUrl} alt="cover" className="transform scale-90" />
        </div>
        <div
          id="data"
          className="flex flex-col space-y-4 justify-center content-center"
        >
          <div id="title" className="flex flex-col space-y-1">
            <p className="uppercase">Naziv filma</p>
            <p className="font-normal">{data.title}</p>
          </div>
          <div id="year" className="flex flex-col space-y-1">
            <p className="uppercase">Godina izdanja</p>
            <p className="font-normal">{data.year}</p>
          </div>
          <div id="description" className="flex flex-col space-y-1">
            <p className="uppercase">Kratki opis</p>
            <p className="font-normal">{data.description}</p>
          </div>
        </div>
        <div
          id="info"
          className="flex flex-col space-y-4 justify-center content-center"
        >
          <div id="imdb" className="flex flex-col space-y-1">
            <p className="uppercase">IMDB</p>
            <Link href={data.imdbUrl!}>
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
              width="300px"
              height="200px"
              src={data.trailerUrl!.replace("watch?v=", "embed/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
      <div
        id="movieFile"
        className="flex flex-col justify-center content-center my-auto space-y-1 mx-auto"
      >
        <p className="uppercase">Video datoteka</p>
        <video src={movieUrl} height="400px" width="600px" controls />
      </div>
    </motion.div>
  );
}
