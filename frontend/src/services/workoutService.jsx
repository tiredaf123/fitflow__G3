import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/workouts';

// Fetch all plans for this trainer
export const fetchWorkoutPlans = async (token) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;  // array of workout plan objects
};
