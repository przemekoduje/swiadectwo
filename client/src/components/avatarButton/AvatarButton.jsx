import React, { useState, useEffect } from "react";
import "./avatarButton.scss"; // Zakładając, że kod CSS jest w osobnym pliku

const AvatarButton = ({ onAutoResponse }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Uruchamianie animacji pulsacji po krótkim czasie, aby wskazać użytkownikowi akcję
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(true); // Aktywacja pulsacji
      setShowTooltip(true); // Pokaż dymek z informacją
    }, 3000); // Dymek i animacja po 3 sekundach

    // Ukrycie tooltipu po np. 6 sekundach
    const tooltipTimer = setTimeout(() => {
        setIsPulsing(false);
        setShowTooltip(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  return (
    <button
      className={`avatar-button ${isPulsing ? "pulsing" : ""}`}
      onClick={onAutoResponse}
    >
      <img src="/images/account.png" alt="User Avatar" />
      {showTooltip && <div className="tooltip">Naciśnij, jeśli nie znasz odpowiedzi</div>}
    </button>
  );
};

export default AvatarButton;
