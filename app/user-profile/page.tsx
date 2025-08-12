import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
    title: '',
    description: '',
};

const Profile = dynamic(() => import('../../components/user-profile/profile'));

const ProfilePage = () => {
    return <Profile />;
};

export default ProfilePage;
