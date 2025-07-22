import React, { useState, useEffect } from "react";
import { appointmentAPI } from "../services/api";
import { Appointment, User } from "../types";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface EditAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSuccess: () => void;
  users?: User[]; 
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  appointment,
  onClose,
  onSuccess,
  users = [],
}) => {
  const [formData, setFormData] = useState({
    professional_id: appointment.professional?.id || 0,
    date: appointment.date,
    time: appointment.time,
    service: appointment.service,
    duration: appointment.duration,
    price: appointment.price,
    notes: appointment.notes || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      price: prev.duration * 15,
    }));
  }, [formData.duration]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "duration") {
      const duration = parseInt(value) || 0;
      setFormData({ ...formData, duration, price: duration * 15 });
    } else {
      setFormData({
        ...formData,
        [name]: name === "professional_id" ? parseInt(value) || 0 : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await appointmentAPI.requestReschedule(appointment.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  const increaseDuration = () => {
    setFormData((prev) => ({ ...prev, duration: prev.duration + 1 }));
  };

  const decreaseDuration = () => {
    setFormData((prev) => ({ ...prev, duration: Math.max(10, prev.duration - 1) }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className="fixed inset-0 bg-black bg-opacity-40"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg z-10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Appointment</h2>
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {users.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Professional</label>
                <select
                  name="professional_id"
                  value={formData.professional_id}
                  onChange={handleChange}
                  className="input-field"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Service</label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={decreaseDuration}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-field w-20 text-center"
                  />
                  <button
                    type="button"
                    onClick={increaseDuration}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  readOnly
                  disabled
                  className="input-field bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="input-field"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;