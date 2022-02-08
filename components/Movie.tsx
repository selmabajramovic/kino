import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { useRouter } from "next/router"

interface IMovieData {
  title: string;
  year: string;
  coverFile: string;
  objectID: string;
}

export default function Movie({
  title,
  year,
  coverFile,
  objectID,
}: IMovieData) {
  const router = useRouter()
  const [coverUrl, setCoverUrl] = useState("");
  useEffect(() => {
    async function fetchData() {
      const cURL = await getDownloadURL(
        ref(storage, `filmovi/${objectID}/${coverFile}`)
      );
      setCoverUrl(cURL);
    }
    fetchData()
  }, [coverFile, objectID]);
  return (
    <div
      id="movie"
      className="flex flex-col space-x-1 p-4 bg-silver-chalice-900 rounded-lg cursor-pointer"
      onClick={() => router.push(`/filmovi/${objectID}`)}
    >
      <div id="img">
        <img src={coverUrl} alt="cover" width="200px" height="400px" />
      </div>
      <div id="description" className="flex flex-col mt-2 space-y-1">
        <p className="uppercase italic font-bold">{title}</p>
        <p className="font-normal">{year}</p>
      </div>
    </div>
  );
}
