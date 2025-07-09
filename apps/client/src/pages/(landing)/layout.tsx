import React from "react";
import { Outlet } from "react-router";

import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
