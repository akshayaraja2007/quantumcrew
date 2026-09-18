import React, { useEffect, useState } from "react";

function Header({ surge, onToggleSurge }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="app-header">
      <div className="header-inner">

        {/* Brand */}
        <div className="brand-area">
          <div className="brand-mark">
            +
          </div>

          <div className="brand-text">
            <h1 className="brand-title">
              MedSupply Intelligence
            </h1>

            <span className="brand-subtitle">
              Healthcare Supply Chain Intelligence
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions">

          {/* Hospital */}
          <div className="hospital-selector">
            <span>
              <span className="hospital-label">
                Hospital
              </span>

              <span className="hospital-name">
                CityCare General Hospital
              </span>
            </span>
          </div>

          {/* Date and Time */}
          <div className="header-date">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>

          {/* Demand Surge Simulation */}
          <button
            className={
              surge
                ? "icon-button notification-button"
                : "icon-button"
            }
            onClick={onToggleSurge}
            title={
              surge
                ? "Disable demand surge simulation"
                : "Simulate emergency demand surge"
            }
            aria-label="Toggle demand surge simulation"
          >
            {surge ? "!" : "⚡"}

            {!surge && (
              <span className="notification-dot"></span>
            )}
          </button>

          {/* Profile */}
          <div
            className="profile-chip"
            title="Supply Chain Manager"
          >
            SC
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;