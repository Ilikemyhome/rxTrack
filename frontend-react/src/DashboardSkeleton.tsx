import React from "react";
import "../src/styles/DashboardSkeleton.css";

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton-header"></div>

      <div className="skeleton-section">
        <div className="skeleton-title"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-title"></div>
        <div className="skeleton-alert"></div>
        <div className="skeleton-alert"></div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
