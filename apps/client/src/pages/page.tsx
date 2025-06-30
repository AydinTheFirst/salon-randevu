import { Button } from "@heroui/react";
import useSWR from "swr";

import ToggleTheme from "~/components/toggle-theme";

export default function Page() {
  const { data: user } = useSWR("/auth/@me");

  return (
    <div>
      HElloWorld
      <Button>Hello World</Button>
      <ToggleTheme />
      {JSON.stringify(user, null, 2)}
    </div>
  );
}
