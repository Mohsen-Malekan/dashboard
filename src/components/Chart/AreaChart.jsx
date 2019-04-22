import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  Brush,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import purple from "@material-ui/core/colors/purple";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import yellow from "@material-ui/core/colors/yellow";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import pink from "@material-ui/core/colors/pink";
import grey from "@material-ui/core/colors/grey";
import brown from "@material-ui/core/colors/brown";

import { AREA_CHART_CONFIG as CONFIG } from "../../constants";

const colors = [purple, orange, red, yellow, blue, green, pink, grey, brown];

const getDataKeys = data => Object.keys(data).filter(key => key !== "name");

const Chart = props => {
  const [opacity, setOpacity] = useState({});
  const { data, width, height } = props;
  let { config = CONFIG } = props;
  const keys = getDataKeys(data[0] || {});

  useEffect(() => {
    config = { ...CONFIG, ...config };
  }, [props.config]);

  const handleMouseEnter = o => {
    const { dataKey } = o;
    setOpacity({
      ...opacity,
      [dataKey]: 0.5
    });
  };

  const handleMouseLeave = o => {
    const { dataKey } = o;
    setOpacity({
      ...opacity,
      [dataKey]: 1
    });
  };

  return (
    <AreaChart
      data={data}
      width={width}
      height={height}
      margin={{ top: 5, right: 10 }}
      layout={config.layout}
    >
      {keys.map((key, i) => (
        <Area
          type="monotone"
          dataKey={key}
          key={key}
          stroke={colors[i % 9]["500"]}
          fill={colors[i % 9]["500"]}
          opacity={opacity[key]}
          stackId={config.stacked ? "" : i}
        />
      ))}
      {config.brush && <Brush dataKey="name" height={20} />}
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      {config.layout === "vertical" ? (
        <XAxis type="number" />
      ) : (
        <XAxis dataKey="name" />
      )}
      {config.layout === "vertical" ? (
        <YAxis dataKey="name" type="category" />
      ) : (
        <YAxis />
      )}
      <Tooltip wrapperStyle={{ left: "0" }} />
      <Legend
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...config.legend}
      />
    </AreaChart>
  );
};

export default Chart;
