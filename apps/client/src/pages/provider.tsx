import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useHref, useNavigate } from "react-router";
import { SWRConfig } from "swr";

import { composeProviders } from "~/lib/compose-providers";
import { fetcher, handleError } from "~/lib/http";

const AppProviders = composeProviders(
  (props) => {
    const navigate = useNavigate();
    return (
      <HeroUIProvider
        navigate={navigate}
        useHref={useHref}
        validationBehavior='native'
      >
        {props.children}
      </HeroUIProvider>
    );
  },
  (props) => (
    <NextThemesProvider
      {...props}
      attribute='class'
      defaultTheme='light'
    />
  ),
  (props) => (
    <SWRConfig
      {...props}
      value={{
        fetcher,
        onError: handleError
      }}
    />
  )
);

export default AppProviders;
