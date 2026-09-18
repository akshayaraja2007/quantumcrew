import React from "react";

function RiskBadge({ level, type = "risk" }) {
  const normalizedLevel = String(level || "Normal").toLowerCase();

  const getBadgeClass = () => {
    switch (normalizedLevel) {
      case "critical":
        return "badge-critical";

      case "high":
        return "badge-high";

      case "warning":
        return "badge-warning";

      case "normal":
      case "safe":
        return "badge-normal";

      case "information":
      case "info":
        return "badge-information";

      default:
        return "badge-neutral";
    }
  };

  const getLabel = () => {
    if (!level) {
      return "Normal";
    }

    return level;
  };

  return (
    <span
      className={`risk-badge ${getBadgeClass()} ${type}-badge`}
      title={`${type}: ${getLabel()}`}
    >
      {getLabel()}
    </span>
  );
}

export default RiskBadge;