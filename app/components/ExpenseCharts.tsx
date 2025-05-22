'use client';

import {
PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
LineChart, Line
} from 'recharts';

const COLORS = [
"#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6699",
"#FF4444", "#33CC33", "#FF9900", "#33CCCC", "#9966FF", "#FF66CC"
];

// Group for Pie Chart
function groupByCategory(expenses: any[]) {
const grouped: { [key: string]: number } = {};
expenses.forEach(exp => {grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount;
});
return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

// Group for Bar Chart
function groupByMonth(expenses: any[]) {
const grouped: { [key: string]: number } = {};
expenses.forEach(exp => {
    const month = new Date(exp.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    grouped[month] = (grouped[month] || 0) + exp.amount;
});
return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

// Group for Line Chart by category over time
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

export default function ExpenseCharts({ data }: { data: any[] }) {
const pieData = groupByCategory(data);
const barData = groupByMonth(data);
const lineData = groupByCategoryOverTime(data);
const sortedLineData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
const categories = Object.keys(lineData[0] || {}).filter(k => k !== "date");

return (
    <div className="mt-10">
    <h2 className="text-xl font-semibold mb-4">Analytics</h2>

    <div className="grid md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value, percent }) =>
                percent > 0.05 ? `${name}: ${value}` : ''
                }
                labelLine={false}
            >
                {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Monthly Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div style={{ width: '100%', minWidth: '700px', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sortedLineData}>
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
            <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
            <Legend />
            </LineChart>
        </ResponsiveContainer>
        </div>
    </div>
    </div>
);
}
