import React from "react";
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "./page-header";

interface HeaderPageProps {
    title: string;
    description: string;
}

export default function HeaderPage({ title, description }: HeaderPageProps) {
    return (
        <div className="w-full py-10">
            <PageHeader className="space-y-4">
                <PageHeaderHeading className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight whitespace-pre-line">
                    {title}
                </PageHeaderHeading>

                <div className="mt-3 h-1 w-16 rounded-full bg-primary" />

                <PageHeaderDescription className="max-w-2xl text-base text-muted-foreground">
                    {description}
                </PageHeaderDescription>
            </PageHeader>
        </div>
    );
}
