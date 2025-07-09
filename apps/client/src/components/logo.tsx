import { Image, type ImageProps } from "@heroui/react";

export default function Logo(props: ImageProps) {
  const newProps: ImageProps = {
    ...props,
    alt: "Logo",
    src: "/logo.png"
  };

  return <Image {...newProps} />;
}
