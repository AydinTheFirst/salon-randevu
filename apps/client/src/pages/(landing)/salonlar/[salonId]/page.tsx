import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Image,
  Link
} from "@heroui/react";
import React from "react";
import { useLoaderData } from "react-router";

import type { Business, Paginated, Service } from "~/types";

import { http } from "~/lib/http";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { salonId } = params;

  if (!salonId) {
    throw new Error("Salon ID is required");
  }

  const { data: business } = await http.get<Business>(`/businesses/${salonId}`);
  const { data: services } = await http.get<Paginated<Service>>(`/services`, {
    params: {
      businessId: salonId,
      limit: 1000
    }
  });

  return { business, services };
};

export default function Page() {
  const { business, services } = useLoaderData<typeof clientLoader>();

  return (
    <div className='container py-10'>
      <div className='grid grid-cols-12 gap-6'>
        <div className='col-span-12'>
          <Breadcrumbs>
            <BreadcrumbItem href='/'>Anasayfa</BreadcrumbItem>
            <BreadcrumbItem href='/salonlar'>Salonlar</BreadcrumbItem>
            <BreadcrumbItem>{business.name}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className='col-span-12'>
          <h1 className='text-2xl font-bold'>{business.name}</h1>
        </div>
        <div className='col-span-12 md:col-span-3'>
          <div className='grid gap-3'>
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
              href={`/book/${business.id}`}
            >
              Randevu Al
            </Button>
          </div>
        </div>
        <div className='col-span-12 md:col-span-9'>
          <ul className='grid gap-3'>
            <li className='flex flex-col gap-1'>
              <strong>Hakkında</strong>
              <span>{business.description}</span>
            </li>
            <li className='flex flex-col gap-1'>
              <strong>Tür</strong>
              <span>{business.type}</span>
            </li>
            <li className='flex flex-col gap-1'>
              <strong>Adres</strong>
              <span>{business.address}</span>
            </li>
            <li className='flex flex-col gap-1'>
              <strong>Telefon</strong>
              <Link
                color='foreground'
                href={`tel:${business.phone}`}
              >
                {business.phone}
              </Link>
            </li>
          </ul>
        </div>
        <div className='col-span-12 grid gap-3'>
          <h2 className='text-xl font-semibold'>Servisler</h2>
          <ul className='grid gap-3'>
            {services.items.map((service) => (
              <li
                className='flex flex-col gap-1'
                key={service.id}
              >
                <span className='font-semibold'>{service.name}</span>
                <span className='text-sm font-semibold'>
                  {service.price} ₺ - {service.duration} dakika
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className='col-span-12'>
          <iframe
            allowFullScreen
            className='mx-auto h-96 w-full'
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121035.16700250305!2d28.843182608993423!3d41.01993716907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1752782536154!5m2!1str!2str'
            style={{ border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
