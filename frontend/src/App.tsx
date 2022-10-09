import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home/Home";
import { Modal } from "./components/Modal/Modal";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="modal/:artworkId" element={<Modal />} />
      </Route>
    </Routes>
  );
}
