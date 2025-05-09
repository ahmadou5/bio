"use client";

import { useAppStore } from "@/store/appStore";
import { TrendingUp, Home } from "lucide-react";
import React from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

// Define types
interface ChartDataPoint {
  name: string;
  value: number;
}

const data: ChartDataPoint[] = [
  { name: "Jan", value: 195000 },
  { name: "Feb", value: 200000 },
  { name: "Mar", value: 190000 },
  { name: "Apr", value: 205000 },
  { name: "May", value: 210000 },
  { name: "Jun", value: 208000 },
  { name: "Jul", value: 991089 },
];
function Dashboard() {
  const { toggleReceiveModal, toggleSendModal } = useAppStore();
  return (
    <div>
      {" "}
      {/* Balance display */}
      <div className="mb-6">
        <h3 className="text-4xl text-black/80 font-bold mb-1">$23</h3>
        <div className="flex items-center text-green-500 text-sm">
          <TrendingUp size={16} className="mr-1" />
          <span>+1.2%</span>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => toggleSendModal()}
          className="bg-black text-white rounded-full px-5.5 py-2.5 text-sm font-medium flex items-center"
          aria-label="Deposit funds"
        >
          Send
        </button>
        <button
          onClick={() => toggleReceiveModal()}
          className="bg-gray-100 text-black rounded-full px-4 py-2 text-sm font-medium flex items-center"
          aria-label="Send funds"
        >
          Receive
        </button>
      </div>
      {/* Chart */}
      <div className="h-[200px] bg-red-400/0 mb-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <Line
              type="bump"
              dataKey="value"
              stroke="#00000f"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white flex justify-center items-center py-4 px-6 border-t border-gray-100">
        <button
          className="flex flex-col items-center text-black"
          aria-label="Home"
          aria-current="page"
        >
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
