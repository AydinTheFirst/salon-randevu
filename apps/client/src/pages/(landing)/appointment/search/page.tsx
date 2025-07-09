import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useLoaderData } from "react-router";

import type { Business, Paginated } from "~/types";

import { http } from "~/lib/http";

import type { Route } from "./+types/page";

import BusinessCard from "./business-card";

export const clientLoader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);

  const { data: businesses } = await http.get<Paginated<Business>>(
    "/businesses",
    {
      params: url.searchParams
    }
  );

  return { businesses };
};

export default function Search() {
  const { businesses } = useLoaderData<typeof clientLoader>();

  console.log("businesses", businesses);

  return (
    <div className='container py-10'>
      <div className='grid gap-5'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div>
            <h2 className='text-xl font-semibold'>Arama Sonuçları</h2>
            <p className='text-sm text-gray-500'>
              Toplam {businesses.items.length} sonuç bulundu.
            </p>
          </div>
          <div className='flex items-end justify-end'>
            <Button
              isIconOnly
              variant='light'
            >
              <Icon
                className='h-5 w-5'
                icon='lucide:filter'
              />
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {businesses.items.map((business) => (
            <BusinessCard
              business={business}
              key={business.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
