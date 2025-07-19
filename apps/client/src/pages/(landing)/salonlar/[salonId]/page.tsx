import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Image,
  Link
} from "@heroui/react";
import { Clock, Heart, MapPin, Phone, Star, Users } from "lucide-react";
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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='container py-8'>
        <div className='mb-6'>
          <Breadcrumbs>
            <BreadcrumbItem href='/'>Anasayfa</BreadcrumbItem>
            <BreadcrumbItem href='/salonlar'>Salonlar</BreadcrumbItem>
            <BreadcrumbItem>{business.name}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        {/* Hero Section */}
        <Card className='mb-8 overflow-hidden'>
          <div className='relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 md:h-80'>
            <Image
              alt={business.name}
              className='absolute inset-0 h-full w-full object-cover opacity-60'
              src='https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80'
            />
            <div className='bg-opacity-40 absolute inset-0 flex items-end bg-black'>
              <div className='p-8 text-white'>
                <div className='mb-4 flex items-center gap-3'>
                  <Avatar
                    className='h-16 w-16 bg-white text-2xl font-bold text-gray-800'
                    fallback={business.name.charAt(0)}
                  />
                  <div>
                    <h1 className='mb-2 text-4xl font-bold'>{business.name}</h1>
                    <div className='flex items-center gap-2 text-gray-200'>
                      <MapPin size={16} />
                      <span>
                        {business.district}, {business.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <Chip
                    className='bg-white/20 text-white'
                    color='success'
                    variant='flat'
                  >
                    <span className='flex'>
                      <Star className='mr-1 h-4 w-4' />
                      4.8 (124 yorum)
                    </span>
                  </Chip>
                  <Chip
                    className='bg-white/20 text-white'
                    color='primary'
                    variant='flat'
                  >
                    <span className='flex'>
                      <Users className='mr-1 h-4 w-4' />
                      Açık
                    </span>
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className='grid grid-cols-12 gap-8'>
          {/* Sidebar */}
          <div className='col-span-12 lg:col-span-4'>
            <div className='space-y-6'>
              {/* Quick Action Card */}
              <Card className='border-0 shadow-lg'>
                <CardBody className='p-6'>
                  <div className='space-y-4 text-center'>
                    <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600'>
                      <Heart className='h-8 w-8 text-white' />
                    </div>
                    <div>
                      <h3 className='mb-2 text-xl font-semibold'>
                        Randevu Alın
                      </h3>
                      <p className='text-sm text-gray-600'>
                        Hemen randevu alarak güzellik yolculuğunuza başlayın
                      </p>
                    </div>
                    <Button
                      as={Link}
                      className='w-full'
                      color='primary'
                      href={`/book/${business.id}`}
                      size='lg'
                    >
                      Randevu Al
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/* Contact Info Card */}
              <Card className='border-0 shadow-lg'>
                <CardHeader className='pb-3'>
                  <h3 className='text-lg font-semibold'>İletişim Bilgileri</h3>
                </CardHeader>
                <CardBody className='pt-0'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 rounded-lg bg-blue-50 p-3'>
                      <Phone className='h-5 w-5 text-blue-600' />
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Telefon
                        </p>
                        <Link
                          className='font-semibold text-blue-600'
                          href={`tel:${business.phone}`}
                        >
                          {business.phone}
                        </Link>
                      </div>
                    </div>
                    <div className='flex items-start gap-3 rounded-lg bg-green-50 p-3'>
                      <MapPin className='mt-0.5 h-5 w-5 text-green-600' />
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Adres
                        </p>
                        <p className='text-sm text-gray-600'>
                          {business.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Business Type Card */}
              <Card className='border-0 shadow-lg'>
                <CardBody className='p-6'>
                  <div className='text-center'>
                    <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600'>
                      <Users className='h-8 w-8 text-white' />
                    </div>
                    <h3 className='mb-1 font-semibold'>Salon Türü</h3>
                    <Chip
                      className='font-medium'
                      color='secondary'
                      variant='flat'
                    >
                      {business.type === "SALON" ? "Güzellik Salonu" : "Berber"}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className='col-span-12 lg:col-span-8'>
            <div className='space-y-8'>
              {/* About Section */}
              <Card className='border-0 shadow-lg'>
                <CardHeader>
                  <h2 className='text-2xl font-bold'>Hakkımızda</h2>
                </CardHeader>
                <CardBody>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    {business.description ||
                      "Bu salon henüz bir açıklama eklememis."}
                  </p>
                </CardBody>
              </Card>

              {/* Services Section */}
              <Card className='border-0 shadow-lg'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <Star className='h-6 w-6 text-yellow-500' />
                    <h2 className='text-2xl font-bold'>Hizmetlerimiz</h2>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className='grid gap-4'>
                    {services.items.map((service, index) => (
                      <div
                        className='group'
                        key={service.id}
                      >
                        <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100'>
                          <div className='flex items-center gap-4'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white'>
                              {index + 1}
                            </div>
                            <div>
                              <h3 className='text-lg font-semibold text-gray-900'>
                                {service.name}
                              </h3>
                              <div className='mt-1 flex items-center gap-4'>
                                <div className='flex items-center gap-1 text-green-600'>
                                  <span className='text-xl font-bold'>
                                    {service.price}₺
                                  </span>
                                </div>
                                <div className='flex items-center gap-1 text-gray-600'>
                                  <Clock className='h-4 w-4' />
                                  <span className='text-sm'>
                                    {service.duration} dk
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Map Section */}
              <Card className='border-0 shadow-lg'>
                <CardHeader>
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-6 w-6 text-blue-600' />
                    <h2 className='text-2xl font-bold'>Konum</h2>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className='overflow-hidden rounded-lg'>
                    <iframe
                      allowFullScreen
                      className='h-96 w-full'
                      loading='lazy'
                      referrerPolicy='no-referrer-when-downgrade'
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121035.16700250305!2d28.843182608993423!3d41.01993716907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1752782536154!5m2!1str!2str'
                      style={{ border: 0 }}
                      title={`${business.name} Konumu`}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
