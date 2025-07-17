import { Button, Calendar, type DateValue } from "@heroui/react";
import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  cn,
  Image
} from "@heroui/react";
import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import { DateTime } from "ts-luxon";

import type { Business, Paginated, Service } from "~/types";

import HourSelector from "~/components/hour-selector";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
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
  const [selectedHours, setSelectedHours] = React.useState<number[]>([]);

  const onSubmit = async () => {
    try {
      await http.post("/appointments", {
        businessId: business.id,
        date: DateTime.fromJSDate(selectedDate.toDate(getLocalTimeZone())).set({
          hours: selectedHours[0]
        }),
        services: selectedServices,
        userId: user?.id
      });
      toast.success("Randevunuz başarıyla oluşturuldu!");
      navigate(`/salonlar/${business.id}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='container py-10'>
      <div className='grid grid-cols-12 gap-6'>
        <div className='col-span-12 md:col-span-3'>
          <div className='grid gap-3'>
            <Image
              className='h-56'
              src='https://placehold.co/600x400'
            />
            <h2 className='text-xl font-semibold'>{business.name}</h2>
            <span className='text-muted'>
              {business.district} / {business.city}
            </span>
          </div>
        </div>
        <div className='col-span-12 md:col-span-9'>
          <Accordion variant='bordered'>
            <AccordionItem title='Hizmetler'>
              <CheckboxGroup
                label='İstediğiniz hizmetleri seçiniz'
                onValueChange={setSelectedServices}
                value={selectedServices}
              >
                {services.items.map((service) => (
                  <Checkbox
                    classNames={{
                      base: cn(
                        "inline-flex min-w-full bg-content1 m-0",
                        "hover:bg-content2 items-center justify-start",
                        "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary"
                      ),
                      label: "w-full"
                    }}
                    key={service.id}
                    value={service.id}
                  >
                    <div className='flex flex-col gap-1'>
                      <strong>{service.name}</strong>
                      <span className='text-muted'> - {service.price} TL</span>
                      <span className='text-muted'>
                        - {service.duration} dk
                      </span>
                    </div>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </AccordionItem>
            <AccordionItem title='Randevu Tarihi'>
              <div className='flex w-full gap-3'>
                <Calendar
                  isDateUnavailable={(date) => isWeekend(date, locale)}
                  maxValue={today(getLocalTimeZone()).add({ months: 1 })}
                  minValue={today(getLocalTimeZone())}
                  onChange={setSelectedDate}
                  value={selectedDate}
                />
                <HourSelector
                  selected={selectedHours}
                  setSelected={setSelectedHours}
                />
              </div>
            </AccordionItem>

            <AccordionItem title='Özet'>
              <div className='grid gap-3'>
                <h3 className='text-lg font-semibold'>Randevu Özeti</h3>
                <ul className='grid gap-2'>
                  <li className='flex justify-between'>
                    <strong>Salon Adı:</strong>
                    <span>{business.name}</span>
                  </li>
                  <li className='flex justify-between'>
                    <strong>Seçilen Hizmetler:</strong>
                    <span>{selectedServices.length}</span>
                  </li>
                  <li className='flex justify-between'>
                    <strong>Randevu Tarihi:</strong>
                    <span>
                      {selectedDate
                        .toDate(getLocalTimeZone())
                        .toLocaleDateString()}
                    </span>
                  </li>
                  <li className='flex justify-between'>
                    <strong>Randevu Saati:</strong>
                    <span>
                      {selectedHours
                        .map((hour) => `${hour.toString().padStart(2, "0")}:00`)
                        .join(", ")}
                    </span>
                  </li>
                  <li className='flex justify-between'>
                    <strong>Toplam Fiyat:</strong>
                    <span>
                      {services.items
                        .filter((service) =>
                          selectedServices.includes(service.id)
                        )
                        .reduce(
                          (total, service) => total + service.price,
                          0
                        )}{" "}
                      TL
                    </span>
                  </li>
                </ul>
                <Button
                  color='primary'
                  onPress={onSubmit}
                >
                  Randevuyu Onayla
                </Button>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
