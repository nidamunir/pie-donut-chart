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

const getValues = (data) => {
  return data.map((dataPoint) => dataPoint.value);
};

export const DonutChart = ({
  width = 500,
  height = 500,
  innerHoleSize = 50,
  arcPaddingOnHover = 0.05,
}) => {
  const colors = scaleOrdinal(colorScheme);
  const radius = Math.min(width, height) / 4;
  const pieGenerator = pie().sort((a, b) => {
    return a - b;
  });

  const arcs = pieGenerator(getValues(data));
  const [activeArc, setActiveArc] = useState(null);
  const [activeLabel, setActiveLabel] = useState(null);

  const getChildArcs = ({
    data,
    parentArc,
    isArcActive,
    radius,
    marginFromBasePie,
    arcPaddingOnHover,
  }) => {
    const { startAngle: pieStart, endAngle: pieEnd } = parentArc;

    const arcStartAngle = pieStart + marginFromBasePie;
    const arcEndAngle = pieEnd - marginFromBasePie;
    const childPieGenerator = pie()
      .startAngle(arcStartAngle)
      .endAngle(arcEndAngle)
      .padAngle(arcPaddingOnHover)
      .sort((a, b) => {
        return a - b;
      });
    const childArcs = childPieGenerator(getValues(data));

    return childArcs.map((currentChild, test) => {
      const { index } = currentChild;
      const fill = colors(test);

      const childArcGenerator = arc()
        .innerRadius(radius.inner)
        .outerRadius(radius.outer);

      const pathDirection = childArcGenerator(currentChild);
      const { children: childs = [] } = data[index];

      return (
        <>
          <g
            key={`${index}`}
            onMouseEnter={() => {
              setActiveLabel(data[index].value);
            }}
            onMouseOut={() => {
              setActiveLabel(null);
            }}
          >
            <path d={pathDirection} fill={fill}></path>
          </g>
          {childs &&
            getChildArcs({
              data: childs,
              parentArc: currentChild,
              isArcActive,
              radius: {
                inner: isArcActive ? radius.outer + 10 : radius.outer + 2,
                outer: isArcActive ? radius.outer + 30 : radius.outer + 20,
              },
              marginFromBasePie: 0,
              arcPaddingOnHover,
            })}
        </>
      );
    });
  };

  return (
    <div>
      <h3>{activeLabel}</h3>
      <svg width={width} height={height}>
        <g
          className="wrapper"
          transform={`translate(${width / 2},${height / 2})`}
        >
          {arcs.map((currentArc) => {
            const { index, startAngle, endAngle } = currentArc;
            const isArcActive = index === activeArc;
            const marginFromBasePie = isArcActive ? 0.175 : 0;
            const arcStartAngle = isArcActive ? startAngle + 0.2 : startAngle;
            const arcEndAngle = isArcActive ? endAngle - 0.2 : endAngle;

            const arcGenerator = arc()
              .innerRadius(innerHoleSize)
              .outerRadius(radius)
              .startAngle(arcStartAngle)
              .endAngle(arcEndAngle);

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
                    radius: {
                      inner: innerRadius,
                      outer: outerRadius,
                    },
                    marginFromBasePie,
                    arcPaddingOnHover,
                  })}
              </>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
