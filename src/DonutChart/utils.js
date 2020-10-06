export const getPercentage = (value, data) => {
  const total = data.reduce((acc, current) => acc + current.value, 0);
  return Math.round((value / total) * 100);
};

export const transformer = (data) => {
  return data.map((dataPoint) => dataPoint.value);
};

export const adjustColor = (color, amount) => {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
};

export const colorScheme = [
  "#ffb822",
  "#00bf8c",
  // "#ad85cc",
  // "#f95275",
  // "#80B647",
  // "#11AEB4",
  // "#6791D4",
  // "#D36CA1",
  "#FC803B",
];
