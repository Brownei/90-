import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
    title: '',
    description: '',
};

const History = dynamic(() => import('../../components/transaction-history'));

const HistoryPage = () => {
    return <History />;
};

export default HistoryPage;
