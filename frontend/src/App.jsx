import React, { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import KPICard from "./components/KPICard";
import Filters from "./components/Filters";
import InventoryTable from "./components/InventoryTable";
import RiskSection from "./components/RiskSection";
import AlertPanel from "./components/AlertPanel";
import ForecastChart from "./components/ForecastChart";
import ExpiryTable from "./components/ExpiryTable";
import ProcurementCard from "./components/ProcurementCard";
import ItemDetails from "./components/ItemDetails";

import { inventoryService } from "./services/inventoryService";

function App() {
  const [surge, setSurge] = useState(false);
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [forecastRange, setForecastRange] = useState(14);

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    criticality: "All",
    risk: "All",
    expiryStatus: "All",
    supplier: "All",
  });

  // Load inventory data
  const loadData = async () => {
    const inventory = await inventoryService.getInventory(surge);
    const alertData = await inventoryService.getAlerts(surge);

    setItems(inventory);
    setAlerts(alertData);
  };

  useEffect(() => {
    loadData();
  }, [surge]);

  // Filter inventory
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchMatch =
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.generic.toLowerCase().includes(filters.search.toLowerCase());

      const categoryMatch =
        filters.category === "All" ||
        item.category === filters.category;

      const criticalityMatch =
        filters.criticality === "All" ||
        item.criticality === filters.criticality;

      const riskMatch =
        filters.risk === "All" ||
        item.risk === filters.risk;

      const expiryMatch =
        filters.expiryStatus === "All" ||
        item.expiryStatus === filters.expiryStatus;

      const supplierMatch =
        filters.supplier === "All" ||
        item.supplier === filters.supplier;

      return (
        searchMatch &&
        categoryMatch &&
        criticalityMatch &&
        riskMatch &&
        expiryMatch &&
        supplierMatch
      );
    });
  }, [items, filters]);

  // KPI calculations
  const totalInventory = items.length;

  const criticalItems = items.filter(
    (item) => item.criticality === "Critical"
  ).length;

  const stockoutRisks = items.filter(
    (item) => item.risk === "Critical" || item.risk === "High"
  ).length;

  const expiringSoon = items.filter(
    (item) =>
      item.expiryStatus === "Expiring Soon" ||
      item.expiryStatus === "Urgent"
  ).length;

  const reserveStatus = items.every(
    (item) => item.currentStock >= item.emergencyReserve
  )
    ? "Protected"
    : "At Risk";

  // Get available filter values
  const categories = [
    "All",
    ...new Set(items.map((item) => item.category)),
  ];

  const criticalities = [
    "All",
    ...new Set(items.map((item) => item.criticality)),
  ];

  const risks = [
    "All",
    ...new Set(items.map((item) => item.risk)),
  ];

  const expiryStatuses = [
    "All",
    ...new Set(items.map((item) => item.expiryStatus)),
  ];

  const suppliers = [
    "All",
    ...new Set(items.map((item) => item.supplier)),
  ];

  // Open item details
  const handleOpenItem = async (item) => {
    const details = await inventoryService.getItemDetails(
      item.id,
      surge
    );

    setSelectedItem(details);
  };

  // Close item details
  const handleCloseItem = () => {
    setSelectedItem(null);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "All",
      criticality: "All",
      risk: "All",
      expiryStatus: "All",
      supplier: "All",
    });
  };

  return (
    <div className="app-shell">
      <Header
        surge={surge}
        onToggleSurge={() => setSurge((current) => !current)}
      />

      <main className="main-content">
        {/* Emergency demand surge banner */}
        {surge && (
          <section className="surge-banner">
            <div className="surge-banner-icon">!</div>

            <div>
              <strong>EMERGENCY DEMAND SURGE DETECTED</strong>

              <p>
                Abnormal consumption is increasing forecasted demand.
                Review stockout risks and procurement recommendations.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() => setSurge(false)}
            >
              Return to Normal
            </button>
          </section>
        )}

        {/* Page heading */}
        <section className="page-intro">
          <div>
            <p className="eyebrow">LIVE SUPPLY CHAIN MONITORING</p>

            <h1>Hospital Inventory Intelligence</h1>

            <p className="page-description">
              Monitor inventory availability, demand uncertainty,
              expiry exposure, emergency reserves, and procurement
              priorities from one operational dashboard.
            </p>
          </div>

          <div className="status-card">
            <span className="status-dot"></span>

            <div>
              <strong>System Operational</strong>
              <span>Mock intelligence feed active</span>
            </div>
          </div>
        </section>

        {/* KPI cards */}
        <section className="kpi-grid">
          <KPICard
            title="Total Inventory Items"
            value={totalInventory}
            description="Tracked medicines & consumables"
            trend="+4.8%"
            severity="normal"
          />

          <KPICard
            title="Critical Items"
            value={criticalItems}
            description="High clinical criticality"
            trend={surge ? "+18%" : "+2.1%"}
            severity="critical"
          />

          <KPICard
            title="Stockout Risks"
            value={stockoutRisks}
            description="Items requiring attention"
            trend={surge ? "+35%" : "-8.4%"}
            severity={stockoutRisks > 2 ? "critical" : "warning"}
          />

          <KPICard
            title="Expiring Soon"
            value={expiringSoon}
            description="Within priority expiry window"
            trend="+3 items"
            severity="warning"
          />

          <KPICard
            title="Emergency Reserve"
            value={reserveStatus}
            description="Minimum reserve protection"
            trend={reserveStatus === "Protected" ? "Stable" : "Review"}
            severity={
              reserveStatus === "Protected" ? "normal" : "critical"
            }
          />
        </section>

        {/* Filters */}
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">INVENTORY CONTROL</p>
              <h2>Inventory & Risk Overview</h2>
            </div>

            <span className="result-count">
              {filteredItems.length} of {items.length} items
            </span>
          </div>

          <Filters
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            criticalities={criticalities}
            risks={risks}
            expiryStatuses={expiryStatuses}
            suppliers={suppliers}
            onReset={handleResetFilters}
          />

          <InventoryTable
            items={filteredItems}
            onOpenItem={handleOpenItem}
          />
        </section>

        {/* Risk and alert section */}
        <section className="two-column-layout">
          <RiskSection
            items={items}
            surge={surge}
            onOpenItem={handleOpenItem}
          />

          <AlertPanel alerts={alerts} />
        </section>

        {/* Demand forecast */}
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DEMAND INTELLIGENCE</p>
              <h2>Demand Forecast</h2>

              <p className="section-description">
                Historical consumption compared with forecasted demand.
              </p>
            </div>

            <div className="range-selector">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  className={
                    forecastRange === days
                      ? "range-button active"
                      : "range-button"
                  }
                  onClick={() => setForecastRange(days)}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          <ForecastChart
            item={items[0]}
            range={forecastRange}
            surge={surge}
          />
        </section>

        {/* Expiry + procurement */}
        <section className="two-column-layout">
          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">EXPIRY MANAGEMENT</p>
                <h2>Expiry Exposure</h2>
              </div>
            </div>

            <ExpiryTable
              items={items}
              onOpenItem={handleOpenItem}
            />
          </div>

          <ProcurementCard
            item={items.find(
              (item) =>
                item.risk === "Critical" ||
                item.risk === "High"
            )}
            surge={surge}
            onOpenItem={handleOpenItem}
          />
        </section>
      </main>

      {/* Item detail modal */}
      {selectedItem && (
        <ItemDetails
          item={selectedItem}
          surge={surge}
          onClose={handleCloseItem}
        />
      )}
    </div>
  );
}

export default App;