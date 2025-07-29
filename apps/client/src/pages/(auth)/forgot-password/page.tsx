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
      const { data } = await http.post("/auth/forgot-password", formData);
      toast.success("Şifre sıfırlama talebiniz başarıyla gönderildi!");
      await sleep(1000);
      navigate("/reset-password?token=" + data.token);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='center container h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Şifremi Unuttum</h1>
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
              name='query'
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
