import React from "react";

import "./App.css";
import { DonutChart } from "./DonutChart/DonutChart";
import data from "./datasets/dataset1";

function App() {
  return (
    <div className="App">
      <DonutChart data={data} arcWidth={30} />
    </div>
  );
}

export default App;
