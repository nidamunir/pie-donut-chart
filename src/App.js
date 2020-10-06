import React from "react";

import "./App.css";
import { DonutChart } from "./DonutChart/DonutChart";
import data from "./datasets/dataset1";

function App() {
  return (
    <div className="App" style={{ width: "1000px", height: "1000PX" }}>
      <DonutChart data={data} arcWidth={30} levels={4} />
    </div>
  );
}

export default App;
