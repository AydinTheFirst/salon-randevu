import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  type DateValue,
  Select,
  SelectItem,
  Textarea
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useSWR from "swr";

import type { Business, Service } from "~/types";

import { http } from "~/lib/http";

export default function NewAppointmentPage() {
  const navigate = useNavigate();
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // İşletmeleri çek
  const { data: businessesData } = useSWR<{ items: Business[] }>(
    "/businesses",
    (url: string) => http.get(url).then((res) => res.data)
  );

  // Seçili işletmenin hizmetlerini çek
  const { data: servicesData } = useSWR<{ items: Service[] }>(
    selectedBusiness ? `/businesses/${selectedBusiness}/services` : null,
    (url: string) => http.get(url).then((res) => res.data)
  );

  const businesses = businessesData?.items || [];
  const services = servicesData?.items || [];

  // Çalışma saatleri (örnek)
  const workingHours = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30"
  ];

  const handleSubmit = async () => {
    if (
      !selectedBusiness ||
      selectedServices.length === 0 ||
      !selectedDate ||
      !selectedTime
    ) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        businessId: selectedBusiness,
        date: `${selectedDate.toString()}T${selectedTime}:00.000Z`,
        notes,
        serviceIds: selectedServices
      };

      await http.post("/appointments", appointmentData);
      toast.success("Randevu başarıyla oluşturuldu!");
      navigate("/appointments");
    } catch (error) {
      toast.error("Randevu oluşturulurken bir hata oluştu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedBiz = businesses.find((b) => b.id === selectedBusiness);
  const totalDuration = selectedServices.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return total + (service?.duration || 0);
  }, 0);

  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>
          Yeni Randevu Oluştur 📅
        </h1>
        <p className='text-gray-600'>
          Berber veya kuaför salonundan randevu alın
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Form */}
        <div className='space-y-6 lg:col-span-2'>
          {/* İşletme Seçimi */}
          <Card className='border-0 bg-white shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-blue-600' />
                <h3 className='text-lg font-semibold'>İşletme Seçin</h3>
              </div>
            </CardHeader>
            <CardBody>
              <Select
                className='w-full'
                onSelectionChange={(keys) => {
                  setSelectedBusiness(Array.from(keys)[0] as string);
                  setSelectedServices([]); // Reset services when business changes
                }}
                placeholder='Bir işletme seçin...'
                selectedKeys={selectedBusiness ? [selectedBusiness] : []}
              >
                {businesses.map((business) => (
                  <SelectItem key={business.id}>
                    {business.name} - {business.district}, {business.city}
                  </SelectItem>
                ))}
              </Select>

              {selectedBiz && (
                <div className='mt-4 rounded-lg bg-gray-50 p-3'>
                  <h4 className='font-medium'>{selectedBiz.name}</h4>
                  <p className='text-sm text-gray-600'>{selectedBiz.address}</p>
                  {selectedBiz.phone && (
                    <p className='text-sm text-gray-600'>{selectedBiz.phone}</p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Hizmet Seçimi */}
          {selectedBusiness && (
            <Card className='border-0 bg-white shadow-lg'>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <User className='h-5 w-5 text-blue-600' />
                  <h3 className='text-lg font-semibold'>Hizmetler</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className='space-y-3'>
                  {services.map((service) => (
                    <label
                      className='flex cursor-pointer items-center space-x-3'
                      key={service.id}
                    >
                      <input
                        checked={selectedServices.includes(service.id)}
                        className='form-checkbox h-4 w-4 text-blue-600'
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([
                              ...selectedServices,
                              service.id
                            ]);
                          } else {
                            setSelectedServices(
                              selectedServices.filter((id) => id !== service.id)
                            );
                          }
                        }}
                        type='checkbox'
                      />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium'>{service.name}</span>
                          <span className='font-semibold text-blue-600'>
                            ₺{service.price}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          {service.duration} dakika
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Tarih ve Saat Seçimi */}
          {selectedServices.length > 0 && (
            <Card className='border-0 bg-white shadow-lg'>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5 text-blue-600' />
                  <h3 className='text-lg font-semibold'>Tarih ve Saat</h3>
                </div>
              </CardHeader>
              <CardBody className='space-y-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Randevu Tarihi
                  </label>
                  <DatePicker
                    className='w-full'
                    minValue={today(getLocalTimeZone())}
                    onChange={setSelectedDate}
                    value={selectedDate}
                  />
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Randevu Saati
                  </label>
                  <Select
                    className='w-full'
                    onSelectionChange={(keys) =>
                      setSelectedTime(Array.from(keys)[0] as string)
                    }
                    placeholder='Bir saat seçin...'
                    selectedKeys={selectedTime ? [selectedTime] : []}
                  >
                    {workingHours.map((hour) => (
                      <SelectItem key={hour}>{hour}</SelectItem>
                    ))}
                  </Select>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Notlar */}
          {selectedDate && selectedTime && (
            <Card className='border-0 bg-white shadow-lg'>
              <CardHeader>
                <h3 className='text-lg font-semibold'>Ek Notlar (Opsiyonel)</h3>
              </CardHeader>
              <CardBody>
                <Textarea
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='Özel isteklerinizi veya notlarınızı yazın...'
                  value={notes}
                />
              </CardBody>
            </Card>
          )}
        </div>

        {/* Özet */}
        <div className='space-y-6'>
          <Card className='sticky top-6 border-0 bg-white shadow-lg'>
            <CardHeader>
              <h3 className='text-lg font-semibold'>Randevu Özeti</h3>
            </CardHeader>
            <CardBody className='space-y-4'>
              {selectedBiz && (
                <div>
                  <h4 className='font-medium text-gray-900'>İşletme</h4>
                  <p className='text-sm text-gray-600'>{selectedBiz.name}</p>
                </div>
              )}

              {selectedServices.length > 0 && (
                <div>
                  <h4 className='font-medium text-gray-900'>Hizmetler</h4>
                  <div className='space-y-1'>
                    {selectedServices.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId);
                      return service ? (
                        <div
                          className='flex justify-between text-sm'
                          key={serviceId}
                        >
                          <span>{service.name}</span>
                          <span>₺{service.price}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div>
                  <h4 className='font-medium text-gray-900'>Tarih & Saat</h4>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Calendar className='h-4 w-4' />
                    <span>{selectedDate.toString()}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Clock className='h-4 w-4' />
                    <span>{selectedTime}</span>
                  </div>
                </div>
              )}

              {totalDuration > 0 && (
                <div className='border-t pt-4'>
                  <div className='flex justify-between text-sm'>
                    <span>Toplam Süre:</span>
                    <span>{totalDuration} dakika</span>
                  </div>
                  <div className='flex justify-between font-medium'>
                    <span>Toplam Fiyat:</span>
                    <span>₺{totalPrice}</span>
                  </div>
                </div>
              )}

              <Button
                className='w-full'
                color='primary'
                isDisabled={
                  !selectedBusiness ||
                  selectedServices.length === 0 ||
                  !selectedDate ||
                  !selectedTime
                }
                isLoading={loading}
                onPress={handleSubmit}
              >
                Randevu Oluştur
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
