import { useState } from 'react';
import './App.css';

function App() {
  // Task 1: Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // UI States
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user types
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Task 2: Client-side Validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setApiError('');

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Prevent submission
    }

    setLoading(true);

    // Task 3: Backend Integration (Relative Path)
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccessMsg(data.message);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // Reset form
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Create an Account</h2>
      
      {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}
      {apiError && <div style={{ color: 'red' }}>{apiError}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password}</p>}
        </div>

        <div>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default App;