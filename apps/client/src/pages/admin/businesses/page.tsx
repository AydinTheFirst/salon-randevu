import { Button } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";

import type { Business, Pagination } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async () => {
  const { data: businesses } =
    await http.get<Pagination<Business>>("/businesses");

  return { businesses };
};

export default function Businesses() {
  const { businesses } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  const columns = [
    { key: "name", label: "İşletme Adı" },
    { key: "type", label: "Tür" },
    { key: "district", label: "İlçe" },
    { key: "phone", label: "Telefon" },
    { key: "createdAt", label: "Oluşturulma" }
  ];

  const items = businesses.items.map((biz) => ({
    createdAt: new Date(biz.createdAt).toLocaleDateString(),
    district: biz.district,
    key: biz.id,
    name: biz.name,
    phone: biz.phone,
    type: biz.type
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div>
          <h2 className='text-xl font-semibold'>İşletmeler</h2>
          <small className='text-muted'></small>
        </div>
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
        onRowAction={(row) => navigate(`/admin/businesses/${row}`)}
      />
    </div>
  );
}
