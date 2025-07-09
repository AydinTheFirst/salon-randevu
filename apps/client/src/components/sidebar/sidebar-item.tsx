import { Button, type ButtonProps } from "@heroui/react";

export default function SidebarItem(props: ButtonProps) {
  return (
    <Button
      className='justify-start font-semibold'
      fullWidth
      variant='light'
      {...props}
    />
  );
}
