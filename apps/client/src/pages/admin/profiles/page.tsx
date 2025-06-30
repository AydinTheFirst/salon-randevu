import { Button, Pagination } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData, useSearchParams } from "react-router";

import type { Paginated, Profile } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  const { data: profiles } = await http.get<Paginated<Profile>>("/profiles", {
    params: {
      include: "user",
      limit,
      offset
    }
  });

  return { profiles };
};

export default function Profiles() {
  const { profiles } = useLoaderData<typeof clientLoader>();
  const [, setSearchParams] = useSearchParams();

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

      <div className='flex justify-end'>
        <Pagination
          onChange={(page) => {
            setSearchParams((prev) => {
              prev.set("page", String(page));
              return prev;
            });
          }}
          page={profiles.meta.page}
          total={profiles.meta.pageCount}
        />
      </div>
    </div>
  );
}
