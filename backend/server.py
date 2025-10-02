from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class WorkoutType(str, Enum):
    PUSH = "push"
    PULL = "pull"
    LEGS = "legs"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    age: int
    height: float  # in cm
    weight: float  # in kg
    gender: Gender
    program_start_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    height: float
    weight: float
    gender: Gender

class Exercise(BaseModel):
    name: str
    sets: int
    reps: str  # e.g., "8-10" or "AMRAP"
    load: Optional[float] = None  # weight in kg

class WorkoutSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    workout_type: WorkoutType
    workout_number: int  # 1 or 2 (Push1, Push2, etc.)
    week: int
    phase: str
    exercises: List[Exercise]
    date: datetime
    completed: bool = False
    completed_at: Optional[datetime] = None

class WorkoutSessionCreate(BaseModel):
    user_id: str
    workout_type: WorkoutType
    workout_number: int
    week: int
    phase: str
    exercises: List[Exercise]
    date: datetime

class ExerciseLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    exercise_name: str
    load: float
    sets: int
    reps: str
    workout_date: datetime
    workout_type: WorkoutType
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseLogCreate(BaseModel):
    exercise_name: str
    load: float
    sets: int
    reps: str

# Workout program structure based on the Excel file
WORKOUT_PROGRAM = {
    "phase1": {
        "name": "Base Hypertrophy",
        "weeks": [1, 2],
        "workouts": {
            "push1": [
                {"name": "DB Shoulder Press", "sets": 4, "reps": "8-10"},
                {"name": "Machine Shoulder Press", "sets": 3, "reps": "10-12"},
                {"name": "Cable Crossover", "sets": 3, "reps": "12-15"},
                {"name": "DB Flye", "sets": 3, "reps": "10-12"},
                {"name": "DB Lateral Raise", "sets": 3, "reps": "10-12"},
                {"name": "Overhead Triceps Extension", "sets": 3, "reps": "10-12"},
                {"name": "Close Grip Push Up", "sets": 3, "reps": "AMRAP"}
            ],
            "pull1": [
                {"name": "Barbell Deadlift", "sets": 1, "reps": "3-5"},
                {"name": "Lat Pulldown", "sets": 3, "reps": "8-10"},
                {"name": "Pull-Up", "sets": 3, "reps": "AMRAP"},
                {"name": "Single-Arm DB Row", "sets": 3, "reps": "8-10"},
                {"name": "Meadows Row", "sets": 3, "reps": "10-12"},
                {"name": "Face Pull", "sets": 3, "reps": "12-15"},
                {"name": "Cable Shrug", "sets": 3, "reps": "10-12"}
            ],
            "legs1": [
                {"name": "Machine Squat", "sets": 3, "reps": "8-10"},
                {"name": "Front Squat", "sets": 3, "reps": "8-10"},
                {"name": "Box Squat", "sets": 3, "reps": "8-10"},
                {"name": "Dumbbell RDL", "sets": 3, "reps": "10-12"},
                {"name": "Stiff-Leg Deadlift", "sets": 2, "reps": "8-10"},
                {"name": "Leg Press", "sets": 4, "reps": "10-12"},
                {"name": "Standing Calf Raise", "sets": 5, "reps": "10-12"}
            ],
            "push2": [
                {"name": "Bench Press", "sets": 2, "reps": "AMRAP"},
                {"name": "Incline Press", "sets": 3, "reps": "8-10"},
                {"name": "DB Shoulder Press", "sets": 3, "reps": "10-12"},
                {"name": "Machine Lateral Raise", "sets": 3, "reps": "10-12"},
                {"name": "DB Lateral Raise", "sets": 3, "reps": "10-12"},
                {"name": "Cable Crossover", "sets": 3, "reps": "10-12"},
                {"name": "Overhead Triceps Extension", "sets": 3, "reps": "10-12"},
                {"name": "Close-Grip Push Up", "sets": 3, "reps": "AMRAP"}
            ],
            "pull2": [
                {"name": "Trap Bar Deadlift", "sets": 3, "reps": "5-8"},
                {"name": "EZ-Bar Curl", "sets": 3, "reps": "6-8"},
                {"name": "EZ-Bar Bicep 21s", "sets": 3, "reps": "21"},
                {"name": "Lat Pulldown", "sets": 3, "reps": "10-12"},
                {"name": "Neutral-Grip Lat Pulldown", "sets": 3, "reps": "10-12"},
                {"name": "Chin-Up", "sets": 3, "reps": "AMRAP"},
                {"name": "Kroc Row", "sets": 3, "reps": "10-12"}
            ],
            "legs2": [
                {"name": "Pause Squat", "sets": 5, "reps": "3-5"},
                {"name": "Leg Press", "sets": 4, "reps": "10-12"},
                {"name": "Lying Hamstring Curl", "sets": 3, "reps": "12"},
                {"name": "Nordic Ham Curl", "sets": 3, "reps": "10"},
                {"name": "Seated Calf Raise", "sets": 3, "reps": "12-15"},
                {"name": "Standing Calf Raise", "sets": 3, "reps": "12-15"},
                {"name": "Cable Crunch", "sets": 4, "reps": "15-20"}
            ]
        }
    },
    "phase2": {
        "name": "Maximum Effort",
        "weeks": [3, 4],
        "workouts": {
            "push1": [
                {"name": "Bench Press", "sets": 4, "reps": "3-5"},
                {"name": "Larsen Press", "sets": 3, "reps": "8-10"},
                {"name": "Incline Press", "sets": 3, "reps": "8-10"},
                {"name": "Arnold Press", "sets": 3, "reps": "8-10"},
                {"name": "DB Flye", "sets": 3, "reps": "10-12"},
                {"name": "Press-Around", "sets": 3, "reps": "12-15"},
                {"name": "Triceps Pressdown", "sets": 3, "reps": "8+8"}
            ],
            "pull1": [
                {"name": "Barbell RDL", "sets": 3, "reps": "6-8"},
                {"name": "Lat Pulldown", "sets": 5, "reps": "10"},
                {"name": "Machine Row", "sets": 3, "reps": "8-10"},
                {"name": "Incline DB Row", "sets": 3, "reps": "8-10"},
                {"name": "Cable Row", "sets": 3, "reps": "8-10"},
                {"name": "DB Lat Pullover", "sets": 3, "reps": "10-12"},
                {"name": "Face Pull", "sets": 3, "reps": "12-15"}
            ],
            "legs1": [
                {"name": "Squat", "sets": 3, "reps": "3-5"},
                {"name": "Stiff-Leg Deadlift", "sets": 2, "reps": "8"},
                {"name": "Leg Press", "sets": 4, "reps": "10-12"},
                {"name": "DB Step-Up", "sets": 3, "reps": "10-12"},
                {"name": "Goblet Squat", "sets": 3, "reps": "10-12"},
                {"name": "Seated Calf Raise", "sets": 3, "reps": "12-15"},
                {"name": "Standing Calf Raise", "sets": 3, "reps": "12-15"}
            ]
        }
    },
    "phase3": {
        "name": "Supercompensation",
        "weeks": [5, 6],
        "workouts": {
            "push1": [
                {"name": "Incline Press", "sets": 3, "reps": "8,5,12"},
                {"name": "Bench Press", "sets": 5, "reps": "5"},
                {"name": "DB Shoulder Press", "sets": 3, "reps": "10-12"},
                {"name": "Machine Lateral Raise", "sets": 3, "reps": "10-12"},
                {"name": "DB Lateral Raise", "sets": 3, "reps": "10-12"},
                {"name": "DB Flye", "sets": 3, "reps": "10-12"},
                {"name": "Triceps Pressdown", "sets": 3, "reps": "8+8"}
            ],
            "pull1": [
                {"name": "Deadlift", "sets": 1, "reps": "3-5"},
                {"name": "Lat Pulldown", "sets": 3, "reps": "10-12"},
                {"name": "Pull-Up", "sets": 3, "reps": "AMRAP"},
                {"name": "Single-Arm DB Row", "sets": 3, "reps": "10-12"},
                {"name": "Meadows Row", "sets": 3, "reps": "12-15"},
                {"name": "Face Pull", "sets": 3, "reps": "15-20"},
                {"name": "DB Shrug", "sets": 3, "reps": "10-12"}
            ],
            "legs1": [
                {"name": "Machine Squat", "sets": 3, "reps": "10-12"},
                {"name": "Front Squat", "sets": 3, "reps": "10-12"},
                {"name": "Box Squat", "sets": 3, "reps": "10-12"},
                {"name": "Dumbbell RDL", "sets": 3, "reps": "12-15"},
                {"name": "Stiff-Leg Deadlift", "sets": 1, "reps": "8"},
                {"name": "Leg Press", "sets": 5, "reps": "12-15"},
                {"name": "Standing Calf Raise", "sets": 5, "reps": "15-20"}
            ]
        }
    }
}

# Helper functions
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, str) and 'T' in value:
                try:
                    item[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except:
                    pass
    return item

def get_current_week_and_phase(start_date: datetime):
    """Calculate current week and phase based on start date"""
    current_date = datetime.now(timezone.utc)
    days_elapsed = (current_date - start_date).days
    week = (days_elapsed // 7) + 1
    
    if week <= 2:
        phase = "phase1"
    elif week == 3:  # Deload week
        phase = "deload1"
        week = 3
    elif week <= 5:
        phase = "phase2"
    elif week == 6:  # Semi-deload week
        phase = "deload2"
        week = 6
    elif week <= 8:
        phase = "phase3"
        week = week - 2  # Adjust for deload weeks
    else:
        # Program complete, cycle back to phase1
        phase = "phase1"
        week = ((week - 1) % 6) + 1
    
    return week, phase

def get_workout_for_day(start_date: datetime, target_date: datetime):
    """Get the workout type and number for a specific date"""
    days_elapsed = (target_date - start_date).days
    workout_cycle = days_elapsed % 6  # 6-day cycle: Push1, Pull1, Legs1, Push2, Pull2, Legs2
    
    workout_map = {
        0: ("push", 1),
        1: ("pull", 1),
        2: ("legs", 1),
        3: ("push", 2),
        4: ("pull", 2),
        5: ("legs", 2)
    }
    
    return workout_map[workout_cycle]

# API Routes
@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    user_dict = user_data.dict()
    user_obj = User(**user_dict)
    user_dict = prepare_for_mongo(user_obj.dict())
    await db.users.insert_one(user_dict)
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = parse_from_mongo(user)
    return User(**user)

@api_router.post("/users/{user_id}/start-program")
async def start_program(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    start_date = datetime.now(timezone.utc)
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"program_start_date": start_date.isoformat()}}
    )
    
    return {"message": "Program started", "start_date": start_date}

@api_router.get("/users/{user_id}/current-workout")
async def get_current_workout(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.get("program_start_date"):
        raise HTTPException(status_code=400, detail="Program not started")
    
    start_date = datetime.fromisoformat(user["program_start_date"].replace('Z', '+00:00'))
    current_date = datetime.now(timezone.utc)
    
    week, phase = get_current_week_and_phase(start_date)
    workout_type, workout_number = get_workout_for_day(start_date, current_date)
    
    # Handle deload weeks
    if "deload" in phase:
        exercises = [{"name": "Rest Day - Light Activity", "sets": 0, "reps": "Recovery"}]
    else:
        workout_key = f"{workout_type}{workout_number}"
        exercises = WORKOUT_PROGRAM[phase]["workouts"].get(workout_key, [])
    
    # Get previous session data for this exercise
    previous_session = await db.workout_sessions.find_one(
        {
            "user_id": user_id,
            "workout_type": workout_type,
            "workout_number": workout_number
        },
        sort=[("date", -1)]
    )
    
    # Add previous loads to exercises
    for exercise in exercises:
        previous_load = None
        if previous_session:
            for prev_ex in previous_session.get("exercises", []):
                if prev_ex.get("name") == exercise["name"]:
                    previous_load = prev_ex.get("load")
                    break
        exercise["previous_load"] = previous_load
    
    return {
        "week": week,
        "phase": phase,
        "workout_type": workout_type,
        "workout_number": workout_number,
        "exercises": exercises,
        "date": current_date
    }

@api_router.get("/users/{user_id}/calendar")
async def get_workout_calendar(user_id: str, days: int = 30):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.get("program_start_date"):
        raise HTTPException(status_code=400, detail="Program not started")
    
    start_date = datetime.fromisoformat(user["program_start_date"].replace('Z', '+00:00'))
    calendar_data = []
    
    for i in range(days):
        target_date = datetime.now(timezone.utc) + timedelta(days=i)
        week, phase = get_current_week_and_phase(start_date)
        workout_type, workout_number = get_workout_for_day(start_date, target_date)
        
        calendar_data.append({
            "date": target_date,
            "week": week,
            "phase": phase,
            "workout_type": workout_type,
            "workout_number": workout_number,
            "workout_name": f"{workout_type.title()}{workout_number}" if "deload" not in phase else "Rest Day"
        })
    
    return calendar_data

@api_router.post("/users/{user_id}/workout-session")
async def log_workout_session(user_id: str, session_data: WorkoutSessionCreate):
    session_dict = session_data.dict()
    session_obj = WorkoutSession(**session_dict)
    session_dict = prepare_for_mongo(session_obj.dict())
    await db.workout_sessions.insert_one(session_dict)
    
    # Log individual exercises
    for exercise in session_data.exercises:
        if exercise.load:
            exercise_log = ExerciseLog(
                user_id=user_id,
                exercise_name=exercise.name,
                load=exercise.load,
                sets=exercise.sets,
                reps=exercise.reps,
                workout_date=session_data.date,
                workout_type=session_data.workout_type
            )
            exercise_dict = prepare_for_mongo(exercise_log.dict())
            await db.exercise_logs.insert_one(exercise_dict)
    
    return {"message": "Workout session logged"}

@api_router.get("/users/{user_id}/progress/{exercise_name}")
async def get_exercise_progress(user_id: str, exercise_name: str):
    logs = await db.exercise_logs.find(
        {"user_id": user_id, "exercise_name": exercise_name}
    ).sort("workout_date", 1).to_list(None)
    
    progress_data = []
    for log in logs:
        log = parse_from_mongo(log)
        progress_data.append({
            "date": log["workout_date"],
            "load": log["load"],
            "sets": log["sets"],
            "reps": log["reps"]
        })
    
    return progress_data

@api_router.get("/users/{user_id}/all-progress")
async def get_all_progress(user_id: str):
    logs = await db.exercise_logs.find(
        {"user_id": user_id}
    ).sort("workout_date", 1).to_list(None)
    
    progress_by_exercise = {}
    for log in logs:
        log = parse_from_mongo(log)
        exercise_name = log["exercise_name"]
        if exercise_name not in progress_by_exercise:
            progress_by_exercise[exercise_name] = []
        
        progress_by_exercise[exercise_name].append({
            "date": log["workout_date"],
            "load": log["load"],
            "sets": log["sets"],
            "reps": log["reps"]
        })
    
    return progress_by_exercise

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()