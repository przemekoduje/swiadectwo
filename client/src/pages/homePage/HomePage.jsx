import React from "react";
import "./homePage.scss";
import Home1 from "../../components/home1/Home1";
import Home2 from "../../components/home2/Home2";
import Home3 from "../../components/home3/Home3";
import Home4 from "../../components/home4/Home4";
import QAList from "../../components/home5QA/Home5";

export default function HomePage() {
  return (
    <div className="homepage">
      <Home1/>
      <Home2/>
      <Home3/>
      <Home4/>
      <QAList/>
    </div>
  );
}
