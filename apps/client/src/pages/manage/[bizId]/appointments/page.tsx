import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Link,
  Tab,
  Tabs
} from "@heroui/react";
import {
  Calendar,
  List,
  LucideCalendar1,
  LucideClock,
  LucideIdCard,
  LucidePhone
} from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";

import type { Appointment, Paginated } from "~/types";

import { UserCard } from "~/components/user-card";
import { http } from "~/lib/http";

import type { Route } from "./+types/page";

import { AppointmentCalendar } from "./calendar";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { data: appointments } = await http.get<Paginated<Appointment>>(
    "appointments",
    {
      params: {
        businessId: params.bizId,
        include: "business,user,user.profile"
      }
    }
  );

  return { appointments };
};

export default function Appointments() {
  const { appointments } = useLoaderData<typeof clientLoader>();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");

  return (
    <div className='grid gap-6'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='grid gap-1'>
          <h2 className='text-xl font-semibold'>Randevular</h2>
          <p className='text-muted text-sm'>
            İşletmenize gelen randevuları buradan yönetebilirsiniz. Randevu
            detaylarına tıklayarak düzenleme veya iptal etme işlemleri
            gerçekleştirebilirsiniz.
          </p>
        </div>
        <div className='flex justify-end'>
          <Tabs
            className='w-auto'
            onSelectionChange={(key) => setViewMode(key as "calendar" | "list")}
            selectedKey={viewMode}
          >
            <Tab
              key='list'
              title={
                <div className='flex items-center gap-2'>
                  <List size={16} />
                  Liste
                </div>
              }
            />
            <Tab
              key='calendar'
              title={
                <div className='flex items-center gap-2'>
                  <Calendar size={16} />
                  Takvim
                </div>
              }
            />
          </Tabs>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <AppointmentCalendar appointments={appointments.items} />
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {appointments.items.length === 0 ? (
            <div className='col-span-full'>
              <Card>
                <CardBody className='py-12 text-center'>
                  <LucideCalendar1
                    className='text-muted-foreground mx-auto mb-4'
                    size={48}
                  />
                  <h3 className='mb-2 text-lg font-medium'>
                    Henüz randevu yok
                  </h3>
                  <p className='text-muted-foreground'>
                    İşletmenize henüz randevu alınmamış
                  </p>
                </CardBody>
              </Card>
            </div>
          ) : (
            appointments.items.map((appointment) => (
              <AppointmentCard
                appointment={appointment}
                key={appointment.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const isInFuture = new Date(appointment.date) > new Date();

  return (
    <Card>
      <CardHeader className='justify-between'>
        <UserCard
          avatarProps={{
            name: appointment.business?.name
          }}
          description={
            isInFuture
              ? "Oluşturuldu: " +
                new Date(appointment.createdAt).toLocaleDateString()
              : "Randevu Geçmiş"
          }
          name={appointment.business?.name}
        />
        <Chip
          className='ml-2'
          color={isInFuture ? "success" : "default"}
          size='sm'
          variant='flat'
        >
          {isInFuture ? "Aktif" : "Geçmiş"}
        </Chip>
      </CardHeader>
      <CardBody className='grid gap-3'>
        <Alert
          color='primary'
          icon={<LucideCalendar1 />}
          title={new Date(appointment.date).toLocaleDateString()}
          variant='flat'
        />

        <Alert
          color='success'
          icon={<LucideClock />}
          title={new Date(appointment.date).toLocaleString()}
          variant='flat'
        />

        <Alert
          icon={<LucidePhone />}
          title={appointment.user?.phone}
          variant='flat'
        />

        <Alert
          icon={<LucideIdCard />}
          title={appointment.user?.profile?.displayName}
          variant='flat'
        />

        <Button
          as={Link}
          color='primary'
          href={`/manage/${appointment.business?.id}/appointments/${appointment.id}`}
        >
          İşlemler
        </Button>
      </CardBody>
    </Card>
  );
}
