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

  const validatePhone = () => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    if (!formData.phone.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      setErrors({ phone: 'Please enter a valid phone number' });
      return false;
    }
    setErrors({});
    return true;
  };

  const sendOtp = async () => {
    if (!validatePhone()) return;
    
    setLoading(true);
    try {
      // Generate a random 6-digit OTP for simulation
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(generatedOtp);
      
      // In a real app, you would send this OTP via SMS
      console.log('OTP sent:', generatedOtp);
      alert(`OTP sent to ${formData.phone}: ${generatedOtp}`); // For demo purposes
      
      setStep('otp');
      setOtpTimer(60); // 60 seconds timer
      
      // Start countdown
      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrors({ phone: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = () => {
    if (!otp.trim()) {
      setErrors({ otp: 'Please enter the OTP' });
      return;
    }
    
    if (otp !== sentOtp) {
      setErrors({ otp: 'Invalid OTP. Please try again.' });
      return;
    }
    
    setErrors({});
    setStep('verified');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStep('phone');
  };

  const handleFinalSubmit = async () => {
    if (step !== 'verified') return;
    
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-12 bg-gray-800 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 15.57 15.57 7 12 3.43 13.43 2 14.86 3.43 16.29 2 18.43 4.14 19.86 2.71 21.29 4.14 19.86 5.57 22 7.71 20.57 9.14 22 10.57 20.57 12 22 13.43 20.57 14.86z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PPL Workout Tracker</h1>
          <p className="text-gray-600 text-base">
            {step === 'form' && "Let's get you started with your Push/Pull/Legs program."}
            {step === 'phone' && "Please verify your phone number"}
            {step === 'otp' && "Enter the OTP sent to your phone"}
            {step === 'verified' && "Phone verified! Creating your profile..."}
          </p>
        </div>
        
        <div>
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent ${errors.first_name ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent ${errors.last_name ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>
              </div>
              
              {/* Physical Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent ${errors.age ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent ${errors.height ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="75"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent ${errors.weight ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                </div>
              </div>
              
              {/* Dropdowns */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="relative">
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent appearance-none bg-white ${errors.gender ? 'border-red-500' : ''}`}
                      disabled={loading}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rest Day</label>
                  <div className="relative">
                    <select
                      value={formData.rest_day}
                      onChange={(e) => handleInputChange('rest_day', e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent appearance-none bg-white ${errors.rest_day ? 'border-red-500' : ''}`}
                      disabled={loading}
                    >
                      <option value="">Select Rest Day</option>
                      <option value="0">Sunday</option>
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.rest_day && <p className="text-red-500 text-xs mt-1">{errors.rest_day}</p>}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 px-6 rounded-xl font-medium transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </button>
              
              {/* Privacy Notice */}
              <p className="text-center text-xs text-gray-500 mt-4">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </form>
          )}

          {step === 'phone' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setStep('form')}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button 
                  onClick={sendOtp}
                  className="flex-1 bg-black hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  OTP sent to {formData.phone}
                </p>
                {otpTimer > 0 && (
                  <p className="text-xs text-gray-500">
                    Resend OTP in {otpTimer}s
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={`text-center text-lg tracking-widest ${errors.otp ? 'border-red-500' : ''}`}
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setErrors({});
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={verifyOtp}
                  className="flex-1 bg-black hover:bg-gray-800"
                  disabled={otp.length !== 6}
                >
                  Verify OTP
                </Button>
              </div>

              {otpTimer === 0 && (
                <Button 
                  onClick={sendOtp}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              )}
            </div>
          )}

          {step === 'verified' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-black">Phone Verified!</h3>
              <p className="text-gray-600">Your phone number has been successfully verified.</p>
              
              <Button 
                onClick={handleFinalSubmit}
                className="w-full bg-black hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </div>
          )}

          {errors.submit && (
            <p className="text-red-500 text-sm text-center mt-4">{errors.submit}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOnboarding;