import React, { ReactNode } from "react";
import PageCard from "./layout/PageCard";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Brain } from "lucide-react";

interface BehindTheScenensCardProps {
    icon: ReactNode;
    title: string;
    content: string;
}

export default function BehindTheScencesCard({
    icon,
    title,
    content,
}: BehindTheScenensCardProps) {
    return (
        <PageCard className="flex-1">
            <CardHeader className="">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    {icon}
                </div>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-6 pb-8">
                {content}
            </CardContent>
        </PageCard>
    );
}
