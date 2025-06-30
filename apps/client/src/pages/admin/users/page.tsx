import { Button, Pagination } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

import type { Paginated, User } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  const { data: users } = await http.get<Paginated<User>>("/users", {
    params: { include: "profile", limit, offset }
  });

  return { users };
};

export default function Users() {
  const { users } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
    phone: user.phone ?? "-",
    "profile.displayName": user.profile?.displayName ?? "-",
    updatedAt: new Date(user.updatedAt).toLocaleDateString()
  }));

  const currentPage = users.meta.page;
  const totalPages = users.meta.pageCount;

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

      <div className='mt-4 flex justify-end'>
        <Pagination
          onChange={(page) => {
            searchParams.set("page", page.toString());
            setSearchParams(searchParams);
          }}
          page={currentPage}
          total={totalPages}
        />
      </div>
    </div>
  );
}
