// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer style={{ padding: "10px", backgroundColor: "#282c34", color: "white", textAlign: "center" }}>
      <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
