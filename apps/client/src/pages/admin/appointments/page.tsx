import { Button } from "@heroui/react";
import { LucideFilter } from "lucide-react";
// routes/admin/appointments.tsx
import { useLoaderData, useNavigate } from "react-router";

import type { Appointment, Pagination } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async () => {
  const { data: appointments } = await http.get<Pagination<Appointment>>(
    "/appointments",
    {
      params: { include: "user,business" }
    }
  );

  return { appointments };
};

export default function Appointments() {
  const navigate = useNavigate();
  const { appointments } = useLoaderData<typeof clientLoader>();

  const columns = [
    { key: "appointmentAt", label: "Randevu Tarihi" },
    { key: "user.email", label: "Kullanıcı" },
    { key: "business.name", label: "İşletme" },
    { key: "phone", label: "Telefon" }
  ];

  const items = appointments.items.map((a) => ({
    appointmentAt: new Date(a.appointmentAt).toLocaleString(),
    "business.name": a.business?.name ?? "-",
    key: a.id,
    phone: a.phone,
    "user.email": a.user?.email ?? "-"
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <h2 className='text-xl font-semibold'>Randevular</h2>
        <div className='flex justify-end'>
          <Button
            isIconOnly
            variant='light'
          >
            <LucideFilter />
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        items={items}
        onRowAction={(row) => navigate(`/admin/appointments/${row}`)}
      />
    </div>
  );
}
