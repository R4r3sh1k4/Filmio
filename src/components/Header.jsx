import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteIcon from "../assets/SiteIcon.png";
import { useFavorites } from "../context/FavoritesContext";

export default function Header({ fps, setFps, query, setQuery, min = 5, max = 60 }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logoHover, setLogoHover] = useState(false);
  const wrapperRef = useRef(null);
  const { favorites } = useFavorites();

  useEffect(() => {
    function onDocClick(e) {
      // debug: log mousedown target to help diagnose settings toggle
      // eslint-disable-next-line no-console
      console.log('[Header] document mousedown target:', e.target);
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        // eslint-disable-next-line no-console
        console.log('[Header] click outside header — closing settings');
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header
      ref={wrapperRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        zIndex: 3,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        color: "white",
        boxSizing: "border-box",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => {
            if (typeof setQuery === "function") setQuery("");
            navigate('/');
          }}
          aria-label="Go to home"
          title="Go to home"
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          style={{
            background: logoHover ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.18)",
            border: logoHover ? "1px solid rgba(255,255,255,0.28)" : "1px solid rgba(255,255,255,0.18)",
            padding: 6,
            borderRadius: 8,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
            transform: logoHover ? "translateY(-1px) scale(1.02)" : "none",
            boxShadow: logoHover ? "0 6px 18px rgba(0,0,0,0.25)" : "none",
          }}
        >
          <img src={SiteIcon} alt="logo" style={{ width: 40, height: 40, display: "block" }} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 600 }}>FILMIO</div>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <input
          value={query ?? ""}
          onChange={(e) => {
            if (typeof setQuery === "function") setQuery(e.target.value);
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
          placeholder="Search movies..."
          style={{
            width: 420,
            maxWidth: "80%",
            minWidth: 200,
            padding: "0.5rem 0.75rem",
            fontSize: 14,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            color: 'inherit',
            outline: 'none'
          }}
        />
      </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        <button
          onClick={() => navigate('/favorites')}
          aria-label="Favorites"
          title="Favorites"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#c5c5c5ff',
            padding: 8,
            borderRadius: 6,
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12.001 4.529c1.867-3.51 9.43-1.872 9.43 2.353 0 4.052-3.88 7.09-9.43 11.588-5.548-4.499-9.43-7.536-9.43-11.588 0-4.225 7.564-5.864 9.43-2.353z" fill="white"/>
          </svg>
          {favorites && favorites.length > 0 && (
            <span style={{ position: 'absolute', right: 2, top: 2, background: '#ff4d6d', color: '#fff', fontSize: 11, padding: '2px 6px', borderRadius: 12 }}>
              {favorites.length}
            </span>
          )}
        </button>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('[Header] gear button clicked — toggling settings (was)', open);
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-label="Open settings"
            style={{
              background: "transparent",
              border: "none",
              color: "#c5c5c5ff",
              padding: 8,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 20a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="white" />
            </svg>
          </button>

          {open && (
            <div
              style={{
                position: "fixed",
                right: 16,
                top: "calc(64px + 8px)",
                background: "rgba(255,255,255,0.40)",
                border: "1px solid rgba(255,255,255,0.10)",
                padding: 12,
                borderRadius: 8,
                minWidth: 240,
                boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                zIndex: 9999,
              }}
            >
              <div style={{ marginBottom: 8, fontSize: 13, color: "#000000ff" }}>Rendering settings</div>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 13, minWidth: 36, color: "#000000ff" }}>FPS</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <div style={{ minWidth: 40, textAlign: "right", color: "#000000ff" }}>{fps}</div>
              </label>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
