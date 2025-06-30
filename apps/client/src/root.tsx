import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import "~/styles/globals.css";

import type { Route } from "./+types/root";

export { ErrorBoundary } from "~/components/error-boundary";
export { HydrateFallback } from "~/components/hydrate-fallback";

export const links: Route.LinksFunction = () => [
  { href: "https://fonts.googleapis.com", rel: "preconnect" },
  {
    crossOrigin: "anonymous",
    href: "https://fonts.gstatic.com",
    rel: "preconnect"
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    rel: "stylesheet"
  }
];

export default function App() {
  return <Outlet />;
}

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <head>
        <meta charSet='utf-8' />
        <meta
          content='width=device-width, initial-scale=1'
          name='viewport'
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
