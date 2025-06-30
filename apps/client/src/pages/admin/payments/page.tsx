import { Button } from "@heroui/react";
import { LucideFilter } from "lucide-react";
// routes/admin/payments.tsx
import { useLoaderData } from "react-router";

import type { Pagination, Payment } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async () => {
  const { data: payments } = await http.get<Pagination<Payment>>("/payments", {
    params: { include: "appointment" }
  });

  return { payments };
};

export default function Payments() {
  const { payments } = useLoaderData<typeof clientLoader>();

  const columns = [
    { key: "cardHolder", label: "Kart Sahibi" },
    { key: "cardLast4", label: "Son 4 Hane" },
    { key: "status", label: "Durum" },
    { key: "createdAt", label: "Tarih" }
  ];

  const items = payments.items.map((p) => ({
    cardHolder: p.cardHolder,
    cardLast4: `**** **** **** ${p.cardLast4}`,
    createdAt: new Date(p.createdAt).toLocaleString(),
    key: p.id,
    status: p.status
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <h2 className='text-xl font-semibold'>Ödemeler</h2>
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
      />
    </div>
  );
}
