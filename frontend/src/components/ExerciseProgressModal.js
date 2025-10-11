import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Weight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ExerciseProgressModal = ({ isOpen, onClose, exerciseName, userId }) => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isOpen && exerciseName && userId) {
      fetchExerciseProgress();
    }
  }, [isOpen, exerciseName, userId]);

  const fetchExerciseProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/users/${userId}/exercise-progress/${encodeURIComponent(exerciseName)}`);
      const data = response.data.data;
      
      // Format data for chart
      const chartData = data.map((entry, index) => ({
        session: index + 1,
        load: entry.load,
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: entry.date
      }));
      
      setProgressData(chartData);
      
      // Calculate stats
      if (data.length > 0) {
        const loads = data.map(d => d.load);
        const maxLoad = Math.max(...loads);
        const latestLoad = loads[loads.length - 1];
        const firstLoad = loads[0];
        const improvement = loads.length > 1 ? ((latestLoad - firstLoad) / firstLoad * 100).toFixed(1) : 0;
        
        setStats({
          maxLoad,
          latestLoad,
          improvement,
          totalSessions: data.length,
          firstDate: data[0].date,
          lastDate: data[data.length - 1].date
        });
      }
      
    } catch (error) {
      console.error('Error fetching exercise progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            {exerciseName} - Progress
          </DialogTitle>
          <DialogDescription>
            Track your strength progression over time
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : progressData.length === 0 ? (
          <div className="text-center py-12">
            <Weight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Progress Data Yet</h3>
            <p className="text-gray-500">Complete this exercise in a workout to see your progress here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-black">{stats.maxLoad} kg</div>
                  <p className="text-sm text-gray-600">Personal Best</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-black">{stats.latestLoad} kg</div>
                  <p className="text-sm text-gray-600">Latest Load</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className={`text-2xl font-bold ${
                    stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.improvement >= 0 ? '+' : ''}{stats.improvement}%
                  </div>
                  <p className="text-sm text-gray-600">Improvement</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-black">{stats.totalSessions}</div>
                  <p className="text-sm text-gray-600">Sessions</p>
                </div>
              </div>
            )}

            {/* Progress Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weight Progress Over Time
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={12}
                      label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value, name) => [`${value} kg`, 'Load']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="load" 
                      stroke="#000000" 
                      strokeWidth={3}
                      dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Session History */}
            {stats && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-black mb-2">Training History</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>First session: {formatDate(stats.firstDate)}</p>
                  <p>Latest session: {formatDate(stats.lastDate)}</p>
                  <p>Total sessions recorded: {stats.totalSessions}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseProgressModal;