import React from 'react';
import { appointmentAPI } from '../services/api';

interface Props {
  appointmentId: number;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({ appointmentId, onClose, onDeleteSuccess }) => {
  const handleDelete = async () => {
    await appointmentAPI.cancelAppointment(appointmentId);
    onDeleteSuccess();
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this appointment?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-error" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
