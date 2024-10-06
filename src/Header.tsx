// Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header style={{ padding: "10px", backgroundColor: "#282c34", color: "white" }}>
      <h1>My Website</h1>
      <nav>
        <ul style={{ listStyleType: "none", padding: 0, display: "flex", gap: "10px" }}>
          <li><a href="/" style={{ color: "white", textDecoration: "none" }}>Home</a></li>
          <li><a href="/uploader" style={{ color: "white", textDecoration: "none" }}>Uploader</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
