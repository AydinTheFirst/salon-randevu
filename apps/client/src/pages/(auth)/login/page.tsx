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
      const { data } = await http.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);

      toast.success("Giriş başarılı!");
      await sleep(1000);
      navigate(searchParams.get("redirect") || "/");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='center container h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Giriş Yap</h1>
          <p className='text-muted'>Lütfen hesabınıza giriş yapın.</p>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              description='E-mail adresinizi veya telefon numaranızı girin.'
              isRequired
              label='Kullanıcı Adı'
              name='username'
            />

            <PasswordInput
              isRequired
              label='Şifre'
              name='password'
            />

            <div className='flex justify-end'>
              <Link
                href='/forgot-password'
                size='sm'
              >
                Şifremi Unuttum?
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
            Hesabınız yok mu?{" "}
            <Link
              href='/register'
              size='sm'
            >
              Kayıt Ol
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
