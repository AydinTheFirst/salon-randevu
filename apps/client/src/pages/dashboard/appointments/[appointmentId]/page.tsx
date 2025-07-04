import type { CalendarDateTime } from "@internationalized/date";

import {
  Button,
  Card,
  CardBody,
  DatePicker,
  Input,
  Textarea,
  useDisclosure
} from "@heroui/react";
import { parseDateTime } from "@internationalized/date";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";
import { type Appointment } from "~/types";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientActionArgs) => {
  const { appointmentId } = params;

  if (!appointmentId) {
    throw new Error("Appointment ID is required");
  }

  if (appointmentId === "create") {
    return { appointment: null };
  }

  const { data: appointment } = await http.get<Appointment>(
    `/appointments/${appointmentId}`,
    {
      params: {
        include: "user,business"
      }
    }
  );

  return { appointment };
};

export default function CreateOrEditAppointment() {
  const navigate = useNavigate();
  const { appointment } = useLoaderData<typeof clientLoader>();

  const [date, setDate] = React.useState<CalendarDateTime | null>(
    appointment ? parseDateTime(appointment.date.replace("Z", "")) : null
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const deleleModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    console.log("Form Data:", data);

    data.date = date?.toDate("Europe/Istanbul");

    setIsLoading(true);

    try {
      if (appointment) {
        await http.patch(`/appointments/${appointment.id}`, data);
        toast.success("Randevu başarıyla güncellendi.");
      } else {
        await http.post("/appointments", data);
        toast.success("Yeni randevu başarıyla oluşturuldu.");
      }
      navigate("/admin/appointments");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!appointment) return;

    try {
      await http.delete(`/appointments/${appointment.id}`);
      deleleModal.onClose();
      navigate("/admin/appointments");
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  return (
    <>
      <section className='grid gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <h2 className='text-xl font-semibold'>
            {appointment ? "Randevuyu Düzenle" : "Yeni Randevu Oluştur"}
          </h2>
          <div className='flex justify-end'>
            <Button
              color='danger'
              hidden={!appointment}
              onPress={deleleModal.onOpen}
              variant='light'
            >
              Sil
            </Button>
          </div>
        </div>

        <Card>
          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <DatePicker
                granularity='minute'
                isRequired
                label='Randevu Tarihi'
                name='date'
                onChange={setDate}
                value={date}
              />

              <Input
                isRequired
                label='Ad Soyad'
                name='fullName'
                {...(appointment && { defaultValue: appointment.fullName })}
              />

              <Input
                isRequired
                label='Telefon'
                name='phone'
                {...(appointment && { defaultValue: appointment.phone })}
              />

              <Textarea
                label='Adres'
                name='address'
                {...(appointment && {
                  defaultValue: appointment.address ?? ""
                })}
              />

              <Input
                isDisabled
                label='İşletme'
                value={appointment?.business?.name}
              />

              <Input
                isDisabled
                label='Kullanıcı'
                value={appointment?.user?.profile?.displayName}
              />

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {appointment ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>

      <ConfirmModal
        {...deleleModal}
        message='Randevuyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
