import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    completionPercentage: 0,
    streak: 0,
  });

  const token = localStorage.getItem("token");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const updateStatsFromHabits = (habitList) => {
    const today = getToday();

    const completedToday = habitList.filter((habit) =>
      habit.completedDates?.includes(today)
    ).length;

    setStats((oldStats) => ({
      ...oldStats,
      totalHabits: habitList.length,
      completedToday,
      completionPercentage: habitList.length
        ? Math.round((completedToday / habitList.length) * 100)
        : 0,
    }));
  };

  const fetchHabits = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://habittracker-of6r.onrender.com/api/habits",
        getConfig()
      );

      // Supports both backend response formats:
      // [habits] OR { habits: [...], stats: {...} }
      const receivedHabits = Array.isArray(response.data)
        ? response.data
        : response.data.habits || [];

      setHabits(receivedHabits);

      if (response.data.stats) {
        setStats({
          totalHabits: response.data.stats.totalHabits || 0,
          completedToday: response.data.stats.completedToday || 0,
          completionPercentage:
            response.data.stats.completionPercentage || 0,
          streak: response.data.stats.streak || 0,
        });
      } else {
        updateStatsFromHabits(receivedHabits);
      }
    } catch (error) {
      console.log("Fetch habits error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Could not load habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      return;
    }

    fetchHabits();
  }, []);

  const addHabit = async () => {
    if (!newHabit.trim()) {
      alert("Enter a habit name");
      return;
    }

    try {
      const response = await axios.post(
        "https://habittracker-of6r.onrender.com/api/habits",
        {
          title: newHabit.trim(),
          category,
        },
        getConfig()
      );

      // Show newly added habit immediately
      const updatedHabits = [response.data, ...habits];

      setHabits(updatedHabits);
      updateStatsFromHabits(updatedHabits);

      setNewHabit("");
      setCategory("General");

      // Sync with MongoDB backend
      await fetchHabits();
    } catch (error) {
      console.log("Add habit error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Habit not added");
    }
  };

  const completeHabit = async (id) => {
    try {
      const response = await axios.put(
        `https://habittracker-of6r.onrender.com/api/habits/${id}/complete`,
        {},
        getConfig()
      );

      const updatedHabits = habits.map((habit) =>
        habit._id === id ? response.data : habit
      );

      setHabits(updatedHabits);
      updateStatsFromHabits(updatedHabits);

      await fetchHabits();
    } catch (error) {
      alert(error.response?.data?.message || "Could not complete habit");
    }
  };

  const deleteHabit = async (id) => {
    try {
      await axios.delete(
        `https://habittracker-of6r.onrender.com/api/habits/${id}`,
        getConfig()
      );

      const updatedHabits = habits.filter((habit) => habit._id !== id);

      setHabits(updatedHabits);
      updateStatsFromHabits(updatedHabits);

      await fetchHabits();
    } catch (error) {
      alert(error.response?.data?.message || "Could not delete habit");
    }
  };

  const today = getToday();

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Dashboard</h1>

       <div className="stats-grid">
  <div className="stat-card">
    <span className="material-symbols-outlined stat-icon">
      checklist
    </span>

    <div>
      <p>Total Habits</p>
      <b>{stats.totalHabits}</b>
    </div>
  </div>

  <div className="stat-card">
    <span className="material-symbols-outlined stat-icon success-icon">
      task_alt
    </span>

    <div>
      <p>Completed Today</p>
      <b>{stats.completedToday}</b>
    </div>
  </div>

  <div className="stat-card">
    <span className="material-symbols-outlined stat-icon streak-icon">
      local_fire_department
    </span>

    <div>
      <p>Current Streak</p>
      <b>{stats.streak} Days</b>
    </div>
  </div>

  <div className="stat-card">
    <span className="material-symbols-outlined stat-icon">
      trending_up
    </span>

    <div>
      <p>Completion</p>
      <b>{stats.completionPercentage}%</b>
    </div>
  </div>
</div>

        <div className="card">
          <h2>Add Habit</h2>

          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Example: Read Book - 20 pages"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Fitness">Fitness</option>
            <option value="Study">Study</option>
            <option value="Reading">Reading</option>
            <option value="Meditation">Meditation</option>
            <option value="Coding">Coding</option>
          </select>

          <button onClick={addHabit}>Add Habit</button>
        </div>

        <div className="card">
          <h2>My Habits</h2>

          {loading && <p>Loading habits...</p>}

          {!loading && habits.length === 0 && (
            <p>No habits added yet.</p>
          )}

          {habits.map((habit) => {
            const isCompleted = habit.completedDates?.includes(today);

            return (
              <div className="habit-item" key={habit._id}>
                <div>
                  <h3 className={isCompleted ? "done" : ""}>
                    {habit.title}
                  </h3>

                  <p>{habit.category}</p>
                </div>

                <div>
                  <button
                    onClick={() => completeHabit(habit._id)}
                    disabled={isCompleted}
                  >
                    {isCompleted ? "Completed ✓" : "Complete"}
                  </button>

                  <button
                    className="danger"
                    onClick={() => deleteHabit(habit._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;