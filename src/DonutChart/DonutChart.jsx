import React, { useEffect, useState } from "react";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";

const childData4 = [
  {
    value: 4,
    label: "Label1",
  },
];
const childData3 = [
  {
    value: 4,
    label: "Level 2 child 0",
  },

  {
    value: 8,
    label: "Level 2 child 1",
    children: childData4,
  },
];

const childData2 = [
  {
    value: 4,
    label: "Level1Child0",
  },

  {
    value: 4,
    label: "Level1Child1",
  },
  {
    value: 8,
    label: "Level1Child2",
    children: childData3,
  },
];

const data = [
  {
    value: 6,
    label: "Parent0",
    children: childData3,
  },
  {
    value: 12,
    label: "Parent1",
    children: childData4,
  },
  {
    value: 22,
    label: "Parent2",
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
  width = 500,
  height = 500,
  innerHoleSize = 50,
}) => {
  const colors = scaleOrdinal(colorScheme);
  const radius = Math.min(width, height) / 4;
  const pieGenerator = pie().sort((a, b) => {
    return a - b;
  });

  const arcs = pieGenerator(getValues(data));
  const [activeArc, setActiveArc] = useState(null);

  // const updatedStartAngle = isArcActive ? startAngle : startAngle;
  // const updatedEndAngle = isArcActive ? endAngle : endAngle;
  // if first index
  // if ((index === childArcs.length - 1) & isArcActive)
  //   console.log(
  //     colors(index),
  //     index,
  //     "length",
  //     childArcs.length - 1
  //   );
  const getChildArcs = (
    data,
    parentArc,
    isArcActive,
    innerRadius,
    outerRadius,
    isFirstChild
  ) => {
    const { startAngle: pieStart, endAngle: pieEnd } = parentArc;
    const childPieGenerator = pie()
      .startAngle(pieStart)
      .endAngle(pieEnd)
      .sort((a, b) => {
        return a - b;
      });
    const childArcs = childPieGenerator(getValues(data));

    return childArcs.map((currentChild, test) => {
      const { index, startAngle, endAngle } = currentChild;
      const fill = colors(test);

      const arcStartAngle =
        index === 0 && isArcActive && isFirstChild
          ? startAngle + 0.175
          : startAngle;
      const arcEndAngle =
        index === childArcs.length - 1 && isArcActive
          ? endAngle - 0.175
          : endAngle;
      const padAngle = isArcActive ? 0.05 : 0;

      const childArcGenerator = arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(arcStartAngle)
        .endAngle(arcEndAngle)
        .padAngle(padAngle);
      const pathDirection = childArcGenerator(currentChild);
      const { children: childs = [] } = data[index];

      return (
        <>
          <g key={`${index}`}>
            <path d={pathDirection} fill={fill}></path>
          </g>
          {childs &&
            getChildArcs(
              childs,
              currentChild,
              isArcActive,
              isArcActive ? outerRadius + 10 : outerRadius + 2,
              isArcActive ? outerRadius + 30 : outerRadius + 20,
              false
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
          {arcs.map((currentArc) => {
            const { index, startAngle, endAngle } = currentArc;
            const isArcActive = index === activeArc;
            const updatedStartAngle = isArcActive
              ? startAngle + 0.2
              : startAngle;
            const updatedEndAngle = isArcActive ? endAngle - 0.2 : endAngle;

            const arcGenerator = arc()
              .innerRadius(innerHoleSize)
              .outerRadius(radius)
              .startAngle(updatedStartAngle)
              .endAngle(updatedEndAngle);

            const pathDirection = arcGenerator(currentArc);
            const fill = colors(index);
            const innerRadius = isArcActive ? radius + 10 : radius + 2;
            const outerRadius = isArcActive ? radius + 30 : radius + 20;

            return (
              <>
                <g
                  key={`${currentArc.index}`}
                  onMouseEnter={() => {
                    setActiveArc(index);
                  }}
                  onMouseOut={() => {
                    setActiveArc(null);
                  }}
                >
                  <path d={pathDirection} fill={fill}></path>
                </g>

                {data[index].children &&
                  getChildArcs(
                    data[index].children,
                    currentArc,
                    isArcActive,
                    innerRadius,
                    outerRadius,
                    true
                  )}
              </>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
