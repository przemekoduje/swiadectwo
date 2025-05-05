import React from "react";
import "./footer.scss";

export default function Footer() {
  return (
    <div className="footer">
      <div className="background-footer">
        <img src="images/design_footer.png" alt="" />
      </div>
      <div className="footer-texts lato-regular">
        <div className="footer-h3">
          <h3>swiadectwo-na-klik.online</h3>
          {/* <div className="adress">
            <span>Aplikacja firmy GREENSPAN Przemysław Rakotny</span> 
            <span>44-121 Gliwice, ul. J.Ordona 5/34</span> 
            <span>NIP 631 259 07 15</span>
          </div> */}
          <div className="audytor">
            <span>AUDYTOR</span> 
            <span>Przemysław Rakotny</span> 
            <span>Nr wpisu 38909 /Centralny Rejestr Charakterystyki Energetycznej
            Budynku/</span> 
            <span>Uprawnienia budowlane: SLK/2122/OWOK/08</span>
          </div>
          <div className="kontakt">
            <span>KONTAKT</span> 
            <span>690 029 414 | greenspan@gmail.com</span> 
          </div>
        </div>
      </div>
    </div>
  );
}
