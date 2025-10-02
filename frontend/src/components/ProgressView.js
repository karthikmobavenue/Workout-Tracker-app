import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TrendingUp, BarChart3, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProgressView = ({ user }) => {
  const [progressData, setProgressData] = useState({});
  const [selectedExercise, setSelectedExercise] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get(`${API}/users/${user.id}/all-progress`);
      setProgressData(response.data);
      
      // Set first exercise as default selection
      const exercises = Object.keys(response.data);
      if (exercises.length > 0) {
        setSelectedExercise(exercises[0]);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (exerciseData) => {
    return exerciseData.map((entry, index) => ({
      session: index + 1,
      load: entry.load,
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: entry.date
    }));
  };

  const getExerciseStats = (exerciseData) => {
    if (!exerciseData || exerciseData.length === 0) return null;
    
    const loads = exerciseData.map(entry => entry.load);
    const maxLoad = Math.max(...loads);
    const minLoad = Math.min(...loads);
    const latestLoad = loads[loads.length - 1];
    const improvement = ((latestLoad - loads[0]) / loads[0] * 100).toFixed(1);
    
    return {
      maxLoad,
      minLoad,
      latestLoad,
      improvement,
      totalSessions: exerciseData.length
    };
  };

  const getOverallStats = () => {
    const exercises = Object.keys(progressData);
    const totalExercises = exercises.length;
    const totalSessions = exercises.reduce((acc, exercise) => {
      return acc + progressData[exercise].length;
    }, 0);
    
    // Calculate average improvement across all exercises
    const improvements = exercises.map(exercise => {
      const data = progressData[exercise];
      if (data.length < 2) return 0;
      const first = data[0].load;
      const last = data[data.length - 1].load;
      return ((last - first) / first) * 100;
    }).filter(imp => !isNaN(imp) && isFinite(imp));
    
    const avgImprovement = improvements.length > 0 
      ? (improvements.reduce((a, b) => a + b, 0) / improvements.length).toFixed(1)
      : 0;
    
    return {
      totalExercises,
      totalSessions,
      avgImprovement
    };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const exercises = Object.keys(progressData);
  const selectedData = selectedExercise ? progressData[selectedExercise] : [];
  const chartData = formatChartData(selectedData);
  const exerciseStats = getExerciseStats(selectedData);
  const overallStats = getOverallStats();

  if (exercises.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Progress Data Yet</h3>
            <p className="text-gray-500">Complete some workouts to see your progress charts here!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Progress Tracking
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Exercises</CardTitle>
            <Target className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{overallStats.totalExercises}</div>
            <p className="text-xs text-gray-500 mt-1">Unique exercises tracked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{overallStats.totalSessions}</div>
            <p className="text-xs text-gray-500 mt-1">Workout sessions completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {overallStats.avgImprovement > 0 ? '+' : ''}{overallStats.avgImprovement}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Across all exercises</p>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Select Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="w-full md:w-1/2" data-testid="exercise-select">
              <SelectValue placeholder="Choose an exercise" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map(exercise => (
                <SelectItem key={exercise} value={exercise}>
                  {exercise} ({progressData[exercise].length} sessions)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Exercise Stats */}
      {exerciseStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{exerciseStats.maxLoad} kg</div>
                <p className="text-sm text-gray-600">Personal Best</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{exerciseStats.latestLoad} kg</div>
                <p className="text-sm text-gray-600">Latest Load</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  exerciseStats.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {exerciseStats.improvement >= 0 ? '+' : ''}{exerciseStats.improvement}%
                </div>
                <p className="text-sm text-gray-600">Improvement</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{exerciseStats.totalSessions}</div>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">
              {selectedExercise} - Load Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full" data-testid="progress-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    label={{ value: 'Load (kg)', angle: -90, position: 'insideLeft' }}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressView;