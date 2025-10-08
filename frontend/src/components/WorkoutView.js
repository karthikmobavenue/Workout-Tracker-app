import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Save, Clock, Weight, TrendingUp, BarChart3 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import ExerciseProgressModal from './ExerciseProgressModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WorkoutView = ({ user, setCurrentView, selectedDate, setSelectedDate }) => {
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentWorkout();
  }, [selectedDate]); // Re-fetch when selectedDate changes

  const fetchCurrentWorkout = async () => {
    try {
      let response;
      if (selectedDate) {
        // Fetch specific date workout - single workout
        response = await axios.get(`${API}/users/${user.id}/workout/${selectedDate}`);
        setUpcomingWorkouts([response.data]);
      } else {
        // Fetch upcoming workouts - multiple workouts
        response = await axios.get(`${API}/users/${user.id}/upcoming-workouts?days=7`);
        setUpcomingWorkouts(response.data);
      }
      
      // Initialize exercise logs
      const logs = {};
      const allWorkouts = Array.isArray(response.data) ? response.data : [response.data];
      allWorkouts.forEach(workout => {
        if (workout.exercises) {
          workout.exercises.forEach(exercise => {
            logs[exercise.name] = {
              load: exercise.previous_load || '',
              notes: ''
            };
          });
        }
      });
      setExerciseLogs(logs);
      
    } catch (error) {
      console.error('Error fetching workout:', error);
      toast({
        title: "Error",
        description: "Failed to load workout data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseClick = (exerciseName) => {
    setSelectedExercise(exerciseName);
    setShowProgressModal(true);
  };

  const toggleWorkout = (workoutName) => {
    setExpandedWorkouts(prev => ({
      ...prev,
      [workoutName]: !prev[workoutName]
    }));
  };

  const goToCurrentWorkout = () => {
    setSelectedDate(null); // Clear selected date to get current workout
    fetchCurrentWorkout();
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
    setSelectedExercise(null);
  };

  const updateExerciseLog = (exerciseName, field, value) => {
    setExerciseLogs(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        [field]: value
      }
    }));
  };

  const saveWorkout = async (workout) => {
    // Check if trying to save future workout
    const today = new Date().toISOString().split('T')[0];
    const workoutDate = new Date(workout.date).toISOString().split('T')[0];
    
    if (workoutDate > today) {
      toast({
        title: "Cannot Save Future Workout",
        description: "You can only save today's workout or past workouts",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const exercises = workout.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        load: parseFloat(exerciseLogs[exercise.name]?.load) || null
      }));

      const sessionData = {
        user_id: user.id,
        workout_type: workout.workout_type,
        workout_number: workout.workout_number,
        week: workout.week,
        phase: workout.phase,
        exercises: exercises,
        date: workout.date
      };

      await axios.post(`${API}/users/${user.id}/workout-session`, sessionData);
      
      toast({
        title: "Workout Saved! 💪",
        description: `${workout.workout_name} completed successfully!`,
      });

      // Refresh workout data
      await fetchCurrentWorkout();
      
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'phase1': return 'bg-blue-100 text-blue-800';
      case 'phase2': return 'bg-red-100 text-red-800';
      case 'phase3': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseName = (phase) => {
    switch (phase) {
      case 'phase1': return 'Base Hypertrophy';
      case 'phase2': return 'Maximum Effort';
      case 'phase3': return 'Supercompensation';
      case 'deload1':
      case 'deload2': return 'Deload Week';
      default: return phase;
    }
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

  if (!upcomingWorkouts || upcomingWorkouts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No workout data available. Please start your program first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle rest day
  if (upcomingWorkouts[0] && (upcomingWorkouts[0].is_rest_day || upcomingWorkouts[0].workout_type === 'rest')) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <Card className="border-2 shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="text-center py-16">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto flex items-center justify-center shadow-lg">
                <div className="text-6xl">🛌</div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">Rest Day</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Time to recover and rebuild! Your muscles grow during rest periods.
            </p>
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm mx-auto">
              <div className="text-lg font-semibold text-gray-700 mb-2">Recovery Tips</div>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• Stay hydrated 💧</li>
                <li>• Get quality sleep 😴</li>
                <li>• Light stretching 🧘‍♀️</li>
                <li>• Proper nutrition 🥗</li>
              </ul>
            </div>
            <div className="mt-8">
              <Button 
                onClick={() => setCurrentView('calendar')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                View Workout Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-black">
            {selectedDate ? 'Historical Workout' : 'Your Training Program'}
          </h1>
          {selectedDate && (
            <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full shadow-lg">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          {selectedDate 
            ? `Viewing completed workout for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
            : 'Transform your physique with structured progression - click sections to expand and track your journey'
          }
        </p>
        {selectedDate && (
          <Button 
            onClick={goToCurrentWorkout}
            className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            ← Back to Current Program
          </Button>
        )}
      </div>

      {/* Workout Sections */}
      <div className="space-y-6">
        {upcomingWorkouts.map((workout, workoutIndex) => {
          const isExpanded = expandedWorkouts[workout.workout_name];
          const isToday = workout.is_today;
          
          return (
            <Card key={workoutIndex} className={`border-2 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 ${
              isToday 
                ? 'border-black bg-gradient-to-br from-gray-50 to-white shadow-black/10' 
                : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-gray-300'
            }`}>
              {/* Workout Header - Clickable */}
              <div 
                className="cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 p-8 border-b border-gray-100 group"
                onClick={() => toggleWorkout(workout.workout_name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-lg">
                        {workout.workout_type === 'push' ? '💪' : workout.workout_type === 'pull' ? '🏋️' : '🦵'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-black tracking-tight flex items-center gap-3 group-hover:text-gray-800 transition-colors">
                        {workout.workout_name}
                        {isToday && (
                          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ✨ Today
                          </span>
                        )}
                        {workout.is_completed && (
                          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ✅ Complete
                          </span>
                        )}
                      </h2>
                      <p className="text-gray-600 mt-2 text-lg font-medium">
                        Week {workout.week} • {new Date(workout.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge className={`text-sm px-5 py-3 ${getPhaseColor(workout.phase)} border-0 font-bold rounded-xl shadow-md`}>
                      {getPhaseName(workout.phase)}
                    </Badge>
                    {/* Expand/Collapse Icon */}
                    <div className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700 transition-all duration-300 ${isExpanded ? 'rotate-180 bg-black text-white' : ''}`}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workout Details - Collapsible */}
              <div className={`transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}>
                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {exerciseIndex + 1}
                            </div>
                            <div>
                              <h3 
                                className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-600 flex items-center gap-2"
                                onClick={() => handleExerciseClick(exercise.name)}
                              >
                                {exercise.name}
                                <BarChart3 className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.previous_load && ` • Previous: ${exercise.previous_load} kg`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Exercise Input */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Weight (kg)
                            </label>
                            <Input
                              type="number"
                              placeholder="Enter weight"
                              value={exerciseLogs[exercise.name]?.load || ''}
                              onChange={(e) => updateExerciseLog(exercise.name, 'load', e.target.value)}
                              className="h-10 text-center border-2 focus:border-black"
                              step="0.5"
                              min="0"
                            />
                          </div>
                          
                          {exercise.previous_load && (
                            <div className="bg-white rounded-lg p-3 text-center border">
                              <p className="text-xs text-gray-600 font-medium">PREVIOUS</p>
                              <p className="text-lg font-bold text-gray-800">{exercise.previous_load} kg</p>
                            </div>
                          )}
                          
                          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                            <p className="text-xs text-blue-600 font-medium">TARGET</p>
                            <p className="text-lg font-bold text-blue-800">{exercise.reps} reps</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Save Button for each workout */}
                  {isToday && (
                    <div className="flex justify-center mt-6">
                      <Button 
                        onClick={() => saveWorkout(workout)}
                        disabled={saving}
                        className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold rounded-lg"
                      >
                        {saving ? 'Saving...' : `Complete ${workout.workout_name}`}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Exercise Progress Modal */}
      <ExerciseProgressModal
        isOpen={showProgressModal}
        onClose={closeProgressModal}
        exerciseName={selectedExercise}
        userId={user.id}
      />
    </div>
  );
};

export default WorkoutView;