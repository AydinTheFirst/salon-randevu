import { Button, Link } from "@heroui/react";
import useSWR from "swr";

import type { User } from "~/types";

export default function Page() {
  const { data: user } = useSWR<User>("/auth/@me", {
    onError: undefined
  });

  const handleLogout = async () => {
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <div className='grid h-screen place-items-center'>
      <div
        className='grid gap-3 text-center'
        hidden={!!user}
      >
        <h1 className='text-2xl font-bold'>Welcome to the App!</h1>
        <p className='text-gray-600'>Please log in to continue.</p>
        <div className='flex gap-3'>
          <Button
            as={Link}
            color='primary'
            fullWidth
            href='/login'
          >
            Log In
          </Button>
          <Button
            as={Link}
            color='secondary'
            fullWidth
            href='/register'
          >
            Register
          </Button>
        </div>
      </div>

      <div
        className='grid gap-3 text-center'
        hidden={!user}
      >
        <h1 className='text-2xl font-bold'>
          Welcome, {user?.profile?.displayName}!
        </h1>
        <p className='text-gray-600'>You are logged in as {user?.email}.</p>
        <Button
          as={Link}
          color='primary'
          href='/admin'
        >
          Go to Admin Panel
        </Button>
        <Button
          color='danger'
          onPress={handleLogout}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}
