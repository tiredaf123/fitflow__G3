// services/achievementService.js
import axios from 'axios';

const API_URL = "http://10.0.2.2:5000/api/achievements";

export const fetchAchievements = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching achievements:', err);
    throw err;
  }
};
