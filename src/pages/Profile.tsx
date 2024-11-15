import  { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Car {
  _id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  owner: string;
}

const Profile = () => {
  const { login ,  user, isAuthenticated } = useAuth();
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const navigate = useNavigate();

  useEffect(() => {
  
    if (!isAuthenticated) {
      navigate('/');
    } else {
      fetchUserCars();
    }
    console.log("ijnfiuwe foweoifwoej");
  }, [isAuthenticated, user , login]);

  const fetchUserCars = async () => {
    console.log("bjfb wfius fisfb wuif");
    try {
        console.log("bjfb wfius fisfb wuif 22");
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/users/user/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserCars(response.data);

        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user cars:', error);
      } finally {
        setLoading(false);
      }
  };

  const handleDelete = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`https://car-management-backend-alpha.vercel.app/api/users/${carId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  // Filter cars based on the search query
  const filteredCars = userCars.filter((car) =>
    car.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    car.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // if (loading) {
  //   return <p>Loading cars...</p>;
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Cars</h1>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search cars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Link
          to="/cars/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Car
        </Link>
      </div>

      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop'}
                alt={car.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{car.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/cars/edit/${car._id}`}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No cars found.</p>
      )}
    </div>
  );
};

export default Profile;
