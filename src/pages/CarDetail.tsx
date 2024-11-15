import  { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Car {
  _id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  owner: {
    _id: string;
    username: string;
  };
}

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`https://car-management-backend-alpha.vercel.app/api/users/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car:', error);
      setError('Failed to load car details');
    }
  };

  const nextImage = () => {
    if (car) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const previousImage = () => {
    if (car) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to listings
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={car.images[currentImageIndex]}
            alt={car.title}
            className="w-full h-full object-cover"
          />
          {car.images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{car.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {car.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-600 mb-6 whitespace-pre-line">{car.description}</p>

          <div className="flex items-center text-sm text-gray-500">
            <span>Posted by {car.owner.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;