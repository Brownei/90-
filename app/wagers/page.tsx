import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: '',
  description: '',
};

const Wager = dynamic(() => import('../../components/wagers/CreateWagerPage'));

const BookedWager = () => {
  return <Wager />;
};

export default BookedWager;
