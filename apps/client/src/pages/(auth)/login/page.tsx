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

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      const { data } = await http.post("/auth/login", formData);
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
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
          <h1 className='text-2xl font-bold'>Login</h1>
          <p className='text-muted'>
            Please enter your credentials to continue.
          </p>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              description='Enter your username or email address.'
              isRequired
              label='Username'
              name='username'
            />
            <PasswordInput
              isRequired
              label='Password'
              name='password'
            />
            <div className='flex justify-end'>
              <Link
                href='/forgot-password'
                size='sm'
              >
                Forgot password?
              </Link>
            </div>
            <Button
              color='primary'
              type='submit'
            >
              Login
            </Button>
          </form>
        </CardBody>
        <CardFooter className='flex justify-center'>
          <p className='text-muted text-sm'>
            Don't have an account?{" "}
            <Link
              href='/register'
              size='sm'
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
