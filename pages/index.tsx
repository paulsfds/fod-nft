import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Auction from '../components/Auction';
import NavBar from '../components/NavBar';
import { useAccount, useBalance, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { data: account } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });
  const { data: ensName } = useEnsName({ address: account?.address });
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance();

  return (
    <div>
      <NavBar />
      <Auction />
    </div>
  )
};

export default Home;
