import React, { useMemo } from "react";

function ForecastChart({ item, range = 14, surge = false }) {
  const chartData = useMemo(() => {
    if (!item) {
      return {
        labels: [],
        historical: [],
        forecast: [],
      };
    }

    const historical = item.historical || [];

    const baseUsage =
      item.normalDailyUsage ||
      item.dailyUsage ||
      1;

    const forecastMultiplier = surge ? 1.35 : 1;

    const forecast = Array.from(
      { length: range },
      (_, index) => {
        const variation =
          1 + Math.sin(index * 0.8) * 0.08;

        return Math.round(
          baseUsage *
            forecastMultiplier *
            variation
        );
      }
    );

    const labels = [
      ...historical.map((_, index) => `H-${historical.length - index}`),
      ...forecast.map((_, index) => `F+${index + 1}`),
    ];

    return {
      labels,
      historical,
      forecast,
    };
  }, [item, range, surge]);

  const createPoints = (values, startIndex = 0) => {
    if (!values.length) {
      return "";
    }

    const width = 760;
    const height = 260;

    const maxValue =
      Math.max(...values, 10) * 1.2;

    return values
      .map((value, index) => {
        const x =
          ((startIndex + index) /
            Math.max(
              chartData.labels.length - 1,
              1
            )) *
          width;

        const y =
          height -
          (value / maxValue) * height;

        return `${x},${y}`;
      })
      .join(" ");
  };

  if (!item) {
    return (
      <div className="panel forecast-chart">
        <div className="section-heading">
          <div>
            <h2>Demand Forecast</h2>
            <p className="section-description">
              Historical consumption and projected demand
            </p>
          </div>
        </div>

        <div className="chart-empty">
          Select an inventory item to view its forecast.
        </div>
      </div>
    );
  }

  const historicalPoints = createPoints(
    chartData.historical,
    0
  );

  const forecastStartIndex =
    chartData.historical.length - 1;

  const forecastValues = [
    chartData.historical[
      chartData.historical.length - 1
    ] || item.dailyUsage || 0,
    ...chartData.forecast,
  ];

  const forecastPoints = createPoints(
    forecastValues,
    forecastStartIndex
  );

  return (
    <div className="panel forecast-chart">
      <div className="chart-header">
        <div>
          <h2>Demand Forecast</h2>

          <p className="section-description">
            {item.name} — historical consumption
            and predicted demand
          </p>
        </div>

        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-line historical"></span>
            Historical
          </span>

          <span className="legend-item">
            <span className="legend-line forecast"></span>
            Forecast
          </span>
        </div>
      </div>

      <div className="range-selector">
        {[7, 14, 30].map((days) => (
          <button
            key={days}
            type="button"
            className={`range-button ${
              range === days ? "active" : ""
            }`}
            onClick={() => {
              // Range selection is controlled by App.jsx.
              // This button is kept for dashboard display.
            }}
          >
            {days} Days
          </button>
        ))}
      </div>

      {surge && (
        <div className="section-description">
          Emergency demand surge scenario is active.
          Forecast reflects increased consumption.
        </div>
      )}

      <div className="chart-container">
        <svg
          className="chart-svg"
          viewBox="0 0 760 300"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Demand forecast for ${item.name}`}
        >
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4].map((line) => {
            const y = 20 + line * 60;

            return (
              <line
                key={line}
                x1="0"
                y1={y}
                x2="760"
                y2={y}
                className="chart-grid-line"
              />
            );
          })}

          {/* Historical line */}
          {historicalPoints && (
            <polyline
              points={historicalPoints}
              fill="none"
              className="chart-historical-line"
            />
          )}

          {/* Forecast line */}
          {forecastPoints && (
            <polyline
              points={forecastPoints}
              fill="none"
              className="chart-forecast-line"
              strokeDasharray="8 6"
            />
          )}

          {/* Historical points */}
          {chartData.historical.map(
            (value, index) => {
              const width = 760;
              const height = 260;

              const maxValue =
                Math.max(
                  ...chartData.historical,
                  ...chartData.forecast,
                  10
                ) * 1.2;

              const x =
                (index /
                  Math.max(
                    chartData.labels.length - 1,
                    1
                  )) *
                width;

              const y =
                height -
                (value / maxValue) * height;

              return (
                <circle
                  key={`history-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  className="chart-point historical-point"
                />
              );
            }
          )}
        </svg>

        <div className="chart-axis-labels">
          <span>Past</span>
          <span>Today</span>
          <span>
            +{range} days
          </span>
        </div>
      </div>

      <div className="risk-stats">
        <div className="risk-stat">
          <span>Current Daily Use</span>
          <strong>
            {item.dailyUsage} units/day
          </strong>
        </div>

        <div className="risk-stat">
          <span>Normal Daily Use</span>
          <strong>
            {item.normalDailyUsage ||
              item.dailyUsage}{" "}
            units/day
          </strong>
        </div>

        <div className="risk-stat">
          <span>Forecast Period</span>
          <strong>
            {range} days
          </strong>
        </div>

        <div className="risk-stat">
          <span>Scenario</span>
          <strong>
            {surge ? "Demand Surge" : "Normal"}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default ForecastChart;