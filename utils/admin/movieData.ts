import { storage, db } from "../firebase";
import { ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { index as algoliaIndex } from "../algolia";
import lodash from "lodash";

interface MovieData {
  title: string;
  year: number;
  description: string;
  imdbUrl?: string;
  trailerUrl?: string;
  coverFile?: File;
  movieFile?: File;
}

async function uploadMovie(data: MovieData) {
  if (data === null) return;
  try {
    return new Promise<boolean>((resolve, reject) => {
      const {
        title,
        year,
        description,
        imdbUrl,
        trailerUrl,
        coverFile,
        movieFile,
      } = data;
      const regex: RegExp = /[^\\]*\.(\w+)$/;
      const imageExt = coverFile!.name.match(regex)![1];
      const movieExt = movieFile!.name.match(regex)![1];
      const newTitle = lodash.kebabCase(title).toLowerCase();
      const coverFileRef = ref(
        storage,
        `filmovi/${newTitle}/cover.${imageExt}`
      );
      const movieFileRef = ref(
        storage,
        `filmovi/${newTitle}/movie.${movieExt}`
      );
      uploadBytes(coverFileRef, coverFile!)
        .then(() => {
          uploadBytes(movieFileRef, movieFile!)
            .then(() => {
              const newData = {
                title,
                year,
                description,
                imdbUrl,
                trailerUrl,
                coverFile: `cover.${imageExt}`,
                movieFile: `movie.${movieExt}`,
                dateCreated: Timestamp.now(),
              };
              setDoc(doc(db, "filmovi", newTitle), newData)
                .then(() => {
                  const algoliaData = { ...newData, objectID: newTitle };
                  algoliaIndex
                    .saveObject(algoliaData)
                    .then(() => resolve(true))
                    .catch((err) => reject(err));
                    //! TODO: FIX API KEY
                })
                .catch(() => reject(false));
            })
            .catch(() => reject(false));
        })
        .catch(() => reject(false));
    });
  } catch (err) {
    console.log(err);
  }
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

async function deleteMovie(id: string) {
  try {
    await deleteDoc(doc(db, "filmovi", id));
    const listData = await listAll(ref(storage, `filmovi/${id}`));
    let itemsToDelete: string[] = [];
    listData.items.map((data) => itemsToDelete.push(data.name));
    itemsToDelete.forEach(async (item) => {
      await deleteObject(ref(storage, `filmovi/${id}/${item}`));
    });
    await algoliaIndex.deleteObject(id);
  } catch (err) {
    console.log(err);
  }
}

export { uploadMovie, fetchMovies, deleteMovie };
