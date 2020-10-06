import React, { useEffect, useState } from "react";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";

const level5Child1 = [
  {
    value: 20,
    label: "Ch4 L1",
  },
  {
    value: 20,
    label: "Ch2 L2",
  },
];

const level3Child1 = [
  {
    value: 40,
    label: "Lev3 L1*",
    children: level5Child1,
  },
  {
    value: 10,
    label: "Lev3 L2*",
  },
];
const level2Child1 = [
  {
    value: 4,
    label: "Lev2Ch1",
  },

  {
    value: 6,
    label: "Lev2Ch2",
    children: level3Child1,
  },
];

const level1Ch1 = [
  {
    value: 5,
    label: "Lev1 C1",
  },

  {
    value: 5,
    label: "Lev1 C2",
  },
  {
    value: 50,
    label: "Lev1 C3",
    children: level2Child1,
  },
];

const level1Ch2 = [
  {
    value: 5,
    label: "Lev1Ch1",
  },

  {
    value: 5,
    label: "Lev1Ch2",
  },
  {
    value: 10,
    label: "Lev1Ch3",
    children: level3Child1,
  },
];
const data = [
  {
    value: 40,
    label: "Parent0",
    children: level1Ch2,
  },

  {
    value: 60,
    label: "Parent2",
    children: level1Ch1,
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
  width = 900,
  height = 690,
  innerHoleSize = 30,
  arcPaddingOnHover = 0.05,
  pieOffsetOnHover = 0.2,
  arcWidth = 40,
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

  const colors = scaleOrdinal(colorScheme);
  const radius = Math.min(width, height) / 4;
  const pieGenerator = pie().sort((a, b) => {
    return a - b;
  });

  const arcs = pieGenerator(transformer(data));
  const [activeArc, setActiveArc] = useState(null);

  const getChildArcs = ({
    parentArc,
    data,
    innerRadius,
    outerRadius,
    isArcActive,
    offsetAdjustment = 0,
    labelEnd = outerRadius + 180,
  }) => {
    const { startAngle, endAngle, padAngle } = parentArc;
    const adjustedStart = startAngle + offsetAdjustment;
    const adjustedEnd = endAngle - offsetAdjustment;
    const adjustedPadAngle = isArcActive ? arcPaddingOnHover : padAngle;

    const childPieGenerator = pie()
      .startAngle(adjustedStart)
      .endAngle(adjustedEnd)
      .padAngle(adjustedPadAngle)
      .sort((a, b) => {
        return a - b;
      });
    const childArcs = childPieGenerator(transformer(data));

    return childArcs.map((currentChildArc) => {
      const childArcGenerator = arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
      const arcPath = childArcGenerator(currentChildArc);

      const labelLineArc = arc()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius + 50);
      const labelTextArc = arc()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius + 80);
      const lineStart = childArcGenerator.centroid(currentChildArc);
      const lineEnd = labelLineArc.centroid(currentChildArc);
      const labelPosition = labelTextArc.centroid(currentChildArc);
      const linePoints = [lineStart, lineEnd];

      const { index } = currentChildArc;
      const fill = colors(index);
      const { children = [], label } = data[index];

      return (
        <>
          <g key={`${index}${label}`}>
            <path d={arcPath} fill={fill}></path>
          </g>
          {!children.length && (
            <g>
              <polyline stroke="black" points={linePoints}></polyline>
              <text
                transform={`translate(${labelPosition})`}
                textAnchor="middle"
              >
                {data[index].label}
              </text>
            </g>
          )}
          {children.length && (
            <>
              <text
                transform={`translate(${lineStart})rotate(-0)`}
                textAnchor="middle"
                fontSize={arcWidth / 4}
              >
                {data[index].label}
              </text>

              <text
                transform={`translate(${lineStart[0]},${
                  lineStart[1] + 20
                })rotate(0)`}
                fontSize={arcWidth / 3}
                textAnchor="middle"
              >
                ({data[index].value})
              </text>
            </>
          )}
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
              labelEnd: labelEnd - arcWidth,
            })}
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
            const arcStartAngle = isArcActive ? startAngle + 0.2 : startAngle;
            const arcEndAngle = isArcActive ? endAngle - 0.2 : endAngle;

            const arcGenerator = arc()
              .innerRadius(innerHoleSize)
              .outerRadius(radius)
              .startAngle(arcStartAngle)
              .endAngle(arcEndAngle);
            const parentMidAngle = startAngle + (endAngle - startAngle) / 2;
            console.log(parentMidAngle, data[index].label);
            const pathDirection = arcGenerator(currentArc);
            const fill = colors(index);
            const innerRadius = isArcActive
              ? radius + levelsInnerSpaceOnHover
              : radius + levelsInnerSpace;
            const outerRadius = isArcActive
              ? radius + levelsInnerSpaceOnHover + arcWidth
              : radius + arcWidth;
            const offsetAdjustment = isArcActive
              ? pieOffsetOnHover - arcPaddingOnHover / 2
              : 0;
            const labelPosition = arcGenerator.centroid(currentArc);
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
                  <path d={pathDirection} fill={fill}></path>{" "}
                  <text
                    transform={`translate(${labelPosition})`}
                    textAnchor="middle"
                  >
                    {`${data[index].label} (${data[index].value})`}
                  </text>
                </g>

                {data[index].children &&
                  getChildArcs({
                    data: data[index].children,
                    parentArc: currentArc,
                    isArcActive,
                    innerRadius,
                    outerRadius,
                    offsetAdjustment,
                    parentMidAngle,
                  })}
              </>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
