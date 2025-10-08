import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CalendarView = ({ user, setCurrentView, setSelectedDate }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await axios.get(`${API}/users/${user.id}/calendar?days=30`);
      setCalendarData(response.data);
    } catch (error) {
      console.error('Error fetching calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (day) => {
    if (day.is_rest_day) return; // Don't navigate for rest days
    
    const dateStr = new Date(day.date).toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setCurrentView('workout');
  };

  const getWorkoutTypeColor = (workoutType, isRestDay, isCompleted) => {
    if (isRestDay) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    // Base colors
    let baseColor = '';
    switch (workoutType) {
      case 'push': baseColor = 'bg-red-100 text-red-800 border-red-200'; break;
      case 'pull': baseColor = 'bg-blue-100 text-blue-800 border-blue-200'; break;
      case 'legs': baseColor = 'bg-green-100 text-green-800 border-green-200'; break;
      default: baseColor = 'bg-gray-100 text-gray-800 border-gray-200'; break;
    }
    
    // Add completed styling
    if (isCompleted) {
      switch (workoutType) {
        case 'push': return 'bg-red-600 text-white border-red-600';
        case 'pull': return 'bg-blue-600 text-white border-blue-600';
        case 'legs': return 'bg-green-600 text-white border-green-600';
        default: return 'bg-gray-600 text-white border-gray-600';
      }
    }
    
    return baseColor;
  };

  const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getMonthName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Group calendar data by weeks with proper alignment
  const groupByWeeks = (data) => {
    if (!data || data.length === 0) return [];
    
    const weeks = [];
    let currentWeek = new Array(7).fill(null); // Sunday = 0, Monday = 1, ..., Saturday = 6
    
    data.forEach((day) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // If we're starting a new week and current week has any data
      if (dayOfWeek === 0 && currentWeek.some(d => d !== null)) {
        weeks.push([...currentWeek]);
        currentWeek = new Array(7).fill(null);
      }
      
      currentWeek[dayOfWeek] = day;
    });
    
    // Push the last week if it has any data
    if (currentWeek.some(d => d !== null)) {
      weeks.push(currentWeek);
    }
    
    return weeks;
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

  const weeks = groupByWeeks(calendarData);

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Workout Calendar
            </CardTitle>
            <div className="text-sm font-semibold text-gray-600">
              {calendarData.length > 0 && getMonthName(calendarData[0].date)}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Legend */}
      <Card className="mb-4">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1">Push</Badge>
              <span className="text-xs text-gray-600">Chest, Shoulders, Triceps</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-1">Pull</Badge>
              <span className="text-xs text-gray-600">Back, Biceps</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1">Legs</Badge>
              <span className="text-xs text-gray-600">Quads, Hamstrings, Glutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs px-2 py-1">Rest</Badge>
              <span className="text-xs text-gray-600">Recovery Day</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="pt-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  day ? (
                    <div 
                      key={`${weekIndex}-${dayIndex}`} 
                      className={`
                        min-h-[80px] p-2 border border-gray-200 rounded-md transition-all cursor-pointer text-xs
                        ${isToday(day.date) 
                          ? 'border-black bg-gray-50 shadow-sm' 
                          : 'hover:border-gray-300'
                        }
                        ${!day.is_rest_day ? 'hover:shadow-sm' : 'cursor-default'}
                      `}
                      data-testid={`calendar-day-${dayIndex}`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-semibold ${
                          isToday(day.date) ? 'text-black' : 'text-gray-700'
                        }`}>
                          {formatDate(day.date)}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {getDayName(day.date)}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        {day.is_rest_day ? (
                          <div className="flex items-center justify-center">
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-gray-100 text-gray-600 w-full justify-center font-medium py-1"
                            >
                              🛌 Rest
                            </Badge>
                          </div>
                        ) : day.phase?.includes('deload') ? (
                          <div className="flex items-center justify-center">
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-orange-100 text-orange-700 w-full justify-center font-medium py-1"
                            >
                              💪 Deload
                            </Badge>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-center gap-1">
                              <Badge 
                                className={`text-xs flex-1 justify-center font-semibold py-1 ${getWorkoutTypeColor(day.workout_type, day.is_rest_day, day.is_completed)}`}
                              >
                                {day.workout_name}
                              </Badge>
                              {day.is_completed && (
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 text-center font-medium">
                              Week {day.week}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div 
                      key={`${weekIndex}-${dayIndex}`} 
                      className="min-h-[80px] border border-gray-100 rounded-md bg-gray-25"
                    >
                      {/* Empty day slot */}
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Program Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-black mb-2">6-Day Rotation:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Push1 → Pull1 → Legs1</li>
                <li>• Push2 → Pull2 → Legs2</li>
                <li>• Repeat cycle</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-2">6-Week Program:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Weeks 1-2: Base Hypertrophy</li>
                <li>• Week 3: Deload</li>
                <li>• Weeks 4-5: Maximum Effort</li>
                <li>• Week 6: Supercompensation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;