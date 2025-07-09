import { Card, CardBody } from "@heroui/react";

import type { Business } from "~/types";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card>
      <CardBody className='grid gap-3'>
        <h2 className='text-lg font-semibold'>{business.name}</h2>
        <p className='text-muted line-clamp-3 text-sm'>
          {business.description}
        </p>

        <ul className='grid gap-1'>
          <li className='flex items-center justify-between'>
            <strong>Adres</strong>
            <span className='text-muted text-sm'>{business.address}</span>
          </li>
          <li className='flex items-center justify-between'>
            <strong>Telefon</strong>
            <span className='text-muted text-sm'>{business.phone}</span>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
}
