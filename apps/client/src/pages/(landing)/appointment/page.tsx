import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Select,
  SelectItem
} from "@heroui/react";
import { useNavigate } from "react-router";

import { useCities } from "~/hooks/use-cities";
import { BusinessType } from "~/types";

export default function Page() {
  const { cities, districts, setSelectedCity } = useCities();
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

  return (
    <div className='container grid h-screen place-items-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <h2 className='text-xl font-semibold'>Randevu Al</h2>
        </CardHeader>
        <CardBody>
          <Form
            className='grid gap-3'
            onSubmit={onSubmit}
          >
            <Autocomplete
              defaultItems={cities}
              isRequired
              label='İl'
              name='city'
              onSelectionChange={(key) =>
                setSelectedCity(key?.toString() ?? null)
              }
            >
              {(item) => (
                <AutocompleteItem
                  className='capitalize'
                  key={item.name}
                >
                  {item.name}
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Autocomplete
              defaultItems={districts}
              isRequired
              label='İlçe'
              name='district'
            >
              {(item) => (
                <AutocompleteItem
                  className='capitalize'
                  key={item.name}
                >
                  {item.name}
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Select
              isRequired
              items={Object.values(BusinessType).map((type) => ({
                key: type,
                label: type.charAt(0).toUpperCase() + type.slice(1)
              }))}
              label='Tür'
              name='type'
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            <Button
              color='primary'
              type='submit'
            >
              Randevu Al
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
