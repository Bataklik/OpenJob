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
        <PageCard className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold">
                    Match Score
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-6 pb-8">
                {score !== null ? (
                    <ScoreChart score={score} />
                ) : (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                        No score available
                    </div>
                )}

                {matchText && (
                    <p className="text-center text-sm text-muted-foreground max-w-xs">
                        {matchText}
                    </p>
                )}
            </CardContent>
        </PageCard>
    );
}
