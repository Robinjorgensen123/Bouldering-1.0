import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./UserSettings.scss";

const UserSettings = () => {
  const { user, updateUser } = useAuth();

  const handleScaleChange = (scale: "font" | "v-scale") => {
    if (!user) return;

    const updatedUser = { ...user, gradingSystem: scale };
    updateUser(updatedUser);
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <section className="settings-section">
        <h2>Grading System</h2>
        <div className="scale-options">
          <button
            className={user?.gradingSystem === "font" ? "active" : ""}
            onClick={() => handleScaleChange("font")}
          >
            Fontainebleau
          </button>
          <button
            aria-label="V-Scale"
            className={user?.gradingSystem === "v-scale" ? "active" : ""}
            onClick={() => handleScaleChange("v-scale")}
          >
            V-Scale
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserSettings;
