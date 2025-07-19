import type React from "react";

import { Checkbox } from "@heroui/react";

interface HourSelectorProps {
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
}

export default function HourSelector({
  selected,
  setSelected
}: HourSelectorProps) {
  const toggleHour = (hour: number) => {
    setSelected((prev) => (prev === hour ? -1 : hour));
  };

  function range(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  const hours = range(9, 17);

  return (
    <div className='grid grid-cols-4 gap-2'>
      {hours.map((hour) => (
        <Checkbox
          isSelected={selected === hour}
          onValueChange={() => toggleHour(hour)}
        >
          {hour.toString().padStart(2, "0")}:00
        </Checkbox>
      ))}
    </div>
  );
}
