import React from "react";

function Filters({
  filters,
  setFilters,
  categories,
  criticalities,
  risks,
  expiryStatuses,
  suppliers,
  onReset,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="filters">
      {/* Search */}
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        className="search-input"
        placeholder="Search medicine or consumable..."
        aria-label="Search inventory"
      />

      {/* Category */}
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="filter-select"
        aria-label="Filter by category"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === "All"
              ? "All Categories"
              : category}
          </option>
        ))}
      </select>

      {/* Criticality */}
      <select
        name="criticality"
        value={filters.criticality}
        onChange={handleChange}
        className="filter-select"
        aria-label="Filter by criticality"
      >
        {criticalities.map((criticality) => (
          <option key={criticality} value={criticality}>
            {criticality === "All"
              ? "All Criticality"
              : criticality}
          </option>
        ))}
      </select>

      {/* Risk */}
      <select
        name="risk"
        value={filters.risk}
        onChange={handleChange}
        className="filter-select"
        aria-label="Filter by stockout risk"
      >
        {risks.map((risk) => (
          <option key={risk} value={risk}>
            {risk === "All"
              ? "All Risk Levels"
              : `${risk} Risk`}
          </option>
        ))}
      </select>

      {/* Expiry Status */}
      <select
        name="expiryStatus"
        value={filters.expiryStatus}
        onChange={handleChange}
        className="filter-select"
        aria-label="Filter by expiry status"
      >
        {expiryStatuses.map((status) => (
          <option key={status} value={status}>
            {status === "All"
              ? "All Expiry Status"
              : status}
          </option>
        ))}
      </select>

      {/* Supplier */}
      <select
        name="supplier"
        value={filters.supplier}
        onChange={handleChange}
        className="filter-select"
        aria-label="Filter by supplier"
      >
        {suppliers.map((supplier) => (
          <option key={supplier} value={supplier}>
            {supplier === "All"
              ? "All Suppliers"
              : supplier}
          </option>
        ))}
      </select>

      {/* Reset */}
      <button
        type="button"
        className="reset-button"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}

export default Filters;