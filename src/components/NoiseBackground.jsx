import React, { useRef, useEffect } from "react";
import { createNoise3D } from "simplex-noise";

export default function NoiseBackground({ maxFPS = 30 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const maxFPSRef = useRef(maxFPS);

  useEffect(() => {
    maxFPSRef.current = maxFPS;
  }, [maxFPS]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 0.4;
    const noise3D = createNoise3D();
    let z = Math.random() * 1000;

    let width = 0;
    let height = 0;
    let imageData = null;
    let data = null;

    const invDiv = 1 / 250;

    function resize() {
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      const w = Math.max(1, Math.floor(window.innerWidth * scale * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * scale * dpr));

      if (w === width && h === height) return;

      width = w;
      height = h;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      imageData = ctx.createImageData(width, height);
      data = imageData.data;
    }

    resize();

    let lastTime = performance.now();
    let lastRender = lastTime;
    let running = true;
    // frameInterval will be read from `maxFPSRef.current` inside drawFrame

    function clampByte(v) {
      if (v < 0) return 0;
      if (v > 255) return 255;
      return v | 0; // ensure integer
    }

    function drawFrame(now) {
      rafRef.current = requestAnimationFrame(drawFrame);
      if (!running || !imageData) return;

      // Skip rendering if we're running faster than `maxFPSState`.
      const frameInterval = 1000 / Math.max(1, maxFPSRef.current);
      if (now - lastRender < frameInterval) return;

      const dt = (now - lastTime) / 1000;
      lastTime = now;
      lastRender = now;
      z += dt * 0.2;

      const localData = data;
      const noise = noise3D;
      const inv = invDiv;

      // Color shift using the RAF timestamp
      const t = now * 0.001;
      const rMul = 100 + 50 * Math.sin(t);
      const gMul = 80 + 60 * Math.sin(t + 2);
      const bMul = 150 + 70 * Math.sin(t + 4);
      const rOff = 50;
      const gOff = 30;
      const bOff = 50;

      let idx = 0;
      let yOff = 0;
      for (let y = 0; y < height; y++, yOff += inv) {
        let xOff = 0;
        for (let x = 0; x < width; x++, xOff += inv) {
          const v = (noise(xOff, yOff, z) + 1) * 0.5;

          const r = clampByte(v * rMul + rOff);
          const g = clampByte(v * gMul + gOff);
          const b = clampByte(v * bMul + bOff);

          localData[idx++] = r;
          localData[idx++] = g;
          localData[idx++] = b;
          localData[idx++] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    let resizeTimer = null;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    }

    function onVisibilityChange() {
      if (document.hidden) {
        running = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        running = true;
        lastTime = performance.now();
        if (!rafRef.current) rafRef.current = requestAnimationFrame(drawFrame);
      }
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange, false);
    rafRef.current = requestAnimationFrame(drawFrame);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimeout(resizeTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      running = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        backgroundColor: "black",
        filter: "blur(10px) brightness(0.9)",
      }}
    />
  );
}
