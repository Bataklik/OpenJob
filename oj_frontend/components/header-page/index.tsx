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
        <div className="w-full py-16 rounded-2xl">
            <PageHeader className="text-center space-y-4">
                <PageHeaderHeading className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight">
                    {title}
                </PageHeaderHeading>

                <div className="mx-auto h-2 w-18 rounded-full bg-primary" />

                <PageHeaderDescription className="mx-auto max-w-2xl text-base text-muted-foreground">
                    {description}
                </PageHeaderDescription>
            </PageHeader>
        </div>
    );
}
