import { Button, Card, CardBody, Image, Link } from "@heroui/react";

import type { Business } from "~/types";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card>
      <CardBody className='grid place-items-center gap-5'>
        <Image
          className='h-56'
          src='https://placehold.co/600x400'
        />
        <h2 className='text-xl font-semibold'>{business.name}</h2>
        <span className='text-muted'>
          {business.district} / {business.city}
        </span>
        <Button
          as={Link}
          color='primary'
          fullWidth
          href={`/salonlar/${business.id}`}
        >
          Detayları Gör
        </Button>
      </CardBody>
    </Card>
  );
}
