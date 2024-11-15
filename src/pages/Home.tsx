import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

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

const Home = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated , login } = useAuth();

  useEffect(() => {
    fetchCars();
  }, [isAuthenticated , login, setCars]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://car-management-backend-alpha.vercel.app/api/users');
      setCars(response.data);
    } catch (err) {
      setError('Failed to fetch cars. Please try again later.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter(car =>
    car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`https://car-management-backend-alpha.vercel.app/api/users/${carId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <button
                onClick={fetchCars}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Featured Cars</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {isAuthenticated && (
            <Link
              to="/cars/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Car
            </Link>
          )}
        </div>
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding a new car'}
          </p>
          {isAuthenticated && !searchTerm && (
            <div className="mt-6">
              <Link
                to="/cars/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Car
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Link
              key={car._id}
              to={`/cars/${car._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop'}
                  alt={car.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{car.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>
                <div className="flex flex-wrap gap-2">
                  {car.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                 <div className="mt-4 text-sm text-gray-500">
                  Posted by {car.owner.username}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
