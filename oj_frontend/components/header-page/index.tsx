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
        <PageHeader>
            <PageHeaderHeading>{title}</PageHeaderHeading>
            <PageHeaderDescription>{description}</PageHeaderDescription>
        </PageHeader>
    );
}
