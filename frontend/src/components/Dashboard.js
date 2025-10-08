import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Calendar, TrendingUp, Play } from 'lucide-react';

const Dashboard = ({ user, onStartProgram, setCurrentView }) => {
  const hasStartedProgram = user.program_start_date;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">
            Welcome, {user.first_name}!
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-black to-gray-600 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-xl mt-6 font-medium leading-relaxed max-w-2xl mx-auto">
          Ready to transform your physique with the <span className="font-bold text-black">Ultimate PPL Program</span>
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">Age</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{user.age} <span className="text-lg text-gray-600">years</span></div>
          </CardContent>
        </Card>
        
        <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">Height</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{user.height} <span className="text-lg text-gray-600">cm</span></div>
          </CardContent>
        </Card>
        
        <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">Weight</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{user.weight} <span className="text-lg text-gray-600">kg</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Program Info */}
      <Card className="mb-12 border-2 shadow-2xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-black mb-3">The Ultimate PPL Program</CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A scientifically-designed 6-week periodized Push/Pull/Legs program engineered for maximum muscle growth and strength gains through progressive overload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-black mb-3 text-lg">Base Hypertrophy</h3>
                <p className="text-sm text-gray-700 font-medium">Weeks 1-2: Foundation building with moderate volume and intensity</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-200 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-black mb-3 text-lg">Maximum Effort</h3>
                <p className="text-sm text-gray-700 font-medium">Weeks 3-4: Intensity focus with lower volume, higher loads</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-black mb-3 text-lg">Supercompensation</h3>
                <p className="text-sm text-gray-700 font-medium">Weeks 5-6: Peak volume for maximum hypertrophy stimulus</p>
              </div>
            </div>
            
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-700 mb-4 text-lg font-medium">
                The program includes strategic deload weeks for recovery and follows a proven 6-day rotation:
              </p>
              <div className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
                <span className="text-blue-300">Push1</span>
                <span className="text-gray-300">→</span>
                <span className="text-green-300">Pull1</span>
                <span className="text-gray-300">→</span>
                <span className="text-red-300">Legs1</span>
                <span className="text-gray-300">→</span>
                <span className="text-blue-300">Push2</span>
                <span className="text-gray-300">→</span>
                <span className="text-green-300">Pull2</span>
                <span className="text-gray-300">→</span>
                <span className="text-red-300">Legs2</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Program Section */}
      <Card className="border-2 shadow-2xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-black mb-4">
            {hasStartedProgram ? '🚀 Program Active' : '💪 Ready to Begin?'}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {hasStartedProgram 
              ? 'Your PPL transformation journey is underway! Track your workouts, monitor progress, and achieve your fitness goals.'
              : 'Start your transformation today with the Ultimate PPL Program. Your journey to a stronger, more muscular physique begins now.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {!hasStartedProgram ? (
            <div className="space-y-6">
              <Button 
                onClick={onStartProgram}
                size="lg"
                className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                data-testid="start-program-btn"
              >
                <Play className="mr-3 h-6 w-6" />
                Start Your Transformation
              </Button>
              <p className="text-gray-500 text-sm">Click to begin your 6-week journey</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl shadow-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-lg">Program Active!</span>
              </div>
              <p className="text-gray-600 font-medium">
                Started on: <span className="font-bold text-black">{new Date(user.program_start_date || Date.now()).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  data-testid="view-calendar-btn"
                  onClick={() => setCurrentView('calendar')}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  View Calendar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  data-testid="todays-workout-btn"
                  onClick={() => setCurrentView('workout')}
                >
                  Today's Workout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;