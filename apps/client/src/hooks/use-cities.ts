import React from "react";

import cities from "~/data/cities.json";

export function useCities() {
  const [selectedCity, setSelectedCity] = React.useState<null | string>(null);

  const districts = React.useMemo(() => {
    if (!selectedCity) return [];
    return (
      cities.data.find((city) => city.name === selectedCity)?.districts || []
    );
  }, [selectedCity]);

  return {
    cities: cities.data,
    districts,
    selectedCity,
    setSelectedCity
  };
}
