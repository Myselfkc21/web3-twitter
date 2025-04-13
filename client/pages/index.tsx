import Image from "next/image";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Home/Feed";
import Widgets from "../components/Widgets";
import metamaskLogo from "../assets/metamask.png";
import errorImg from "../assets/error.png";
import { useTwitterContext } from "../context/TwitterContext";

const style = {
  wrapper: `flex justify-center min-h-screen w-full select-none bg-[#15202b] text-white`,
  content: `max-w-[1400px] w-full flex justify-between px-4`,
  loginContainer: `w-full h-screen flex flex-col justify-center items-center gap-8`,
  walletConnectButton: `text-xl text-black bg-white font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-[#d7dbdc] transition-colors duration-200`,
  loginContent: `text-2xl font-bold text-center`,
  imageContainer: `relative w-[200px] h-[200px]`,
  errorImageContainer: `relative w-[250px] h-[200px]`,
  link: `text-[#1d9bf0] hover:underline`
};

const Home = () => {
  const { connectWallet, appStatus } = useTwitterContext();

  const app = (status = appStatus) => {
    switch (status) {
      case "connected":
        return userLoggedIn;
      case "notConnected":
        return noUserFound;
      case "noMetaMask":
        return noMetaMaskFound;
      case "error":
        return error;
      default:
        return loading;
    }
  };

  const userLoggedIn = (
    <div className={style.content}>
      <Sidebar initialSelectedIcon={"Home"} />
      <Feed />
      <Widgets />
    </div>
  );

  const noUserFound = (
    <div className={style.loginContainer}>
      <div className={style.imageContainer}>
        <Image alt="metamask" src={metamaskLogo} fill style={{ objectFit: "contain" }} />
      </div>
      <button
        className={style.walletConnectButton}
        onClick={() => connectWallet()}
      >
        Connect Wallet
      </button>
      <div className={style.loginContent}>Connect to Metamask</div>
    </div>
  );

  const noMetaMaskFound = (
    <div className={style.loginContainer}>
      <div className={style.imageContainer}>
        <Image alt="metamask" src={metamaskLogo} fill style={{ objectFit: "contain" }} />
      </div>
      <div className={style.loginContent}>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://metamask.io/download.html"
          className={style.link}
        >
          You must install Metamask, a virtual Ethereum wallet, in your browser.
        </a>
      </div>
    </div>
  );

  const error = (
    <div className={style.loginContainer}>
      <div className={style.errorImageContainer}>
        <Image alt="error" src={errorImg} fill style={{ objectFit: "contain" }} />
      </div>
      <div className={style.loginContent}>
        An error occurred. Please try again later or from another browser.
      </div>
    </div>
  );

  const loading = (
    <div className={style.loginContainer}>
      <div className={style.loginContent}>Loading...</div>
    </div>
  );

  return <div className={style.wrapper}>{app(appStatus)}</div>;
};

export default Home;
