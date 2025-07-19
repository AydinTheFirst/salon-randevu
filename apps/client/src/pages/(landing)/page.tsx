import { Button, Card, CardBody, Link } from "@heroui/react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Star,
  User,
  Users,
  Zap
} from "lucide-react";

import { useAuth } from "~/hooks/use-auth";
import { UserRole } from "~/types";

export default function Page() {
  const { user } = useAuth();

  const features = [
    {
      description:
        "Favori salonlarınızı bulun ve saniyeler içinde randevu alın. Kolay ve hızlı!",
      icon: Calendar,
      title: "Hızlı Randevu"
    },
    {
      description:
        "Güvenilir salonlar, profesyonel hizmet. Kalite garantisi bizden!",
      icon: Shield,
      title: "Güvenilir Hizmet"
    },
    {
      description: "7/24 müşteri desteği ile her zaman yanınızdayız.",
      icon: Clock,
      title: "7/24 Destek"
    }
  ];

  const stats = [
    { label: "Kayıtlı Salon", value: "500+" },
    { label: "Mutlu Müşteri", value: "50K+" },
    { label: "Şehir", value: "81" },
    { label: "Ortalama Puan", value: "4.9" }
  ];

  return (
    <div className='overflow-hidden'>
      {/* Hero Section */}
      <section className='relative flex min-h-screen items-center justify-center'>
        {/* Background */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'></div>
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        ></div>

        {/* Content */}
        <div className='relative z-10 container mx-auto px-6 text-center text-white'>
          <div className='mx-auto max-w-4xl'>
            {/* Badge */}
            <div className='mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm'>
              <Sparkles className='h-4 w-4 text-yellow-300' />
              <span className='text-sm font-medium'>
                Türkiye'nin #1 Salon Randevu Platformu
              </span>
            </div>

            {/* Main Heading */}
            <h1 className='mb-6 text-5xl leading-tight font-bold md:text-7xl'>
              <span className='block'>Güzellik ve Bakım</span>
              <span className='block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent'>
                Randevularınız
              </span>
              <span className='block'>Artık Çok Kolay!</span>
            </h1>

            <p className='mb-12 text-xl leading-relaxed text-blue-100 md:text-2xl'>
              Şehrinizdeki en iyi güzellik salonları ve berberleri keşfedin.
              Kolayca randevu alın, güzelliğinize güzellik katın!
            </p>

            {/* CTA Buttons */}
            <div className='mb-16 flex flex-col justify-center gap-4 sm:flex-row'>
              {!user ? (
                <>
                  <Button
                    as={Link}
                    className='h-auto bg-white px-8 py-6 text-lg font-semibold text-purple-600 hover:bg-gray-100'
                    href='/salonlar'
                    size='lg'
                    startContent={<Search className='h-5 w-5' />}
                  >
                    Salon Keşfet
                  </Button>
                  <Button
                    as={Link}
                    className='h-auto border-2 border-white bg-transparent px-8 py-6 text-lg font-semibold text-white hover:bg-white hover:text-purple-600'
                    href='/login'
                    size='lg'
                    startContent={<User className='h-5 w-5' />}
                    variant='bordered'
                  >
                    Giriş Yap
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    className='h-auto bg-white px-8 py-6 text-lg font-semibold text-purple-600 hover:bg-gray-100'
                    href='/salonlar'
                    size='lg'
                    startContent={<Calendar className='h-5 w-5' />}
                  >
                    Randevu Al
                  </Button>
                  <Button
                    as={Link}
                    className='h-auto border-2 border-white bg-transparent px-8 py-6 text-lg font-semibold text-white hover:bg-white hover:text-purple-600'
                    href='/dashboard'
                    size='lg'
                    startContent={<Users className='h-5 w-5' />}
                    variant='bordered'
                  >
                    Panele Git
                  </Button>
                  {user?.roles?.includes(UserRole.ADMIN) && (
                    <Button
                      as={Link}
                      className='h-auto bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6 text-lg font-semibold text-white hover:from-orange-600 hover:to-red-600'
                      href='/admin'
                      size='lg'
                      startContent={<Shield className='h-5 w-5' />}
                    >
                      Admin Paneli
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Stats */}
            <div className='mx-auto grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4'>
              {stats.map((stat, index) => (
                <div
                  className='text-center'
                  key={index}
                >
                  <div className='mb-2 text-3xl font-bold text-white md:text-4xl'>
                    {stat.value}
                  </div>
                  <div className='text-sm font-medium text-blue-200'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className='absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-white/10 blur-xl'></div>
        <div className='absolute right-16 bottom-32 h-32 w-32 animate-pulse rounded-full bg-pink-500/20 blur-2xl delay-1000'></div>
        <div className='absolute top-1/2 left-1/4 h-16 w-16 animate-pulse rounded-full bg-yellow-400/20 blur-xl delay-500'></div>
      </section>

      {/* Features Section */}
      <section className='bg-white py-20'>
        <div className='container mx-auto px-6'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-gray-900 md:text-5xl'>
              Neden Salon Randevu?
            </h2>
            <p className='mx-auto max-w-2xl text-xl text-gray-600'>
              Güzellik ve bakım dünyasında yenilikçi çözümlerle hayatınızı
              kolaylaştırıyoruz
            </p>
          </div>

          <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3'>
            {features.map((feature, index) => (
              <Card
                className='group border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'
                key={index}
              >
                <CardBody className='p-8 text-center'>
                  <div className='mb-6 flex justify-center'>
                    <div className='rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 transition-transform duration-300 group-hover:scale-110'>
                      <feature.icon className='h-8 w-8 text-white' />
                    </div>
                  </div>
                  <h3 className='mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600'>
                    {feature.title}
                  </h3>
                  <p className='leading-relaxed text-gray-600'>
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='bg-gradient-to-br from-gray-50 to-blue-50 py-20'>
        <div className='container mx-auto px-6'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-gray-900 md:text-5xl'>
              Nasıl Çalışır?
            </h2>
            <p className='mx-auto max-w-2xl text-xl text-gray-600'>
              3 basit adımda hayalinizdeki randevuya ulaşın
            </p>
          </div>

          <div className='mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3'>
            {[
              {
                description:
                  "Şehrinizdeki salonları keşfedin, yorumları okuyun ve favorilerinizi belirleyin",
                icon: MapPin,
                step: "01",
                title: "Salon Keşfet"
              },
              {
                description:
                  "Uygun tarih ve saati seçin, hizmetinizi belirleyin",
                icon: Calendar,
                step: "02",
                title: "Randevu Seç"
              },
              {
                description:
                  "Randevunuz onaylandı! Güzelliğinize güzellik katma zamanı",
                icon: Zap,
                step: "03",
                title: "Keyfini Çıkar"
              }
            ].map((step, index) => (
              <div
                className='relative text-center'
                key={index}
              >
                <div className='relative mb-8'>
                  <div className='inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-bold text-white shadow-lg'>
                    {step.step}
                  </div>
                  <div className='absolute -top-2 -right-2 rounded-full bg-white p-2 shadow-lg'>
                    <step.icon className='h-6 w-6 text-blue-600' />
                  </div>
                </div>
                <h3 className='mb-4 text-2xl font-bold text-gray-900'>
                  {step.title}
                </h3>
                <p className='leading-relaxed text-gray-600'>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20 text-white'>
        <div className='container mx-auto px-6 text-center'>
          <div className='mx-auto max-w-3xl'>
            <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
              Güzelliğinize Güzellik Katmaya Hazır mısınız?
            </h2>
            <p className='mb-8 text-xl leading-relaxed text-blue-100'>
              Hemen şimdi salonları keşfetmeye başlayın ve hayalinizdeki
              randevuyu alın!
            </p>
            <Button
              as={Link}
              className='h-auto bg-white px-12 py-6 text-lg font-semibold text-purple-600 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl'
              href='/salonlar'
              size='lg'
              startContent={<Star className='h-5 w-5' />}
            >
              Şimdi Başla
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
