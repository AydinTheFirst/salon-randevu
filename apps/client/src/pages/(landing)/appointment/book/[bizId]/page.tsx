import type { CalendarDate, TimeInputValue } from "@heroui/react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Input,
  Select,
  type Selection,
  SelectItem,
  TimeInput
} from "@heroui/react";
import { getLocalTimeZone, Time, today } from "@internationalized/date";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

import type { Business, Paginated, Service } from "~/types";

import { handleError, http } from "~/lib/http";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { bizId } = params;

  if (!bizId) {
    throw new Error("Business ID is required");
  }

  const { data: business } = await http.get<Business>(`/businesses/${bizId}`);
  const { data: services } = await http.get<Paginated<Service>>("services", {
    params: {
      businessId: bizId
    }
  });

  return { business, services };
};

const useSelectionValue = <T extends { id: string }>(
  selection: Selection,
  items: T[]
) => {
  if (typeof selection === "string" && selection === "all") {
    return items;
  }

  const selectedKeys = Array.from(selection);
  return items.filter((item) => selectedKeys.includes(item.id));
};

export default function Page() {
  const navigate = useNavigate();

  const { business, services } = useLoaderData<typeof clientLoader>();

  const [selectedServices, setSelectedServices] = React.useState<Selection>(
    new Set([])
  );
  const [date, setDate] = React.useState<CalendarDate>(
    today(getLocalTimeZone()).add({ days: 1 })
  );
  const [time, setTime] = React.useState<TimeInputValue>(new Time(9, 0));

  const selectedServicesItems = useSelectionValue(
    selectedServices,
    services.items
  );

  console.log("Selected Services:", selectedServicesItems);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const appointmentData = {
      businessId: business.id,
      date: new Date(
        date.year,
        date.month - 1,
        date.day,
        time.hour,
        time.minute
      ),
      fullName: data.fullName as string,
      phone: data.phone as string,
      services: selectedServicesItems.map((service) => service.id)
    };

    try {
      await http.post("/appointments", appointmentData);
      toast.success("Randevunuz başarıyla alındı!");
      navigate("/appointments");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='container py-10'>
      <Card className='mx-auto max-w-3xl'>
        <CardHeader>
          <h2>Randevu Al</h2>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={onSubmit}
          >
            <Input
              label='Adınız Soyadınız'
              name='fullName'
            />

            <Input
              label='Telefon Numaranız'
              name='phone'
            />

            <Select
              items={services.items}
              label='Servis Seçin'
              onSelectionChange={setSelectedServices}
              selectedKeys={selectedServices}
              selectionMode='multiple'
            >
              {(item) => (
                <SelectItem
                  key={item.id}
                  textValue={item.name}
                >
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-semibold'>{item.name}</span>
                    <span className='text-xs text-gray-500'>
                      {item.duration} dakika
                    </span>
                    <span className='text-lg text-gray-500'>
                      {item.price.toLocaleString("tr-TR", {
                        currency: "TRY",
                        style: "currency"
                      })}
                    </span>
                  </div>
                </SelectItem>
              )}
            </Select>

            <DatePicker
              label='Randevu Tarihi'
              maxValue={today(getLocalTimeZone()).add({ months: 1 })}
              minValue={today(getLocalTimeZone())}
              onChange={setDate}
              value={date}
            />

            <TimeInput
              label='Randevu Saati'
              maxValue={new Time(17)}
              minValue={new Time(9)}
              onChange={setTime}
              value={time}
            />

            <div className='flex justify-between'>
              <strong>Fiyat</strong>
              <span>
                {selectedServicesItems
                  .reduce((total, service) => total + service.price, 0)
                  .toLocaleString("tr-TR", {
                    currency: "TRY",
                    style: "currency"
                  })}
              </span>
            </div>

            <Button
              color='primary'
              type='submit'
            >
              Randevu Al
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
