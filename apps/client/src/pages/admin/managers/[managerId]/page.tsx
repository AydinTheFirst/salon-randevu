import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  useDisclosure
} from "@heroui/react";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import useSWR from "swr";

import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";
import {
  type Business,
  type BusinessManager,
  type Paginated,
  type User
} from "~/types";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientActionArgs) => {
  const { managerId } = params;

  if (!managerId) {
    throw new Error("Manager ID is required");
  }

  if (managerId === "create") {
    return { manager: null };
  }

  const { data: manager } = await http.get<BusinessManager>(
    `/managers/${managerId}`
  );

  return { manager };
};

export default function CreateOrEditBusinessManager() {
  const navigate = useNavigate();
  const { manager } = useLoaderData<typeof clientLoader>();

  const { data: users } = useSWR<Paginated<User>>("/users?include=profile");
  const { data: businesses } = useSWR<Paginated<Business>>("/businesses");

  const [selectedUser, setSelectedUser] = React.useState<null | string>(
    manager ? manager.userId : null
  );
  const [selectedBusiness, setSelectedBusiness] = React.useState<null | string>(
    manager ? manager.businessId : null
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const deleleModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    if (!selectedUser || !selectedBusiness) {
      toast.error("Kullanıcı ve işletme seçilmesi zorunludur.");
      return;
    }

    data.userId = selectedUser;
    data.businessId = selectedBusiness;

    setIsLoading(true);

    try {
      if (manager) {
        await http.patch(`/managers/${manager.id}`, data);
        toast.success("Business manager başarıyla güncellendi.");
      } else {
        await http.post("/managers", data);
        toast.success("Yeni business manager başarıyla oluşturuldu.");
      }
      navigate("/admin/managers");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!manager) return;

    try {
      await http.delete(`/business-managers/${manager.id}`);
      deleleModal.onClose();
      navigate("/admin/business-managers");
    } catch (error) {
      console.error("Failed to delete business manager:", error);
    }
  };

  return (
    <>
      <section className='grid gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <h2 className='text-xl font-semibold'>
            {manager
              ? "Business Manager Düzenle"
              : "Yeni Business Manager Oluştur"}
          </h2>
          <div className='flex justify-end'>
            <Button
              color='danger'
              hidden={!manager}
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
              <Autocomplete
                isRequired
                items={users?.items ?? []}
                label='Kullanıcı'
                name='userId'
                onSelectionChange={(key) =>
                  setSelectedUser(key?.toString() ?? null)
                }
                selectedKey={selectedUser}
              >
                {(item) => (
                  <AutocompleteItem key={item.id}>
                    {item.profile?.displayName}
                  </AutocompleteItem>
                )}
              </Autocomplete>

              <Autocomplete
                isRequired
                items={businesses?.items ?? []}
                label='İşletme'
                name='businessId'
                onSelectionChange={(key) =>
                  setSelectedBusiness(key?.toString() ?? null)
                }
                selectedKey={selectedBusiness}
              >
                {(item) => (
                  <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                )}
              </Autocomplete>
              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {manager ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>

      <ConfirmModal
        {...deleleModal}
        message='Business manager kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
