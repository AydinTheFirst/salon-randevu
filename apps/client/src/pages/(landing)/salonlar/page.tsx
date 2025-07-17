import { useLoaderData } from "react-router";

import BusinessCard from "~/components/business-card";
import { http } from "~/lib/http";
import { type Business, type Paginated } from "~/types";

import type { Route } from "./+types/page";

import FilterBusinesses from "./filter";

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
    <>
      <div className='container grid gap-5 py-10'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div>
            <h2 className='text-xl font-semibold'>Salonlar</h2>
          </div>
          <div className='flex justify-end'>
            <FilterBusinesses />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {businesses.items.map((business) => (
            <BusinessCard
              business={business}
              key={business.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/**
 *   const { cities, districts, setSelectedCity } = useCities();
  const navigate = useNavigate();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const url = new URL("/appointment/search", window.location.origin);

    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;
      url.searchParams.set(key, value.toString());
    }

    navigate({
      pathname: url.pathname,
      search: url.search
    });
  };
 */
