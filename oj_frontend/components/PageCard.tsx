import React from "react";
import { Card } from "./ui/card";

interface PageCardProps {
    children: React.ReactNode;
}

export default function PageCard({ children }: PageCardProps) {
    return (
        <Card className="w-full max-w-lg border-none bg-zinc-50">
            {children}
        </Card>
    );
}
