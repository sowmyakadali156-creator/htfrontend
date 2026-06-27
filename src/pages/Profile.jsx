import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(
        "https://habittracker-of6r.onrender.com/api/users/me",
        config
      );

      setProfile(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Please login again");
    }
  };

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    try {
      const response = await axios.put(
        "https://habittracker-of6r.onrender.com/api/users/me",
        {
          name: profile.name,
          age: profile.age,
          bio: profile.bio,
          goal: profile.goal,
        },
        config
      );

      setProfile(response.data);
      setEditMode(false);

      alert("Profile updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="card profile-card">
          <h1>
            <span className="material-symbols-outlined profile-icon">
              account_circle
            </span>
            My Profile
          </h1>

          {!profile ? (
            <p>Loading profile...</p>
          ) : !editMode ? (
            <>
              <div className="profile-details">
                <p>
                  <b>Name:</b> {profile.name || "Not added"}
                </p>

                <p>
                  <b>Email:</b> {profile.email}
                </p>

                <p>
                  <b>Age:</b> {profile.age || "Not added"}
                </p>

                <p>
                  <b>Bio:</b> {profile.bio || "Not added"}
                </p>

                <p>
                  <b>Goal:</b> {profile.goal || "Not added"}
                </p>
              </div>

              <button onClick={() => setEditMode(true)}>
                <span className="material-symbols-outlined action-icon">
                  edit
                </span>
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <input
                name="name"
                value={profile.name || ""}
                placeholder="Name"
                onChange={handleChange}
              />

              <input
                name="age"
                value={profile.age || ""}
                placeholder="Age"
                onChange={handleChange}
              />

              <textarea
                name="bio"
                value={profile.bio || ""}
                placeholder="Bio"
                onChange={handleChange}
              />

              <select
                name="goal"
                value={profile.goal || ""}
                onChange={handleChange}
              >
                <option value="">Select Goal</option>
                <option value="Fitness">Fitness</option>
                <option value="Study">Study</option>
                <option value="Reading">Reading</option>
                <option value="Meditation">Meditation</option>
                <option value="Coding">Coding</option>
              </select>

              <button onClick={updateProfile}>
                <span className="material-symbols-outlined action-icon">
                  save
                </span>
                Save Changes
              </button>

              <button
                className="danger"
                onClick={() => {
                  setEditMode(false);
                  getProfile();
                }}
              >
                <span className="material-symbols-outlined action-icon">
                  close
                </span>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;