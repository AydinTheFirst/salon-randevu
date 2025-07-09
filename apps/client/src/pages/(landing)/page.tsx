import { Button, Link } from "@heroui/react";

import { useAuth } from "~/hooks/use-auth";
import { UserRole } from "~/types";

export default function Page() {
  const { user } = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className='relative flex h-[calc(100vh-64px)] items-center justify-center bg-cover bg-center text-center'
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1557683316-973673baf923?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      >
        <div className='absolute inset-0 bg-black opacity-60'></div>
        <div className='relative z-10 mx-auto max-w-4xl p-8'>
          <h1 className='mb-4 text-5xl leading-tight font-extrabold text-white md:text-7xl'>
            Salon Randevu Sistemi
          </h1>
          <p className='mb-8 text-xl text-gray-200 md:text-2xl'>
            Güzellik ve bakım randevularınızı kolayca yönetin.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            {!user ? (
              <>
                <Button
                  as={Link}
                  color='primary'
                  href='/login'
                  size='lg'
                >
                  Giriş Yap
                </Button>
                <Button
                  as={Link}
                  color='secondary'
                  href='/register'
                  size='lg'
                >
                  Kayıt Ol
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  color='primary'
                  href='/dashboard'
                  size='lg'
                >
                  Panele Git
                </Button>
                {user?.roles?.includes(UserRole.ADMIN) && (
                  <Button
                    as={Link}
                    color='secondary'
                    href='/admin'
                    size='lg'
                  >
                    Admin Paneli
                  </Button>
                )}
                <Button
                  as={Link}
                  color='primary'
                  href='/appointment'
                  size='lg'
                >
                  Randevu Al
                </Button>

                <Button
                  color='danger'
                  onPress={handleLogout}
                  size='lg'
                >
                  Çıkış Yap
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-white px-8 py-20 dark:bg-gray-800'>
        <h2 className='mb-12 text-center text-4xl font-bold'>Özellikler</h2>
        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3'>
          <div className='text-center'>
            <h3 className='mb-4 text-2xl font-semibold'>Kolay Randevu</h3>
            <p className='text-gray-700 dark:text-gray-300'>
              Müşterileriniz saniyeler içinde randevu oluşturabilir.
            </p>
          </div>
          <div className='text-center'>
            <h3 className='mb-4 text-2xl font-semibold'>Yönetim Paneli</h3>
            <p className='text-gray-700 dark:text-gray-300'>
              Randevularınızı ve müşterilerinizi kolayca yönetin.
            </p>
          </div>
          <div className='text-center'>
            <h3 className='mb-4 text-2xl font-semibold'>Esnek Entegrasyon</h3>
            <p className='text-gray-700 dark:text-gray-300'>
              Mevcut sistemlerinize kolayca entegre edin.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
