import { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import api from '../api/axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, statesRes] = await Promise.all([
        api.get('/products'),
        api.get('/states')
      ]);

      setProducts(productsRes.data);
      setStates(statesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setActionLoading(productId);
    try {
      await api.delete(`/api/products/${productId}`);
      setProducts(prev => prev.filter(product => product._id !== productId));
      setMessage('Product deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Error deleting product');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const updateState = async (stateId, updates) => {
    setActionLoading(stateId);
    try {
      const response = await api.put(`/api/states/${stateId}`, updates);
      setStates(prev => prev.map(state =>
        state._id === stateId ? response.data : state
      ));
      setMessage('State updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating state:', error);
      setMessage('Error updating state');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const QuickEditState = ({ state }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      name: state.name,
      capital: state.capital
    });

    const handleSave = () => {
      updateState(state._id, editData);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditData({ name: state.name, capital: state.capital });
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div className="border rounded p-3 bg-yellow-50">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full mb-2 px-2 py-1 border rounded"
            placeholder="State name"
          />
          <input
            type="text"
            value={editData.capital}
            onChange={(e) => setEditData(prev => ({ ...prev, capital: e.target.value }))}
            className="w-full mb-2 px-2 py-1 border rounded"
            placeholder="Capital"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={actionLoading === state._id}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-green-400"
            >
              {actionLoading === state._id ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{state.name}</h3>
          <p className="text-sm text-gray-600">Capital: {state.capital}</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Edit
        </button>
      </div>
    );
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Admin Dashboard
        </h1>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('Error')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Products Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Products Management ({products.length})
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No products found</p>
                ) : (
                  products.map(product => (
                    <div key={product._id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.stateOfOrigin} • {product.category}</p>
                      </div>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        disabled={actionLoading === product._id}
                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:bg-red-400"
                      >
                        {actionLoading === product._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* States Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                States Management ({states.length})
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {states.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No states found</p>
                ) : (
                  states.map(state => (
                    <div key={state._id} className="border rounded p-3">
                      <QuickEditState state={state} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Actions Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded">
              <h3 className="font-medium text-gray-800">Total Products</h3>
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            </div>
            <div className="text-center p-4 border rounded">
              <h3 className="font-medium text-gray-800">Total States</h3>
              <p className="text-2xl font-bold text-green-600">{states.length}</p>
            </div>
            <div className="text-center p-4 border rounded">
              <h3 className="font-medium text-gray-800">Admin Role</h3>
              <p className="text-2xl font-bold text-purple-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
