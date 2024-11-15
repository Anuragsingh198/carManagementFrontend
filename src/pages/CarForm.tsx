// CarForm.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { X } from 'lucide-react';

interface CarFormData {
  title: string;
  description: string;
  tags: string[];
  images: File[];
  existingImages: string[];
}

const CarForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<CarFormData>({
    title: '',
    description: '',
    tags: [],
    images: [],
    existingImages: [],
  });
  const [tagInput, setTagInput] = useState<string>('');

  useEffect(() => {
    if (id) fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`https://car-management-backend-alpha.vercel.app/api/users/${id}`);
      const car = response.data;
      setFormData({
        title: car.title,
        description: car.description,
        tags: car.tags,
        images: [],
        existingImages: car.images,
      });
    } catch (error) {
      console.error('Error fetching car:', error);
      setError('Failed to fetch car details');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('tags', JSON.stringify(formData.tags));
    
    if (formData.existingImages.length > 0) {
      formDataToSend.append('existingImages', JSON.stringify(formData.existingImages));
    }

    formData.images.forEach((image) => formDataToSend.append('images', image));

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const url = id ? `https://car-management-backend-alpha.vercel.app/api/users/${id}` : 'https://car-management-backend-alpha.vercel.app/api/users';
      const method = id ? 'put' : 'post';

      await axios[method](url, formDataToSend, config);
      navigate('/profile');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save car');
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (formData.images.length + formData.existingImages.length + newImages.length > 10) {
        setError('Maximum 10 images allowed');
        return;
      }
      setFormData({ ...formData, images: [...formData.images, ...newImages] });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const removeExistingImage = (index: number) => {
    setFormData({
      ...formData,
      existingImages: formData.existingImages.filter((_, i) => i !== index),
    });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {id ? 'Edit Car' : 'Add New Car'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Press Enter to add tags"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="mt-1 block w-full"
          />
          <p className="mt-1 text-sm text-gray-500">
            Maximum 10 images allowed. {10 - formData.images.length - formData.existingImages.length} remaining.
          </p>
          
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {formData.existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative">
                <img
                  src={image}
                  alt={`Preview ${index}`}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.images.map((image, index) => (
              <div key={`new-${index}`} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {id ? 'Update Car' : 'Add Car'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
