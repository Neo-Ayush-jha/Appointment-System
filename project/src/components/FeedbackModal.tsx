import React, { useState } from "react";
import { appointmentAPI } from "../services/api";
import { Appointment } from "../types";
import { XMarkIcon, StarIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onSuccess: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    professional_id: appointment.professional_id,
    user_id: appointment.customer?.id, 
    date: appointment.date,
    time: appointment.time,
    experience: "",
    suggestion: "",
    image_url: "",
    rating: 0,
    recommend: false,               
  });
  console.log("Initial formData:", appointment);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = formData.image_url;
      console.log("Selected image:", formData.image_url);
      if (selectedImage) {
        imageUrl = `https://example.com/feedback-images/${Date.now()}-${
          selectedImage.name
        }`;
      }

      const feedbackData = {
        ...formData,
        image_url: imageUrl,
      };

      await appointmentAPI.submitFeedback(appointment.id, feedbackData);
      onSuccess();
      onClose();
      setFormData({
        professional_id: appointment.professional_id,
        user_id: appointment.customer?.id,
        date: appointment.date,
        time: appointment.time,
        experience: "",
        suggestion: "",
        image_url: "",
        rating: 0,
        recommend: false,               
      });

      setSelectedImage(null);
      setImagePreview("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData({
      ...formData,
      image_url: "",
    });
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
                Leave Feedback
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Appointment Details
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Service:</span>{" "}
                  {appointment.service}
                </p>
                <p>
                  <span className="font-medium">Professional:</span>{" "}
                  {appointment.professional?.name}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {appointment.time}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {appointment.duration} minutes
                </p>
                <p>
                  <span className="font-medium">Price:</span> ₹
                  {appointment.price}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you rate this appointment? *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className="focus:outline-none"
                    >
                      {star <= formData.rating ? (
                        <StarIconSolid className="h-8 w-8 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400 transition-colors" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {formData.rating === 0 && "Please select a rating"}
                  {formData.rating === 1 && "Poor"}
                  {formData.rating === 2 && "Fair"}
                  {formData.rating === 3 && "Good"}
                  {formData.rating === 4 && "Very Good"}
                  {formData.rating === 5 && "Excellent"}
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Share your experience *
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows={4}
                  className="input-field"
                  placeholder="Describe your experience with this appointment..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Suggestions for improvement (Optional)
                </label>
                <textarea
                  id="suggestion"
                  name="suggestion"
                  value={formData.suggestion}
                  onChange={handleChange}
                  rows={2}
                  className="input-field"
                  placeholder="Any suggestions to improve the service..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-sm text-blue-600 hover:text-blue-500">
                            Click to upload an image
                          </span>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="recommend"
                  name="recommend"
                  type="checkbox"
                  checked={formData.recommend}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="recommend"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I would recommend this professional to others
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Thank you for your feedback!
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your feedback helps us improve our services and helps
                        other customers make informed decisions.
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
                  disabled={loading || formData.rating === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
