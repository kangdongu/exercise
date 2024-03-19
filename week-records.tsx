import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

export default function WeekRecords(){



const data = [
    {
      "name": "Page A",
      "pv": 7,
      "amt": 2400
    },
    {
      "name": "Page B",
      "pv": 3,
      "amt": 2210
    },
    {
      "name": "Page C",
      "pv": 4,
      "amt": 2290
    },
    {
      "name": "Page D",
      "pv": 2,
      "amt": 2000
    },
    {
      "name": "Page E",
      "pv": 5,
      "amt": 2181
    },
    {
      "name": "Page F",
      "pv": 6,
      "amt": 2500
    },
    {
      "name": "Page G",
      "pv": 6,
      "amt": 2100
    }
  ]
  return (
                              
  <LineChart width={730} height={250} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
  </LineChart>
  )
  }