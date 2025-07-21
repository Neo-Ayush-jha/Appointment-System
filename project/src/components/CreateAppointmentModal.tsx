import React, { useState } from "react";
import { appointmentAPI } from "../services/api";
import { User, CreateAppointmentData } from "../types";
import { PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSuccess: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  users,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateAppointmentData>({
    professional_id: 0,
    date: "",
    time: "",
    service: "",
    duration: 10,
    price: 150,
    notes: "",
  });

  const [selectedRole, setSelectedRole] = useState<"doctor" | "barber" | "">(
    ""
  );
  const [filteredProfessionals, setFilteredProfessionals] = useState<User[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (role: "doctor" | "barber" | "") => {
    setSelectedRole(role);
    const roleUsers = users.filter((u) => u.role === role);
    setFilteredProfessionals(roleUsers);

    setFormData({
      ...formData,
      professional_id: 0,
      service: role, // set role as service
      duration: 10,
      price: 150,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "duration") {
      const duration = parseInt(value) || 0;
      setFormData({
        ...formData,
        duration,
        price: duration * 15,
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "professional_id" ? parseInt(value) || 0 : value,
      });
    }
  };
  const handleIncreaseDuration = () => {
    const duration = formData.duration + 1;
    setFormData({ ...formData, duration, price: duration * 15 });
  };

  const handleDecreaseDuration = () => {
    const duration = formData.duration - 1;
    setFormData({ ...formData, duration, price: duration * 15 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ Validate duration minimum
    if (formData.duration < 10) {
      setError("Minimum duration is 10 minutes.");
      setLoading(false);
      return;
    }

    try {
      // 🔁 Price auto-calculated before sending
      const appointmentData = {
        ...formData,
        price: formData.duration * 15,
      };

      await appointmentAPI.createAppointment(appointmentData);
      onSuccess();
      onClose();

      setFormData({
        professional_id: 0,
        date: "",
        time: "",
        service: "",
        duration: 30,
        price: 30 * 15,
        notes: "",
      });
      setSelectedRole("");
      setFilteredProfessionals([]);
      setRoleServices([]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Book New Appointment
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={selectedRole}
                  onChange={(e) =>
                    handleRoleChange(e.target.value as "doctor" | "barber")
                  }
                  required
                  className="input-field"
                >
                  <option value="">Select a role</option>
                  <option value="doctor">Doctor</option>
                  <option value="barber">Barber</option>
                </select>
              </div>

              {/* Professional Selection */}
              <div>
                <label
                  htmlFor="professional_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Professional
                </label>
                <select
                  id="professional_id"
                  name="professional_id"
                  value={formData.professional_id}
                  onChange={handleChange}
                  required
                  className="input-field"
                  disabled={!selectedRole}
                >
                  <option value="">Select a professional</option>
                  {filteredProfessionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Duration & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Duration (min)
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleDecreaseDuration}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="input-field w-20 text-center"
                    />
                    <button
                      type="button"
                      onClick={handleIncreaseDuration}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    disabled
                    readOnly
                    className="input-field bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="Any special requests or notes..."
                />
              </div>

              {/* Submit Buttons */}
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
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;
