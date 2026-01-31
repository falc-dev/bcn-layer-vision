import React from "react";
import { Link } from "react-router";

import "./main-menu.css";

export default function MainMenu() {
  return (
    <nav className="main-menu">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <Link to="/atencio-primaria">Atenció Primària</Link>
        </li>
        <li>
          <Link to="/participacio-ciutadana">Participació Ciutadana</Link>
        </li>
      </ul>
    </nav>
  );
}
