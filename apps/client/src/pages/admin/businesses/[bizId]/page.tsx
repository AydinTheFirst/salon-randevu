import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure
} from "@heroui/react";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import useSWR from "swr";

import type { TRApiResponse } from "~/types/tr";

import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";
import { type Business, BusinessType } from "~/types";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientActionArgs) => {
  const { bizId } = params;

  if (!bizId) {
    throw new Error("Business ID is required");
  }

  if (bizId === "create") {
    return { business: null };
  }

  const { data: business } = await http.get<Business>(`/businesses/${bizId}`);

  return { business };
};

export default function CreateOrEditBiz() {
  const navigate = useNavigate();
  const { business } = useLoaderData<typeof clientLoader>();

  const [isLoading, setIsLoading] = React.useState(false);

  const [selectedCity, setSelectedCity] = React.useState<null | string>(
    business ? business.city : null
  );
  const [selectedDistrict, setSelectedDistrict] = React.useState<null | string>(
    business ? business.district : null
  );

  const { data: cities } = useSWR<TRApiResponse>(
    "https://turkiyeapi.dev/api/v1/provinces"
  );

  const deleleModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setIsLoading(true);

    try {
      if (business) {
        await http.patch(`/businesses/${business.id}`, data);
        toast.success("İşletme başarıyla güncellendi.");
      } else {
        await http.post("/businesses", data);
        toast.success("Yeni işletme başarıyla eklendi.");
      }
      navigate("/admin/businesses");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!business) return;

    try {
      await http.delete(`/businesses/${business.id}`);
      deleleModal.onClose();
      navigate("/admin/businesses");
    } catch (error) {
      console.error("Failed to delete business:", error);
    }
  };

  const districts =
    cities && selectedCity
      ? cities.data.find((city) => city.name === selectedCity)?.districts || []
      : [];

  return (
    <>
      <section className='grid gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div>
            <h2 className='text-xl font-semibold'>
              {business ? "İşletmeyi Düzenle" : "Yeni İşletme Ekle"}
            </h2>
          </div>
          <div className='flex justify-end'>
            <Button
              color='danger'
              hidden={!business}
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
                {...(business && { defaultValue: business.name })}
                isRequired
                label='İşletme Adı'
                name='name'
              />

              <Select
                {...(business && { defaultSelectedKeys: [business.type] })}
                isRequired
                items={Object.values(BusinessType).map((type) => ({
                  key: type,
                  label: type.charAt(0).toUpperCase() + type.slice(1)
                }))}
                label='Tür'
                name='type'
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>

              <Autocomplete
                isRequired
                items={cities?.data || []}
                label='İl'
                name='city'
                onSelectionChange={(key) =>
                  setSelectedCity(key?.toString() ?? "")
                }
                selectedKey={selectedCity}
              >
                {(item) => (
                  <AutocompleteItem key={item.name}>
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>

              <Autocomplete
                isRequired
                items={districts}
                label='İlçe'
                name='district'
                onSelectionChange={(key) =>
                  setSelectedDistrict(key?.toString() ?? "")
                }
                selectedKey={selectedDistrict}
              >
                {(item) => (
                  <SelectItem
                    key={item.name}
                    textValue={item.name}
                  >
                    {item.name}
                  </SelectItem>
                )}
              </Autocomplete>

              <Textarea
                {...(business && { defaultValue: business.description ?? "" })}
                label='Açıklama'
                name='description'
              />

              <Textarea
                {...(business && { defaultValue: business.address ?? "" })}
                isRequired
                label='Adres'
                name='address'
              />

              <Input
                {...(business && { defaultValue: business.phone })}
                isRequired
                label='Telefon'
                name='phone'
              />
              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {business ? "Güncelle" : "Ekle"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>

      <ConfirmModal
        {...deleleModal}
        message='İşletmeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
