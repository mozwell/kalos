import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { Home } from "./Home";
import { BasicModal } from "./BasicModal";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="modal" element={<BasicModal />} />
      </Route>
    </Routes>
  );
}
