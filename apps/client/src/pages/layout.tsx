import { Outlet } from "react-router";
import { Toaster } from "sonner";

import ToggleTheme from "~/components/toggle-theme";

import AppProviders from "./provider";

export { ErrorBoundary } from "~/components/error-boundary";

export default function Layout() {
  return (
    <AppProviders>
      <Outlet />
      <div className='fixed right-4 bottom-4 z-50'>
        <ToggleTheme />
      </div>
      <Toaster richColors />
    </AppProviders>
  );
}
