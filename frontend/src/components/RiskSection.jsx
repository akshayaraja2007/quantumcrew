import React from "react";
import RiskBadge from "./RiskBadge";

function RiskSection({ items, surge, onOpenItem }) {
  const riskItems = items
    .filter(
      (item) =>
        item.risk === "Critical" ||
        item.risk === "High"
    )
    .sort(
      (a, b) =>
        (b.stockoutProbability || 0) -
        (a.stockoutProbability || 0)
    )
    .slice(0, 5);

  const getDaysRemaining = (item) => {
    if (!item.dailyUsage || item.dailyUsage <= 0) {
      return 999;
    }

    return Math.ceil(
      item.currentStock / item.dailyUsage
    );
  };

  const getProgressWidth = (probability) => {
    const value = Number(probability || 0);

    return Math.min(
      Math.max(value, 5),
      100
    );
  };

  return (
    <div className="panel">
      <div className="section-heading">
        <div>
          <h2>Stockout Risk Analysis</h2>

          <p className="section-description">
            Items requiring attention based on consumption,
            lead time and emergency reserve
          </p>
        </div>

        <span className="result-count">
          {riskItems.length} high-risk items
        </span>
      </div>

      {surge && (
        <div className="section-description">
          Demand surge scenario is active. Risk levels
          reflect increased consumption.
        </div>
      )}

      {riskItems.length === 0 ? (
        <div className="empty-state">
          <strong>No high-risk inventory items</strong>

          <span>
            Current inventory is above the monitored
            stockout-risk threshold.
          </span>
        </div>
      ) : (
        <div className="risk-list">
          {riskItems.map((item) => {
            const probability =
              item.stockoutProbability || 0;

            const daysRemaining =
              getDaysRemaining(item);

            return (
              <div
                className="risk-item"
                key={item.id}
              >
                <div className="risk-item-top">
                  <div>
                    <div className="risk-item-name">
                      {item.name}
                    </div>

                    <div className="risk-item-meta">
                      {item.category} •{" "}
                      {item.supplier}
                    </div>
                  </div>

                  <RiskBadge
                    level={item.risk}
                    type="risk"
                  />
                </div>

                <div className="risk-progress">
                  <div
                    className="risk-progress-bar"
                    style={{
                      width: `${getProgressWidth(
                        probability
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="risk-stats">
                  <div className="risk-stat">
                    <span>Stock</span>
                    <strong>
                      {item.currentStock} units
                    </strong>
                  </div>

                  <div className="risk-stat">
                    <span>Daily Use</span>
                    <strong>
                      {item.dailyUsage} / day
                    </strong>
                  </div>

                  <div className="risk-stat">
                    <span>Days Left</span>
                    <strong>
                      {daysRemaining > 900
                        ? "Stable"
                        : `${daysRemaining} days`}
                    </strong>
                  </div>

                  <div className="risk-stat">
                    <span>Lead Time</span>
                    <strong>
                      {item.leadTime} days
                    </strong>
                  </div>

                  <div className="risk-stat">
                    <span>Risk Probability</span>
                    <strong>
                      {probability}%
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="action-button"
                    onClick={() =>
                      onOpenItem(item)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RiskSection;