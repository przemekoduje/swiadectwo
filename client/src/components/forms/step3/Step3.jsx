import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./step3.scss";

export default function Step3({ nextStep, prevStep, setData, saveDraft }) {
  // Inicjalizowanie stanu z localStorage, jeśli dane istnieją
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("step3FormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          miasto: "",
          ulica: "",
        };
  });

  const [mapCenter, setMapCenter] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  // Funkcja obsługująca zmianę w inputach
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleNext = () => {
    saveDraft(3, formData);
    setData(formData); // zapisujemy miasto + ulicę
    nextStep();
  };
  // Sprawdza, czy wszystkie pola są wypełnione
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  // Funkcja do pobierania współrzędnych z Google Maps API
  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCmAwRE3ftUWNr5245Wb79HdqmNfya6QSo`
      );
      const data = await response.json();
      console.log(data); // Dodaj logowanie danych
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setMapCenter({ lat: location.lat, lng: location.lng });
        setMapVisible(true);
      } else {
        console.error("No results found");
        setMapVisible(false);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setMapVisible(false);
    }
  };

  // Wywołanie funkcji po wypełnieniu formularza
  useEffect(() => {
    if (isFormValid) {
      const fullAddress = `${formData.ulica}, ${formData.miasto}`;
      getCoordinates(fullAddress);
    }
  }, [isFormValid, formData]);

  useEffect(() => {
    console.log(mapCenter); // Sprawdź, czy wartości są poprawne
  }, [mapCenter]);

  useEffect(() => {
    // Zapisywanie stanu do localStorage po każdej zmianie
    localStorage.setItem("step3FormData", JSON.stringify(formData));
  }, [formData]);

  // Oczyszczanie danych i mapy po naciśnięciu przycisku wstecz
  const handleBack = () => {
    setFormData({ miasto: "", ulica: "" });
    setMapCenter(null);
    setMapVisible(false); // Oczyszczenie widoczności mapy
    prevStep();
  };

  return (
    <div className="step3">
      <h2 className="merriweather-light">Adres nieruchomości</h2>

      {/* Mapa Google wyświetlana po wypełnieniu formularza */}
      {mapCenter && (
        <div className={`map-container ${mapVisible ? "visible" : ""}`}>
          <LoadScript googleMapsApiKey="AIzaSyCmAwRE3ftUWNr5245Wb79HdqmNfya6QSo">
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "200px",
              }}
              center={mapCenter}
              zoom={15}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      <div className="inputs">
        <div className="input-wrapper">
          <input
            className="lato-light miasto-input"
            type="text"
            name="miasto"
            value={formData.miasto}
            onChange={handleChange}
            required
          />
          <label className={`lato-light ${formData.miasto ? "active" : ""}`}>
            Miasto
          </label>
        </div>
        <div className="input-wrapper">
          <input
            className="lato-light ulica-input"
            type="text"
            name="ulica"
            value={formData.ulica}
            onChange={handleChange}
            required
          />
          <label className={`lato-light ${formData.ulica ? "active" : ""}`}>
            Ulica
          </label>
        </div>
      </div>

      <button className="back" onClick={handleBack}>
        &#x2190;
      </button>
      <button onClick={handleNext} disabled={!isFormValid}>
        Dalej
      </button>
    </div>
  );
}
