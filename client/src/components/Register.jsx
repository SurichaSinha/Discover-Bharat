import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!formData.email.includes('@'))
      newErrors.email = 'Email must contain @ symbol';

    if (!formData.password.trim())
      newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const registerResponse = await api.post('/auth/register', formData);

      if (registerResponse.data?.msg === 'registered') {
        setMessage('Registration successful! Logging you in...');

        setTimeout(async () => {
          try {
            const loginResult = await login(formData.email, formData.password);

            if (loginResult.success) {
              setMessage('Login successful! Redirecting...');
              setTimeout(() => (window.location.href = '/'), 800);
            } else {
              setMessage(
                'Registration successful, but login failed. Please log in manually.'
              );
            }
          } catch (err) {
            setMessage('Registration successful! Please log in manually.');
          }
        }, 600);
      } else {
        setMessage(registerResponse.data.msg || 'Registration failed');
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/patterns/indian-bg.png')",
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay',
        backgroundColor: '#f7f2e8'
      }}
    >
      <div className="max-w-md w-full bg-[#fffaf3] shadow-xl rounded-2xl p-8 border border-[#e6d8c2]">

        {/* Branding */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#6b3a1f]">
            Bharat Connect
          </h2>
          <p className="text-sm text-[#7e5d46]">
            Culture, Heritage & Innovation
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Name */}
          <div>
            <label className="text-sm text-[#6b3a1f] font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                errors.name ? 'border-red-400' : 'border-[#d4c4a8]'
              } focus:ring-2 focus:ring-orange-400 outline-none bg-[#fffdf8]`}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-[#6b3a1f] font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                errors.email ? 'border-red-400' : 'border-[#d4c4a8]'
              } focus:ring-2 focus:ring-orange-400 outline-none bg-[#fffdf8]`}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-[#6b3a1f] font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Min 6 characters"
              className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                errors.password ? 'border-red-400' : 'border-[#d4c4a8]'
              } focus:ring-2 focus:ring-orange-400 outline-none bg-[#fffdf8]`}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes('successful')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#b45309] text-white py-2 rounded-lg font-semibold
              hover:bg-[#a34400] transition disabled:bg-orange-300"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-[#7e5d46]">
            Already have an account?{' '}
            <a href="/login" className="text-[#b45309] font-semibold hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;