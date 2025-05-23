const API_URL = "http://10.0.2.2:5000/api/achievements";

export const fetchAchievements = async (token) => {
  try {
    const res = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch achievements');
    }

    const data = await res.json();
    
    // Ensure we have empty arrays if no achievements
    const unlocked = data.achievements || [];
    const newAchievements = data.newAchievements || [];

    return {
      streak: data.streak || 0,
      lastLogin: data.lastLogin || '',
      unlocked: unlocked.map(ach => ({
        id: ach,
        title: getAchievementTitle(ach),
        description: getAchievementDescription(ach),
        icon: getAchievementIcon(ach)
      })),
      new: newAchievements.map(ach => ({
        id: ach,
        title: getAchievementTitle(ach),
        description: getAchievementDescription(ach),
        icon: getAchievementIcon(ach)
      }))
    };
  } catch (err) {
    console.error('Error fetching achievements:', err);
    throw err;
  }
};

// Helper functions
const getAchievementTitle = (id) => {
  const titles = {
    '7_day_streak': '7-Day Streak Master',
    '30_day_streak': 'Monthly Legend',
    'first_login': 'Welcome!',
    'first_complete': 'First Task Done'
  };
  return titles[id] || 'Achievement Unlocked';
};

const getAchievementDescription = (id) => {
  const descriptions = {
    '7_day_streak': 'Logged in for 7 consecutive days!',
    '30_day_streak': '30 days of dedication!',
    'first_login': 'Completed your first login',
    'first_complete': 'Completed your first task'
  };
  return descriptions[id] || 'Keep up the good work!';
};

const getAchievementIcon = (id) => {
  const icons = {
    '7_day_streak': 'fire',
    '30_day_streak': 'award',
    'first_login': 'smile',
    'first_complete': 'check-circle'
  };
  return icons[id] || 'star';
};