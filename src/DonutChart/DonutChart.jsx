import React, { useEffect, useState } from "react";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";

const level5Child1 = [
  {
    value: 20,
    label: "Label1",
  },
  {
    value: 20,
    label: "Label1",
  },
];

const level4Child1 = [
  {
    value: 40,
    label: "Label1",
    children: level5Child1,
  },
  {
    value: 10,
    label: "Label1",
  },
];
const level3Child1 = [
  {
    value: 4,
    label: "Level 2 child 0",
  },

  {
    value: 6,
    label: "Level 2 child 1",
    children: level4Child1,
  },
];

const level2Child1 = [
  {
    value: 5,
    label: "Level1Child0",
  },

  {
    value: 5,
    label: "Level1Child1",
  },
  {
    value: 50,
    label: "Level1Child2",
    children: level4Child1,
  },
];

const level2Child2 = [
  {
    value: 5,
    label: "Level1Child0",
  },

  {
    value: 5,
    label: "Level1Child1",
  },
  {
    value: 10,
    label: "Level1Child2",
    children: level4Child1,
  },
];
const data = [
  {
    value: 40,
    label: "Parent0",
    children: level2Child2,
  },

  {
    value: 60,
    label: "Parent2",
    children: level2Child1,
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

const transformer = (data) => {
  return data.map((dataPoint) => dataPoint.value);
};

export const DonutChart = ({
  width = 500,
  height = 500,
  innerHoleSize = 50,
  arcPaddingOnHover = 0.05,
  pieOffsetOnHover = 0.2,
  arcWidth = 20,
  levelsInnerSpaceOnHover = 10,
  levelsInnerSpace = 2,
}) => {
  // TODO: Add Labels
  // TODO: Define Labels in apis data
  // TODO: Colors scheme
  // TODO: Colors in api data
  // TODO: Improve names
  // TODO: Add Legends
  // TODO: Move data to datasets folder
  // TODO: Add utils

  const offsetAdjustment = pieOffsetOnHover - arcPaddingOnHover / 2;
  const colors = scaleOrdinal(colorScheme);
  const radius = Math.min(width, height) / 4;
  const pieGenerator = pie().sort((a, b) => {
    return a - b;
  });

  const arcs = pieGenerator(transformer(data));
  const [activeArc, setActiveArc] = useState(null);
  const [activeLabel, setActiveLabel] = useState(null);

  const getChildArcs = ({
    parentArc,
    data,
    innerRadius,
    outerRadius,
    isArcActive,
    offsetAdjustment = 0,
  }) => {
    const { startAngle, endAngle } = parentArc;
    const adjustedStart = startAngle + offsetAdjustment;
    const adjustedEnd = endAngle - offsetAdjustment;
    const childPieGenerator = pie()
      .startAngle(adjustedStart)
      .endAngle(adjustedEnd)
      .padAngle(arcPaddingOnHover)
      .sort((a, b) => {
        return a - b;
      });
    const childArcs = childPieGenerator(transformer(data));

    return childArcs.map((currentChildArc) => {
      const childArcGenerator = arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
      const arcPath = childArcGenerator(currentChildArc);

      const { index } = currentChildArc;
      const fill = colors(index);
      const { children = [], label } = data[index];

      return (
        <>
          <g
            key={`${index}${label}`}
            // onMouseEnter={() => {
            //   setActiveLabel(data[index].value);
            // }}
            // onMouseOut={() => {
            //   setActiveLabel(null);
            // }}
          >
            <path d={arcPath} fill={fill}></path>
          </g>
          {children &&
            getChildArcs({
              data: children,
              parentArc: currentChildArc,
              isArcActive,
              innerRadius: isArcActive
                ? outerRadius + levelsInnerSpaceOnHover
                : outerRadius + 2,
              outerRadius: isArcActive
                ? outerRadius + levelsInnerSpaceOnHover + arcWidth
                : outerRadius + arcWidth,
            })}
        </>
      );
    });
  };

  return (
    <div>
      {/* <h3>{activeLabel}</h3> */}
      <svg width={width} height={height}>
        <g
          className="wrapper"
          transform={`translate(${width / 2},${height / 2})`}
        >
          {arcs.map((currentArc) => {
            const { index, startAngle, endAngle } = currentArc;
            const isArcActive = index === activeArc;
            const arcStartAngle = isArcActive ? startAngle + 0.2 : startAngle;
            const arcEndAngle = isArcActive ? endAngle - 0.2 : endAngle;

            const arcGenerator = arc()
              .innerRadius(innerHoleSize)
              .outerRadius(radius)
              .startAngle(arcStartAngle)
              .endAngle(arcEndAngle);

            const pathDirection = arcGenerator(currentArc);
            const fill = colors(index);
            const innerRadius = isArcActive
              ? radius + levelsInnerSpaceOnHover
              : radius + levelsInnerSpace;
            const outerRadius = isArcActive
              ? radius + levelsInnerSpaceOnHover + arcWidth
              : radius + arcWidth;

            return (
              <>
                <g
                  key={`${currentArc.index}`}
                  onMouseEnter={() => {
                    setActiveArc(index);
                    setActiveLabel(data[index].label);
                  }}
                  onMouseOut={() => {
                    setActiveArc(null);
                    setActiveLabel(null);
                  }}
                >
                  <path d={pathDirection} fill={fill}></path>
                </g>

                {data[index].children &&
                  getChildArcs({
                    data: data[index].children,
                    parentArc: currentArc,
                    isArcActive,
                    innerRadius,
                    outerRadius,
                    offsetAdjustment,
                  })}
              </>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
