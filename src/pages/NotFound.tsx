import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center", color: " white" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ color: "#007bff", textDecoration: "underline" }}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
