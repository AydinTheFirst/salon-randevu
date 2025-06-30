import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link
} from "@heroui/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import PasswordInput from "~/components/password-input";
import { handleError, http } from "~/lib/http";
import { sleep } from "~/lib/utils";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      await http.post("/auth/register", formData);
      toast.success("Register successful!");
      await sleep(1000);
      navigate("/");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='center container h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Register</h1>
          <p className='text-muted'>
            Please fill in the details to create a new account.
          </p>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label='Username'
              name='username'
            />

            <Input
              isRequired
              label='Display Name'
              name='displayName'
            />

            <Input
              isRequired
              label='Email'
              name='email'
              type='email'
            />

            <PasswordInput
              isRequired
              label='Password'
              name='password'
            />

            <Button
              color='primary'
              type='submit'
            >
              Register
            </Button>
          </form>
        </CardBody>
        <CardFooter className='flex justify-center'>
          <p className='text-muted text-sm'>
            Already have an account?{" "}
            <Link
              href='/login'
              size='sm'
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
