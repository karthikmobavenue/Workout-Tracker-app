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

const WorkoutView = ({ user, setCurrentView, selectedDate }) => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
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
        <Card className="mb-6">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🛌</div>
            <h2 className="text-2xl font-bold text-black mb-2">Rest Day</h2>
            <p className="text-gray-600 mb-4">
              Time to recover! Your muscles grow during rest.
            </p>
            <div className="text-sm text-gray-500">
              Next workout: Tomorrow
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
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  📅 Historical Workout
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Exercise List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Weight className="h-5 w-5" />
            Today's Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentWorkout.exercises.map((exercise, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 
                      className="font-semibold text-black text-lg cursor-pointer hover:text-gray-600 flex items-center gap-2" 
                      data-testid={`exercise-${index}`}
                      onClick={() => handleExerciseClick(exercise.name)}
                    >
                      {exercise.name}
                      <BarChart3 className="h-4 w-4 text-gray-400" />
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {exercise.sets} sets × {exercise.reps} reps
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Load (kg)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter weight"
                      value={exerciseLogs[exercise.name]?.load || ''}
                      onChange={(e) => updateExerciseLog(exercise.name, 'load', e.target.value)}
                      className="w-full"
                      data-testid={`load-input-${index}`}
                      step="0.5"
                      min="0"
                    />
                  </div>
                  
                  {exercise.previous_load && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Previous: {exercise.previous_load} kg</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Target: {exercise.reps} reps</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={saveWorkout}
          disabled={saving}
          size="lg"
          className="bg-black hover:bg-gray-800 px-8"
          data-testid="save-workout-btn"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Workout'}
        </Button>
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