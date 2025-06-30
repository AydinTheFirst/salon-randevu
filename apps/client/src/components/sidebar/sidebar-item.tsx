import { Button, type ButtonProps, Link } from "@heroui/react";

export default function SidebarItem(props: ButtonProps) {
  return (
    <Button
      as={Link}
      className='justify-start font-semibold'
      fullWidth
      href='/dashboard'
      variant='light'
      {...props}
    />
  );
}
