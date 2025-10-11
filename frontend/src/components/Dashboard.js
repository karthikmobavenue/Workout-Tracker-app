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
                <div className="bg-green-500 h-2 rounded-full" style={{width: '33%'}}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">33% Complete</p>
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

      {/* Start Program Section */}
      {!hasStartedProgram && (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <Button 
              onClick={() => setCurrentView('calendar')}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-semibold rounded-lg"
              data-testid="start-program-btn"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Your Transformation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;