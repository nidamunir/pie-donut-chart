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
  },
  {
    value: 8,
    label: "Label1",
    children: childData3,
  },
];

const data = [
  {
    value: 6,
    label: "Parent0",
  },
  {
    value: 12,
    label: "Parent1",
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
  width = 300,
  height = 400,
  innerHoleSize = 30,
}) => {
  const colors = scaleOrdinal(colorScheme);
  const radius = Math.min(width, height) / 4;
  const pieGenerator = pie().sort((a, b) => {
    return a - b;
  });

  const arcs = pieGenerator(getValues(data));
  const [activeArc, setActiveArc] = useState(null);

  const getChildArcs = (
    data,
    parentArc,
    innerRadius = radius + 2,
    outerRadius = radius + 10,
    isHover
  ) => {
    const { index, startAngle, endAngle } = parentArc;
    const innerRadiusUpdated = !isHover ? innerRadius : innerRadius;
    const outerRadiusUpdated = !isHover ? outerRadius : outerRadius;
    const padAngle = index === activeArc ? 0 : 0;

    const childArcGenerator = arc()
      .innerRadius(innerRadiusUpdated)
      .outerRadius(outerRadiusUpdated);
    const childPieGenerator = pie()
      .startAngle(startAngle)
      .endAngle(endAngle)
      .sort((a, b) => {
        return a - b;
      })
      .padAngle(padAngle);
    const childArcs = childPieGenerator(getValues(data));

    return childArcs.map((currentChild) => {
      const fill = colors(currentChild.index);

      const pathDirection = childArcGenerator(currentChild);
      const { children: childs = [] } = data[currentChild.index];

      return (
        <>
          <g
            key={`${currentChild.index}`}
            // onMouseOver={(event) => {
            //   console.log("On mouse over in child");
            //   setActiveArc(index);
            // }}
          >
            <path
              d={pathDirection}
              fill={fill}
              // onMouseOver={(event) => {
              //   console.log("On mouse over", event);
              //   setActiveArc(index);
              // }}
            ></path>
          </g>
          {childs &&
            getChildArcs(
              childs,
              currentChild,
              outerRadius + 2,
              outerRadius + 30,
              isHover
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
            const arcPadding = index === activeArc ? 0.3 : 0;
            const innerRadiusUpdated =
              index === activeArc ? innerHoleSize : innerHoleSize - 10;
            const outerRadiusUpdated =
              index === activeArc ? radius : radius - 10;
            const isHover = index === activeArc;
            const arcGenerator = arc()
              .innerRadius(innerRadiusUpdated)
              .outerRadius(outerRadiusUpdated)
              .padAngle(arcPadding);

            const pathDirection = arcGenerator(current);
            const fill = colors(index);

            return (
              <>
                <g
                  key={`${current.index}`}
                  onMouseOver={(event) => {
                    setActiveArc(index);
                    console.log(
                      "fill",
                      fill,
                      "index",
                      index,
                      data[index].label
                    );
                  }}
                  onMouseOut={(event) => {
                    setActiveArc(null);
                  }}
                >
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
