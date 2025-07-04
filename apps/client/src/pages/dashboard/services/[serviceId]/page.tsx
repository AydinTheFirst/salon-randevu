import {
  Button,
  Card,
  CardBody,
  Input,
  NumberInput,
  Select,
  SelectItem,
  useDisclosure
} from "@heroui/react";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import useSWR from "swr";

import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";
import { type Business, type Paginated, type Service } from "~/types";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientActionArgs) => {
  const { serviceId } = params;

  if (!serviceId) {
    throw new Error("Service ID is required");
  }

  if (serviceId === "create") {
    return { service: null };
  }

  const { data: service } = await http.get<Service>(`/services/${serviceId}`);

  return { service };
};

export default function CreateOrEditService() {
  const navigate = useNavigate();
  const { service } = useLoaderData<typeof clientLoader>();
  const { data: businesses } = useSWR<Paginated<Business>>("/businesses/user");

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    data.duration = Number(data.duration);
    data.price = Number(data.price);

    setIsLoading(true);

    try {
      if (service) {
        await http.patch(`/services/${service.id}`, data);
        toast.success("Hizmet başarıyla güncellendi.");
      } else {
        await http.post("/services", data);
        toast.success("Yeni hizmet başarıyla oluşturuldu.");
      }
      navigate("/dashboard/services");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const deleleModal = useDisclosure();

  const handleDelete = async () => {
    if (!service) return;

    try {
      await http.delete(`/services/${service.id}`);
      deleleModal.onClose();
      navigate("/admin/services");
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  return (
    <>
      <section className='grid gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <h2 className='text-xl font-semibold'>
            {service ? "Hizmet Düzenle" : "Yeni Hizmet Oluştur"}
          </h2>
          <div className='flex justify-end'>
            <Button
              color='danger'
              hidden={!service}
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
              <Input
                isRequired
                label='Hizmet Adı'
                name='name'
                {...(service && { defaultValue: service.name })}
              />

              <NumberInput
                isRequired
                label='Fiyat'
                min={0}
                name='price'
                step={0.01}
                {...(service && { defaultValue: service.price })}
              />

              <NumberInput
                isRequired
                label='Süre (dakika)'
                min={0}
                name='duration'
                {...(service && { defaultValue: service.duration })}
              />

              <Select
                isRequired
                items={businesses?.items ?? []}
                label='İşletme'
                name='businessId'
                {...(service && { defaultSelectedKeys: [service.businessId] })}
              >
                {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
              </Select>

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {service ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>

      <ConfirmModal
        {...deleleModal}
        message='Hizmeti silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
