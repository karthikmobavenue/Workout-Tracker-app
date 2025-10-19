import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Calendar, TrendingUp, Play } from 'lucide-react';

const Dashboard = ({ user, onStartProgram, setCurrentView }) => {
  const hasStartedProgram = user.program_start_date;
  
  // Calculate actual progress based on completed workouts
  const totalWorkouts = 42; // 6 weeks * 7 days = 42 days total program
  const completedWorkouts = 2; // This should come from actual completed workout data
  const progressPercentage = hasStartedProgram ? Math.round((completedWorkouts / totalWorkouts) * 100 * 10) / 10 : 0;
  const currentWeek = hasStartedProgram ? Math.ceil((completedWorkouts + 1) / 7) : 1;

  return (
    <div className="max-w-4xl mx-auto p-4 py-6 pb-20">
      {/* Header with Profile */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">
            Good Morning, {user.first_name}
          </h1>
          <p className="text-gray-600 text-lg">
            Ready for today's workout?
          </p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl font-bold">
            {user.first_name.charAt(0)}
          </span>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="text-center p-4 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <CardContent className="p-0">
            <p className="text-gray-600 text-sm mb-1">Age</p>
            <p className="text-2xl font-bold text-black">{user.age}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-4 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <CardContent className="p-0">
            <p className="text-gray-600 text-sm mb-1">Height</p>
            <p className="text-2xl font-bold text-black">{user.height}cm</p>
          </CardContent>
        </Card>
        
        <Card className="text-center p-4 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <User className="h-6 w-6 text-purple-600" />
          </div>
          <CardContent className="p-0">
            <p className="text-gray-600 text-sm mb-1">Weight</p>
            <p className="text-2xl font-bold text-black">{user.weight}kg</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Program Section */}
      {hasStartedProgram && (
        <Card className="mb-6 border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-black mb-1">Current Program</h3>
                <p className="text-gray-600">6-Week PPL Program</p>
                <p className="text-sm text-gray-500">Week {currentWeek} of 6</p>
              </div>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${progressPercentage}%`}}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{progressPercentage}% Complete ({completedWorkouts}/{totalWorkouts} workouts)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Phases */}
      <Card className="mb-6 border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black">Training Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Phase 1 */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div>
                <h4 className="font-bold text-black">Base Hypertrophy</h4>
                <p className="text-sm text-gray-600">Weeks 1-2</p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Phase 2 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-black">
              <div>
                <h4 className="font-bold text-black">Max Effort</h4>
                <p className="text-sm text-gray-600">Weeks 3-4</p>
              </div>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            
            {/* Phase 3 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <div>
                <h4 className="font-bold text-black">Supercompensation</h4>
                <p className="text-sm text-gray-600">Weeks 5-6</p>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">3</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6-Day Rotation */}
      <Card className="mb-6 border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-black mb-4">6-Day Rotation</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">↑</span>
              </div>
              <span className="text-sm font-medium">Push</span>
            </div>
            
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">↓</span>
              </div>
              <span className="text-sm font-medium">Pull</span>
            </div>
            
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🏃</span>
              </div>
              <span className="text-sm font-medium">Legs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Phases Section */}
      {hasStartedProgram && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Training Phases</h2>
          
          <div className="space-y-4">
            {/* Base Hypertrophy - Completed */}
            <div className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-gray-50 rounded-r-xl">
              <div>
                <h3 className="font-bold text-gray-900">Base Hypertrophy</h3>
                <p className="text-gray-600 text-sm">Weeks 1-2</p>
              </div>
              <div className="w-12 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Max Effort - Current */}
            <div className="flex items-center justify-between p-4 border-l-4 border-black bg-gray-50 rounded-r-xl">
              <div>
                <h3 className="font-bold text-gray-900">Max Effort</h3>
                <p className="text-gray-600 text-sm">Weeks 3-4</p>
              </div>
              <div className="w-12 h-8 bg-black rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>

            {/* Supercompensation - Upcoming */}
            <div className="flex items-center justify-between p-4 border-l-4 border-gray-300 bg-gray-50 rounded-r-xl">
              <div>
                <h3 className="font-bold text-gray-900">Supercompensation</h3>
                <p className="text-gray-600 text-sm">Weeks 5-6</p>
              </div>
              <div className="w-12 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Workout Section */}
      {hasStartedProgram && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Workout</h2>
          
          <div className="border-l-4 border-red-500 pl-6 pr-4 py-4 bg-gray-50 rounded-r-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Push Day
              </div>
            </div>
            
            <p className="text-gray-700 font-medium mb-4">Chest, Shoulders, Triceps</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Duration: 60-75 min</p>
                <p className="text-gray-600 text-sm">Exercises: 7</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">Last session</p>
                <p className="font-bold text-gray-900">2 days ago</p>
              </div>
            </div>
            
            <button 
              onClick={() => setCurrentView('workout')}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-xl font-bold text-lg transition-colors"
            >
              Start Workout
            </button>
          </div>
        </div>
      )}

      {/* This Week Section */}
      {hasStartedProgram && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">This Week</h2>
          
          <div className="grid grid-cols-7 gap-2">
            {/* Monday - Completed */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Mon</p>
              <div className="w-12 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Tuesday - Completed */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Tue</p>
              <div className="w-12 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Wednesday - Completed */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Wed</p>
              <div className="w-12 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Thursday - Rest Day */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Thu</p>
              <div className="w-12 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
            </div>

            {/* Friday - Current Day (Blinking) */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Fri</p>
              <div className="w-12 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>

            {/* Saturday - Upcoming */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Sat</p>
              <div className="w-12 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <span className="text-gray-500 font-bold text-sm">P</span>
              </div>
            </div>

            {/* Sunday - Upcoming */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Sun</p>
              <div className="w-12 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <span className="text-gray-500 font-bold text-sm">L</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Program Section */}
      {!hasStartedProgram && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <button 
              onClick={() => setCurrentView('calendar')}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 px-6 rounded-xl font-bold text-lg transition-colors"
            >
              Start Your Transformation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;