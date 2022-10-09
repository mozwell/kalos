import React from "react";
import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Detail } from "./pages/Detail";
import { Create } from "./pages/Create";
import { useDarkMode } from "./hooks";

export function App() {
  useDarkMode();
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="detail/:artworkId" element={<Detail />} />
        <Route path="create" element={<Create />} />
      </Route>
    </Routes>
  );
}
