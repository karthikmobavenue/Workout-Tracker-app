#!/usr/bin/env python3
"""
PPL Workout Tracker Backend API Testing Suite
Tests all backend APIs for functionality, data consistency, and edge cases.
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import time

# Configuration
BASE_URL = "https://liftlogger-11.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class PPLBackendTester:
    def __init__(self):
        self.test_user_id = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response_data"] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
    def test_api_health(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{BASE_URL}/", headers=HEADERS, timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_test("API Health Check", True, f"API is running: {data.get('message', 'OK')}")
                return True
            else:
                self.log_test("API Health Check", False, f"API returned status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection failed: {str(e)}")
            return False
    
    def test_user_onboarding(self):
        """Test user creation with all required fields"""
        user_data = {
            "first_name": "Alex",
            "last_name": "Johnson",
            "age": 28,
            "height": 175.5,
            "weight": 80.2,
            "gender": "male",
            "rest_day": 0  # Sunday
        }
        
        try:
            response = requests.post(f"{BASE_URL}/users", 
                                   json=user_data, 
                                   headers=HEADERS, 
                                   timeout=10)
            
            if response.status_code == 200:
                user = response.json()
                self.test_user_id = user["id"]
                
                # Validate all required fields are present
                required_fields = ["id", "first_name", "last_name", "age", "height", "weight", "gender", "rest_day"]
                missing_fields = [field for field in required_fields if field not in user]
                
                if not missing_fields:
                    self.log_test("User Onboarding", True, 
                                f"User created successfully with ID: {self.test_user_id}")
                    return True
                else:
                    self.log_test("User Onboarding", False, 
                                f"Missing fields in response: {missing_fields}")
                    return False
            else:
                self.log_test("User Onboarding", False, 
                            f"Failed to create user: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Onboarding", False, f"Exception during user creation: {str(e)}")
            return False
    
    def test_get_user(self):
        """Test retrieving user data"""
        if not self.test_user_id:
            self.log_test("Get User", False, "No test user ID available")
            return False
            
        try:
            response = requests.get(f"{BASE_URL}/users/{self.test_user_id}", 
                                  headers=HEADERS, 
                                  timeout=10)
            
            if response.status_code == 200:
                user = response.json()
                self.log_test("Get User", True, f"User retrieved successfully: {user['first_name']} {user['last_name']}")
                return True
            else:
                self.log_test("Get User", False, f"Failed to get user: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Get User", False, f"Exception during user retrieval: {str(e)}")
            return False
    
    def test_program_start(self):
        """Test program start functionality"""
        if not self.test_user_id:
            self.log_test("Program Start", False, "No test user ID available")
            return False
            
        try:
            response = requests.post(f"{BASE_URL}/users/{self.test_user_id}/start-program", 
                                   headers=HEADERS, 
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "start_date" in data:
                    # Verify the start date was set by checking user data
                    user_response = requests.get(f"{BASE_URL}/users/{self.test_user_id}", 
                                               headers=HEADERS, timeout=10)
                    if user_response.status_code == 200:
                        user = user_response.json()
                        if user.get("program_start_date"):
                            self.log_test("Program Start", True, 
                                        f"Program started successfully on {data['start_date']}")
                            return True
                        else:
                            self.log_test("Program Start", False, 
                                        "Program start date not saved in user profile")
                            return False
                else:
                    self.log_test("Program Start", False, "No start_date in response")
                    return False
            else:
                self.log_test("Program Start", False, 
                            f"Failed to start program: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Program Start", False, f"Exception during program start: {str(e)}")
            return False
    
    def test_current_workout_api(self):
        """Test current workout API"""
        if not self.test_user_id:
            self.log_test("Current Workout API", False, "No test user ID available")
            return False
            
        try:
            response = requests.get(f"{BASE_URL}/users/{self.test_user_id}/current-workout", 
                                  headers=HEADERS, 
                                  timeout=10)
            
            if response.status_code == 200:
                workout = response.json()
                required_fields = ["week", "phase", "workout_type", "workout_number", "exercises", "date"]
                missing_fields = [field for field in required_fields if field not in workout]
                
                if not missing_fields:
                    if workout["workout_type"] == "rest":
                        self.log_test("Current Workout API", True, 
                                    f"Current workout is rest day (week {workout['week']}, {workout['phase']})")
                    else:
                        exercise_count = len(workout["exercises"])
                        self.log_test("Current Workout API", True, 
                                    f"Current workout: {workout['workout_type'].upper()}{workout['workout_number']} "
                                    f"(week {workout['week']}, {workout['phase']}) with {exercise_count} exercises")
                    return True
                else:
                    self.log_test("Current Workout API", False, 
                                f"Missing fields in workout response: {missing_fields}")
                    return False
            else:
                self.log_test("Current Workout API", False, 
                            f"Failed to get current workout: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Current Workout API", False, f"Exception during current workout fetch: {str(e)}")
            return False
    
    def test_upcoming_workouts_api(self):
        """Test upcoming workouts API for multiple workout sections"""
        if not self.test_user_id:
            self.log_test("Upcoming Workouts API", False, "No test user ID available")
            return False
            
        try:
            response = requests.get(f"{BASE_URL}/users/{self.test_user_id}/upcoming-workouts?days=7", 
                                  headers=HEADERS, 
                                  timeout=10)
            
            if response.status_code == 200:
                workouts = response.json()
                
                if isinstance(workouts, list):
                    workout_count = len(workouts)
                    
                    # Validate structure of each workout
                    valid_workouts = 0
                    for workout in workouts:
                        required_fields = ["date", "week", "phase", "workout_type", "workout_number", 
                                         "workout_name", "exercises"]
                        if all(field in workout for field in required_fields):
                            valid_workouts += 1
                    
                    if valid_workouts == workout_count:
                        self.log_test("Upcoming Workouts API", True, 
                                    f"Retrieved {workout_count} upcoming workouts with proper structure")
                        
                        # Test section-level data for accordion UI
                        workout_types = set(w["workout_type"] for w in workouts if w["workout_type"] != "rest")
                        self.log_test("Upcoming Workouts - Section Data", True, 
                                    f"Workout sections available: {', '.join(workout_types)}")
                        return True
                    else:
                        self.log_test("Upcoming Workouts API", False, 
                                    f"Only {valid_workouts}/{workout_count} workouts have valid structure")
                        return False
                else:
                    self.log_test("Upcoming Workouts API", False, "Response is not a list")
                    return False
            else:
                self.log_test("Upcoming Workouts API", False, 
                            f"Failed to get upcoming workouts: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Upcoming Workouts API", False, f"Exception during upcoming workouts fetch: {str(e)}")
            return False
    
    def test_specific_day_workout_api(self):
        """Test specific day workout API for historical workouts"""
        if not self.test_user_id:
            self.log_test("Specific Day Workout API", False, "No test user ID available")
            return False
            
        # Test today's date
        today = datetime.now().strftime("%Y-%m-%d")
        
        try:
            response = requests.get(f"{BASE_URL}/users/{self.test_user_id}/workout/{today}", 
                                  headers=HEADERS, 
                                  timeout=10)
            
            if response.status_code == 200:
                workout = response.json()
                required_fields = ["date", "week", "phase", "workout_type", "workout_number", "exercises"]
                missing_fields = [field for field in required_fields if field not in workout]
                
                if not missing_fields:
                    self.log_test("Specific Day Workout API", True, 
                                f"Retrieved workout for {today}: {workout['workout_type'].upper()}{workout['workout_number']}")
                    
                    # Test a future date
                    future_date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
                    future_response = requests.get(f"{BASE_URL}/users/{self.test_user_id}/workout/{future_date}", 
                                                 headers=HEADERS, timeout=10)
                    
                    if future_response.status_code == 200:
                        self.log_test("Specific Day Workout API - Future Date", True, 
                                    f"Successfully retrieved workout for future date {future_date}")
                    else:
                        self.log_test("Specific Day Workout API - Future Date", False, 
                                    f"Failed to get future date workout: {future_response.status_code}")
                    
                    return True
                else:
                    self.log_test("Specific Day Workout API", False, 
                                f"Missing fields in workout response: {missing_fields}")
                    return False
            else:
                self.log_test("Specific Day Workout API", False, 
                            f"Failed to get workout for {today}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Specific Day Workout API", False, f"Exception during specific day workout fetch: {str(e)}")
            return False
    
    def test_calendar_api(self):
        """Test calendar API for calendar view"""
        if not self.test_user_id:
            self.log_test("Calendar API", False, "No test user ID available")
            return False
            
        try:
            response = requests.get(f"{BASE_URL}/users/{self.test_user_id}/calendar?days=30", 
                                  headers=HEADERS, 
                                  timeout=10)
            
            if response.status_code == 200:
                calendar_data = response.json()
                
                if isinstance(calendar_data, list) and len(calendar_data) == 30:
                    # Validate structure of calendar entries
                    valid_entries = 0
                    rest_days = 0
                    workout_days = 0
                    
                    for entry in calendar_data:
                        required_fields = ["date", "week", "phase", "workout_type", "workout_number", 
                                         "workout_name", "is_rest_day", "is_completed"]
                        if all(field in entry for field in required_fields):
                            valid_entries += 1
                            if entry["is_rest_day"]:
                                rest_days += 1
                            else:
                                workout_days += 1
                    
                    if valid_entries == 30:
                        self.log_test("Calendar API", True, 
                                    f"Retrieved 30-day calendar: {workout_days} workout days, {rest_days} rest days")
                        return True
                    else:
                        self.log_test("Calendar API", False, 
                                    f"Only {valid_entries}/30 calendar entries have valid structure")
                        return False
                else:
                    self.log_test("Calendar API", False, 
                                f"Expected 30 calendar entries, got {len(calendar_data) if isinstance(calendar_data, list) else 'non-list'}")
                    return False
            else:
                self.log_test("Calendar API", False, 
                            f"Failed to get calendar: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Calendar API", False, f"Exception during calendar fetch: {str(e)}")
            return False
    
    def test_workout_session_saving(self):
        """Test workout session saving API"""
        if not self.test_user_id:
            self.log_test("Workout Session Saving", False, "No test user ID available")
            return False
            
        # Create a sample workout session
        session_data = {
            "user_id": self.test_user_id,
            "workout_type": "push",
            "workout_number": 1,
            "week": 1,
            "phase": "phase1",
            "exercises": [
                {
                    "name": "DB Shoulder Press",
                    "sets": 4,
                    "reps": "8-10",
                    "load": 25.0
                },
                {
                    "name": "Machine Shoulder Press",
                    "sets": 3,
                    "reps": "10-12",
                    "load": 30.0
                }
            ],
            "date": datetime.now().isoformat()
        }
        
        try:
            response = requests.post(f"{BASE_URL}/users/{self.test_user_id}/workout-session", 
                                   json=session_data, 
                                   headers=HEADERS, 
                                   timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if "message" in result:
                    self.log_test("Workout Session Saving", True, 
                                f"Workout session saved successfully: {result['message']}")
                    return True
                else:
                    self.log_test("Workout Session Saving", False, "No confirmation message in response")
                    return False
            else:
                self.log_test("Workout Session Saving", False, 
                            f"Failed to save workout session: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Workout Session Saving", False, f"Exception during workout session save: {str(e)}")
            return False
    
    def test_exercise_progress_api(self):
        """Test exercise progress API for viewing exercise-specific progress graphs"""
        if not self.test_user_id:
            self.log_test("Exercise Progress API", False, "No test user ID available")
            return False
            
        # Test single exercise progress
        exercise_name = "DB Shoulder Press"
        
        try:
            response = requests.get(f"{BASE_URL}/users/{self.test_user_id}/exercise-progress/{exercise_name}", 
                                  headers=HEADERS, 
                                  timeout=10)
            
            if response.status_code == 200:
                progress = response.json()
                
                if "exercise_name" in progress and "data" in progress:
                    data_points = len(progress["data"])
                    self.log_test("Exercise Progress API - Single Exercise", True, 
                                f"Retrieved progress for {exercise_name}: {data_points} data points")
                    
                    # Test all progress endpoint
                    all_response = requests.get(f"{BASE_URL}/users/{self.test_user_id}/all-progress", 
                                              headers=HEADERS, timeout=10)
                    
                    if all_response.status_code == 200:
                        all_progress = all_response.json()
                        exercise_count = len(all_progress.keys()) if isinstance(all_progress, dict) else 0
                        self.log_test("Exercise Progress API - All Exercises", True, 
                                    f"Retrieved progress for {exercise_count} exercises")
                        return True
                    else:
                        self.log_test("Exercise Progress API - All Exercises", False, 
                                    f"Failed to get all progress: {all_response.status_code}")
                        return False
                else:
                    self.log_test("Exercise Progress API - Single Exercise", False, 
                                "Missing exercise_name or data in response")
                    return False
            else:
                self.log_test("Exercise Progress API - Single Exercise", False, 
                            f"Failed to get exercise progress: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Exercise Progress API", False, f"Exception during exercise progress fetch: {str(e)}")
            return False
    
    def test_edge_cases(self):
        """Test edge cases and error handling"""
        edge_case_results = []
        
        # Test invalid user ID
        try:
            response = requests.get(f"{BASE_URL}/users/invalid-uuid", headers=HEADERS, timeout=10)
            if response.status_code == 404:
                edge_case_results.append("✅ Invalid user ID returns 404")
            else:
                edge_case_results.append(f"❌ Invalid user ID returns {response.status_code}, expected 404")
        except Exception as e:
            edge_case_results.append(f"❌ Exception testing invalid user ID: {str(e)}")
        
        # Test invalid date format
        if self.test_user_id:
            try:
                response = requests.get(f"{BASE_URL}/users/{self.test_user_id}/workout/invalid-date", 
                                      headers=HEADERS, timeout=10)
                if response.status_code == 400:
                    edge_case_results.append("✅ Invalid date format returns 400")
                else:
                    edge_case_results.append(f"❌ Invalid date format returns {response.status_code}, expected 400")
            except Exception as e:
                edge_case_results.append(f"❌ Exception testing invalid date: {str(e)}")
        
        success = all("✅" in result for result in edge_case_results)
        self.log_test("Edge Cases", success, f"Edge case tests: {'; '.join(edge_case_results)}")
        return success
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting PPL Workout Tracker Backend API Tests")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("API Health Check", self.test_api_health),
            ("User Onboarding", self.test_user_onboarding),
            ("Get User", self.test_get_user),
            ("Program Start", self.test_program_start),
            ("Current Workout API", self.test_current_workout_api),
            ("Upcoming Workouts API", self.test_upcoming_workouts_api),
            ("Specific Day Workout API", self.test_specific_day_workout_api),
            ("Calendar API", self.test_calendar_api),
            ("Workout Session Saving", self.test_workout_session_saving),
            ("Exercise Progress API", self.test_exercise_progress_api),
            ("Edge Cases", self.test_edge_cases)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_test(test_name, False, f"Unexpected exception: {str(e)}")
            
            # Small delay between tests
            time.sleep(0.5)
        
        print("\n" + "=" * 60)
        print(f"🏁 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All backend APIs are working correctly!")
        else:
            print(f"⚠️  {total - passed} tests failed - see details above")
        
        return passed, total, self.test_results

def main():
    """Main test execution"""
    tester = PPLBackendTester()
    passed, total, results = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "passed": passed,
                "total": total,
                "success_rate": f"{(passed/total)*100:.1f}%"
            },
            "results": results
        }, f, indent=2)
    
    print(f"\n📊 Detailed results saved to backend_test_results.json")
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)