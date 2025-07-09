import React from "react";

export default function Footer() {
  return (
    <footer className='bg-gray-200 py-8 text-center text-gray-600 dark:bg-gray-900 dark:text-gray-400'>
      <p>
        &copy; {new Date().getFullYear()} Salon Randevu Sistemi. Tüm Hakları
        Saklıdır.
      </p>
    </footer>
  );
}
