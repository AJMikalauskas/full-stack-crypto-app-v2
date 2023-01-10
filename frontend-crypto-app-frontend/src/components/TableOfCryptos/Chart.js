import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import axios from "../../api/axios";

const MyChart = (props) => {
  const RETRIEVE_CHART_URL = '/coins/retrieveChartInfo';
  const [dataForChart, setDataForChart] = useState([]);
  const retrieveCoinChart = async() => {
    try {
    const response = await axios.post(RETRIEVE_CHART_URL, 
      JSON.stringify({ coinName: props.coinName}),
     {
     headers: { "Content-Type": "application/json" }
     }
    );
    //console.log(response);
    setDataForChart(response.data.chartData);
    } catch(err) {
      throw new Error(err);
    }
  }
  useEffect(() => {
    retrieveCoinChart();
  }, [])


  // //! console.log(dataTest);

  const LineChartOptions = {
    //  y-axis is price of crypto/stock
    //  x-axis is time in day
    legend: "none",
    hAxis: { textPosition: 'none', format: 'M/d/yy', baselineColor: "none" },
    vAxis: { textPosition: 'none', baselineColor: "none" },
    width: `${props.width}`,
    height: `${props.height}`,
    'chartArea': {'width': '100%', 'height': '80%'},
  };
  return (
    <div className="container mt-5">
      {/* <h2>React Google Line Chart Example</h2> */}
      <Chart
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={dataForChart}
        options={LineChartOptions}
      />
    </div>
  );
};
export default MyChart;
