import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { appointmentAPI } from "../services/api";
import { Appointment } from "../types";
import { useAuth } from "../contexts/AuthContext";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import "react-calendar/dist/Calendar.css";

interface AppointmentCalendarProps {
  className?: string;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  className = "",
}) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let appointmentsData: Appointment[] = [];

      if (user?.role === "customer" || user?.role === "admin") {
        appointmentsData = await appointmentAPI.getAllAppointments();
      } else if (user?.role === "doctor" || user?.role === "barber") {
        appointmentsData = await appointmentAPI.getClientAppointments();
      }

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]; 
    return appointments.appointments.filter((apt) => {
      const aptDateString = new Date(apt.date).toISOString().split("T")[0];
      return aptDateString === dateString;
    });
  };

  const getSelectedDateAppointments = () => {
    return getAppointmentsForDate(selectedDate);
  };

  const hasAppointmentsOnDate = (date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "reschedule_requested":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && hasAppointmentsOnDate(date)) {
      const dayAppointments = getAppointmentsForDate(date);
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          {dayAppointments.length > 1 && (
            <div className="w-2 h-2 bg-blue-400 rounded-full ml-1"></div>
          )}
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && hasAppointmentsOnDate(date)) {
      return "has-appointments";
    }
    return "";
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center h-96`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
          Appointment Calendar
        </h2>
        <div className="text-sm text-gray-500">
          Total: {appointments.length} appointments
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="calendar-container">
          <style jsx>{`
            .calendar-container :global(.react-calendar) {
              width: 100%;
              border: 1px solid #e5e7eb;
              border-radius: 0.5rem;
              font-family: inherit;
            }
            .calendar-container :global(.react-calendar__tile) {
              position: relative;
              padding: 0.75rem 0.5rem;
              background: none;
              border: none;
              font-size: 0.875rem;
            }
            .calendar-container :global(.react-calendar__tile:hover) {
              background-color: #f3f4f6;
            }
            .calendar-container :global(.react-calendar__tile--active) {
              background-color: #3b82f6 !important;
              color: white;
            }
            .calendar-container :global(.react-calendar__tile--now) {
              background-color: #fef3c7;
            }
            .calendar-container
              :global(.react-calendar__tile.has-appointments) {
              background-color: #dbeafe;
            }
            .calendar-container :global(.react-calendar__navigation button) {
              font-size: 1rem;
              font-weight: 500;
            }
          `}</style>
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
          />

          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span>Has Appointments</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-200 rounded-full mr-2"></div>
              <span>Today</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <span className="text-sm text-gray-500">
              {getSelectedDateAppointments().length} appointments
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {getSelectedDateAppointments().length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  No appointments
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  No appointments scheduled for this date.
                </p>
              </div>
            ) : (
              getSelectedDateAppointments()
                .sort(
                  (a, b) =>
                    new Date(`${a.date}T${a.time}`).getTime() -
                    new Date(`${b.date}T${b.time}`).getTime()
                )
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`border rounded-lg p-4 ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {appointment.service}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user?.role === "customer"
                              ? `with ${appointment.professional?.name}`
                              : `with ${appointment.customer?.name}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                        {appointment.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>
                          {appointment.time} ({appointment.duration} min)
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        <span>{formatCurrency(appointment.price)}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}

                    {appointment.reschedule_date &&
                      appointment.reschedule_time && (
                        <div className="mt-2 text-sm text-yellow-700">
                          <strong>Reschedule Requested:</strong>{" "}
                          {new Date(
                            appointment.reschedule_date
                          ).toLocaleDateString()}{" "}
                          at {appointment.reschedule_time}
                        </div>
                      )}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
