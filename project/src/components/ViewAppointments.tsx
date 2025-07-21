import React from "react";
import { Appointment } from "../types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
}

const ViewAppointments: React.FC<Props> = ({ isOpen, onClose, appointment }) => {
  if (!isOpen) return null;

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  const formattedStatus = appointment.status.replace("_", " ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-900">Appointment Details</h2>
        <p className="text-sm text-gray-500 mb-4">{new Date(appointment.date).toDateString()}</p>

        <div className="space-y-3 text-sm text-gray-800">
          <div>
            <span className="font-medium">Service:</span> {appointment.service}
          </div>
          <div>
            <span className="font-medium">Time:</span> {appointment.time}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {appointment.duration} minutes
          </div>
          <div>
            <span className="font-medium">Price:</span> ₹{appointment.price}
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                statusColor[appointment.status as keyof typeof statusColor] || "bg-gray-200"
              }`}
            >
              {formattedStatus}
            </span>
          </div>
          {appointment.notes && (
            <div>
              <span className="font-medium">Notes:</span> {appointment.notes}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ViewAppointments;
