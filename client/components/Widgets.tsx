import { news, whoToFollow } from "../utils/static";
import { BiSearch } from "react-icons/bi";
import { useState } from "react";

const style = {
  wrapper: `flex-[1] p-4 sticky top-0 h-screen overflow-y-auto`,
  searchBar: `flex items-center bg-[#243340] p-2 rounded-3xl mb-4 sticky top-0 z-10`,
  searchIcon: `text-[#8899a6] mr-2 text-xl`,
  inputBox: `bg-transparent outline-none w-full text-white placeholder-[#8899a6]`,
  section: `bg-[#192734] my-6 rounded-xl overflow-hidden`,
  title: `p-3 font-bold text-lg text-white`,
  showMore: `p-3 text-[#1d9bf0] text-sm cursor-pointer hover:bg-[#22303c] transition-colors duration-200`,
  item: `flex items-center p-3 my-2 hover:bg-[#22303c] cursor-pointer transition-colors duration-200`,
  newsItemLeft: `flex-1`,
  newsItemCategory: `text-[#8899a6] text-xs font-semibold`,
  newsItemTitle: `text-sm font-bold text-white`,
  newsItemRight: `w-1/5 ml-3`,
  newsItemImage: `rounded-xl h-14 w-14 object-cover`,
  followAvatarContainer: `w-1/6`,
  followAvatar: `rounded-full h-[40px] w-[40px] object-cover`,
  profileDetails: `flex-1`,
  name: `font-bold text-white`,
  handle: `text-[#8899a6] text-sm`,
  followButton: `bg-white text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors duration-200`,
};

function Widgets() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.searchBar}>
        <BiSearch className={style.searchIcon} />
        <input
          placeholder="Search Twitter"
          type="text"
          className={style.inputBox}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className={style.section}>
        <div className={style.title}>What&apos;s happening</div>
        {news.map((item, index) => (
          <div key={index} className={style.item}>
            <div className={style.newsItemLeft}>
              <div className={style.newsItemCategory}>{item.category}</div>
              <div className={style.newsItemTitle}>{item.title}</div>
            </div>
            <div className={style.newsItemRight}>
              <img
                src={item.image}
                alt={item.category}
                className={style.newsItemImage}
                loading="lazy"
              />
            </div>
          </div>
        ))}
        <div className={style.showMore}>Show more</div>
      </div>
      <div className={style.section}>
        <div className={style.title}>Who to follow</div>
        {whoToFollow.map((item, index) => (
          <div key={index} className={style.item}>
            <div className={style.followAvatarContainer}>
              <img
                src={item.avatar}
                alt={item.handle}
                className={style.followAvatar}
                loading="lazy"
              />
            </div>
            <div className={style.profileDetails}>
              <div className={style.name}>{item.name}</div>
              <div className={style.handle}>{item.handle}</div>
            </div>
            <div className={style.followButton}>Follow</div>
          </div>
        ))}
        <div className={style.showMore}>Show more</div>
      </div>
    </div>
  );
}

export default Widgets;
