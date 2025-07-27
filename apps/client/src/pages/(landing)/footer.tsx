import { Link } from "@heroui/react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter
} from "lucide-react";

import Logo from "~/components/logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white'>
      <div className='container mx-auto px-6 py-12'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand & Description */}
          <div className='lg:col-span-1'>
            <div className='mb-4 flex items-center gap-3'>
              <Logo className='h-8 w-8' />
              <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent'>
                Salon Randevu
              </span>
            </div>
            <p className='mb-6 leading-relaxed text-gray-300'>
              Türkiye'nin en kapsamlı güzellik ve bakım salonu randevu
              platformu. Hayalinizdeki görünüme ulaşmanın en kolay yolu!
            </p>
            <div className='flex space-x-4'>
              <Link
                className='text-gray-400 transition-colors duration-300 hover:text-blue-400'
                href='#'
              >
                <Facebook className='h-5 w-5' />
              </Link>
              <Link
                className='text-gray-400 transition-colors duration-300 hover:text-pink-400'
                href='#'
              >
                <Instagram className='h-5 w-5' />
              </Link>
              <Link
                className='text-gray-400 transition-colors duration-300 hover:text-blue-400'
                href='#'
              >
                <Twitter className='h-5 w-5' />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='mb-4 text-lg font-semibold text-white'>
              Hızlı Linkler
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  className='text-gray-300 transition-colors duration-300 hover:text-white'
                  href='/'
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  className='text-gray-300 transition-colors duration-300 hover:text-white'
                  href='/salonlar'
                >
                  Salonlar
                </Link>
              </li>
              <li>
                <Link
                  className='text-gray-300 transition-colors duration-300 hover:text-white'
                  href='/randevularım'
                >
                  Randevularım
                </Link>
              </li>
              <li>
                <Link
                  className='text-gray-300 transition-colors duration-300 hover:text-white'
                  href='/favoriler'
                >
                  Favorilerim
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='mb-4 text-lg font-semibold text-white'>Hizmetler</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  className='text-gray-300 transition-colors duration-300 hover:text-white'
                  href='#'
                >
                  Kuaför & Berber
                </Link>
              </li>
              <li>
                <Link
                  className='text-gray-300 transition-colors duration-300 hover:text-white'
                  href='#'
                >
                  Güzellik Salonu
                </Link>
              </li>
              <li>
                <Link
                  className='text-gray-300 transition-colors duration-300 hover:text-white'
                  href='#'
                >
                  Spa & Masaj
                </Link>
              </li>
              <li>
                <Link
                  className='text-gray-300 transition-colors duration-300 hover:text-white'
                  href='#'
                >
                  Nail Art
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='mb-4 text-lg font-semibold text-white'>İletişim</h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 text-gray-300'>
                <MapPin className='h-4 w-4 text-blue-400' />
                <span className='text-sm'>İstanbul, Türkiye</span>
              </div>
              <div className='flex items-center gap-3 text-gray-300'>
                <Phone className='h-4 w-4 text-green-400' />
                <span className='text-sm'>+90 (212) 555 0123</span>
              </div>
              <div className='flex items-center gap-3 text-gray-300'>
                <Mail className='h-4 w-4 text-purple-400' />
                <span className='text-sm'>info@salonrandevu.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className='mt-6'>
              <h4 className='mb-2 text-sm font-medium text-white'>Bülten</h4>
              <p className='mb-3 text-xs text-gray-400'>
                Yeni salonlar ve fırsatlardan haberdar olun
              </p>
              <div className='flex gap-2'>
                <input
                  className='flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none'
                  placeholder='E-posta adresiniz'
                  type='email'
                />
                <button className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700'>
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 border-t border-white/10 pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <div className='flex items-center gap-2 text-sm text-gray-400'>
              <span>&copy; {currentYear} Salon Randevu Sistemi.</span>
              <span>Tüm hakları saklıdır.</span>
            </div>

            <div className='dark flex items-center gap-4 text-sm'>
              <Link
                color='foreground'
                href='#'
                size='sm'
              >
                Gizlilik Politikası
              </Link>
              <Link
                color='foreground'
                href='#'
                size='sm'
              >
                Kullanım Şartları
              </Link>
              <Link
                color='foreground'
                href='#'
                size='sm'
              >
                Yardım
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
