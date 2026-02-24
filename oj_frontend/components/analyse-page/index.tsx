import React from "react";
import PageCard from "../PageCard";
import { CardContent, CardHeader, CardTitle } from "../ui/card";

interface AnalysePageProps {
    matched: string[];
    missing: string[];
}

export default function AnalysePage({ matched, missing }: AnalysePageProps) {
    return (
        <PageCard>
            <CardHeader>
                <CardTitle>Skills Analysis</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Matched */}
                <div>
                    <h3 className="text-sm font-medium mb-2">Matched Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {matched.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Missing */}
                <div>
                    <h3 className="text-sm mb-2 font-medium">
                        Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {missing.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </PageCard>
    );
}
