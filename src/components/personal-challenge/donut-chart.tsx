import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";

interface Props {
  completed: number;
  total: number;
}

const DonutChart: React.FC<Props> = ({ completed, total }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<"doughnut"> | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        const data = {
          labels: ["완료", "미완료"],
          datasets: [
            {
              data: [completed, total - completed],
              backgroundColor: ["#ff0000", "#ddd"],
            },
          ],
        };
        const options = {
          responsive: true,
          cutoutPercentage: 75,
          plugins: {
            legend: {
              display: false,
            },
          },
        };
        chartInstanceRef.current = new Chart(ctx, {
          type: "doughnut",
          data: data,
          options: options,
        } as ChartConfiguration<"doughnut">);
      }
    }
  }, [completed, total]);

  return (
  <canvas ref={chartRef}></canvas>
);
};

export default DonutChart;