import {
  Button,
  Calendar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Chip,
  type DateValue,
  Divider,
  Image
} from "@heroui/react";
import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import React from "react";
import { Link, redirect, useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import { DateTime } from "ts-luxon";

import type { Business, Paginated, Service } from "~/types";

import HourSelector from "~/components/hour-selector";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  if (!localStorage.getItem("token")) {
    return redirect(`/login?redirect=${window.location.pathname}`);
  }

  const { salonId } = params;

  if (!salonId) {
    throw new Error("Salon ID is required");
  }

  const { data: business } = await http.get<Business>(`/businesses/${salonId}`);
  const { data: services } = await http.get<Paginated<Service>>(`/services`, {
    params: {
      businessId: salonId,
      limit: 1000
    }
  });

  return { business, services };
};

export default function Book() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { business, services } = useLoaderData<typeof clientLoader>();
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<DateValue>(
    today(getLocalTimeZone()).add({ days: 1 })
  );
  const [selectedHours, setSelectedHours] = React.useState<number>(0);
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  const totalPrice = services.items
    .filter((service) => selectedServices.includes(service.id))
    .reduce((total, service) => total + service.price, 0);

  const totalDuration = services.items
    .filter((service) => selectedServices.includes(service.id))
    .reduce((total, service) => total + service.duration, 0);

  const onSubmit = async () => {
    try {
      await http.post("/appointments", {
        businessId: business.id,
        date: DateTime.fromJSDate(selectedDate.toDate(getLocalTimeZone())).set({
          hours: selectedHours
        }),
        services: selectedServices,
        userId: user?.id
      });
      toast.success("Randevunuz başarıyla oluşturuldu! 🎉");
      navigate(`/salonlar/${business.id}`);
    } catch (error) {
      handleError(error);
    }
  };

  const canProceedToNext = () => {
    if (currentStep === 1) return selectedServices.length > 0;
    if (currentStep === 2) return selectedDate && selectedHours > 0;
    return true;
  };

  const steps = [
    { number: 1, title: "Hizmet Seçimi" },
    { number: 2, title: "Tarih & Saat" },
    { number: 3, title: "Onay" }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'>
      <div className='container py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            as={Link}
            className='mb-4'
            href={`/salonlar/${business.id}`}
            startContent={<ArrowLeft className='h-4 w-4' />}
            variant='light'
          >
            Geri Dön
          </Button>

          <div className='text-center'>
            <h1 className='mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent'>
              Randevu Al
            </h1>
            <p className='text-gray-600'>
              {business.name} - {business.district}, {business.city}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className='mb-8'>
          <div className='flex items-center justify-center'>
            {steps.map((step, index) => (
              <div
                className='flex items-center'
                key={step.number}
              >
                <div
                  className={`flex flex-col items-center ${
                    currentStep >= step.number
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className='h-5 w-5' />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className='mt-2 text-xs font-medium'>{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-1 w-16 ${
                      currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
                <CardHeader className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
                  <div className='flex items-center gap-3'>
                    <Sparkles className='h-6 w-6' />
                    <div>
                      <h2 className='text-xl font-bold'>
                        Hizmetlerinizi Seçin
                      </h2>
                      <p className='text-sm text-blue-100'>
                        İstediğiniz hizmetleri seçebilirsiniz
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className='p-6'>
                  <CheckboxGroup
                    onValueChange={setSelectedServices}
                    value={selectedServices}
                  >
                    <div className='grid gap-4'>
                      {services.items.map((service) => (
                        <Checkbox
                          classNames={{
                            base: "max-w-full w-full bg-gray-50 hover:bg-gray-100 m-0 p-4 rounded-lg border-2 border-transparent data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-50 transition-all duration-300",
                            label: "w-full"
                          }}
                          key={service.id}
                          value={service.id}
                        >
                          <div className='flex w-full items-center justify-between'>
                            <div className='flex flex-col'>
                              <span className='font-semibold text-gray-900'>
                                {service.name}
                              </span>
                              <span className='text-sm text-gray-600'>
                                {service.duration} dakika
                              </span>
                            </div>
                            <div className='text-right'>
                              <span className='text-2xl font-bold text-blue-600'>
                                {service.price} ₺
                              </span>
                            </div>
                          </div>
                        </Checkbox>
                      ))}
                    </div>
                  </CheckboxGroup>
                </CardBody>
                <CardFooter className='px-6 pb-6'>
                  <Button
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white hover:from-blue-700 hover:to-purple-700'
                    isDisabled={!canProceedToNext()}
                    onPress={() => setCurrentStep(2)}
                    size='lg'
                  >
                    Devam Et - Tarih Seç
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 2 && (
              <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
                <CardHeader className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
                  <div className='flex items-center gap-3'>
                    <CalendarDays className='h-6 w-6' />
                    <div>
                      <h2 className='text-xl font-bold'>Tarih ve Saat Seçin</h2>
                      <p className='text-sm text-blue-100'>
                        Uygun tarihinizi ve saatinizi belirleyin
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className='p-6'>
                  <div className='grid gap-6 md:grid-cols-2'>
                    <div>
                      <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                        Tarih Seçin
                      </h3>
                      <Calendar
                        classNames={{
                          base: "bg-white shadow-lg rounded-lg",
                          cell: "hover:bg-blue-50",
                          gridHeader: "bg-gray-50",
                          headerWrapper:
                            "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg"
                        }}
                        isDateUnavailable={(date) => isWeekend(date, locale)}
                        maxValue={today(getLocalTimeZone()).add({ months: 1 })}
                        minValue={today(getLocalTimeZone())}
                        onChange={setSelectedDate}
                        value={selectedDate}
                      />
                    </div>
                    <div>
                      <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                        Saat Seçin
                      </h3>
                      <HourSelector
                        selected={selectedHours}
                        setSelected={setSelectedHours}
                      />
                    </div>
                  </div>
                </CardBody>
                <CardFooter className='flex gap-3 px-6 pb-6'>
                  <Button
                    className='flex-1'
                    onPress={() => setCurrentStep(1)}
                    size='lg'
                    variant='bordered'
                  >
                    Geri
                  </Button>
                  <Button
                    className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white hover:from-blue-700 hover:to-purple-700'
                    isDisabled={!canProceedToNext()}
                    onPress={() => setCurrentStep(3)}
                    size='lg'
                  >
                    Devam Et - Onayla
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
                <CardHeader className='bg-gradient-to-r from-green-600 to-blue-600 text-white'>
                  <div className='flex items-center gap-3'>
                    <CheckCircle className='h-6 w-6' />
                    <div>
                      <h2 className='text-xl font-bold'>Randevu Onayı</h2>
                      <p className='text-sm text-green-100'>
                        Bilgilerinizi kontrol edin ve onaylayın
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className='p-6'>
                  <div className='space-y-6'>
                    {/* Salon Info */}
                    <div className='rounded-lg bg-gray-50 p-4'>
                      <h3 className='mb-2 flex items-center gap-2 font-semibold text-gray-900'>
                        <MapPin className='h-4 w-4' />
                        Salon Bilgileri
                      </h3>
                      <p className='text-gray-700'>{business.name}</p>
                      <p className='text-sm text-gray-600'>
                        {business.district}, {business.city}
                      </p>
                    </div>

                    {/* Selected Services */}
                    <div className='rounded-lg bg-blue-50 p-4'>
                      <h3 className='mb-3 flex items-center gap-2 font-semibold text-gray-900'>
                        <Sparkles className='h-4 w-4' />
                        Seçilen Hizmetler
                      </h3>
                      <div className='space-y-2'>
                        {services.items
                          .filter((service) =>
                            selectedServices.includes(service.id)
                          )
                          .map((service) => (
                            <div
                              className='flex items-center justify-between rounded bg-white p-3'
                              key={service.id}
                            >
                              <div>
                                <span className='font-medium'>
                                  {service.name}
                                </span>
                                <span className='ml-2 text-sm text-gray-600'>
                                  ({service.duration} dk)
                                </span>
                              </div>
                              <span className='font-bold text-blue-600'>
                                {service.price} ₺
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className='rounded-lg bg-purple-50 p-4'>
                      <h3 className='mb-2 flex items-center gap-2 font-semibold text-gray-900'>
                        <Clock className='h-4 w-4' />
                        Randevu Zamanı
                      </h3>
                      <p className='text-gray-700'>
                        {selectedDate
                          .toDate(getLocalTimeZone())
                          .toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            weekday: "long",
                            year: "numeric"
                          })}
                      </p>
                      <p className='text-gray-600'>
                        Saat: {selectedHours.toString().padStart(2, "0")}:00
                      </p>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className='flex gap-3 px-6 pb-6'>
                  <Button
                    className='flex-1'
                    onPress={() => setCurrentStep(2)}
                    size='lg'
                    variant='bordered'
                  >
                    Geri
                  </Button>
                  <Button
                    className='flex-1 bg-gradient-to-r from-green-600 to-blue-600 font-medium text-white hover:from-green-700 hover:to-blue-700'
                    onPress={onSubmit}
                    size='lg'
                    startContent={<CheckCircle className='h-5 w-5' />}
                  >
                    Randevuyu Onayla
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 space-y-6'>
              {/* Salon Card */}
              <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
                <CardHeader className='p-0'>
                  <Image
                    alt={business.name}
                    className='h-48 w-full object-cover'
                    src='https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                  />
                </CardHeader>
                <CardBody className='p-4'>
                  <h3 className='mb-2 text-xl font-bold text-gray-900'>
                    {business.name}
                  </h3>
                  <div className='mb-3 flex items-center gap-2 text-gray-600'>
                    <MapPin className='h-4 w-4' />
                    <span className='text-sm'>
                      {business.district}, {business.city}
                    </span>
                  </div>
                  <div className='mb-3 flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      <Star className='h-4 w-4 fill-current text-yellow-400' />
                      <span className='text-sm font-medium'>4.8</span>
                    </div>
                    <div className='flex items-center gap-1 text-gray-600'>
                      <Users className='h-4 w-4' />
                      <span className='text-sm'>150+ yorum</span>
                    </div>
                  </div>
                  {business.phone && (
                    <div className='flex items-center gap-2 text-blue-600'>
                      <Phone className='h-4 w-4' />
                      <span className='text-sm'>{business.phone}</span>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Summary Card */}
              {(selectedServices.length > 0 || currentStep > 1) && (
                <Card className='border-0 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl'>
                  <CardHeader>
                    <h3 className='flex items-center gap-2 text-lg font-bold text-gray-900'>
                      <CreditCard className='h-5 w-5' />
                      Randevu Özeti
                    </h3>
                  </CardHeader>
                  <CardBody className='pt-0'>
                    <div className='space-y-4'>
                      {selectedServices.length > 0 && (
                        <div>
                          <div className='mb-2 flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-700'>
                              Hizmet Sayısı
                            </span>
                            <Chip
                              color='primary'
                              size='sm'
                            >
                              {selectedServices.length}
                            </Chip>
                          </div>
                          <div className='mb-2 flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-700'>
                              Toplam Süre
                            </span>
                            <span className='text-sm text-gray-600'>
                              {totalDuration} dakika
                            </span>
                          </div>
                        </div>
                      )}

                      {currentStep >= 2 &&
                        selectedDate &&
                        selectedHours > 0 && (
                          <div className='rounded-lg bg-white p-3'>
                            <div className='mb-1 text-sm text-gray-600'>
                              Randevu Zamanı
                            </div>
                            <div className='font-medium text-gray-900'>
                              {selectedDate
                                .toDate(getLocalTimeZone())
                                .toLocaleDateString("tr-TR")}
                            </div>
                            <div className='text-sm text-gray-600'>
                              {selectedHours.toString().padStart(2, "0")}:00
                            </div>
                          </div>
                        )}

                      <Divider />

                      <div className='flex items-center justify-between'>
                        <span className='font-bold text-gray-900'>
                          Toplam Tutar
                        </span>
                        <span className='text-2xl font-bold text-blue-600'>
                          {totalPrice} ₺
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
