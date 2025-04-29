import React, { useState, useRef, useEffect } from "react";
import "./customSelect.scss";

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  name,
  onFocus,
}) {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    if (option !== label) {
      setSelectedValue(option);
      onChange({ target: { name, value: option } });

      if (onFocus) {
        onFocus(name); // Wywołanie `onFocus` po wyborze wartości
      }
    }
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="custom-select-wrapper lato-light"
      ref={dropdownRef}
      tabIndex={0} // Dodajemy focus na cały wrapper
      onFocus={() => {
        if (onFocus) onFocus(name);
      }}
    >
      <label className={`lato-light ${selectedValue ? "active" : ""}`}>
        {label}
      </label>
      <div
        className={`custom-select ${isOpen ? "open" : ""}`}
        onClick={toggleDropdown}
      >
        <div className="custom-select-trigger">
          {selectedValue || label}{" "}
          {/* Wyświetl pytanie, gdy brak wybranej opcji */}
          <span className="arrow">&#9662;</span>
        </div>
        {isOpen && (
          <div className="custom-options">
            <div className="custom-option label-option" disabled>
              {label} {/* Wyświetlamy label jako nagłówek */}
            </div>
            {options.map((option, index) => (
              <div
                key={index}
                className={`custom-option ${
                  option === selectedValue ? "selected" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
