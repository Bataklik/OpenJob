"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

interface ScoreChartProps {
    score: number;
}
function getLabel(score: number) {
    if (score >= 80) return "Excellent";
    if (score >= 65) return "Good";
    if (score >= 50) return "Average";
    return "Low";
}
export default function ScoreChart({ score }: ScoreChartProps) {
    const data = [{ name: "score", value: score }];
    const label = getLabel(score);
    return (
        <div className="flex items-center justify-center">
            <RadialBarChart
                width={200}
                height={200}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={12}
                data={data}
                startAngle={90}
                endAngle={-270}
            >
                <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                />

                <RadialBar
                    dataKey="value"
                    cornerRadius={20}
                    fill="var(--primary)"
                    background={{ fill: "var(--muted)" }}
                />

                {/* Score text in center */}
                <text
                    x="50%"
                    y="47%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--foreground)"
                    fontSize="22"
                    fontWeight="600"
                >
                    {score}%
                </text>
                {/* Label */}
                <text
                    x="50%"
                    y="60%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                >
                    {label}
                </text>
            </RadialBarChart>
        </div>
    );
}
