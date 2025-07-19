import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  useDisclosure
} from "@heroui/react";
import { Filter, Search, Sparkles, X } from "lucide-react";
import { useSearchParams } from "react-router";

import { BusinessType } from "~/types";

export default function FilterBusinesses() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFiltersCount = Array.from(searchParams.entries()).filter(
    ([key, value]) => value && key !== "page"
  ).length;

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newSearchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;
      newSearchParams.set(key, value.toString());
    }

    setSearchParams(newSearchParams);
    onClose();
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    onClose();
  };

  return (
    <>
      <Button
        endContent={
          activeFiltersCount > 0 ? (
            <Chip
              className='ml-1 bg-white/20 text-white'
              size='sm'
            >
              {activeFiltersCount}
            </Chip>
          ) : null
        }
        onPress={onOpen}
        startContent={<Filter className='h-4 w-4' />}
        variant={activeFiltersCount > 0 ? "solid" : "faded"}
      >
        Filtrele
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='right'
        size='sm'
      >
        <DrawerContent>
          <DrawerHeader className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5' />
              <span className='text-lg font-bold'>Salon Filtreleme</span>
            </div>
            <p className='text-sm'>
              İstediğiniz kriterlere göre salonları filtreleyin
            </p>
          </DrawerHeader>

          <DrawerBody className='px-6 py-6'>
            <form
              className='space-y-6'
              onSubmit={onSubmit}
            >
              <div className='space-y-2'>
                <Input
                  defaultValue={searchParams.get("search") ?? ""}
                  label='Salon Adı'
                  labelPlacement='outside'
                  name='search'
                  placeholder='Salon adı yazın...'
                  startContent={<Search className='h-4 w-4 text-gray-400' />}
                  variant='faded'
                />
              </div>

              <div className='space-y-2'>
                <Autocomplete
                  defaultSelectedKey={searchParams.get("type") ?? ""}
                  label='Salon Türü'
                  labelPlacement='outside'
                  name='type'
                  placeholder='Tür seçin...'
                  variant='faded'
                >
                  <AutocompleteItem
                    key={BusinessType.BARBER}
                    startContent={<span className='text-blue-600'>✂️</span>}
                  >
                    Berber
                  </AutocompleteItem>
                  <AutocompleteItem
                    key={BusinessType.SALON}
                    startContent={<span className='text-pink-600'>💄</span>}
                  >
                    Güzellik Salonu
                  </AutocompleteItem>
                </Autocomplete>
              </div>

              <div className='space-y-3 pt-4'>
                <Button
                  fullWidth
                  startContent={<Filter className='h-4 w-4' />}
                  type='submit'
                >
                  Filtreleri Uygula
                </Button>

                {activeFiltersCount > 0 && (
                  <Button
                    className='w-full'
                    color='danger'
                    onPress={clearFilters}
                    size='lg'
                    startContent={<X className='h-4 w-4' />}
                    variant='faded'
                  >
                    Filtreleri Temizle
                  </Button>
                )}
              </div>
            </form>
          </DrawerBody>

          <DrawerFooter className='bg-gray-50 px-6'>
            <Button
              className='w-full'
              onPress={onClose}
              variant='light'
            >
              Kapat
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
