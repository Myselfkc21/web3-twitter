import { useEffect, useState } from "react";
import { useTwitterContext } from "../../context/TwitterContext";
import Post from "../Post";

const style = {
  wrapper: `no-scrollbar`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
};

interface Tweet {
  timestamp: string;
  tweet: string;
  _id?: string;
  image?: string;
}

interface Tweets extends Array<Tweet> {}

interface Author {
  name: string;
  profileImage: string;
  walletAddress: string;
  isProfileImageNft: Boolean | undefined;
}

interface UserData {
  name: string;
  profileImage: string;
  coverImage: string;
  walletAddress: string;
  tweets: Array<Tweet>;
  isProfileImageNft: Boolean | undefined;
}

interface ProfileTweetsProps {
  userData?: UserData;
}

const ProfileTweets = ({ userData }: ProfileTweetsProps) => {
  const { currentUser, tweets } = useTwitterContext();
  const [userTweets, setUserTweets] = useState<Tweets>([
    { timestamp: "", tweet: "" },
  ]);
  const [author, setAuthor] = useState<Author>({
    name: "",
    profileImage: "",
    walletAddress: "",
    isProfileImageNft: undefined,
  });

  useEffect(() => {
    if (userData) {
      setUserTweets(userData.tweets);
      setAuthor({
        name: userData.name,
        profileImage: userData.profileImage,
        walletAddress: userData.walletAddress,
        isProfileImageNft: userData.isProfileImageNft,
      });
    } else if (currentUser) {
      setUserTweets(currentUser.tweets);
      setAuthor({
        name: currentUser.name,
        profileImage: currentUser.profileImage,
        walletAddress: currentUser.walletAddress,
        isProfileImageNft: currentUser.isProfileImageNft,
      });
    }
  }, [currentUser, userData]);

  // Find all tweets that belong to the current user from the global tweets array
  const findUserTweetDetails = () => {
    if (!author.walletAddress || !tweets) return {};

    const tweetDetailsMap: any = {};
    tweets.forEach((tweet: any) => {
      if (
        tweet.author.walletAddress.toLowerCase() ===
        author.walletAddress.toLowerCase()
      ) {
        tweetDetailsMap[tweet.tweet] = {
          id: tweet._id,
          image: tweet.image,
        };
      }
    });

    return tweetDetailsMap;
  };

  const tweetDetailsMap = findUserTweetDetails();

  return (
    <div className={style.wrapper}>
      {userTweets?.map((tweet: Tweet, index: number) => {
        const tweetDetails = tweetDetailsMap[tweet.tweet] || {};

        return (
          <Post
            key={index}
            displayName={
              author.name === "Unnamed"
                ? `${author.walletAddress.slice(
                    0,
                    4
                  )}...${author.walletAddress.slice(41)}`
                : author.name
            }
            userName={`${author.walletAddress.slice(
              0,
              4
            )}...${author.walletAddress.slice(41)}`}
            text={tweet.tweet}
            avatar={author.profileImage}
            timestamp={tweet.timestamp}
            isProfileImageNft={author.isProfileImageNft}
            tweetId={tweetDetails.id || tweet._id}
            authorWalletAddress={author.walletAddress}
            image={tweetDetails.image || tweet.image}
          />
        );
      })}
    </div>
  );
};

export default ProfileTweets;
