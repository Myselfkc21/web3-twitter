import { useState } from "react";
import { BsCardImage, BsEmojiSmile, BsXCircleFill } from "react-icons/bs";
import { RiFileGifLine, RiBarChartHorizontalFill } from "react-icons/ri";
import { IoMdCalendar } from "react-icons/io";
import { MdOutlineLocationOn } from "react-icons/md";
import { client } from "../../utils/sanity";
import { useTwitterContext } from "../../context/TwitterContext";

const style = {
  wrapper: `px-4 flex flex-row border-b border-[#38444d] pb-4`,
  tweetBoxLeft: `mr-4`,
  tweetBoxRight: `flex-1`,
  profileImage: `height-12 w-12 rounded-full`,
  inputField: `w-full h-full outline-none bg-transparent text-lg`,
  formLowerContainer: `flex`,
  iconsContainer: `text-[#1d9bf0] flex flex-1 items-center`,
  icon: `mr-2 cursor-pointer`,
  submitGeneral: `px-6 py-2 rounded-3xl font-bold`,
  inactiveSubmit: `bg-[#196195] text-[#95999e]`,
  activeSubmit: `bg-[#1d9bf0] text-white`,
  imgPreview: `relative my-2 rounded-2xl overflow-hidden max-h-80`,
  imgPreviewImage: `object-contain max-w-full h-auto`,
  removeImgBtn: `absolute top-1 left-1 text-white bg-[#15181c] rounded-full p-1 cursor-pointer`,
  imageUrlInput: `w-full bg-transparent border border-[#38444d] rounded-md p-2 text-white mb-2`,
  imageInputContainer: `mt-2`,
};

function TweetBox() {
  const { currentAccount, currentUser, fetchTweets } = useTwitterContext();
  const [tweetMessage, setTweetMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const handleImageClick = () => {
    setShowImageInput(!showImageInput);
  };

  const removeImage = () => {
    setImageUrl("");
    setShowImageInput(false);
  };

  const submitTweet = async (e: any) => {
    e.preventDefault();

    if (!tweetMessage && !imageUrl) return;
    
    // Create a unique ID based on timestamp and a random component to prevent collisions
    const tweetId = `${currentAccount}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const tweetDoc = {
      _type: "tweets",
      _id: tweetId,
      tweet: tweetMessage,
      timestamp: new Date(Date.now()).toISOString(),
      image: imageUrl || undefined, // Only include if there's an image
      author: {
        _key: tweetId,
        _ref: currentAccount,
        _type: "reference",
      },
    };

    await client.createIfNotExists(tweetDoc);

    await client
      .patch(currentAccount)
      .setIfMissing({ tweets: [] })
      .insert("after", "tweets[-1]", [
        {
          _key: tweetId,
          _ref: tweetId,
          _type: "reference",
        },
      ])
      .commit();

    await fetchTweets();
    setTweetMessage("");
    setImageUrl("");
    setShowImageInput(false);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.tweetBoxLeft}>
        <img
          src={currentUser.profileImage}
          className={
            currentUser.isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />
      </div>
      <div className={style.tweetBoxRight}>
        <form>
          <textarea
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            className={style.inputField}
          />
          
          {showImageInput && (
            <div className={style.imageInputContainer}>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className={style.imageUrlInput}
              />
            </div>
          )}
          
          {imageUrl && (
            <div className={style.imgPreview}>
              <div className={style.removeImgBtn} onClick={removeImage}>
                <BsXCircleFill size={20} />
              </div>
              <img src={imageUrl} alt="Preview" className={style.imgPreviewImage} />
            </div>
          )}
          
          <div className={style.formLowerContainer}>
            <div className={style.iconsContainer}>
              <BsCardImage 
                className={`${style.icon} ${showImageInput ? 'text-[#1a8cd8]' : ''}`} 
                onClick={handleImageClick} 
              />
              <RiFileGifLine className={style.icon} />
              <RiBarChartHorizontalFill className={style.icon} />
              <BsEmojiSmile className={style.icon} />
              <IoMdCalendar className={style.icon} />
              <MdOutlineLocationOn className={style.icon} />
            </div>
            <button
              type="submit"
              onClick={(e) => submitTweet(e)}
              disabled={!tweetMessage && !imageUrl}
              className={`${style.submitGeneral} ${
                (tweetMessage || imageUrl) ? style.activeSubmit : style.inactiveSubmit
              }`}
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TweetBox;
