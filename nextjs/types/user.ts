export type UserEntity = {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  sub: string;
  githubHandle?: string;
  settings?: {
    theme: 'light' | 'dark';
  };
};

export type UserEntitySession = Pick<UserEntity, 'email' | 'userId'>;
