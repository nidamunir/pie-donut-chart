import React, { useState } from "react";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { adjustColor, getPercentage, transformer, colorScheme } from "./utils";

export const DonutChart = ({
  width = 600,
  height = 600,
  data = [],
  labelStyle = "inside",
  explodePie = true,
  explodeDonut = true,
  pieName = "",
  holeSize = 30,
  arcInnerGap = 0.025,
  pieExplodeAngle = 0.2,
  arcWidth = 40,
  donutInnerGap = 2,
  showPercentage = true,
}) => {
  const donutInnerGapOnHover = explodeDonut ? 8 : 2;
  const innerHoleSize = pieName ? holeSize : 0;
  // TODO: Add Labels
  // TODO: Colors scheme
  // TODO: Improve names
  // TODO: Add Legends
  // TODO: Move data to datasets folder
  // TODO: Add utils
  // TODO: fix percenta sign
  // TODO: remove opacity
  // TODO: fix radius calculation
  //

  const colors = scaleOrdinal(colorScheme);
  const radius = Math.min(height, width) / 4;
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
    anglesAdjustment = 0,
    color = "#000",
  }) => {
    const { startAngle, endAngle, padAngle } = parentArc;
    const adjustedStart = startAngle + anglesAdjustment;
    const adjustedEnd = endAngle - anglesAdjustment;
    const adjustedPadAngle = isArcActive ? arcInnerGap : padAngle;
    let colorAmount = 0;
    const childPieGenerator = pie()
      .startAngle(adjustedStart)
      .endAngle(adjustedEnd)
      .padAngle(adjustedPadAngle)
      .sort((a, b) => {
        return a - b;
      });
    const childArcs = childPieGenerator(transformer(data));

    return childArcs.map((currentChildArc) => {
      const { index } = currentChildArc;
      const fill = adjustColor(color, colorAmount);
      colorAmount += 30;
      const { children = [], label, value } = data[index];
      const percentage = getPercentage(value, data);

      const childArcGenerator = arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
      const arcPath = childArcGenerator(currentChildArc);

      const labelLineArc = arc()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius + 50);
      const labelTextArc = arc()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius + 100);
      const lineStart = childArcGenerator.centroid(currentChildArc);
      const lineEnd = labelLineArc.centroid(currentChildArc);
      const labelPosition = labelTextArc.centroid(currentChildArc);
      const linePoints = [lineStart, lineEnd];

      return (
        <>
          <g key={`${index}${label}`}>
            <path d={arcPath} fill={fill}></path>
          </g>
          {labelStyle === "outside" && !children.length && (
            <g>
              <polyline stroke="black" points={linePoints}></polyline>
              <text
                transform={`translate(${labelPosition})`}
                textAnchor="middle"
              >
                {label}
              </text>
              <text
                transform={`translate(${labelPosition[0]},${
                  labelPosition[1] + 15
                })rotate(0)`}
                textAnchor="middle"
              >
                ({showPercentage ? percentage : value}%)
              </text>
            </g>
          )}
          {labelStyle === "inside" && (
            <>
              <text
                transform={`translate(${lineStart})rotate(-0)`}
                textAnchor="middle"
                fontSize={arcWidth / 4}
              >
                {label}
              </text>

              <text
                transform={`translate(${lineStart[0]},${
                  lineStart[1] + 15
                })rotate(0)`}
                fontSize={arcWidth / 3}
                textAnchor="middle"
              >
                ({showPercentage ? percentage : value}%)
              </text>
            </>
          )}
          {children &&
            getChildArcs({
              data: children,
              parentArc: currentChildArc,
              isArcActive,
              innerRadius: isArcActive
                ? outerRadius + donutInnerGapOnHover
                : outerRadius + 2,
              outerRadius: isArcActive
                ? outerRadius + donutInnerGapOnHover + arcWidth
                : outerRadius + arcWidth,
              color: fill,
            })}
        </>
      );
    });
  };

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {pieName && (
            <text textAnchor="middle" fontSize={14}>
              {pieName}
            </text>
          )}
          {arcs.map((currentArc) => {
            const { index, startAngle, endAngle } = currentArc;
            const isArcActive = index === activeArc;
            const arcStartAngle = isArcActive
              ? startAngle + pieExplodeAngle
              : startAngle;
            const arcEndAngle = isArcActive
              ? endAngle - pieExplodeAngle
              : endAngle;
            const pieOuterRadius =
              explodePie && isArcActive
                ? radius + donutInnerGapOnHover + arcWidth
                : radius;
            // we don't need to add arcWidth, I guess. It is only needed in child arcs
            const arcGenerator = arc()
              .innerRadius(innerHoleSize)
              .outerRadius(pieOuterRadius)
              .startAngle(arcStartAngle)
              .endAngle(arcEndAngle);

            const pathDirection = arcGenerator(currentArc);
            const fill = adjustColor(colors(index), -80);
            const pieLabelCoordinates = arcGenerator.centroid(currentArc);

            // child Arc calculation
            const innerRadius = isArcActive
              ? pieOuterRadius + donutInnerGapOnHover
              : pieOuterRadius + donutInnerGap;
            const outerRadius = isArcActive
              ? pieOuterRadius + donutInnerGapOnHover + arcWidth
              : pieOuterRadius + arcWidth;
            const anglesAdjustment = isArcActive
              ? pieExplodeAngle - arcInnerGap / 2
              : 0;
            const { children = [], label, value } = data[index];
            const percentage = getPercentage(value, data);

            return (
              <>
                <g
                  key={`${currentArc.index}`}
                  onMouseEnter={() => {
                    setActiveArc(index);
                  }}
                  onMouseOver={() => {
                    setActiveArc(index);
                  }}
                  onMouseOut={() => {
                    setActiveArc(null);
                  }}
                >
                  <path d={pathDirection} fill={fill}></path>
                  <text
                    transform={`translate(${pieLabelCoordinates})`}
                    textAnchor="middle"
                    fontSize={14}
                    fill="#fff"
                  >
                    {`${label} `}
                  </text>
                  <text
                    transform={`translate(${pieLabelCoordinates[0]},${
                      pieLabelCoordinates[1] + 15
                    })`}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                  >
                    ({showPercentage ? percentage : value}%)
                  </text>
                </g>

                {children &&
                  getChildArcs({
                    data: children,
                    parentArc: currentArc,
                    isArcActive,
                    innerRadius,
                    outerRadius,
                    anglesAdjustment,
                    color: fill,
                  })}
              </>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
