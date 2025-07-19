import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link
} from "@heroui/react";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import useSWR from "swr";

import type { Paginated } from "~/types";

import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";
import { type Appointment } from "~/types";

export default function Page() {
  const { user } = useAuth();
  const { data: appointments, mutate } = useSWR<Paginated<Appointment>>(
    `/appointments?userId=${user?.id}&include=business,user`
  );

  const onCancel = async (appointmentId: string) => {
    try {
      await http.delete(`/appointments/${appointmentId}`);
      toast.success("Randevu başarıyla iptal edildi");
      mutate();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='container grid gap-6 py-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Randevularım</h1>
          <p className='mt-1 text-gray-600'>
            Tüm randevu geçmişinizi buradan takip edebilirsiniz
          </p>
        </div>
      </div>

      <div className='grid gap-4'>
        {appointments?.items.length === 0 && (
          <Card className='py-16'>
            <CardBody className='text-center'>
              <div className='flex flex-col items-center gap-4'>
                <div className='rounded-full bg-gray-100 p-4'>
                  <Calendar
                    className='text-gray-400'
                    size={48}
                  />
                </div>
                <div>
                  <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                    Henüz randevunuz yok
                  </h3>
                  <p className='max-w-md text-gray-500'>
                    Bir salon seçip randevu alabilirsiniz. Randevularınız burada
                    görünecek.
                  </p>
                </div>
                <Button
                  as={Link}
                  className='mt-4'
                  color='primary'
                  href='/salonlar'
                  size='lg'
                >
                  Randevu Al
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
        {appointments?.items.map((appointment) => (
          <Card
            className='transition-all duration-300 hover:shadow-lg'
            key={appointment.id}
          >
            <CardHeader className='pb-3'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <Avatar
                    className='bg-gradient-to-br from-blue-500 to-purple-600'
                    name={appointment.business?.name}
                    showFallback
                    size='lg'
                  />
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {appointment.business?.name || "Salon Adı"}
                    </h3>
                    <div className='flex items-center gap-1 text-gray-600'>
                      <MapPin size={14} />
                      <span className='text-sm'>
                        {appointment.business?.district},{" "}
                        {appointment.business?.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <Chip
                    color={
                      new Date(appointment.date) > new Date()
                        ? "success"
                        : "default"
                    }
                    size='sm'
                    variant='flat'
                  >
                    {new Date(appointment.date) > new Date()
                      ? "Aktif"
                      : "Geçmiş"}
                  </Chip>
                  {appointment.payment && (
                    <Chip
                      color={
                        appointment.payment.status === "COMPLETED"
                          ? "success"
                          : appointment.payment.status === "PENDING"
                            ? "warning"
                            : "danger"
                      }
                      size='sm'
                      variant='flat'
                    >
                      {appointment.payment.status === "COMPLETED"
                        ? "Ödendi"
                        : appointment.payment.status === "PENDING"
                          ? "Bekliyor"
                          : "Başarısız"}
                    </Chip>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardBody className='pt-0'>
              <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3 rounded-lg bg-blue-50 p-3'>
                    <Calendar
                      className='text-blue-600'
                      size={20}
                    />
                    <div>
                      <p className='text-sm font-medium text-gray-700'>
                        Randevu Tarihi
                      </p>
                      <p className='text-sm font-semibold text-gray-900'>
                        {new Date(appointment.date).toLocaleDateString(
                          "tr-TR",
                          {
                            day: "numeric",
                            month: "long",
                            weekday: "long",
                            year: "numeric"
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 rounded-lg bg-green-50 p-3'>
                    <Clock
                      className='text-green-600'
                      size={20}
                    />
                    <div>
                      <p className='text-sm font-medium text-gray-700'>
                        Randevu Saati
                      </p>
                      <p className='text-sm font-semibold text-gray-900'>
                        {new Date(appointment.date).toLocaleTimeString(
                          "tr-TR",
                          {
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  {appointment.address && (
                    <div className='flex items-start gap-3 rounded-lg bg-orange-50 p-3'>
                      <MapPin
                        className='mt-0.5 text-orange-600'
                        size={20}
                      />
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Adres
                        </p>
                        <p className='text-sm text-gray-900'>
                          {appointment.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {appointment.services && appointment.services.length > 0 && (
                <>
                  <Divider className='my-4' />
                  <div>
                    <p className='mb-3 flex items-center gap-2 text-sm font-medium text-gray-700'>
                      <Star
                        className='text-yellow-500'
                        size={16}
                      />
                      Seçilen Hizmetler
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {appointment.services.map((service) => (
                        <Chip
                          className='text-xs'
                          color='primary'
                          key={service.id}
                          variant='flat'
                        >
                          {service.name} • {service.price}₺
                        </Chip>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardBody>

            <CardFooter className='border-t border-gray-100 pt-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='text-muted text-xs'>
                  Oluşturulma:{" "}
                  {new Date(appointment.createdAt).toLocaleDateString("tr-TR")}
                </div>
                <div className='flex gap-2'>
                  <Button
                    as={Link}
                    color='default'
                    href={`/salonlar/${appointment.business?.id}`}
                    size='sm'
                    variant='flat'
                  >
                    İşletmeyi Gör
                  </Button>

                  {new Date(appointment.date) > new Date() && (
                    <Button
                      color='danger'
                      onPress={() => onCancel(appointment.id)}
                      size='sm'
                      variant='flat'
                    >
                      İptal Et
                    </Button>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
