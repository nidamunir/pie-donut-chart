import React from "react";

import "./App.css";
import { DonutChart } from "./DonutChart/DonutChart";
import dataset1 from "./datasets/dataset1";
import dataset2 from "./datasets/dataset2";

function App() {
  return (
    <div className="App" style={{ width: "1000px", height: "1000PX" }}>
      <DonutChart
        data={dataset2}
        arcWidth={35}
        labelStyle="inside"
        pieName="test"
      />
    </div>
  );
}

export default App;
