export const LEGEND_CONFIG = {
  layout: "horizontal",
  align: "center",
  verticalAlign: "bottom",
  iconType: "rect"
};

export const BAR_CHART_CONFIG = {
  layout: "horizontal",
  stacked: false,
  brush: false,
  legend: LEGEND_CONFIG
};

export const AREA_CHART_CONFIG = {
  layout: "horizontal",
  stacked: false,
  brush: false,
  legend: LEGEND_CONFIG
};

export const Line_CHART_CONFIG = {
  layout: "horizontal",
  stacked: false,
  brush: false,
  legend: LEGEND_CONFIG
};

export const PIE_CHART_CONFIG = {
  innerRadius: 0,
  legend: LEGEND_CONFIG
};

export const RADAR_CHART_CONFIG = {
  innerRadius: 0,
  legend: LEGEND_CONFIG
};

export const CHART_CONFIG = {
  Bar: BAR_CHART_CONFIG,
  Area: AREA_CHART_CONFIG,
  Line: Line_CHART_CONFIG,
  Pie: PIE_CHART_CONFIG,
  Radar: RADAR_CHART_CONFIG
};
