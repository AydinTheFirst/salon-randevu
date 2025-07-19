import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea
} from "@heroui/react";
import {
  Bell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "~/hooks/use-auth";
import { handleError } from "~/lib/http";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    address: "",
    bio: user?.profile?.bio || "",
    city: "İstanbul",
    displayName: user?.profile?.displayName || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    promotions: false,
    reminders: true,
    smsNotifications: true
  });

  // Security settings
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    twoFactorAuth: false
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // TODO : API call to save profile data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profil bilgileriniz başarıyla güncellendi! 🎉");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      // TODO:    API call to save notification settings
      toast.success("Bildirim ayarlarınız güncellendi!");
    } catch (error) {
      handleError(error);
    }
  };

  const handleChangePassword = async () => {
    if (!security.currentPassword || !security.newPassword) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    try {
      // TODO: API call to change password
      toast.success("Şifreniz başarıyla değiştirildi!");
      setSecurity({ ...security, currentPassword: "", newPassword: "" });
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
                <User className='h-6 w-6' />
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
                    size='sm'
                    variant='flat'
                  >
                    Fotoğraf Değiştir
                  </Button>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <Input
                  label='Görünen Ad'
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  placeholder='Görünen adınızı girin'
                  startContent={<User className='h-4 w-4 text-gray-400' />}
                  value={formData.displayName}
                  variant='bordered'
                />
                <Input
                  label='E-posta'
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder='E-posta adresiniz'
                  startContent={<Mail className='h-4 w-4 text-gray-400' />}
                  type='email'
                  value={formData.email}
                  variant='bordered'
                />
                <Input
                  label='Telefon'
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder='Telefon numaranız'
                  startContent={<Phone className='h-4 w-4 text-gray-400' />}
                  value={formData.phone}
                  variant='bordered'
                />
                <Select
                  label='Şehir'
                  onSelectionChange={(keys) => {
                    const city = Array.from(keys)[0] as string;
                    setFormData({ ...formData, city });
                  }}
                  placeholder='Şehir seçin'
                  selectedKeys={[formData.city]}
                  startContent={<MapPin className='h-4 w-4 text-gray-400' />}
                  variant='bordered'
                >
                  <SelectItem key='İstanbul'>İstanbul</SelectItem>
                  <SelectItem key='Ankara'>Ankara</SelectItem>
                  <SelectItem key='İzmir'>İzmir</SelectItem>
                  <SelectItem key='Bursa'>Bursa</SelectItem>
                  <SelectItem key='Antalya'>Antalya</SelectItem>
                </Select>
                <Textarea
                  className='md:col-span-2'
                  label='Biyografi'
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder='Kendinizden bahsedin...'
                  value={formData.bio}
                  variant='bordered'
                />
                <Textarea
                  className='md:col-span-2'
                  label='Adres'
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder='Adres bilgileriniz'
                  value={formData.address}
                  variant='bordered'
                />
              </div>

              <div className='mt-6 flex justify-end'>
                <Button
                  className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  isLoading={isLoading}
                  onPress={handleSaveProfile}
                  startContent={<Save className='h-4 w-4' />}
                >
                  Değişiklikleri Kaydet
                </Button>
              </div>
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
              <div className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <Input
                    endContent={
                      <button
                        className='focus:outline-none'
                        onClick={() => setShowPassword(!showPassword)}
                        type='button'
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4 text-gray-400' />
                        ) : (
                          <Eye className='h-4 w-4 text-gray-400' />
                        )}
                      </button>
                    }
                    label='Mevcut Şifre'
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        currentPassword: e.target.value
                      })
                    }
                    placeholder='Mevcut şifrenizi girin'
                    startContent={<Lock className='h-4 w-4 text-gray-400' />}
                    type={showPassword ? "text" : "password"}
                    value={security.currentPassword}
                    variant='bordered'
                  />
                  <Input
                    label='Yeni Şifre'
                    onChange={(e) =>
                      setSecurity({ ...security, newPassword: e.target.value })
                    }
                    placeholder='Yeni şifrenizi girin'
                    startContent={<Lock className='h-4 w-4 text-gray-400' />}
                    type={showPassword ? "text" : "password"}
                    value={security.newPassword}
                    variant='bordered'
                  />
                </div>

                <Divider />

                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      İki Faktörlü Doğrulama
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Hesabınızı ekstra güvenlik katmanı ile koruyun
                    </p>
                  </div>
                  <Switch
                    isSelected={security.twoFactorAuth}
                    onValueChange={(value) =>
                      setSecurity({ ...security, twoFactorAuth: value })
                    }
                  />
                </div>

                <div className='flex gap-3'>
                  <Button
                    className='bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    onPress={handleChangePassword}
                    startContent={<Lock className='h-4 w-4' />}
                  >
                    Şifreyi Değiştir
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Notification Settings */}
          <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
            <CardHeader className='bg-gradient-to-r from-green-500 to-emerald-500 text-white'>
              <div className='flex items-center gap-3'>
                <Bell className='h-6 w-6' />
                <div>
                  <h2 className='text-xl font-bold'>Bildirim Ayarları</h2>
                  <p className='text-sm text-green-100'>
                    Hangi bildirimleri almak istediğinizi seçin
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className='p-6'>
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      E-posta Bildirimleri
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Randevu onayları ve hatırlatmalar
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.emailNotifications}
                    onValueChange={(value) =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: value
                      })
                    }
                  />
                </div>

                <Divider />

                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      SMS Bildirimleri
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Önemli güncellemeler için SMS
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.smsNotifications}
                    onValueChange={(value) =>
                      setNotifications({
                        ...notifications,
                        smsNotifications: value
                      })
                    }
                  />
                </div>

                <Divider />

                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Randevu Hatırlatmaları
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Randevunuzdan önce hatırlatma
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.reminders}
                    onValueChange={(value) =>
                      setNotifications({ ...notifications, reminders: value })
                    }
                  />
                </div>

                <Divider />

                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Promosyon E-postaları
                    </h3>
                    <p className='text-sm text-gray-500'>
                      İndirimler ve özel teklifler
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.promotions}
                    onValueChange={(value) =>
                      setNotifications({ ...notifications, promotions: value })
                    }
                  />
                </div>

                <div className='flex justify-end'>
                  <Button
                    className='bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    onPress={handleSaveNotifications}
                    startContent={<Bell className='h-4 w-4' />}
                  >
                    Bildirim Ayarlarını Kaydet
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Account Status */}
          <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
            <CardHeader className='bg-gradient-to-r from-gray-600 to-gray-700 text-white'>
              <div className='flex items-center gap-3'>
                <User className='h-6 w-6' />
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
                    <User className='h-6 w-6 text-blue-600' />
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
