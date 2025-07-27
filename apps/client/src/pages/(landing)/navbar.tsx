import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroNavbar,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@heroui/react";
import { Calendar, Heart, Home, LogIn, Search, User } from "lucide-react";
import { useState } from "react";

import Logo from "~/components/logo";
import { useAuth } from "~/hooks/use-auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { href: "/", icon: Home, name: "Ana Sayfa" },
    { href: "/salonlar", icon: Search, name: "Salonlar" },
    { href: "/appointments", icon: Calendar, name: "Randevularım" },
    { href: "/favoriler", icon: Heart, name: "Favoriler" }
  ];

  return (
    <HeroNavbar
      className='border-b border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-md'
      isMenuOpen={isMenuOpen}
      maxWidth='2xl'
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Mobile Menu Toggle */}
      <NavbarContent className='sm:hidden'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className='text-gray-700'
        />
      </NavbarContent>

      {/* Brand */}
      <NavbarContent
        className='pr-3 sm:hidden'
        justify='center'
      >
        <NavbarBrand className='flex items-center gap-2'>
          <Logo className='h-8 w-8' />
          <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent'>
            Glow Point
          </span>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Brand */}
      <NavbarContent
        className='hidden gap-4 sm:flex'
        justify='start'
      >
        <NavbarBrand
          as={Link}
          className='flex items-center gap-3'
          href='/'
        >
          <Logo className='h-10 w-10' />
          <div className='flex flex-col'>
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent'>
              Glow Point
            </span>
            <span className='text-xs text-gray-500'>Güzellik & Bakım</span>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent
        className='hidden gap-4 sm:flex'
        justify='center'
      >
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Link
              className='flex items-center gap-2 text-gray-700 transition-colors duration-300 hover:text-blue-600'
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Desktop Right Side */}
      <NavbarContent
        as='div'
        className='items-center'
        justify='end'
      >
        {user && (
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <Button
                startContent={<User className='h-4 w-4' />}
                variant='solid'
              >
                Hesabım
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Profile Actions'
              variant='flat'
            >
              <DropdownItem
                className='h-14 gap-2'
                key='profile'
                startContent={
                  <Avatar
                    className='h-8 w-8'
                    fallback='U'
                  />
                }
              >
                <p className='font-semibold'>Kullanıcı</p>
                <p className='text-tiny text-gray-500'>{user.email}</p>
              </DropdownItem>
              <DropdownItem
                href='/randevularım'
                key='appointments'
                startContent={<Calendar className='h-4 w-4' />}
              >
                Randevularım
              </DropdownItem>
              <DropdownItem
                href='/favoriler'
                key='favorites'
                startContent={<Heart className='h-4 w-4' />}
              >
                Favorilerim
              </DropdownItem>
              <DropdownItem
                href='/profil'
                key='settings'
                startContent={<User className='h-4 w-4' />}
              >
                Profil Ayarları
              </DropdownItem>
              <DropdownItem
                className='text-danger'
                color='danger'
                key='logout'
                startContent={<LogIn className='h-4 w-4' />}
              >
                Çıkış Yap
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        {!user && (
          <Button
            as={Link}
            href='/login'
            startContent={<LogIn className='h-4 w-4' />}
          >
            Giriş Yap
          </Button>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className='bg-white/95 backdrop-blur-md'>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className='flex w-full items-center gap-3 py-2 text-gray-700 transition-colors duration-300 hover:text-blue-600'
              href={item.href}
              size='lg'
            >
              <item.icon className='h-5 w-5' />
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <div className='mt-4 border-t border-gray-200 pt-4'>
            <div className='flex flex-col gap-2'>
              <Button
                className='w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                href='/profil'
                startContent={<User className='h-4 w-4' />}
              >
                Profil Ayarları
              </Button>
              <Button
                className='w-full justify-start bg-red-500 text-white'
                startContent={<LogIn className='h-4 w-4' />}
                variant='solid'
              >
                Çıkış Yap
              </Button>
            </div>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroNavbar>
  );
}
