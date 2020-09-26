import React, { useState } from "react";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";

const childData4 = [
  {
    value: 4,
    label: "Label1",
  },

  {
    value: 8,
    label: "Label1",
  },
];
const childData3 = [
  {
    value: 4,
    label: "Label1",
  },

  {
    value: 8,
    label: "Label1",
    children: childData4,
  },
];

const childData2 = [
  {
    value: 4,
    label: "Label1",
  },

  {
    value: 4,
    label: "Label1",
    children: childData3,
  },
  {
    value: 8,
    label: "Label1",
    children: childData3,
  },
];

const data = [
  {
    value: 2,
    label: "Label1",
  },
  {
    value: 4,
    label: "Label1",
  },
  {
    value: 6,
    label: "Label1",
  },
  {
    value: 12,
    label: "Label1",
  },
  {
    value: 22,
    label: "Label1",
    children: childData2,
  },
];
const colorScheme = [
  "#4daf4a",
  "#377eb8",
  "#ff7f00",
  "#984ea3",
  "#e41a1c",
  "#ffb822",
  "#00bf8c",
  "#219ddb",
  "#ad85cc",
  "#f95275",
  "#80B647",
  "#11AEB4",
  "#6791D4",
  "#D36CA1",
  "#FC803B",
];

const getValues = (data) => {
  return data.map((dataPoint) => dataPoint.value);
};

export const DonutChart = ({
  width = 300,
  height = 400,
  innerHoleSize = 30,
}) => {
  const colors = scaleOrdinal(colorScheme);
  const [radius, setRadius] = useState(
    Math.min(width, height + innerHoleSize) / 4
  );

  const pieGenerator = pie().sort((a, b) => {
    return a - b;
  });
  const arcGenerator = arc().innerRadius(innerHoleSize).outerRadius(radius);
  const arcs = pieGenerator(getValues(data));

  const getChildArcs = (
    data,
    parentArc,
    innerRadius = radius + 2,
    outerRadius = radius + 10
  ) => {
    const { startAngle, endAngle } = parentArc;

    const childArcGenerator = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    const childPieGenerator = pie()
      .startAngle(startAngle)
      .endAngle(endAngle)
      .sort((a, b) => {
        return a - b;
      });
    const childArcs = childPieGenerator(getValues(data));

    return childArcs.map((currentChild) => {
      const fill = colors(currentChild.index);
      const pathDirection = childArcGenerator(currentChild);
      const { children: childs = [] } = data[currentChild.index];

      return (
        <>
          <g key={`${currentChild.index}`}>
            <path d={pathDirection} fill={fill}></path>
          </g>
          {childs &&
            getChildArcs(
              childs,
              currentChild,
              outerRadius + 2,
              outerRadius + 30
            )}
        </>
      );
    });
  };

  return (
    <div>
      <svg width={width} height={height}>
        <g
          className="wrapper"
          transform={`translate(${width / 2},${height / 2})`}
        >
          {arcs.map((current) => {
            const { index } = current;
            const pathDirection = arcGenerator(current);
            const fill = colors(index);

            return (
              <>
                <g key={`${current.index}`}>
                  <path d={pathDirection} fill={fill}></path>
                </g>
                {data[index].children &&
                  getChildArcs(data[index].children, current)}
              </>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
