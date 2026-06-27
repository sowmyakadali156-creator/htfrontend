import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Calendar() {
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchHabits = async () => {
    try {
      const response = await axios.get(
        "https://habittracker-of6r.onrender.com/api/habits",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHabits(response.data.habits || []);
    } catch (error) {
      alert(error.response?.data?.message || "Could not load calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const completedCountByDate = {};

  habits.forEach((habit) => {
   (habit.completedDates || []).forEach((date) => {
      completedCountByDate[date] = (completedCountByDate[date] || 0) + 1;
    });
  });

  const getDateString = (day) => {
    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  };

  const changeMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const totalCompletedThisMonth = Object.entries(completedCountByDate).filter(
    ([date]) => date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)
  ).length;

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="calendar-header">
          <div>
            <h1>Habit Calendar</h1>
            <p>Track your daily habit completion progress.</p>
          </div>

          <div className="calendar-summary">
            <span>Active days this month</span>
            <b>{totalCompletedThisMonth}</b>
          </div>
        </div>

        <div className="calendar-card">
          <div className="month-controls">
            <button onClick={() => changeMonth(-1)}>← Previous</button>

            <h2>{monthName}</h2>

            <button onClick={() => changeMonth(1)}>Next →</button>
          </div>

          <div className="week-days">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {loading ? (
            <p className="calendar-loading">Loading calendar...</p>
          ) : (
            <div className="calendar-grid real-calendar">
              {Array.from({ length: firstDay }).map((_, index) => (
                <div className="empty-day" key={`empty-${index}`}></div>
              ))}

              {Array.from({ length: totalDays }, (_, index) => {
                const day = index + 1;
                const fullDate = getDateString(day);
                const completedCount = completedCountByDate[fullDate] || 0;
                const isCompleted = completedCount > 0;

                return (
                  <div
                    key={day}
                    className={`day calendar-day ${
                      isCompleted ? "completed-day" : ""
                    }`}
                  >
                    <span className="day-number">{day}</span>

                    {isCompleted && (
                      <span className="completion-count">
                        ✓ {completedCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="calendar-legend">
            <span>
              <i className="legend-empty"></i> No habits completed
            </span>

            <span>
              <i className="legend-completed"></i> Habits completed
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;