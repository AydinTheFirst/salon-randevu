import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Link
} from "@heroui/react";
import {
  Heart,
  MapPin,
  Phone,
  Search,
  Star,
  Trash2,
  Users
} from "lucide-react";
import { useLoaderData } from "react-router";

import type { Business, Paginated } from "~/types";

import { http } from "~/lib/http";
import { useFavoritesStore } from "~/store/favorites-store";

export const clientLoader = async () => {
  const { data: businesses } = await http.get<Paginated<Business>>(
    "/businesses",
    {
      params: {
        limit: 1000
      }
    }
  );

  return { businesses };
};

export default function FavoritesPage() {
  const { businesses } = useLoaderData<typeof clientLoader>();
  const { clearFavorites, isFavorite, removeFromFavorites } =
    useFavoritesStore();

  // Favori salonları filtrele
  const favoriteBusinesses = businesses.items.filter((business) =>
    isFavorite(business.id)
  );

  const handleRemoveFavorite = (businessId: string) => {
    removeFromFavorites(businessId);
  };

  const FavoriteBusinessCard = ({ business }: { business: Business }) => (
    <Card className='group border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'>
      <CardHeader className='relative overflow-hidden p-0'>
        <div className='relative h-48 w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500'>
          <Image
            alt={business.name}
            className='absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-60'
            src='https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />

          {/* Remove from Favorites Button */}
          <button
            className='absolute top-3 right-3 rounded-full bg-red-500 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-red-600'
            onClick={() => handleRemoveFavorite(business.id)}
            title='Favorilerden çıkar'
          >
            <Trash2 className='h-4 w-4' />
          </button>

          {/* Favorite Badge */}
          <div className='absolute top-3 left-3'>
            <Chip
              className='animate-pulse bg-red-500/90 font-medium text-white'
              size='sm'
              variant='flat'
            >
              ❤️ Favorim
            </Chip>
          </div>

          {/* Business Type Badge */}
          <div className='absolute bottom-3 left-3'>
            <Chip
              className='bg-white/20 font-medium text-white'
              size='sm'
              variant='flat'
            >
              {business.type === "SALON" ? "Güzellik Salonu" : "Berber"}
            </Chip>
          </div>

          {/* Rating */}
          <div className='absolute right-3 bottom-3 flex items-center gap-1'>
            <div className='flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm'>
              <Star className='h-3 w-3 fill-current text-yellow-400' />
              <span className='text-xs font-medium text-white'>4.8</span>
            </div>
          </div>
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
            <Heart className='h-5 w-5 fill-current text-red-500' />
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

  if (favoriteBusinesses.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'>
        <div className='container py-12'>
          {/* Header */}
          <div className='mb-12 text-center'>
            <h1 className='mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent'>
              Favori Salonlarım
            </h1>
            <p className='text-xl text-gray-600'>
              Beğendiğiniz salonları favorilerinize ekleyin
            </p>
          </div>

          {/* Empty State */}
          <div className='mx-auto max-w-md text-center'>
            <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
              <CardBody className='py-12'>
                <div className='mb-6 flex justify-center'>
                  <div className='rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-6'>
                    <Heart className='h-12 w-12 text-gray-400' />
                  </div>
                </div>
                <h3 className='mb-3 text-xl font-bold text-gray-900'>
                  Henüz favori salon yok
                </h3>
                <p className='mb-6 text-gray-600'>
                  Beğendiğiniz salonları favorilerinize ekleyerek daha sonra
                  kolayca ulaşabilirsiniz.
                </p>
                <Button
                  as={Link}
                  className='bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white hover:from-blue-700 hover:to-purple-700'
                  href='/salonlar'
                  size='lg'
                  startContent={<Search className='h-5 w-5' />}
                >
                  Salonları Keşfet
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'>
      <div className='container py-12'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent'>
            Favori Salonlarım
          </h1>
          <p className='mb-8 text-xl text-gray-600'>
            Beğendiğiniz {favoriteBusinesses.length} salon listenizde
          </p>

          {/* Stats */}
          <div className='mx-auto grid max-w-lg grid-cols-1 gap-6 md:grid-cols-2'>
            <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
              <CardBody className='py-4 text-center'>
                <div className='text-3xl font-bold text-red-600'>
                  {favoriteBusinesses.length}
                </div>
                <div className='text-sm text-gray-600'>Favori Salon</div>
              </CardBody>
            </Card>
            <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
              <CardBody className='py-4 text-center'>
                <div className='text-3xl font-bold text-purple-600'>
                  {favoriteBusinesses.filter((b) => b.type === "SALON").length}
                </div>
                <div className='text-sm text-gray-600'>Güzellik Salonu</div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className='mb-8 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              as={Link}
              href='/salonlar'
              startContent={<Search className='h-4 w-4' />}
              variant='bordered'
            >
              Daha Fazla Salon Keşfet
            </Button>
          </div>

          {favoriteBusinesses.length > 0 && (
            <Button
              className='text-red-600 hover:bg-red-50'
              onPress={clearFavorites}
              startContent={<Trash2 className='h-4 w-4' />}
              variant='light'
            >
              Tümünü Temizle
            </Button>
          )}
        </div>

        {/* Favorites Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {favoriteBusinesses.map((business) => (
            <FavoriteBusinessCard
              business={business}
              key={business.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
