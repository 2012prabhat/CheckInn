"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/components/api";
import { Trash2 } from "lucide-react";
import { alertError, alertSuccess } from "@/components/Alert";

export default function AddHotel() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { mutate, isLoading } = useMutation({
    mutationFn: async (hotelData) => {
      const formData = new FormData();
      Object.entries(hotelData).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      imageFiles.forEach((file) => formData.append("images", file));
        try{
          await api.post("/admin/hotels/add-hotel", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          alertSuccess("Hotel added successfully!");
        }catch(err){
          const errMess = err.response.data.error;
          alertError(errMess)
        }
     
      reset();
      setImagePreviews([]);
      setImageFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImagePreviews((prev) => [...prev, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 mt-8">
      <h2 className="text-lg text-center font-semibold mb-3">Add a New Hotel</h2>

      <form onSubmit={handleSubmit(mutate)} className="space-y-4">
        {/* Name, Price & Address */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Hotel Name</label>
            <input type="text" {...register("name", { required: "Required" })} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm">Price ($/Night)</label>
            <input type="number" {...register("price", { required: "Required", min: 1 })} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm">Address</label>
            <input type="text" {...register("address", { required: "Required" })} className="w-full p-2 border rounded text-sm" />
          </div>
        </div>

        {/* City, State & Country */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">City</label>
            <input type="text" {...register("city", { required: "Required" })} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm">State</label>
            <input type="text" {...register("state", { required: "Required" })} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm">Country</label>
            <input type="text" {...register("country", { required: "Required" })} className="w-full p-2 border rounded text-sm" />
          </div>
        </div>

        {/* Zipcode, Amenities & Description */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Zip Code</label>
            <input type="text" {...register("zipcode", { required: "Required" })} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm">Amenities</label>
            <input
              type="text"
              {...register("amenities")}
              className="w-full p-2 border rounded text-sm"
              placeholder="WiFi, Pool, Parking"
            />
          </div>
          <div>
            <label className="block text-sm">Description</label>
            <textarea {...register("description", { required: "Required" })} className="w-full p-2 border rounded text-sm h-12"></textarea>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm">Upload Images</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="w-full p-2 border rounded text-sm" />

          {imagePreviews.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {imagePreviews.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img src={img.preview} alt="Preview" className="w-full h-full rounded object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-sm">
          {isLoading ? "Adding..." : "Add Hotel"}
        </button>
      </form>
    </div>
  );
}
