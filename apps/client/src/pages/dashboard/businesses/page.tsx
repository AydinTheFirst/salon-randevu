import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Link,
  Pagination
} from "@heroui/react";
import { LucideMapPin } from "lucide-react";
import { useLoaderData } from "react-router";

import type { Business, Paginated } from "~/types";

import { http } from "~/lib/http";

import type { Route } from "./+types/page";

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;
  url.searchParams.set("offset", offset.toString());

  const { data: businesses } = await http.get<Paginated<Business>>(
    "/businesses",
    {
      params: url.searchParams
    }
  );

  return { businesses };
};

export default function Page() {
  const { businesses } = useLoaderData<typeof clientLoader>();

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-semibold'>İşletmelerim</h2>
          <p className='text-muted text-sm'>
            Sahip olduğunuz işletemeler burada görüntülenir
          </p>
        </div>
        <div className='flex justify-end'></div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {businesses.items.map((business) => (
          <Card key={business.id}>
            <CardHeader className='from-primary to-secondary h-32 bg-gradient-to-tr'></CardHeader>
            <CardBody className='grid gap-3'>
              <h3 className='font-semibold'>{business.name}</h3>
              <span className='text-muted text-sm'>
                <LucideMapPin className='mr-1 inline h-4 w-4' />
                {business.district} / {business.city}
              </span>
              <p className='text-muted text-xs'>{business.description}</p>
              <Button
                as={Link}
                color='primary'
                fullWidth
                href={`/manage/${business.id}`}
              >
                Yönet
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className='grid place-items-center'>
        <Pagination total={businesses.meta.total} />
      </div>
    </div>
  );
}
