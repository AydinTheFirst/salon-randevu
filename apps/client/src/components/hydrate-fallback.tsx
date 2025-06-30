import { Spinner } from "@heroui/react";

export function HydrateFallback() {
  return (
    <div className='center h-screen'>
      <Spinner size='lg' />
    </div>
  );
}
