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
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentWorkout();
  }, [selectedDate]); // Re-fetch when selectedDate changes

  const fetchCurrentWorkout = async () => {
    try {
      let response;
      if (selectedDate) {
        // Fetch specific date workout
        response = await axios.get(`${API}/users/${user.id}/workout/${selectedDate}`);
      } else {
        // Fetch current workout
        response = await axios.get(`${API}/users/${user.id}/current-workout`);
      }
      setCurrentWorkout(response.data);
      
      // Initialize exercise logs with previous loads
      const logs = {};
      response.data.exercises.forEach(exercise => {
        logs[exercise.name] = {
          load: exercise.previous_load || '',
          notes: ''
        };
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

  const saveWorkout = async () => {
    // Check if trying to save future workout
    const today = new Date().toISOString().split('T')[0];
    const workoutDate = selectedDate || today;
    
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
      const exercises = currentWorkout.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        load: parseFloat(exerciseLogs[exercise.name]?.load) || null
      }));

      const sessionData = {
        user_id: user.id,
        workout_type: currentWorkout.workout_type,
        workout_number: currentWorkout.workout_number,
        week: currentWorkout.week,
        phase: currentWorkout.phase,
        exercises: exercises,
        date: new Date(workoutDate).toISOString()
      };

      await axios.post(`${API}/users/${user.id}/workout-session`, sessionData);
      
      toast({
        title: "Workout Saved! 💪",
        description: "Moving to next workout...",
      });

      // Clear selectedDate to go back to current workout progression
      setCurrentView('calendar'); // Go to calendar to see completion status
      
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

  if (!currentWorkout) {
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
  if (currentWorkout.is_rest_day || currentWorkout.workout_type === 'rest') {
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
      {/* Workout Header */}
      <Card className="mb-6 border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-black tracking-tight">
                {currentWorkout.workout_type.toUpperCase()}{currentWorkout.workout_number}
              </CardTitle>
              <p className="text-gray-600 mt-2 text-lg">
                Week {currentWorkout.week} • {selectedDate ? 
                  new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 
                  new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`text-sm px-4 py-2 ${getPhaseColor(currentWorkout.phase)} border-0 font-semibold`}>
                {getPhaseName(currentWorkout.phase)}
              </Badge>
              {selectedDate && selectedDate !== new Date().toISOString().split('T')[0] && (
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    📅 Historical Workout
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={goToCurrentWorkout}
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    Today's Workout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Exercise List */}
      <Card className="mb-8 border-2 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-2xl font-bold text-black flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Weight className="h-6 w-6 text-white" />
            </div>
            Today's Training Session
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {currentWorkout.exercises.map((exercise, index) => (
              <div key={index} className="group relative bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                {/* Exercise Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 
                      className="text-xl font-bold text-gray-800 cursor-pointer hover:text-gray-600 flex items-center gap-3 transition-colors" 
                      data-testid={`exercise-${index}`}
                      onClick={() => handleExerciseClick(exercise.name)}
                    >
                      {exercise.name}
                      <BarChart3 className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-sm bg-gray-100 text-gray-700 px-3 py-1 font-semibold">
                    {exercise.sets} sets × {exercise.reps} reps
                  </Badge>
                </div>
                
                {/* Exercise Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter weight"
                      value={exerciseLogs[exercise.name]?.load || ''}
                      onChange={(e) => updateExerciseLog(exercise.name, 'load', e.target.value)}
                      className="h-12 text-lg font-semibold text-center border-2 focus:border-black"
                      data-testid={`load-input-${index}`}
                      step="0.5"
                      min="0"
                    />
                  </div>
                  
                  {exercise.previous_load && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium uppercase tracking-wide">Previous</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{exercise.previous_load} kg</div>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium uppercase tracking-wide">Target</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">{exercise.reps} reps</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Button 
            onClick={saveWorkout}
            disabled={saving}
            size="lg"
            className="bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 text-white px-12 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="save-workout-btn"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Saving Workout...
              </>
            ) : (
              <>
                <Save className="mr-3 h-6 w-6" />
                Complete Workout
              </>
            )}
          </Button>
          {selectedDate && selectedDate > new Date().toISOString().split('T')[0] && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-red-600 font-medium whitespace-nowrap">
              ⚠️ Cannot save future workouts
            </div>
          )}
        </div>
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