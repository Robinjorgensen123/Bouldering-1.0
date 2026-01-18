import { useState } from "react";
import "./UserSettings.scss";

const UserSettings = () => {
  const [gradeScale, setGradeScale] = useState(
    localStorage.getItem("gradeScale") || "font"
  );

  const handleScaleChange = (scale: string) => {
    setGradeScale(scale);
    localStorage.setItem("gradeScale", scale);
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <section className="settings-section">
        <h2>Grading System</h2>
        <div className="scale-options">
          <button
            className={gradeScale === "font" ? "active" : ""}
            onClick={() => handleScaleChange("font")}
          >
            Fontainebleau
          </button>
          <button
            aria-label="V-Scale"
            className={gradeScale === "v-scale" ? "active" : ""}
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
