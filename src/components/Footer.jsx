import React from "react";
import TheMovieDB from "../assets/TheMovieDB.svg";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        padding: "12px 0",
        textAlign: "center",
        background: "rgba(0,0,0,0.25)",
        color: "#fff",
        fontSize: 14,
        position: "fixed",
        left: 0,
        bottom: 0,
        zIndex: 2,
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <div>© {new Date().getFullYear()} FILMIO. All rights reserved.</div>
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        title="The Movie Database"
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <img src={TheMovieDB} alt="TMDB" style={{ height: 18, display: "block" }} />
        <span style={{ fontSize: 13, color: "#ddd" }}>The Movie Database</span>
      </a>
    </footer>
  );
}
