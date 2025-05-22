'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6699",
  "#FF4444", "#33CC33", "#FF9900", "#33CCCC", "#9966FF", "#FF66CC"
];

function groupByCategory(expenses: any[]) {
  const grouped: { [key: string]: number } = {};
  expenses.forEach(exp => {
    grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount;
  });
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

function groupByMonth(expenses: any[]) {
  const grouped: { [key: string]: number } = {};
  expenses.forEach(exp => {
    const month = new Date(exp.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    grouped[month] = (grouped[month] || 0) + exp.amount;
  });
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

function groupByCategoryOverTime(expenses: any[]) {
  const monthSet = new Set<string>();
  const categorySet = new Set<string>();
  const map: { [month: string]: { [category: string]: number } } = {};

  expenses.forEach(exp => {
    const month = new Date(exp.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthSet.add(month);
    categorySet.add(exp.category);

    if (!map[month]) map[month] = {};
    map[month][exp.category] = (map[month][exp.category] || 0) + exp.amount;
  });

  const months = Array.from(monthSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const categories = Array.from(categorySet);

  return months.map(month => {
    const entry: { [key: string]: any } = { date: month };
    categories.forEach(cat => {
      entry[cat] = map[month]?.[cat] || 0;
    });
    return entry;
  });
}

function ExpenseCharts({ data }: { data: any[] }) {
  const pieData = groupByCategory(data);
  const barData = groupByMonth(data);
  const lineData = groupByCategoryOverTime(data);
  const sortedLineData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="mt-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="font-semibold text-lg mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="font-semibold text-lg mb-4">Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Legend iconType="circle" />
              <Bar dataKey="value">
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart (spans both columns) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border md:col-span-2" style={{ height: 500 }}>
          <h3 className="font-semibold text-lg mb-4">Spending Over Time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedLineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return date.toLocaleDateString('default', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('default', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#82ca9d"
                name="Amount" 
              />

              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const categories = [
    "All",
    "Housing",
    "Transportation",
    "Food",
    "Health and Insurance",
    "Personal and Lifestyle",
    "Debt Payments",
    "Savings and Investments",
    "Education",
    "Children and Family",
    "Entertainment and Recreation",
    "Gifts and Donations",
    "Business Expenses"
  ];

  useEffect(() => {
    let url = "/api/expenses";
    const params = new URLSearchParams();

    if (selectedCategory && selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }
    if (selectedDate) {
      params.append("date", selectedDate);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, [selectedCategory, selectedDate]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Home Button */}
      <div className="mb-4">
        <Link href="/">
          <button className="btn btn-primary rounded-full">
            Home
          </button>
        </Link>
      </div>

      {/* Filters: Category + Date */}
      <div className="mb-6 flex items-center gap-6 flex-wrap">
        {/* Category Dropdown */}
        <div className="flex items-center">
          <label htmlFor="category" className="mr-2 font-medium">
            Filter by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="flex items-center">
          <label htmlFor="date" className="mr-2 font-medium">
            Filter by Date:
          </label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          {selectedDate && (
            <button
              type="button"
              className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs"
              onClick={() => setSelectedDate("")}
            >
              All
            </button>
          )}
        </div>
      </div>     
      <ExpenseCharts data={expenses} />
    </div>
  );
}
