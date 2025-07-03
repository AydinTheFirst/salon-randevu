import { DatePicker } from "@heroui/react";
import { parseDateTime } from "@internationalized/date";
import React from "react";

export default function Page() {
  const [date, setDate] = React.useState(
    parseDateTime("2024-07-29T10:30:00")
  ); // Default to a value for demonstration

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold mb-4'>Dashboard</h1>
      <p className='mb-4'>Appointments Calendar:</p>
      <DatePicker
        aria-label='Appointment date'
        className='w-full'
        granularity='minute'
        label='Appointment Date'
        onChange={setDate}
        value={date}
      />
      {/* More dashboard content can be added here */}
    </div>
  );
}
