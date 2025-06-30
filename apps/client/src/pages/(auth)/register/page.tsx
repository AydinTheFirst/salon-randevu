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
      toast.success("Kayıt başarılı!");
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
          <h1 className='text-2xl font-bold'>Kayıt Ol</h1>
          <p className='text-muted'>
            Alanları doldurarak yeni bir hesap oluşturun.
          </p>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label='Telefon Numarası'
              name='phone'
            />

            <Input
              isRequired
              label='İsim'
              name='displayName'
            />

            <Input
              isRequired
              label='E-posta Adresi'
              name='email'
              type='email'
            />

            <PasswordInput
              isRequired
              label='Şifre'
              name='password'
            />

            <Button
              color='primary'
              type='submit'
            >
              Kayıt Ol
            </Button>
          </form>
        </CardBody>
        <CardFooter className='flex justify-center'>
          <p className='text-muted text-sm'>
            Hesabınız var mı?{" "}
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
