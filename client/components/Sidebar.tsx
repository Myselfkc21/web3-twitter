import { useState } from "react";
import SidebarOption from "./SidebarOptions";
import { RiHome7Line, RiHome7Fill, RiFileList2Fill } from "react-icons/ri";
import { BiHash } from "react-icons/bi";
import { FiBell, FiMoreHorizontal } from "react-icons/fi";
import { HiOutlineMail, HiMail } from "react-icons/hi";
import { FaRegListAlt, FaHashtag, FaBell } from "react-icons/fa";
import { CgMoreO } from "react-icons/cg";
import { VscTwitter } from "react-icons/vsc";
import Modal from "react-modal";
import { customStyles } from "../utils/constants";
import ProfileImageMinter from "./Profile/mintingModal/ProfileImageMinter";
import {
  BsBookmark,
  BsBookmarkFill,
  BsPerson,
  BsPersonFill,
} from "react-icons/bs";
import { useTwitterContext } from "../context/TwitterContext";

const styles = {
  wrapper: "flex-[0.7] px-8 flex flex-col sticky top-0 h-screen",
  twitterIconContainer: "text-3xl m-4",
  tweetButton:
    "bg-[#1d9bf0] hover:bg-[#1b8cd8] flex items-center justify-center font-bold rounded-3xl h-[50px] mt-[20px] cursor-pointer transition-colors duration-200",
  navContainer: "flex-1",
  profileButton:
    "flex items-center mb-6 cursor-pointer hover:bg-[#333c45] rounded-[100px] p-2 transition-colors duration-200",
  profileLeft: "flex items-center justify-center mr-4",
  profileImage: "h-12 w-12 rounded-full object-cover",
  profileRight: "flex-1 flex",
  details: "flex-1",
  name: "text-lg font-medium",
  handle: "text-[#8899a6] text-sm",
  moreContainer: "flex items-center mr-2",
};

interface SidebarProps {
  initialSelectedIcon: string;
}

function Sidebar({ initialSelectedIcon }: SidebarProps) {
  const { currentAccount, currentUser } = useTwitterContext();
  const [selected, setSelected] = useState<String>(initialSelectedIcon);
  const [mint, setMint] = useState<String>("");

  return (
    <div className={styles.wrapper}>
      <div className={styles.twitterIconContainer}>
        <VscTwitter />
      </div>
      <div className={styles.navContainer}>
        <SidebarOption
          Icon={selected === "Home" ? RiHome7Fill : RiHome7Line}
          text="Home"
          isActive={Boolean(selected === "Home")}
          setSelected={setSelected}
          redirect={"/"}
        />
        <SidebarOption
          Icon={selected === "Explore" ? FaHashtag : BiHash}
          text="Explore"
          isActive={Boolean(selected === "Explore")}
          setSelected={setSelected}
        />
        <SidebarOption
          Icon={selected === "Notifications" ? FaBell : FiBell}
          text="Notifications"
          isActive={Boolean(selected === "Notifications")}
          setSelected={setSelected}
        />
        <SidebarOption
          Icon={selected === "Messages" ? HiMail : HiOutlineMail}
          text="Messages"
          isActive={Boolean(selected === "Messages")}
          setSelected={setSelected}
        />
        <SidebarOption
          Icon={selected === "Bookmarks" ? BsBookmarkFill : BsBookmark}
          text="Bookmarks"
          isActive={Boolean(selected === "Bookmarks")}
          setSelected={setSelected}
        />
        <SidebarOption
          Icon={selected === "Lists" ? RiFileList2Fill : FaRegListAlt}
          text="Lists"
          isActive={Boolean(selected === "Lists")}
          setSelected={setSelected}
        />
        <SidebarOption
          Icon={selected === "Profile" ? BsPersonFill : BsPerson}
          text="Profile"
          isActive={Boolean(selected === "Profile")}
          setSelected={setSelected}
          redirect={"/profile"}
        />
        <SidebarOption Icon={CgMoreO} text="More" />
        <div
          onClick={() => setMint(currentAccount)}
          className={styles.tweetButton}
        >
          Mint
        </div>
      </div>
      <div className={styles.profileButton}>
        <div className={styles.profileLeft}>
          <img
            src={currentUser.profileImage}
            alt="profile"
            className={
              currentUser.isProfileImageNft
                ? `${styles.profileImage} smallHex`
                : styles.profileImage
            }
          />
        </div>
        <div className={styles.profileRight}>
          <div className={styles.details}>
            <div className={styles.name}>{currentUser.name}</div>
            <div className={styles.handle}>
              @{currentAccount.slice(0, 6)}...{currentAccount.slice(39)}
            </div>
          </div>
          <div className={styles.moreContainer}>
            <FiMoreHorizontal />
          </div>
        </div>
      </div>

      <Modal
        isOpen={mint !== ""}
        onRequestClose={() => setMint("")}
        style={customStyles}
      >
        <ProfileImageMinter setMint={setMint} />
      </Modal>
    </div>
  );
}

export default Sidebar;
