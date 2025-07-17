import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  useDisclosure
} from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useSearchParams } from "react-router";

import { BusinessType } from "~/types";

export default function App() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  const [searchParams, setSearchParams] = useSearchParams();

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

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideFilter />
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          <DrawerHeader className='flex flex-col gap-1'>
            Salonlarda Filtreleme
          </DrawerHeader>
          <DrawerBody>
            <form
              className='grid gap-3'
              onSubmit={onSubmit}
            >
              <Input
                defaultValue={searchParams.get("search") ?? ""}
                label='Salon Adı'
                name='search'
              />

              <Autocomplete
                defaultSelectedKey={searchParams.get("type") ?? ""}
                label='Tür'
                name='type'
              >
                <AutocompleteItem key={BusinessType.BARBER}>
                  Berber
                </AutocompleteItem>
                <AutocompleteItem key={BusinessType.SALON}>
                  Güzellik Salonu
                </AutocompleteItem>
              </Autocomplete>

              <Button
                color='primary'
                type='submit'
              >
                Filtrele
              </Button>
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button
              color='danger'
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
