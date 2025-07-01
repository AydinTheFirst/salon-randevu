import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  useDisclosure
} from "@heroui/react";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";
import { type User, UserRole } from "~/types";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientActionArgs) => {
  const { userId } = params;

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (userId === "create") {
    return { user: null };
  }

  const { data: user } = await http.get<User>(`/users/${userId}`);

  return { user };
};

export default function CreateOrEditUser() {
  const navigate = useNavigate();
  const { user } = useLoaderData<typeof clientLoader>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>(
    user ? user.roles : []
  );

  const deleleModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    data.roles = selectedRoles;

    setIsLoading(true);

    try {
      if (user) {
        await http.patch(`/users/${user.id}`, data);
        toast.success("Kullanıcı başarıyla güncellendi.");
      } else {
        await http.post("/users", data);
        toast.success("Yeni kullanıcı başarıyla oluşturuldu.");
      }
      navigate("/admin/users");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      await http.delete(`/users/${user.id}`);
      deleleModal.onClose();
      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <>
      <section className='grid gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <h2 className='text-xl font-semibold'>
            {user ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Oluştur"}
          </h2>
          <div className='flex justify-end'>
            <Button
              color='danger'
              hidden={!user}
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
                label='Email'
                name='email'
                type='email'
                {...(user && { defaultValue: user.email })}
              />

              <Input
                label='Telefon'
                name='phone'
                type='tel'
                {...(user && { defaultValue: user.phone ?? "" })}
              />

              {!user && (
                <Input
                  autoComplete='new-password'
                  isRequired
                  label='Şifre'
                  name='password'
                  type='password'
                />
              )}

              <Select
                isRequired
                items={Object.values(UserRole).map((role) => ({
                  key: role,
                  label: role.charAt(0) + role.slice(1).toLowerCase()
                }))}
                label='Roller'
                name='roles'
                onSelectionChange={(keys) =>
                  setSelectedRoles(Array.from(keys) as string[])
                }
                selectedKeys={selectedRoles}
                selectionMode='multiple'
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {user ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>

      <ConfirmModal
        {...deleleModal}
        message='Kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
