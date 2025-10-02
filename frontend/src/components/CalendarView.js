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

  // Group calendar data by weeks
  const groupByWeeks = (data) => {
    const weeks = [];
    let currentWeek = [];
    
    data.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      
      // Start new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      // If it's the last day, push the current week
      if (index === data.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
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
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-black flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Workout Calendar
            </CardTitle>
            <div className="text-lg font-semibold text-gray-600">
              {calendarData.length > 0 && getMonthName(calendarData[0].date)}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Legend */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">Push</Badge>
              <span className="text-sm text-gray-600">Chest, Shoulders, Triceps</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pull</Badge>
              <span className="text-sm text-gray-600">Back, Biceps</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">Legs</Badge>
              <span className="text-sm text-gray-600">Quads, Hamstrings, Glutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-100 text-gray-800 border-gray-200">Rest</Badge>
              <span className="text-sm text-gray-600">Deload Week</span>
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
          <div className="space-y-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`
                      min-h-[100px] p-3 border-2 rounded-lg transition-all cursor-pointer
                      ${isToday(day.date) 
                        ? 'border-black bg-gray-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                      ${!day.is_rest_day ? 'hover:shadow-sm' : 'cursor-default'}
                    `}
                    data-testid={`calendar-day-${dayIndex}`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium ${
                        isToday(day.date) ? 'text-black' : 'text-gray-600'
                      }`}>
                        {formatDate(day.date)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getDayName(day.date)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {day.is_rest_day ? (
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-gray-100 text-gray-800 w-full justify-center"
                        >
                          Rest Day
                        </Badge>
                      ) : day.phase?.includes('deload') ? (
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-orange-100 text-orange-800 w-full justify-center"
                        >
                          Deload
                        </Badge>
                      ) : (
                        <>
                          <Badge 
                            className={`text-xs w-full justify-center ${getWorkoutTypeColor(day.workout_type, day.is_rest_day)}`}
                          >
                            {day.workout_name}
                          </Badge>
                          <div className="text-xs text-gray-500 text-center">
                            Week {day.week}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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