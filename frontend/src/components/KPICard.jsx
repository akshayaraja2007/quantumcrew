import React from "react";

function KPICard({
  title,
  value,
  description,
  trend,
  severity = "normal",
}) {
  const getTrendClass = () => {
    if (severity === "critical") {
      return "negative";
    }

    if (severity === "warning") {
      return "warning";
    }

    return "positive";
  };

  const getSeverityLabel = () => {
    switch (severity) {
      case "critical":
        return "Critical";
      case "warning":
        return "Warning";
      default:
        return "Normal";
    }
  };

  return (
    <article className={`kpi-card ${severity}`}>
      <div className="kpi-card-header">
        <span className="kpi-title">
          {title}
        </span>

        <span
          className={`status-badge ${
            severity === "critical"
              ? "badge-critical"
              : severity === "warning"
              ? "badge-warning"
              : "badge-normal"
          }`}
        >
          {getSeverityLabel()}
        </span>
      </div>

      <div className="kpi-value">
        {value}
      </div>

      <p className="kpi-description">
        {description}
      </p>

      <div className="kpi-footer">
        <span className={`kpi-trend ${getTrendClass()}`}>
          {trend}
        </span>

        <span className="text-muted">
          vs previous period
        </span>
      </div>
    </article>
  );
}

export default KPICard;