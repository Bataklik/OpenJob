import React from "react";
import PageCard from "../PageCard";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import ScoreChart from "./ScoreChart";

interface ScorePageProps {
    score: number | null;
    matchText: string | null;
}

export default function ScorePage({ score, matchText }: ScorePageProps) {
    return (
        <PageCard>
            <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-xl">Match score</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col justify-center items-center">
                {score !== null ? (
                    <ScoreChart score={score} />
                ) : (
                    <div className="flex items-center justify-center h-40 text-gray-400 text-lg">
                        No score available.
                    </div>
                )}
                <p className="text-gray-500">{matchText}</p>
            </CardContent>
        </PageCard>
    );
}
