import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  useDisclosure
} from "@heroui/react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

import type { Appointment } from "~/types";

import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { appointmentId } = params;

  if (!appointmentId) {
    throw new Error("An err occured");
  }

  const { data: appointment } = await http.get<Appointment>(
    `/appointments/${appointmentId}`,
    { params: { include: "business,user,user.profile" } }
  );

  return { appointment };
};

export default function Page() {
  const { appointment } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  const cancelModal = useDisclosure();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await http.patch(`/appointments/${appointment.id}`, data);
      toast.success("Randevu başarıyla güncellendi.");
      navigate(`/manage/${appointment.business?.id}/appointments`);
    } catch (error) {
      handleError(error);
    }
  };

  const onCancel = async () => {
    try {
      await http.delete(`/appointments/${appointment.id}`);
      toast.success("Randevu başarıyla iptal edildi.");
      navigate(`/manage/${appointment.business?.id}/appointments`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className='grid gap-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='grid gap-1'>
            <h2 className='text-xl'>
              {appointment.user?.profile?.displayName ?? "Randevu Detayı"}
            </h2>
            <p className='text-muted text-sm'>
              Bu sayfada randevuları düzenleyebilirsiniz.
            </p>
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              color='danger'
              onPress={cancelModal.onOpen}
            >
              İptal Et
            </Button>
          </div>
        </div>

        <Card>
          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={onSubmit}
            >
              <Input
                isReadOnly
                label='Ad Soyad'
                value={appointment.user?.profile?.displayName}
              />

              <Input
                isReadOnly
                label='Telefon'
                value={appointment.user?.phone?.toString()}
              />

              <Input
                isReadOnly
                label='İşletme'
                value={appointment.business?.name}
              />

              <Input
                isReadOnly
                label='Randevu Tarihi'
                value={new Date(appointment.date).toLocaleString("tr-TR", {
                  dateStyle: "short",
                  timeStyle: "short"
                })}
              />

              <Textarea
                isReadOnly
                label='Randevu Notu'
                value={appointment.notes || "Not bulunmuyor"}
              />
            </form>
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        message='Randevuyu iptal etmek istediğinize emin misiniz?'
        onConfirm={onCancel}
        {...cancelModal}
      />
    </>
  );
}
