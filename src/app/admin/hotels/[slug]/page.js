"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/components/api";
import Image from "next/image";
import { alertSuccess } from "@/components/Alert";

export default function EditHotel() {
  const { slug } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    amenities: "",
    images: []
  });
  const [newImages, setNewImages] = useState([]); // Files to upload
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data } = await api.get(`/hotels?slug=${slug}`);
        if (data) {
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            location: data.location?.coordinates?.join(", "),
            amenities: data.amenities.join(", "),
            images: data.images || []
          });
        }
      } catch (err) {
        console.error("Error fetching hotel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [slug]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const uploadImagesToServer = async () => {
    const uploadedImageURLs = [];

    for (const file of newImages) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/admin/hotels/image-upload", formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }); // Assuming this API exists
      uploadedImageURLs.push(res.data.url); // Adjust this based on response structure
    }

    return uploadedImageURLs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedURLs = [];

      if (newImages.length > 0) {
        uploadedURLs = await uploadImagesToServer();
      }

      const payload = {
        ...formData,
        images: [...formData.images, ...uploadedURLs],
        amenities: formData.amenities.split(",").map(a => a.trim())
      };

      await api.patch(`/admin/hotels/${slug}`, payload);
      alertSuccess("Hotel updated successfully!");
      router.push("/admin");
    } catch (err) {
      console.error("Error updating hotel:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Edit Hotel: {formData.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Hotel Name"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price per night"
          className="w-full p-2 border rounded"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location (lng, lat)"
          className="w-full p-2 border rounded"
        />
        <input
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          placeholder="Amenities (comma separated)"
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-2 flex-wrap">
          {formData.images.map((img, idx) => (
            <div key={idx} className="relative">
              <Image src={img} alt={`img-${idx}`} width={80} height={80} className="rounded" />
              <button
                type="button"
                onClick={() => handleImageDelete(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Upload new images */}
        <input type="file" multiple onChange={handleImageUpload} className="w-full" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
