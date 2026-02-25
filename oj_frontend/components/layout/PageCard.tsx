import React from "react";
import { Card } from "../ui/card";

interface PageCardProps {
    className?: string;
    children: React.ReactNode;
}

export default function PageCard({ children, className }: PageCardProps) {
    return (
        <Card
            className={`flex flex-col w-full border-none bg-zinc-50 ${className ?? ""}`}
        >
            {children}
        </Card>
    );
}
