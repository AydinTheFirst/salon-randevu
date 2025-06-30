import { Button } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";

import type { Pagination, User } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async () => {
  const { data: users } = await http.get<Pagination<User>>("/users", {
    params: { include: "profile" }
  });

  return { users };
};

export default function Users() {
  const { users } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  const columns = [
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone Number" },
    { key: "profile.displayName", label: "Display Name" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" }
  ];

  const items = users.items.map((user) => ({
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    email: user.email,
    key: user.id,
    phone: user.phone,
    "profile.displayName": user.profile?.displayName || "-",
    updatedAt: new Date(user.updatedAt).toLocaleDateString()
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div>
          <h2 className='text-xl font-semibold'>Kullanıcılar</h2>
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
        onRowAction={(row) => navigate(`/admin/users/${row}`)}
      />
    </div>
  );
}
