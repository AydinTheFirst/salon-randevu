import type { ComponentType, PropsWithChildren, ReactNode } from "react";

type ProviderComponent = ComponentType<PropsWithChildren>;

export const composeProviders = (...providers: ProviderComponent[]) => {
  return ({ children }: { children: ReactNode }) =>
    providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children);
};
