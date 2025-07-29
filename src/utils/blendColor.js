export const blendColor = (startColor, endColor, factor) => {
  const result = startColor.map((start, index) =>
    Math.round(start + factor * (endColor[index] - start)),
  );
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
};

export const blendColorWithOpacity = (color, factor) => {
  const opacity = 0.5 + factor * 0.5;
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
};

export const blendColorWithReverseOpacity = (color, factor) => {
  const opacity = 1 - factor * 0.5;
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
};
