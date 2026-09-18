import React, { useState } from "react";
import RiskBadge from "./RiskBadge";

function ProcurementCard({
  item,
  surge,
  onOpenItem,
}) {
  const [approved, setApproved] = useState(false);

  if (!item) {
    return (
      <div className="panel procurement-card">
        <div className="procurement-header">
          <div>
            <div className="procurement-label">
              Procurement Recommendation
            </div>

            <h2>No Procurement Action Required</h2>
          </div>
        </div>

        <div className="empty-state">
          <strong>
            Inventory levels are currently stable
          </strong>

          <span>
            No high-risk item requires an immediate
            procurement recommendation.
          </span>
        </div>
      </div>
    );
  }

  const procurement = item.procurement || {};

  const recommendedQuantity =
    procurement.recommendedQuantity ||
    procurement.quantity ||
    Math.max(
      Math.ceil(
        (item.dailyUsage || 1) *
          ((item.leadTime || 1) + 7)
      ) - (item.currentStock || 0),
      0
    );

  const predictedDemand =
    procurement.predictedDemand ||
    Math.ceil(
      (item.dailyUsage || 1) *
        (item.leadTime || 1)
    );

  const reason =
    item.reason ||
    procurement.reason ||
    "Current inventory may not be sufficient to cover expected consumption and supplier lead time.";

  const orderDate =
    procurement.orderDate ||
    "Immediate";

  const handleApprove = () => {
    setApproved(true);
  };

  return (
    <div className="panel procurement-card">
      <div className="procurement-header">
        <div>
          <div className="procurement-label">
            Procurement Recommendation
          </div>

          <h2>
            Recommended Purchase Action
          </h2>
        </div>

        <RiskBadge
          level={item.risk || "High"}
          type="risk"
        />
      </div>

      {approved && (
        <div className="status-card">
          <span className="status-dot"></span>

          <span>
            Procurement recommendation approved
            for demo purposes.
          </span>
        </div>
      )}

      <div className="procurement-item">
        <div>
          <div className="procurement-item-name">
            {item.name}
          </div>

          <div className="procurement-reason">
            {reason}
          </div>
        </div>

        <div className="procurement-quantity">
          <strong>
            {recommendedQuantity}
          </strong>

          <span>units</span>
        </div>
      </div>

      <div className="procurement-details">
        <div className="procurement-detail">
          <span>Current Stock</span>

          <strong>
            {item.currentStock} units
          </strong>
        </div>

        <div className="procurement-detail">
          <span>Predicted Demand</span>

          <strong>
            {predictedDemand} units
          </strong>
        </div>

        <div className="procurement-detail">
          <span>Supplier Lead Time</span>

          <strong>
            {item.leadTime} days
          </strong>
        </div>

        <div className="procurement-detail">
          <span>Emergency Reserve</span>

          <strong>
            {item.emergencyReserve || 0} units
          </strong>
        </div>

        <div className="procurement-detail">
          <span>Recommended Order Date</span>

          <strong>
            {orderDate}
          </strong>
        </div>

        <div className="procurement-detail">
          <span>Supplier</span>

          <strong>
            {item.supplier || "Approved Supplier"}
          </strong>
        </div>
      </div>

      <div className="procurement-explanation">
        <strong>
          Recommendation Explanation
        </strong>

        <p>
          {surge
            ? `Emergency demand surge is active. Expected consumption has increased, so the system recommends maintaining additional inventory to protect the hospital emergency reserve.`
            : `The recommendation considers current stock, daily consumption, supplier lead time and emergency reserve requirements to reduce the possibility of a stockout.`}
        </p>
      </div>

      <div className="procurement-actions">
        <button
          type="button"
          className="primary-button"
          onClick={handleApprove}
          disabled={approved}
        >
          {approved
            ? "Approved"
            : "Approve Recommendation"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => onOpenItem(item)}
        >
          Review Item
        </button>
      </div>
    </div>
  );
}

export default ProcurementCard;