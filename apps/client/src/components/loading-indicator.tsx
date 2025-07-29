import { Progress } from "@heroui/react";
import { useNavigation, useRevalidator } from "react-router";

export default function LoadingIndicator() {
  const navigation = useNavigation();
  const revalidator = useRevalidator();

  const isLoading =
    navigation.state === "loading" || revalidator.state === "loading";

  if (!isLoading) {
    return null;
  }

  return (
    <Progress
      aria-label='Yükleniyor...'
      className='fixed top-0 left-0 z-50 w-full'
      isIndeterminate
      size='sm'
    />
  );
}
