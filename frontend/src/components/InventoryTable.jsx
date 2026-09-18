import React from "react";
import RiskBadge from "./RiskBadge";

function InventoryTable({ items, onOpenItem }) {
  const getDaysRemaining = (item) => {
    if (!item.dailyUsage || item.dailyUsage <= 0) {
      return 999;
    }

    return Math.ceil(item.currentStock / item.dailyUsage);
  };

  const getDaysClass = (item) => {
    const days = getDaysRemaining(item);

    if (days <= item.leadTime) {
      return "critical";
    }

    if (days <= item.leadTime + 3) {
      return "warning";
    }

    return "normal";
  };

  const getCriticalityLevel = (criticality) => {
    switch (String(criticality || "").toLowerCase()) {
      case "critical":
        return "Critical";

      case "high":
        return "High";

      case "medium":
        return "Warning";

      case "low":
        return "Normal";

      default:
        return criticality || "Normal";
    }
  };

  const getExpiryLevel = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "expired":
        return "Critical";

      case "urgent":
      case "critical":
        return "Critical";

      case "expiring soon":
      case "warning":
        return "Warning";

      case "normal":
      case "safe":
        return "Normal";

      default:
        return status || "Normal";
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="panel">
        <div className="section-heading">
          <div>
            <h2>Inventory Overview</h2>
            <p className="section-description">
              Current hospital inventory and stock status
            </p>
          </div>
        </div>

        <div className="empty-state">
          <strong>No inventory items found</strong>
          <span>
            Try changing the filters or search term.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="section-heading">
        <div>
          <h2>Inventory Overview</h2>
          <p className="section-description">
            Current stock, consumption, expiry and stockout risk
          </p>
        </div>

        <span className="result-count">
          {items.length} items
        </span>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Daily Use</th>
              <th>Days Remaining</th>
              <th>Criticality</th>
              <th>Expiry</th>
              <th>Lead Time</th>
              <th>Stockout Risk</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const daysRemaining = getDaysRemaining(item);
              const daysClass = getDaysClass(item);

              return (
                <tr key={item.id}>
                  {/* Item */}
                  <td>
                    <div className="item-cell">
                      <div>
                        <div className="item-name">
                          {item.name}
                        </div>

                        <div className="item-generic">
                          {item.generic}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="category-label">
                      {item.category}
                    </span>
                  </td>

                  {/* Current Stock */}
                  <td>
                    <span className="numeric-value">
                      {item.currentStock}
                    </span>
                    <span className="text-muted">
                      {" "}
                      units
                    </span>
                  </td>

                  {/* Daily Consumption */}
                  <td>
                    <span className="numeric-value">
                      {item.dailyUsage}
                    </span>
                    <span className="text-muted">
                      {" "}
                      / day
                    </span>
                  </td>

                  {/* Days Remaining */}
                  <td>
                    <span
                      className={`days-remaining ${daysClass}`}
                    >
                      {daysRemaining > 900
                        ? "Stable"
                        : `${daysRemaining} days`}
                    </span>
                  </td>

                  {/* Criticality */}
                  <td>
                    <RiskBadge
                      level={getCriticalityLevel(
                        item.criticality
                      )}
                      type="criticality"
                    />
                  </td>

                  {/* Expiry */}
                  <td>
                    <RiskBadge
                      level={getExpiryLevel(
                        item.expiryStatus
                      )}
                      type="expiry"
                    />

                    {item.expiryDate && (
                      <div className="text-muted">
                        {item.expiryDate}
                      </div>
                    )}
                  </td>

                  {/* Supplier Lead Time */}
                  <td>
                    <span className="numeric-value">
                      {item.leadTime}
                    </span>
                    <span className="text-muted">
                      {" "}
                      days
                    </span>
                  </td>

                  {/* Stockout Risk */}
                  <td>
                    <RiskBadge
                      level={item.risk}
                      type="stockout"
                    />
                  </td>

                  {/* Action */}
                  <td>
                    <button
                      type="button"
                      className="action-button"
                      onClick={() => onOpenItem(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;