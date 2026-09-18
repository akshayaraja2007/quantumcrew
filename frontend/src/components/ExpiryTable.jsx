import React from "react";
import RiskBadge from "./RiskBadge";

function ExpiryTable({ items, onOpenItem }) {
  const expiryItems = [...(items || [])]
    .filter(
      (item) =>
        item.expiryDays !== undefined &&
        item.expiryDays !== null
    )
    .sort(
      (a, b) =>
        Number(a.expiryDays) -
        Number(b.expiryDays)
    )
    .slice(0, 8);

  const getExpiryLevel = (days) => {
    const value = Number(days);

    if (value <= 0) {
      return "Critical";
    }

    if (value <= 30) {
      return "Critical";
    }

    if (value <= 90) {
      return "Warning";
    }

    return "Normal";
  };

  const getExpiryLabel = (days) => {
    const value = Number(days);

    if (value <= 0) {
      return "Expired";
    }

    if (value <= 30) {
      return "Urgent";
    }

    if (value <= 90) {
      return "Expiring Soon";
    }

    return "Normal";
  };

  const getRecommendedAction = (item) => {
    const days = Number(item.expiryDays);

    if (days <= 30) {
      return "USE FIRST";
    }

    if (days <= 60) {
      return "TRANSFER";
    }

    if (days <= 90) {
      return "DISCOUNT / REDISTRIBUTE";
    }

    return "MONITOR";
  };

  const getWastageEstimate = (item) => {
    const stock = Number(item.currentStock || 0);
    const unitCost = Number(item.unitCost || 0);
    const days = Number(item.expiryDays || 0);
    const dailyUsage = Number(
      item.dailyUsage || 0
    );

    if (days <= 0) {
      return stock * unitCost;
    }

    const expectedUsage =
      dailyUsage * days;

    const estimatedUnused = Math.max(
      stock - expectedUsage,
      0
    );

    return estimatedUnused * unitCost;
  };

  if (expiryItems.length === 0) {
    return (
      <div className="panel expiry-table">
        <div className="section-heading">
          <div>
            <h2>Expiry Management</h2>

            <p className="section-description">
              Medicines and consumables approaching expiry
            </p>
          </div>
        </div>

        <div className="empty-state">
          <strong>
            No expiry information available
          </strong>

          <span>
            No inventory items currently require expiry
            monitoring.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="panel expiry-table">
      <div className="section-heading">
        <div>
          <h2>Expiry Management</h2>

          <p className="section-description">
            Items approaching expiry and recommended
            actions to reduce wastage
          </p>
        </div>

        <span className="result-count">
          {expiryItems.length} items
        </span>
      </div>

      <div className="expiry-table-inner">
        <div className="expiry-header">
          <span>Item</span>
          <span>Quantity</span>
          <span>Expiry Date</span>
          <span>Days Left</span>
          <span>Criticality</span>
          <span>Est. Wastage</span>
          <span>Recommended Action</span>
        </div>

        {expiryItems.map((item) => {
          const expiryLevel = getExpiryLevel(
            item.expiryDays
          );

          const expiryLabel = getExpiryLabel(
            item.expiryDays
          );

          const wastage =
            getWastageEstimate(item);

          return (
            <div
              className="expiry-row"
              key={item.id}
            >
              {/* Item */}
              <div>
                <div className="expiry-item-name">
                  {item.name}
                </div>

                <div className="text-muted">
                  {item.category}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <strong>
                  {item.currentStock}
                </strong>{" "}
                <span className="text-muted">
                  units
                </span>
              </div>

              {/* Expiry Date */}
              <div className="expiry-date">
                {item.expiryDate || "Not available"}
              </div>

              {/* Days Until Expiry */}
              <div
                className={`expiry-days ${
                  item.expiryDays <= 30
                    ? "critical"
                    : item.expiryDays <= 90
                    ? "warning"
                    : ""
                }`}
              >
                {item.expiryDays <= 0
                  ? "Expired"
                  : `${item.expiryDays} days`}
              </div>

              {/* Criticality */}
              <div>
                <RiskBadge
                  level={
                    item.criticality ===
                    "Critical"
                      ? "Critical"
                      : item.criticality ===
                        "High"
                      ? "High"
                      : "Normal"
                  }
                  type="criticality"
                />
              </div>

              {/* Estimated Wastage */}
              <div className="wastage-value">
                ₹
                {wastage.toLocaleString(
                  "en-IN"
                )}
              </div>

              {/* Recommended Action */}
              <div>
                <button
                  type="button"
                  className="action-button"
                  onClick={() =>
                    onOpenItem(item)
                  }
                  title={`Expiry status: ${expiryLabel}`}
                >
                  {getRecommendedAction(item)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExpiryTable;