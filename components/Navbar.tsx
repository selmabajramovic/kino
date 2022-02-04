import { motion } from "framer-motion";
import { useState, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/router";
import { fetchAdminData } from "../utils/helperFunctionsClient";
import { BsPower } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import algoliasearch from "algoliasearch";
import { InstantSearch, Hits, connectSearchBox } from "react-instantsearch-dom";

interface IIconProps {
  icon: JSX.Element;
  text?: string;
  onClick?: MouseEventHandler;
}

interface ISearchProps {
  currentRefinement: string;
  isSearchStalle: boolean;
  refine: Function;
}

function SearchBar({
  currentRefinement,
  isSearchStalle,
  refine,
}: ISearchProps) {
  return (
    <div id="search" className="flex flex-row">
      <input
        className="text-input"
        type="search"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
      />
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPage, setAdminPage] = useState(false);
  const [bgNav, setBgNav] = useState("");
  const searchClient = algoliasearch(
    "WWQWXD8XG2",
    process.env!.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
  );
  // @ts-ignore
  const ConnectedSearchBar = connectSearchBox(SearchBar);
  useEffect(() => {
    fetchAdminData()
      .then((res) => setIsAdmin(res))
      .catch((err) => console.log(err));
    const regex = /^\/(?:admin)/;
    if (router.pathname.match(regex)) {
      setAdminPage(true);
    }
    function onScroll() {
      let done = false;
      if (window.scrollY > 0 && !done) {
        setBgNav("bg-silver-chalice-900");
        done = true;
      } else {
        setBgNav("");
        done = false;
      }
    }
    window.addEventListener("scroll", onScroll);
  }, [router.pathname]);
  return (
    <motion.nav
      className={`flex flex-row sticky inset-x-0 top-0 py-4 pr-8 z-20 justify-between content-center transition-colors duration-500 ${bgNav}`}
      transition={{ duration: 1 }}
    >
      <motion.div key="title" className="flex content-center ml-8">
        <motion.h1
          key="title-h1"
          className="my-auto text-white font-semibold text-xl"
        >
          Online kino
        </motion.h1>
      </motion.div>
      <motion.div
        key="search-bar"
        id="search-bar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col justify-center content-center"
      >
        <InstantSearch searchClient={searchClient} indexName="Filmovi">
          <ConnectedSearchBar />
        </InstantSearch>
      </motion.div>
      <motion.div key="navbar-icons" className="flex flex-row space-x-8">
        {adminPage ? (
          <SidebarIcon
            text="Nazad"
            icon={
              <BiArrowBack
                size="40"
                className="bg-gradient-pattern bg-[length:150%_100%] rounded-full text-white p-1"
              />
            }
            onClick={() => router.push("/")}
          />
        ) : null}
        {isAdmin ? (
          <SidebarIcon
            text="Upravljačka ploča"
            icon={
              <MdOutlineManageAccounts
                size="40"
                className="bg-gradient-pattern bg-[length:200%_200%] rounded-full text-white p-1"
              />
            }
            onClick={() => router.push("/admin")}
          />
        ) : null}
        <SidebarIcon
          text="Odjava"
          icon={
            <BsPower
              size="40"
              className="bg-gradient-pattern rounded-full text-white p-1"
            />
          }
          onClick={() => {
            sessionStorage.removeItem("currentUser");
            router.reload();
          }}
        />
      </motion.div>
    </motion.nav>
  );
}

function SidebarIcon({ icon, text, onClick }: IIconProps) {
  return (
    <div className="sidebar-icon group" onClick={onClick}>
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
}
