import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Link
} from "@heroui/react";
import { Heart, MapPin, Phone, Star, Users } from "lucide-react";
import { useLoaderData } from "react-router";

import { http } from "~/lib/http";
import { useFavoritesStore } from "~/store/favorites-store";
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
  const { favorites, isFavorite, toggleFavorite } = useFavoritesStore();

  const BusinessCardNew = ({ business }: { business: Business }) => (
    <Card className='group border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'>
      <CardHeader className='relative overflow-hidden p-0'>
        <div className='relative h-48 w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500'>
          <Image
            alt={business.name}
            className='absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-60'
            src='https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />

          {/* Favorite Button */}
          <button
            className={`absolute top-3 right-3 transform rounded-full p-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
              isFavorite(business.id)
                ? "scale-105 bg-red-500 text-white shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
            onClick={() => toggleFavorite(business.id)}
          >
            <Heart
              className={`h-4 w-4 transition-transform duration-300 ${
                isFavorite(business.id) ? "scale-110 fill-current" : ""
              }`}
            />
          </button>

          {/* Business Type Badge */}
          <div className='absolute top-3 left-3'>
            <Chip
              className='bg-white/20 font-medium text-white'
              size='sm'
              variant='flat'
            >
              {business.type === "SALON" ? "Güzellik Salonu" : "Berber"}
            </Chip>
          </div>

          {/* Rating */}
          <div className='absolute bottom-3 left-3 flex items-center gap-1'>
            <div className='flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm'>
              <Star className='h-3 w-3 fill-current text-yellow-400' />
              <span className='text-xs font-medium text-white'>4.8</span>
            </div>
          </div>

          {/* Favorite Badge */}
          {isFavorite(business.id) && (
            <div className='absolute right-3 bottom-3'>
              <Chip
                className='animate-pulse bg-red-500/90 font-medium text-white'
                size='sm'
                variant='flat'
              >
                ❤️ Favorim
              </Chip>
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody className='p-4'>
        <div className='space-y-3'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h3 className='text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                {business.name}
              </h3>
              <div className='mt-1 flex items-center gap-1 text-gray-600'>
                <MapPin className='h-4 w-4' />
                <span className='text-sm'>
                  {business.district}, {business.city}
                </span>
              </div>
            </div>
            <Avatar
              className='bg-gradient-to-br from-blue-500 to-purple-600 text-white'
              fallback={business.name.charAt(0)}
              size='sm'
            />
          </div>

          {business.description && (
            <p className='line-clamp-2 text-sm text-gray-600'>
              {business.description}
            </p>
          )}

          <div className='flex items-center justify-between pt-2'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1 text-green-600'>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                <span className='text-xs font-medium'>Açık</span>
              </div>
              {business.phone && (
                <Link
                  className='flex items-center gap-1 text-blue-600 hover:text-blue-800'
                  href={`tel:${business.phone}`}
                  size='sm'
                >
                  <Phone className='h-3 w-3' />
                  <span className='text-xs'>Ara</span>
                </Link>
              )}
            </div>
            <Chip
              color='primary'
              size='sm'
              variant='flat'
            >
              <span className='flex'>
                <Users className='mr-1 h-3 w-3' />
                12+ hizmet
              </span>
            </Chip>
          </div>
        </div>
      </CardBody>

      <CardFooter className='px-4 pt-0 pb-4'>
        <Button
          as={Link}
          className='w-full bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white hover:from-blue-700 hover:to-purple-700'
          href={`/salonlar/${business.id}`}
          size='sm'
        >
          Detayları Gör & Randevu Al
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'>
      <div className='container py-12'>
        {/* Hero Section */}
        <div className='mb-12 text-center'>
          <div className='mx-auto max-w-3xl'>
            <h1 className='mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-bold text-transparent'>
              Güzellik & Bakım Salonları
            </h1>
            <p className='mb-8 text-xl text-gray-600'>
              Şehrinizdeki en iyi güzellik salonları ve berberleri keşfedin.
              Hemen randevu alın!
            </p>

            {/* Stats */}
            <div className='mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-4'>
              <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
                <CardBody className='py-4 text-center'>
                  <div className='text-3xl font-bold text-blue-600'>
                    {businesses.items.length}
                  </div>
                  <div className='text-sm text-gray-600'>Kayıtlı Salon</div>
                </CardBody>
              </Card>
              <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
                <CardBody className='py-4 text-center'>
                  <div className='text-3xl font-bold text-purple-600'>50K+</div>
                  <div className='text-sm text-gray-600'>Mutlu Müşteri</div>
                </CardBody>
              </Card>
              <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
                <CardBody className='py-4 text-center'>
                  <div className='text-3xl font-bold text-pink-600'>4.9</div>
                  <div className='text-sm text-gray-600'>Ortalama Puan</div>
                </CardBody>
              </Card>
              <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
                <CardBody className='py-4 text-center'>
                  <div className='text-3xl font-bold text-red-600'>
                    {favorites.length}
                  </div>
                  <div className='text-sm text-gray-600'>Favori Salon</div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div></div>

          <div className='flex justify-end'>
            <FilterBusinesses />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {businesses.items?.map((business) => (
            <BusinessCardNew
              business={business}
              key={business.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
