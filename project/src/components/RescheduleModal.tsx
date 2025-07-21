import React, { useState } from 'react';
import { appointmentAPI } from '../services/api';
import { Appointment } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onSuccess: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await appointmentAPI.requestReschedule(appointment.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request reschedule');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Request Reschedule</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Current Appointment</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Service:</span> {appointment.service}</p>
                <p><span className="font-medium">Professional:</span> {appointment.professional?.name}</p>
                <p><span className="font-medium">Current Date:</span> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Current Time:</span> {appointment.time}</p>
                <p><span className="font-medium">Duration:</span> {appointment.duration} minutes</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  New Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  New Time
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

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Reschedule Request
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your reschedule request will be sent to the professional for approval. 
                        You will be notified once they respond to your request.
                      </p>
                    </div>
                  </div>
                </div>
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
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending Request...' : 'Request Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;