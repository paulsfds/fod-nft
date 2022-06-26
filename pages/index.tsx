import type { NextPage } from 'next';
import Auction from '../components/Auction';
import NavBar from '../components/NavBar';
import { useAccount, useBalance, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { data: account } = useAccount();
  
  return (
    <div>
      <NavBar />
      <Auction />
    </div>
  )
};

export default Home;
