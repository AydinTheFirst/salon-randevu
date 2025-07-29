import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link
} from "@heroui/react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import PasswordInput from "~/components/password-input";
import { handleError, http } from "~/lib/http";
import { sleep } from "~/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      await http.patch("/auth/reset-password", formData);
      toast.success("Şifreniz başarıyla sıfırlandı!");
      await sleep(1000);
      navigate("/login");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='center container h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Şifremi Sıfırla</h1>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label='Token'
              name='token'
              value={searchParams.get("token") || ""}
            />

            <PasswordInput
              isRequired
              label='Yeni Şifre'
              name='password'
              placeholder='Yeni şifrenizi girin'
            />

            <Button
              color='primary'
              type='submit'
            >
              Şifre Sıfırla
            </Button>
          </form>
        </CardBody>
        <CardFooter className='flex justify-center'>
          <p className='text-muted text-sm'>
            <Link
              href='/login'
              size='sm'
            >
              Giriş Yap
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
