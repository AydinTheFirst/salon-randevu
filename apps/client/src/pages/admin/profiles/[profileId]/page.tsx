import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  useDisclosure
} from "@heroui/react";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";
import { type Profile } from "~/types";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientActionArgs) => {
  const { profileId } = params;

  if (!profileId) {
    throw new Error("Profile ID is required");
  }

  if (profileId === "create") {
    return { profile: null };
  }

  const { data: profile } = await http.get<Profile>(`/profiles/${profileId}`);

  return { profile };
};

export default function CreateOrEditProfile() {
  const navigate = useNavigate();
  const { profile } = useLoaderData<typeof clientLoader>();

  const [isLoading, setIsLoading] = React.useState(false);

  const deleleModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setIsLoading(true);

    try {
      if (profile) {
        await http.patch(`/profiles/${profile.id}`, data);
        toast.success("Profil başarıyla güncellendi.");
      } else {
        await http.post("/profiles", data);
        toast.success("Yeni profil başarıyla oluşturuldu.");
      }
      navigate("/admin/profiles");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!profile) return;

    try {
      await http.delete(`/profiles/${profile.id}`);
      deleleModal.onClose();
      navigate("/admin/profiles");
    } catch (error) {
      console.error("Failed to delete profile:", error);
    }
  };

  return (
    <>
      <section className='grid gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <h2 className='text-xl font-semibold'>
            {profile ? "Profil Düzenle" : "Yeni Profil Oluştur"}
          </h2>
          <div className='flex justify-end'>
            <Button
              color='danger'
              hidden={!profile}
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
                label='Ad Soyad'
                name='displayName'
                {...(profile && { defaultValue: profile.displayName })}
              />

              <Textarea
                label='Biyografi'
                name='bio'
                {...(profile && { defaultValue: profile.bio ?? "" })}
              />

              <Input
                label='Avatar URL'
                name='avatar'
                {...(profile && { defaultValue: profile.avatar ?? "" })}
              />

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {profile ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>

      <ConfirmModal
        {...deleleModal}
        message='Profili silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
