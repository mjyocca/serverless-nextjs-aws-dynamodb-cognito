import { useRouter } from 'next/router';
import useSWR from 'swr';

const Profile: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const { id } = query;
  return <>Profile: {id}</>;
};

export default Profile;
