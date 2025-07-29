import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Textarea
} from "@heroui/react";
import { Bell, Lock, LucideUser, Save, Shield } from "lucide-react";
import React from "react";
import { redirect, useLoaderData, useRevalidator } from "react-router";
import { toast } from "sonner";

import type { User } from "~/types";

import PasswordInput from "~/components/password-input";
import { handleError, http } from "~/lib/http";

export const clientLoader = async () => {
  try {
    const { data: user } = await http.get<User>("/auth/@me");
    return { user };
  } catch {
    return redirect(`/login?redirect=${encodeURIComponent("/profile")}`);
  }
};

export default function ProfileSettingsPage() {
  const { user } = useLoaderData<typeof clientLoader>();
  const revalidator = useRevalidator();

  const handleSaveProfile: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      await http.patch("/account/profile", data);
      toast.success("Profil bilgileriniz başarıyla güncellendi! 🎉");
      revalidator.revalidate();
    } catch (error) {
      handleError(error);
    }
  };

  const handleChangePassword: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      await http.patch("/account/password", data);
      toast.success("Şifreniz başarıyla değiştirildi!");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'>
      <div className='container py-12'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent'>
            Profil Ayarları
          </h1>
          <p className='text-gray-600'>
            Hesap bilgilerinizi ve tercihlerinizi yönetin
          </p>
        </div>

        <div className='mx-auto max-w-4xl space-y-8'>
          {/* Profile Information */}
          <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
            <CardHeader className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
              <div className='flex items-center gap-3'>
                <LucideUser className='h-6 w-6' />
                <div>
                  <h2 className='text-xl font-bold'>Kişisel Bilgiler</h2>
                  <p className='text-sm text-blue-100'>
                    Profil bilgilerinizi güncelleyin
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className='p-6'>
              <div className='mb-6 flex items-center gap-6'>
                <Avatar
                  className='h-24 w-24 text-2xl'
                  fallback={
                    user?.profile?.displayName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "U"
                  }
                  src={user?.profile?.avatar || undefined}
                />
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {user?.profile?.displayName || "Kullanıcı"}
                  </h3>
                  <p className='text-gray-500'>{user?.email}</p>
                  <Button
                    className='mt-2'
                    onPress={() =>
                      toast.info("Fotoğraf değiştir özelliği henüz eklenmedi.")
                    }
                    size='sm'
                    variant='flat'
                  >
                    Fotoğraf Değiştir
                  </Button>
                </div>
              </div>

              <form
                className='grid gap-4 md:grid-cols-2'
                onSubmit={handleSaveProfile}
              >
                <Input
                  defaultValue={user?.profile?.displayName || ""}
                  label='Görünen Ad'
                  name='displayName'
                  variant='bordered'
                />

                <Textarea
                  defaultValue={user?.profile?.bio || ""}
                  label='Biyografi'
                  name='bio'
                  placeholder='Kendinizi tanıtın...'
                  variant='bordered'
                />
                <div className='mt-6 flex justify-end md:col-span-2'>
                  <Button
                    className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    startContent={<Save className='h-4 w-4' />}
                    type='submit'
                  >
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Security Settings */}
          <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
            <CardHeader className='bg-gradient-to-r from-red-500 to-pink-500 text-white'>
              <div className='flex items-center gap-3'>
                <Shield className='h-6 w-6' />
                <div>
                  <h2 className='text-xl font-bold'>Güvenlik</h2>
                  <p className='text-sm text-red-100'>
                    Hesap güvenlik ayarlarınız
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className='p-6'>
              <form
                className='space-y-4'
                onSubmit={handleChangePassword}
              >
                <div className='grid gap-4 md:grid-cols-2'>
                  <PasswordInput
                    label='Mevcut Şifre'
                    name='oldPassword'
                    placeholder='Mevcut şifrenizi girin'
                    startContent={<Lock className='h-4 w-4 text-gray-400' />}
                    variant='bordered'
                  />
                  <PasswordInput
                    label='Yeni Şifre'
                    name='newPassword'
                    placeholder='Yeni şifrenizi girin'
                    startContent={<Lock className='h-4 w-4 text-gray-400' />}
                    variant='bordered'
                  />
                </div>

                <div className='flex gap-3'>
                  <Button
                    className='bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    startContent={<Lock className='h-4 w-4' />}
                    type='submit'
                  >
                    Şifreyi Değiştir
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Account Status */}
          <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
            <CardHeader className='bg-gradient-to-r from-gray-600 to-gray-700 text-white'>
              <div className='flex items-center gap-3'>
                <LucideUser className='h-6 w-6' />
                <div>
                  <h2 className='text-xl font-bold'>Hesap Durumu</h2>
                  <p className='text-sm text-gray-100'>
                    Hesap bilgileriniz ve istatistikler
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className='p-6'>
              <div className='grid gap-6 md:grid-cols-3'>
                <div className='text-center'>
                  <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                    <LucideUser className='h-6 w-6 text-blue-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900'>Hesap Tipi</h3>
                  <Chip
                    className='mt-1'
                    color='primary'
                    variant='flat'
                  >
                    Standart Üye
                  </Chip>
                </div>
                <div className='text-center'>
                  <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                    <Shield className='h-6 w-6 text-green-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900'>
                    Güvenlik Durumu
                  </h3>
                  <Chip
                    className='mt-1'
                    color='success'
                    variant='flat'
                  >
                    Güvenli
                  </Chip>
                </div>
                <div className='text-center'>
                  <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100'>
                    <Bell className='h-6 w-6 text-purple-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900'>Üyelik Tarihi</h3>
                  <p className='mt-1 text-sm text-gray-600'>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("tr-TR")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
