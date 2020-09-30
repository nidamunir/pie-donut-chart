import React, { useState } from "react";
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

  const getChildArcs = (
    data,
    parentArc,
    innerRadius = radius + 2,
    outerRadius = radius + 20,
    padAngle,
    hover,
    isFirstChild
  ) => {
    const { index, startAngle, endAngle } = parentArc;
    // const innerRadiusUpdated = !isHover ? innerRadius : innerRadius;
    // const outerRadiusUpdated = !isHover ? outerRadius : outerRadius;
    const updatedStartAngle = hover ? startAngle : startAngle;
    console.log("Parent", 0);
    const updatedEndAngle = hover ? endAngle : endAngle;

    const childPieGenerator = pie()
      .startAngle(updatedStartAngle)
      .endAngle(updatedEndAngle)
      .sort((a, b) => {
        return a - b;
      });
    // .padAngle(padAngle);
    const childArcs = childPieGenerator(getValues(data));

    return childArcs.map((currentChild, index) => {
      const fill = colors(currentChild.index);
      // if first index
      if ((currentChild.index === childArcs.length - 1) & hover)
        console.log(
          colors(currentChild.index),
          currentChild.index,
          "length",
          childArcs.length - 1
        );
      const updatedStartAngle =
        index === 0 && hover && isFirstChild
          ? currentChild.startAngle + 0.175
          : currentChild.startAngle;
      const updatedEndAngle =
        currentChild.index === childArcs.length - 1 && hover
          ? currentChild.endAngle - 0.175
          : currentChild.endAngle;
      const childArcGenerator = arc()
        .innerRadius(innerRadius)
        .startAngle(updatedStartAngle)
        .endAngle(updatedEndAngle)
        .outerRadius(outerRadius)
        .padAngle(padAngle);
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
            <path d={pathDirection} fill={fill}></path>
          </g>
          {childs &&
            getChildArcs(
              childs,
              currentChild,
              hover ? outerRadius + 10 : outerRadius + 2,
              hover ? outerRadius + 30 : outerRadius + 20,
              padAngle,
              hover,
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
          {arcs.map((current) => {
            const { index } = current;
            const arcPadding = index === activeArc ? 0 : 0;
            const innerRadiusUpdated =
              index === activeArc ? innerHoleSize : innerHoleSize + 0;
            const outerRadiusUpdated = index === activeArc ? radius : radius;
            const hover = index === activeArc;
            const childInnerRadius =
              index === activeArc
                ? outerRadiusUpdated + 10
                : outerRadiusUpdated + 2;
            const childOuterRadius =
              index === activeArc
                ? outerRadiusUpdated + 30
                : outerRadiusUpdated + 20;
            const childArcPadding = index === activeArc ? 0.05 : 0;
            const updatedStartAngle = hover
              ? current.startAngle + 0.2
              : current.startAngle;
            const updatedEndAngle = hover
              ? current.endAngle - 0.2
              : current.endAngle;
            const arcGenerator = arc()
              .innerRadius(innerRadiusUpdated)
              .startAngle(updatedStartAngle)
              .endAngle(updatedEndAngle)
              .outerRadius(outerRadiusUpdated);
            // .padAngle(arcPadding);

            const pathDirection = arcGenerator(current);
            const fill = colors(index);

            return (
              <>
                <g
                  key={`${current.index}`}
                  onMouseOver={(event) => {
                    setActiveArc(index);
                  }}
                  onMouseOut={(event) => {
                    setActiveArc(null);
                  }}
                >
                  <path d={pathDirection} fill={fill}></path>
                </g>

                {data[index].children &&
                  getChildArcs(
                    data[index].children,
                    current,
                    childInnerRadius,
                    childOuterRadius,
                    childArcPadding,
                    hover,
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
