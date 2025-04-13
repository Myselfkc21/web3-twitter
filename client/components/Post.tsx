import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { FiShare, FiEdit2, FiTrash2 } from "react-icons/fi";
import { format } from "timeago.js";
import { useState } from "react";
import { useTwitterContext } from "../context/TwitterContext";
import Modal from "react-modal";
import { useRouter } from "next/router";

Modal.setAppElement("#__next");

const style = {
  wrapper: `flex p-3 border-b border-[#38444d]`,
  profileImage: `rounded-full h-[40px] w-[40px] object-cover cursor-pointer`,
  postMain: `flex-1 px-4`,
  headerDetails: `flex items-center`,
  name: `font-bold mr-1 cursor-pointer hover:underline`,
  verified: `text-[0.8rem]`,
  handleAndTimeAgo: `text-[#8899a6] ml-1`,
  handle: `cursor-pointer hover:underline`,
  timeAgo: `text-[#8899a6]`,
  tweet: `my-2`,
  tweetImage: `rounded-2xl max-h-80 object-contain w-full mt-2 border border-[#38444d]`,
  image: `rounded-3xl`,
  footer: `flex justify-between mr-28 mt-4 text-[#8899a6]`,
  footerIcon: `rounded-full text-lg p-2`,
  actionButtons: `flex ml-auto gap-1`,
  actionButton: `text-[#8899a6] hover:text-white cursor-pointer p-1 rounded-full`,
  modalWrapper: `h-[300px] w-[600px] text-white bg-[#15202b] rounded-3xl px-4 py-4`,
  modalHeader: `flex justify-between items-center border-b border-[#38444d] pb-3`,
  modalTitle: `text-xl font-bold`,
  closeButton: `text-[#8899a6] hover:text-white cursor-pointer`,
  inputField: `w-full bg-transparent outline-none text-lg border border-[#38444d] rounded-md p-2 mt-4`,
  saveButton: `bg-[#1d9bf0] text-white px-3 py-2 rounded-full hover:bg-[#1a8cd8] cursor-pointer mt-5 font-bold`,
};

interface PostProps {
  displayName: string;
  userName: string;
  text: string;
  avatar: string;
  timestamp: string;
  isProfileImageNft: Boolean | undefined;
  tweetId?: string;
  authorWalletAddress?: string;
  image?: string;
}

const Post = ({
  displayName,
  userName,
  text,
  avatar,
  timestamp,
  isProfileImageNft,
  tweetId,
  authorWalletAddress,
  image,
}: PostProps) => {
  const [profileImageLink] = useState(avatar);
  const { currentAccount, deleteTweet, editTweet } = useTwitterContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const router = useRouter();

  const isOwner =
    currentAccount?.toLowerCase() === authorWalletAddress?.toLowerCase();

  const handleEdit = async () => {
    if (editText.trim() === "") return;

    const success = await editTweet(tweetId, editText);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteTweet(tweetId);
    if (success) {
      setIsConfirmingDelete(false);
    }
  };

  const navigateToProfile = () => {
    if (authorWalletAddress) {
      router.push(`/profile/${authorWalletAddress}`);
    }
  };

  return (
    <div className={style.wrapper}>
      <div>
        <img
          src={profileImageLink}
          alt={userName}
          className={
            isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
          onClick={navigateToProfile}
        />
      </div>
      <div className={style.postMain}>
        <div>
          <span className={style.headerDetails}>
            <span className={style.name} onClick={navigateToProfile}>
              {displayName}
            </span>
            {isProfileImageNft && (
              <span className={style.verified}>
                <BsFillPatchCheckFill />
              </span>
            )}
            <span className={style.handleAndTimeAgo}>
              <span className={style.handle} onClick={navigateToProfile}>
                @{userName}
              </span>
              <span className={style.timeAgo}>
                {" "}
                • {format(new Date(timestamp).getTime())}
              </span>
            </span>

            {isOwner && (
              <div className={style.actionButtons}>
                <div
                  className={style.actionButton}
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 />
                </div>
                <div
                  className={style.actionButton}
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  <FiTrash2 />
                </div>
              </div>
            )}
          </span>
          <div className={style.tweet}>{text}</div>
          {image && (
            <img src={image} alt="Tweet image" className={style.tweetImage} />
          )}
        </div>
        <div className={style.footer}>
          <div
            className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
          >
            <FaRegComment />
          </div>
          <div
            className={`${style.footerIcon} hover:text-[#03ba7c] hover:bg-[#1b393b]`}
          >
            <FaRetweet />
          </div>
          <div
            className={`${style.footerIcon} hover:text-[#f91c80] hover:bg-[#39243c]`}
          >
            <AiOutlineHeart />
          </div>
          <div
            className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
          >
            <FiShare />
          </div>
        </div>
      </div>

      {/* Edit Tweet Modal */}
      <Modal
        isOpen={isEditing}
        onRequestClose={() => setIsEditing(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(4px)",
          },
          content: {
            border: "none",
            background: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <div className={style.modalWrapper}>
          <div className={style.modalHeader}>
            <h2 className={style.modalTitle}>Edit Tweet</h2>
            <div
              className={style.closeButton}
              onClick={() => setIsEditing(false)}
            >
              ✕
            </div>
          </div>

          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={style.inputField}
            rows={4}
          />

          <button
            className={style.saveButton}
            onClick={handleEdit}
            disabled={!editText.trim()}
          >
            Save
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isConfirmingDelete}
        onRequestClose={() => setIsConfirmingDelete(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(4px)",
          },
          content: {
            border: "none",
            background: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <div className={style.modalWrapper}>
          <div className={style.modalHeader}>
            <h2 className={style.modalTitle}>Delete Tweet</h2>
            <div
              className={style.closeButton}
              onClick={() => setIsConfirmingDelete(false)}
            >
              ✕
            </div>
          </div>

          <p className="mt-4">
            Are you sure you want to delete this tweet? This action cannot be
            undone.
          </p>

          <div className="flex gap-4 mt-6">
            <button
              className="bg-[#38444d] text-white px-4 py-2 rounded-full hover:bg-[#4b5a65]"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[#f4212e] text-white px-4 py-2 rounded-full hover:bg-[#da1f2a]"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Post;
