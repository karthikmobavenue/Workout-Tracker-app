import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Calendar, TrendingUp, Play } from 'lucide-react';

const Dashboard = ({ user, onStartProgram, setCurrentView }) => {
  const hasStartedProgram = user.program_start_date;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">
          Welcome, {user.first_name}!
        </h1>
        <p className="text-gray-600 text-lg">
          Ready to transform your physique with the Ultimate PPL Program
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Age</CardTitle>
            <User className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{user.age} years</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Height</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{user.height} cm</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{user.weight} kg</div>
          </CardContent>
        </Card>
      </div>

      {/* Program Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black">The Ultimate PPL Program</CardTitle>
          <CardDescription>
            A 6-week periodized Push/Pull/Legs program designed for maximum muscle growth and strength gains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Phase 1: Base Hypertrophy</h3>
                <p className="text-sm text-gray-600">Weeks 1-2: Moderate volume and intensity</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Phase 2: Maximum Effort</h3>
                <p className="text-sm text-gray-600">Weeks 3-4: Lower volume, higher intensity</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Phase 3: Supercompensation</h3>
                <p className="text-sm text-gray-600">Weeks 5-6: High volume for peak growth</p>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-gray-600 mb-4">
                The program includes deload weeks for recovery and follows a 6-day rotation:
                <br />
                <span className="font-semibold text-black">Push1 → Pull1 → Legs1 → Push2 → Pull2 → Legs2</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Program Section */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-black">
            {hasStartedProgram ? 'Program Active' : 'Ready to Begin?'}
          </CardTitle>
          <CardDescription>
            {hasStartedProgram 
              ? 'Your PPL journey is underway! Track your workouts and monitor progress.'
              : 'Start your transformation today with the Ultimate PPL Program'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {!hasStartedProgram ? (
            <Button 
              onClick={onStartProgram}
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg"
              data-testid="start-program-btn"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Program
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="text-green-600 font-semibold text-lg">
                ✓ Program Started!
              </div>
              <p className="text-gray-600">
                Program started on: {new Date(user.program_start_date || Date.now()).toLocaleDateString()}
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="border-black text-black hover:bg-black hover:text-white"
                  data-testid="view-calendar-btn"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
                <Button 
                  className="bg-black hover:bg-gray-800"
                  data-testid="todays-workout-btn"
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