"use client";

import { useEffect, useRef, useState } from "react";

export default function AvatarClient() {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(null);

  function resetTimer() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setActive(false);
    }, 60000); // 60 sec inactivity
  }

  useEffect(() => {
    if (active) resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active]);

  function startSession() {
    setActive(true);
    resetTimer();
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "black",
        color: "white",
      }}
    >
      {!active ? (
        <div
          onClick={startSession}
          style={{
            height: "100%",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <h1>Tap to Start</h1>
        </div>
      ) : (
        <div style={{ height: "100%" }}>
          <iframe
            src="https://metavian.tech/"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      )}
    </div>
  );
}
