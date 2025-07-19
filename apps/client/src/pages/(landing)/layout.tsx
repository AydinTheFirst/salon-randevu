import { Outlet } from "react-router";

import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout() {
  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
