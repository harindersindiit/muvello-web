import React from "react";

const NoDataPlaceholder = ({
  message = "No data available",
  showReload = null,
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        // minHeight: "100vh",
        // width: "100%",
        padding: "2rem",
      }}
    >
      <h5 className="text-muted mb-3">{message}</h5>

      {showReload && (
        <button className="btn btn-primary" onClick={handleReload}>
          Reload Page
        </button>
      )}
    </div>
  );
};

export default NoDataPlaceholder;
