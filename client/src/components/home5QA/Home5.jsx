// QAList.js
import React, { useState } from "react";
import "./home5.scss";
import { faqs } from "./faqs";

const QAItem = ({ faq, index, toggleFAQ, isOpen }) => {
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => toggleFAQ(index)}>
        {faq.question}
        <span className={`faq-toggle-icon ${isOpen ? "open" : ""}`}>
          {isOpen ? "▲" : "▼"} {/* Daszek w górę, jeśli otwarte, w dół, jeśli zamknięte */}
        </span>
      </div>
      <div className={`faq-answer ${isOpen ? "open" : ""}`}>
        {faq.answer}
      </div>
    </div>
  );
};

export default function QAList() {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleFAQ = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <div className="h5-QA">
      <div className="faq-list lato-regular">
        {faqs.map((faq, index) => (
          <QAItem
            key={index}
            faq={faq}
            index={index}
            toggleFAQ={toggleFAQ}
            isOpen={openIndexes.includes(index)} // Sprawdza, czy pytanie jest otwarte
          />
        ))}
      </div>
    </div>
  );
}
