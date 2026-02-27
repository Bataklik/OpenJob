import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import PageCard from "./layout/PageCard";
import { Card, CardContent } from "./ui/card";

interface HowToUseCardProps {
    icon: ReactNode;
    step: number;
    title: string;
    description: string;
    children?: ReactNode;
}

export default function HowToUseCard({
    icon,
    step,
    title,
    description,
    children,
}: HowToUseCardProps) {
    return (
        <PageCard className="flex-1 space-y-2 p-4">
            <div className="flex flex-col gap-2 justify-center">
                <div className="flex gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                        {icon}
                    </div>
                    <h3 className="text-xl font-semibold self-center">
                        {step}. {title}
                    </h3>
                </div>

                <p className="text-muted-foreground mx-14">{description}</p>
            </div>

            {children && (
                <Card className="border-dashed justify-center flex items-center mx-14">
                    <CardContent className="flex h-40 items-center justify-center">
                        {children}
                    </CardContent>
                </Card>
            )}
        </PageCard>
    );
}
