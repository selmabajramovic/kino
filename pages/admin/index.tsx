import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchAdminData } from "../../utils/helperFunctionsClient";
import {
  fetchAdmins,
  deleteAdmin,
  createAdmin,
} from "../../utils/admin/adminData";
import PageLayout from "../../components/PageLayout";
import Head from "next/head";
import { Modal } from "../../components/Modal";
import { motion } from "framer-motion";

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
  const [animate, setAnimate] = useState("")
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [adminData, setAdminData] = useState<object[] | undefined>(undefined);
  const [movieData, setMovieData] = useState<object[] | undefined>(undefined);
  const [deleteAdminModal, setDeleteAdminModal] = useState(true)
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
            Dobro došli {currentUser?.displayName}
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
            className={`flex flex-row content-center justify-center mt-4 bg-gradient-pattern w-1/4 rounded-lg p-2 ${animate}`}
            style={{ textShadow: "1px 1px 2px black" }}
            onClick={() => {
                setAnimate("animate-click")
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
            className="flex flex-col mt-4 p-4 bg-silver-chalice-900 bg-opacity-50 rounded-lg"
          >
            {console.log(adminData)}
          </motion.div>
        ) : null}
      </PageLayout>
      <Modal title="Brisanje administratora" isShown={deleteAdminModal} onClose={() => setDeleteAdminModal(false)}>

      </Modal>
    </>
  );
}
