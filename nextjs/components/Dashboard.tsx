import { useSWRConfig } from 'swr';
import { Button, Divider, Input, Loading, Spacer, Toggle, Text } from '@geist-ui/react';
import { Github } from '@geist-ui/react-icons';
import useUser from '../lib/hooks/useUser';
import useForm from '../lib/hooks/useForm';
import { useToasts } from '@geist-ui/react';
import type { UserEntity, UserEntitySession } from '../types/user';

type UserFormProps = {
  user: UserEntity;
  userId: string;
  updateUser: (args: any) => Promise<{ statusCode: number; result: any }>;
};

const defaultFields = {
  firstName: '',
  lastName: '',
  phone: '',
  githubHandle: '',
  settings: {
    theme: 'light',
  },
};

const UserForm: React.FC<UserFormProps> = ({ user, userId, updateUser }: UserFormProps) => {
  const { mutate } = useSWRConfig();
  const [_, setToast] = useToasts();
  const { values, handleInputChange } = useForm<UserEntity>({ ...defaultFields, ...user });

  const submitHandler = async () => {
    const { email } = user as UserEntitySession;
    const { statusCode } = await updateUser({ ...values, userId: email });
    if (statusCode === 200) {
      mutate(`/api/user?id=${userId}`);
      return setToast({
        type: 'success',
        text: `User information was successfully updated!`,
      });
    }
    return setToast({ type: 'error', text: `Issue with updating information` });
  };

  return (
    <>
      <Divider />
      <Spacer />
      <Input name="firstName" value={values.firstName} onChange={handleInputChange} placeholder="John" width="100%">
        First Name
      </Input>
      <Spacer />
      <Input name="lastName" value={values.lastName} onChange={handleInputChange} placeholder="Doe" width="100%">
        Last Name
      </Input>
      <Spacer />
      <Input
        name="githubHandle"
        value={values.githubHandle}
        onChange={handleInputChange}
        icon={<Github />}
        width="100%"
      >
        Github Handle
      </Input>
      <Spacer />
      <Text>Make Profile Public</Text>
      <Toggle html-name="Make Public" />
      <Spacer />
      <Button onClick={submitHandler}>Submit</Button>
    </>
  );
};

export default function Dashboard() {
  const { data: user, isError, isLoading, userId, updateUser } = useUser<UserEntity>();
  if (isLoading) return <Loading>Loading</Loading>;
  if (isError) return <>Error</>;
  return (
    <>
      <>Settings</>
      <UserForm user={user as UserEntity} userId={userId} updateUser={updateUser} />
    </>
  );
}
