import { SyntheticEvent, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { fetchAdminData } from "../../utils/helperFunctionsClient";
import {
  fetchAdmins,
  deleteAdmin,
  createAdmin,
} from "../../utils/admin/adminData";
import {
  fetchMovies,
  deleteMovie,
  uploadMovie,
} from "../../utils/admin/movieData";
import PageLayout from "../../components/PageLayout";
import Head from "next/head";
import { Modal, ModalBody, ModalFooter } from "../../components/Modal";
import { motion } from "framer-motion";
import User from "../../components/admin/User";
import Movie from "../../components/admin/Movie";

interface IUser {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  providerId?: string;
  uid?: string;
}

export default function Index() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const emailFormRef = useRef<HTMLDivElement | null>(null);
  const [animate, setAnimate] = useState("");
  const [animateMovie, setAnimateMovie] = useState("");
  const [idToDelete, setIdToDelete] = useState("");
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [adminData, setAdminData] = useState<object[] | undefined>(undefined);
  const [movieData, setMovieData] = useState<object[] | undefined>(undefined);
  const [deleteAdminModal, setDeleteAdminModal] = useState(false);
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [disabledAddAdmin, setDisabledAddAdmin] = useState(false);
  const [disabledRemoveAdmin, setDisabledRemoveAdmin] = useState(false);
  const [addMovieModal, setAddMovieModal] = useState(false);
  function showDeleteModalWithId(id: string) {
    setIdToDelete(id);
    setDeleteAdminModal(true);
  }
  async function handleAdminSubmit(event: SyntheticEvent) {
    event.preventDefault();
    // @ts-ignore
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd);
    const { email } = data;
    const realEmail = email as string;
    if (realEmail === "") {
      emailInputRef!.current!.className = `${
        emailInputRef!.current!.className
      } border-2 border-red-600`;
      if (document.getElementById("error-message") === null) {
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "E-mail adresa ne može biti prazna!";
        errorMessage.className = "text-red-600 mt-1 drop-shadow-black-sm";
        errorMessage.id = "error-message";
        emailFormRef!.current!.append(errorMessage);
      } else {
        document.getElementById("error-message")!.innerText =
          "E-mail adresa ne može biti prazna!";
      }
      return;
    }
    const emailRegex = /^[a-zA-Z0-9.\_]+\@+[a-zA-Z0-9\-]+\.+[a-z]+/;
    // @ts-ignore
    if (!realEmail.match(emailRegex)) {
      if (document.getElementById("error-message") !== null) {
        document.getElementById("error-message")!.innerText =
          "Unesite validnu E-mail adresu!";
      } else {
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Unesite validnu E-mail adresu!";
        errorMessage.className = "text-red-600 mt-1 drop-shadow-black-sm";
        errorMessage.id = "error-message";
        emailInputRef!.current!.className = `${
          emailInputRef!.current!.className
        } border-2 border-red-600`;
        emailFormRef!.current!.append(errorMessage);
      }
      return;
    }
    if (document.getElementById("error-message") !== null) {
      document.getElementById("error-message")?.remove();
      emailInputRef!.current!.className = "text-input";
    }
    setDisabledAddAdmin(true);
    createAdmin(realEmail)
      .then(() => router.reload())
      .catch((err) => console.log(err));
  }
  async function handleMovieSubmit(event: SyntheticEvent) {
    event.preventDefault();
    // @ts-ignore
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd);
  }
  useEffect(() => {
    fetchAdminData()
      .then((res) => {
        if (!res) {
          router.push("/");
        }
      })
      .catch(() => router.push("/"));
    setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser") || "{}"));
    fetchAdmins()
      .then((data) => setAdminData(data))
      .catch((err) => console.log(err));
    fetchMovies()
      .then((data) => setMovieData(data))
      .catch((err) => console.log(err));
  }, [router]);
  return (
    <>
      <PageLayout id="admin">
        <Head>
          <title>Kino - Upravljačka ploča</title>
        </Head>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="info"
          id="info"
          className="flex flex-col space-y-2 p-4 bg-silver-chalice-900 bg-opacity-50 rounded-lg"
        >
          <h1>Upravljačka ploča</h1>
          <p className="text-md font-normal">
            Dobro došli {currentUser?.displayName} ({currentUser?.email})
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          key="admins"
          id="admins"
          className="flex flex-col mt-10 p-4 bg-silver-chalice-900 bg-opacity-50 rounded-lg"
        >
          <h1>Upravljanje administratorima</h1>
          <button
            className={`add-button mt-4 ${animate}`}
            style={{ textShadow: "1px 1px 2px black" }}
            onClick={() => {
              setAnimate("animate-click");
              setAddAdminModal(true);
            }}
            onAnimationEnd={() => setAnimate("")}
          >
            Dodaj administratora
          </button>
        </motion.div>
        {adminData !== undefined ? (
          <motion.div
            id="admin-data"
            key="admin-data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col mt-4 p-4 bg-silver-chalice-900 bg-opacity-50 rounded-lg space-y-4"
          >
            {adminData?.map((data, idx) => {
              return (
                <User
                  //@ts-ignore
                  id={data.id}
                  //@ts-ignore
                  data={data.data}
                  key={idx}
                  index={idx}
                  //@ts-ignore
                  modal={() => showDeleteModalWithId(data.id)}
                />
              );
            })}
          </motion.div>
        ) : null}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          key="movies"
          id="movies"
          className="flex flex-col mt-10 p-4 bg-silver-chalice-900 bg-opacity-50 rounded-lg"
        >
          <h1>Upravljanje filmovima</h1>
          <button
            className={`add-button mt-4 ${animateMovie}`}
            style={{ textShadow: "1px 1px 2px black" }}
            onClick={() => {
              setAnimateMovie("animate-click");
              setAddMovieModal(true);
            }}
            onAnimationEnd={() => setAnimateMovie("")}
          >
            Dodaj film
          </button>
        </motion.div>
        <motion.div
          id="movie-data"
          key="movie-data"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col mt-4 mb-8 p-4 bg-silver-chalice-900 bg-opacity-50 rounded-lg space-y-4"
        >
          {movieData !== undefined ? (
            movieData!.length === 0 ? (
              <p>Trenutno nema filmova!</p>
            ) : (
              movieData!.map((data, idx) => {
                return (
                  // @ts-ignore
                  <Movie id={data.id} data={data.data} index={idx} key={idx} />
                );
              })
            )
          ) : null}
        </motion.div>
      </PageLayout>
      <Modal
        title="Brisanje administratora"
        isShown={deleteAdminModal}
        onClose={() => setDeleteAdminModal(false)}
      >
        <ModalBody>
          <p>Da li ste sigurni da želite izbrisati administratora?</p>
        </ModalBody>
        <ModalFooter>
          <button
            className="danger-button"
            style={{ textShadow: "1px 1px 2px black" }}
            onClick={() => {
              setDisabledRemoveAdmin(true);
              deleteAdmin(idToDelete)
                .then(() => router.reload())
                .catch((err) => console.log(err));
            }}
            disabled={disabledRemoveAdmin}
          >
            Izbriši
          </button>
          <button
            className="neutral-button"
            style={{ textShadow: "1px 1px 2px black" }}
            onClick={() => setDeleteAdminModal(false)}
            disabled={disabledRemoveAdmin}
          >
            Nazad
          </button>
        </ModalFooter>
      </Modal>
      <Modal
        title="Dodaj administratora"
        isShown={addAdminModal}
        onClose={() => setAddAdminModal(false)}
      >
        <form onSubmit={handleAdminSubmit}>
          <ModalBody>
            <div id="holder" className="flex flex-col" ref={emailFormRef}>
              <label htmlFor="email">E-mail adresa</label>
              <input
                required
                name="email"
                className="text-input"
                placeholder="ime.prezime@adresa.domena"
                id="email"
                type="email"
                ref={emailInputRef}
                disabled={disabledAddAdmin}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="add-button"
              style={{ textShadow: "1px 1px 2px black" }}
              type="submit"
              disabled={disabledAddAdmin}
            >
              Dodaj
            </button>
            <button
              className="neutral-button"
              style={{ textShadow: "1px 1px 2px black" }}
              onClick={() => setAddAdminModal(false)}
              disabled={disabledAddAdmin}
            >
              Nazad
            </button>
          </ModalFooter>
        </form>
      </Modal>
      <Modal
        isShown={addMovieModal}
        title="Dodaj film"
        onClose={() => setAddMovieModal(false)}
      >
        <form onSubmit={handleMovieSubmit}>
          <ModalBody>
            <div id="holder" className="flex flex-col space-y-4">
              <div id="title" className="flex flex-col">
                <label htmlFor="title">Naslov filma</label>
                <input
                  required
                  type="text"
                  name="title"
                  id="title"
                  className="text-input"
                  placeholder="Mission Impossible"
                />
              </div>
              <div id="description" className="flex flex-col">
                <label htmlFor="description">Opis filma</label>
                <textarea
                  rows={4}
                  required
                  spellCheck="false"
                  style={{ resize: "vertical", height: "auto" }}
                  name="description"
                  id="description"
                  className="text-input"
                  placeholder="Kratki opis filma"
                />
              </div>
              {/* Add other things */}
            </div>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
