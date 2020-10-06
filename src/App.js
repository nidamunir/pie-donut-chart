import React from "react";

import "./App.css";
import { DonutChart } from "./DonutChart/DonutChart";
import dataset1 from "./datasets/dataset1";
import dataset2 from "./datasets/dataset2";
import dataset3 from "./datasets/dataset3";

function App() {
  return (
    <div className="App">
      <DonutChart
        data={dataset3}
        arcWidth={35}
        labelStyle="inside"
        pieName="test"
        showPercentage
      />
    </div>
  );
}

export default App;
