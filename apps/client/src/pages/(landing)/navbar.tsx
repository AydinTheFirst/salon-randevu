import { Navbar as HeroNavbar, NavbarContent } from "@heroui/react";

import Logo from "~/components/logo";

export default function Navbar() {
  return (
    <HeroNavbar
      className='bg-gray-100 dark:bg-gray-800'
      maxWidth='2xl'
    >
      <NavbarContent>
        <Logo className='h-12 w-12' />
        <span>Salon Randevu Sistemi</span>
      </NavbarContent>
      <NavbarContent justify='end'></NavbarContent>
    </HeroNavbar>
  );
}
