import { type MetaFunction, Outlet } from "react-router";
import { Toaster } from "sonner";

import LoadingIndicator from "~/components/loading-indicator";
import ToggleTheme from "~/components/toggle-theme";

import AppProviders from "./provider";

export { ErrorBoundary } from "~/components/error-boundary";

export const meta: MetaFunction = () => {
  return [{ title: "Glow Point" }];
};

export default function Layout() {
  return (
    <AppProviders>
      <LoadingIndicator />
      <Outlet />
      <div className='fixed right-4 bottom-4 z-50'>
        <ToggleTheme />
      </div>
      <Toaster richColors />
    </AppProviders>
  );
}
