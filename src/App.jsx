import React, { useEffect, useState } from "react";
import NoiseBackground from "./components/NoiseBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Movies from "./components/Movies";
import MovieDetails from "./components/MovieDetails";
import Favorites from "./components/Favorites";
import { Routes, Route } from "react-router-dom";
import "./App.css";

const STORAGE_KEY = "noise:fps";

function App() {
  const [fps, setFps] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const n = Number(raw);
      if (!Number.isNaN(n) && n > 0) return n;
    } catch (_e) {}
    return 30;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(fps));
    } catch (_e) {}
  }, [fps]);

  const [query, setQuery] = useState("");

  return (
    <div className="App">
      <Header fps={fps} setFps={setFps} query={query} setQuery={setQuery} />
      <NoiseBackground maxFPS={fps} />
      <main style={{ minHeight: "60vh", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Movies query={query} setQuery={setQuery} />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;