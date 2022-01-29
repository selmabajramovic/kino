import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signInWithGoogle } from "../utils/firebase";
import { SpinningCircles } from "react-loading-icons";
import { motion, usePresence } from "framer-motion";
import GoogleButton from "react-google-button";
import Head from "next/head";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

interface ILoginProps {
  gifURL?: string;
}

export default function Login({ gifURL }: ILoginProps) {
  const router = useRouter();
  const [login, setLogin] = useState(true);
  const [isPresent, safeToRemove] = usePresence();
  useEffect(() => {
    AOS.init({
      duration: 500,
    });
    if (
      Object.keys(JSON.parse(sessionStorage.getItem("currentUser") || "{}"))
        .length !== 0
    ) {
      router.push("/");
    }
  }, [router]);
  return (
    <motion.div
      layout
      id="login"
      key="loginPage"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-aos="fadeIn"
    >
      <Head>
        <title>Kino - Prijava</title>
      </Head>
      <div id="background" className="login-bg" />
      <motion.div
        id="content"
        key="content"
        className="flex h-screen w-screen content-center justify-evenly"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          layoutId="box"
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={1}
          initial={false}
          id="gif"
          className="flex flex-col my-auto bg-white bg-opacity-50 rounded-lg p-1"
          data-aos="fadeIn"
        >
          <Image
            src={gifURL!}
            alt="gif"
            width={480}
            height={270}
            data-aos="fadeInOut"
            className="rounded-lg"
          />
          <p
            className="italic text-center mt-1 font-semibold"
            style={{ textShadow: "1px 1px 2px white" }}
          >
            Random GIF dana
          </p>
        </motion.div>
        <div
          id="login-credentials"
          className="flex flex-col my-auto py-12 px-10 rounded-lg bg-black bg-opacity-50"
        >
          <h1
            className="font-bold text-3xl text-white text-center"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            Dobro došli u online kino!
          </h1>
          <p
            className="text-center mt-1 text-lg text-white"
            style={{ textShadow: "1px 1px 1px black" }}
          >
            Da nastavite, molimo da se prijavite sa vašim Google računom.
          </p>
          {login ? (
            <motion.div
              key="googleButton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GoogleButton
                type="dark"
                className="mt-20 mx-auto text-center"
                label="Prijavi se sa Google-om"
                data-aos="fadeIn"
                onClick={() => {
                  setLogin(false);
                  signInWithGoogle()
                    .then((result) => {
                      const { user } = result;
                      sessionStorage.setItem(
                        "currentUser",
                        JSON.stringify(user?.providerData[0])
                      );
                      setTimeout(() => {
                        safeToRemove;
                        router.push("/");
                      }, 1000);
                    })
                    .catch(() => setLogin(true));
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SpinningCircles className="mx-auto mt-20" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export async function getServerSideProps() {
  let gifURL: string = "";
  await fetch(
    `https://api.giphy.com/v1/gifs/random?api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}&tag=fail&rating=pg-13`
  )
    .then((data) => data.json())
    .then((data) => {
      gifURL = data.data.images.downsized_medium.url;
    })
    .catch((err) => console.log(err));

  return {
    props: {
      gifURL,
    },
  };
}
