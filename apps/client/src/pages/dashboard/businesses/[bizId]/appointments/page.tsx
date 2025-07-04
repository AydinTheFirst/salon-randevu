import { Button, Pagination } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

import type { Appointment, Paginated } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

// loader
export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  const { data: appointments } = await http.get<Paginated<Appointment>>(
    "/appointments",
    {
      params: {
        include: "user,business",
        limit,
        offset
      }
    }
  );

  return { appointments };
};

// component
export default function Appointments() {
  const navigate = useNavigate();
  const { appointments } = useLoaderData<typeof clientLoader>();
  const [, setSearchParams] = useSearchParams();

  const columns = [
    { key: "appointmentAt", label: "Randevu Tarihi" },
    { key: "user.email", label: "Kullanıcı" },
    { key: "business.name", label: "İşletme" },
    { key: "phone", label: "Telefon" }
  ];

  const items = appointments.items.map((a) => ({
    appointmentAt: new Date(a.date).toLocaleString(),
    "business.name": a.business?.name ?? "-",
    key: a.id,
    phone: a.phone,
    "user.email": a.user?.email ?? "-"
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <h2 className='text-xl font-semibold'>Randevular</h2>
        <div className='flex justify-end gap-2'>
          <Button
            onPress={() => navigate("/dashboard/appointments/create")}
            variant='flat'
          >
            Yeni Randevu Ekle
          </Button>
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
        onRowAction={(row) => navigate(`/dashboard/appointments/${row}`)}
      />
      <div className='flex justify-end'>
        <Pagination
          onChange={(page) =>
            setSearchParams((prev) => {
              prev.set("page", String(page));
              return prev;
            })
          }
          page={appointments.meta.page}
          total={appointments.meta.pageCount}
        />
      </div>
    </div>
  );
}
