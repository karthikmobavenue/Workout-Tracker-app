import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserOnboarding = ({ onUserCreated }) => {
  const [step, setStep] = useState('form'); // 'form', 'phone', 'otp', 'verified'
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    rest_day: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpTimer, setOtpTimer] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.age || formData.age < 13 || formData.age > 100) newErrors.age = 'Valid age required (13-100)';
    if (!formData.height || formData.height < 100 || formData.height > 250) newErrors.height = 'Valid height required (100-250 cm)';
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) newErrors.weight = 'Valid weight required (30-300 kg)';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.rest_day) newErrors.rest_day = 'Rest day is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userData = {
        ...formData,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        rest_day: parseInt(formData.rest_day)
      };
      
      const response = await axios.post(`${API}/users`, userData);
      onUserCreated(response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ submit: 'Failed to create user. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-black">PPL Workout Tracker</CardTitle>
          <CardDescription className="text-gray-600">
            Let's get you started with your Push/Pull/Legs program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  data-testid="first-name-input"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={errors.first_name ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>
              
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  data-testid="last-name-input"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={errors.last_name ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                data-testid="age-input"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className={errors.age ? 'border-red-500' : ''}
                disabled={loading}
                min="13"
                max="100"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  data-testid="height-input"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className={errors.height ? 'border-red-500' : ''}
                  disabled={loading}
                  min="100"
                  max="250"
                  step="0.1"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  data-testid="weight-input"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className={errors.weight ? 'border-red-500' : ''}
                  disabled={loading}
                  min="30"
                  max="300"
                  step="0.1"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select 
                value={formData.gender} 
                onChange={(e) => handleInputChange('gender', e.target.value)}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md bg-white ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                data-testid="gender-select"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div>
              <Label htmlFor="rest_day">Preferred Rest Day</Label>
              <select 
                value={formData.rest_day} 
                onChange={(e) => handleInputChange('rest_day', e.target.value)}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md bg-white ${errors.rest_day ? 'border-red-500' : 'border-gray-300'}`}
                data-testid="rest-day-select"
              >
                <option value="">Choose your rest day</option>
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
              {errors.rest_day && <p className="text-red-500 text-sm mt-1">{errors.rest_day}</p>}
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800"
              data-testid="create-profile-btn"
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOnboarding;