import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Link
} from "@heroui/react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useMemo, useState } from "react";

import type { Appointment } from "~/types";

interface CalendarProps {
  appointments: Appointment[];
}

export function AppointmentCalendar({ appointments }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Group appointments by date for calendar view
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    appointments.forEach((appointment) => {
      const dateKey = new Date(appointment.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appointment);
    });
    return grouped;
  }, [appointments]);

  // Get appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.toDateString();
    return appointmentsByDate[dateKey] || [];
  }, [selectedDate, appointmentsByDate]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toDateString();
      days.push({
        appointments: appointmentsByDate[dateKey] || [],
        date,
        day
      });
    }

    return days;
  }, [currentDate, appointmentsByDate]);

  const navigateMonth = (direction: "next" | "prev") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık"
  ];

  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  const handleDateClick = (date: Date) => {
    setSelectedDate(
      selectedDate?.toDateString() === date.toDateString() ? null : date
    );
  };

  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      <div className='lg:col-span-2'>
        <Card>
          <CardHeader className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className='flex gap-2'>
              <Button
                isIconOnly
                onPress={() => navigateMonth("prev")}
                size='sm'
                variant='flat'
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                isIconOnly
                onPress={() => navigateMonth("next")}
                size='sm'
                variant='flat'
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className='mb-4 grid grid-cols-7 gap-1'>
              {dayNames.map((day) => (
                <div
                  className='text-muted-foreground p-2 text-center text-sm font-medium'
                  key={day}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className='grid grid-cols-7 gap-1'>
              {calendarDays.map((dayInfo, index) => (
                <div
                  className={`border-divider min-h-[80px] rounded-lg border p-2 transition-colors ${dayInfo ? "hover:bg-content2 cursor-pointer" : ""} ${
                    dayInfo &&
                    selectedDate?.toDateString() === dayInfo.date.toDateString()
                      ? "bg-primary/10 border-primary"
                      : ""
                  } `}
                  key={index}
                  onClick={() => dayInfo && handleDateClick(dayInfo.date)}
                >
                  {dayInfo && (
                    <>
                      <div className='mb-1 text-sm font-medium'>
                        {dayInfo.day}
                      </div>
                      <div className='space-y-1'>
                        {dayInfo.appointments.slice(0, 2).map((appointment) => (
                          <div
                            className='bg-primary/20 text-primary truncate rounded p-1 text-xs'
                            key={appointment.id}
                            title={`${new Date(appointment.date).toLocaleTimeString()} - ${appointment.fullName}`}
                          >
                            {new Date(appointment.date).toLocaleTimeString(
                              "tr-TR",
                              {
                                hour: "2-digit",
                                minute: "2-digit"
                              }
                            )}
                          </div>
                        ))}
                        {dayInfo.appointments.length > 2 && (
                          <div className='text-muted-foreground text-xs'>
                            +{dayInfo.appointments.length - 2}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Selected Date Details */}
      <div className='lg:col-span-1'>
        {selectedDate ? (
          <Card>
            <CardHeader className='justify-between'>
              <h3 className='text-lg font-semibold'>
                {selectedDate.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  weekday: "long"
                })}
              </h3>
              <Badge
                color='primary'
                variant='flat'
              >
                {selectedDateAppointments.length} randevu
              </Badge>
            </CardHeader>
            <CardBody className='space-y-3'>
              {selectedDateAppointments.length === 0 ? (
                <p className='text-muted-foreground py-4 text-center'>
                  Bu tarihte randevu bulunmuyor
                </p>
              ) : (
                selectedDateAppointments.map((appointment) => (
                  <Link
                    className='rounded-lg border border-gray-200 p-3'
                    color='foreground'
                    href={`/manage/${appointment.business?.id}/appointments/${appointment.id}`}
                    key={appointment.id}
                  >
                    <div className='flex w-full items-start justify-between'>
                      <div className='font-medium'>
                        <p className='text-sm'>
                          {appointment.user?.profile?.displayName ?? "x"}
                        </p>
                        <h2>{appointment.user?.phone}</h2>
                      </div>
                      <Chip variant='flat'>
                        <strong>
                          {new Date(appointment.date).toLocaleTimeString(
                            "tr-TR",
                            {
                              hour: "2-digit",
                              minute: "2-digit"
                            }
                          )}
                        </strong>
                      </Chip>
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      {appointment.phone}
                    </div>
                    {appointment.notes && (
                      <div className='bg-content2 rounded p-2 text-sm'>
                        {appointment.notes}
                      </div>
                    )}
                  </Link>
                ))
              )}
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className='py-12 text-center'>
              <CalendarIcon
                className='text-muted-foreground mx-auto mb-4'
                size={48}
              />
              <p className='text-muted-foreground'>
                Randevu detaylarını görmek için takvimden bir tarih seçin
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
