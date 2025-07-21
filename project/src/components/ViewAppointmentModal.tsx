import React from 'react';
import { Appointment } from '../types';

interface Props {
  appointment: Appointment;
  onClose: () => void;
}

const ViewAppointmentModal: React.FC<Props> = ({ appointment, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-2">Appointment Details</h2>
        <p><strong>Service:</strong> {appointment.service}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Duration:</strong> {appointment.duration} min</p>
        <p><strong>Price:</strong> ₹{appointment.price}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
        <p><strong>Notes:</strong> {appointment.notes}</p>
        <button className="btn mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewAppointmentModal;
