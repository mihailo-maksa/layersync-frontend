import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Bridge } from "./components/Bridge";
import { Spinner } from "./components/layout/Spinner";
import { ThemeProvider } from "./state/ThemeContext";

export const App = () => {
  return (
    <ThemeProvider>
      <Suspense fallback={<Spinner />}>
        <Header />
        <Routes>
          <Route path="/" element={<Bridge />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/bridge/:chain" element={<Spinner />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};
