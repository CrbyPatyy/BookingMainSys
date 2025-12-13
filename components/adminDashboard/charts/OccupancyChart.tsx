'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface OccupancyChartProps {
    data: { status: string; count: number; color: string }[]
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null
}

export default function OccupancyChart({ data }: OccupancyChartProps) {
    // Calculate occupancy rate from actual data
    const totalRooms = data.reduce((sum, item) => sum + item.count, 0)
    const occupiedRooms = data.find(item => item.status === 'Occupied')?.count || 0
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    // Handle empty data state
    if (!data || data.length === 0 || totalRooms === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-300">--</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">No Data</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="count"
                        paddingAngle={5}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string) => [`${value} Rooms`, name]}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text - Dynamic Occupancy Rate */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                <p className="text-3xl font-bold text-gray-900">{occupancyRate}%</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Occupied</p>
            </div>
        </div>
    )
}
