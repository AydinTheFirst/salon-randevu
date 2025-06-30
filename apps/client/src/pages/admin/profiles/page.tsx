import { Button } from "@heroui/react";
import { LucideFilter } from "lucide-react";
// routes/admin/profiles.tsx
import { useLoaderData } from "react-router";

import type { Pagination, Profile } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async () => {
  const { data: profiles } = await http.get<Pagination<Profile>>("/profiles", {
    params: { include: "user" }
  });

  return { profiles };
};

export default function Profiles() {
  const { profiles } = useLoaderData<typeof clientLoader>();

  const columns = [
    { key: "displayName", label: "İsim" },
    { key: "user.email", label: "Email" },
    { key: "bio", label: "Biyografi" },
    { key: "createdAt", label: "Oluşturulma" }
  ];

  const items = profiles.items.map((p) => ({
    bio: p.bio || "-",
    createdAt: new Date(p.createdAt).toLocaleDateString(),
    displayName: p.displayName,
    key: p.id,
    "user.email": p.user?.email ?? "-"
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <h2 className='text-xl font-semibold'>Profiller</h2>
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
