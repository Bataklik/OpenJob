"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

const STEPS = [
    { label: "PDF verwerken", duration: 2000 },
    { label: "Analyse uitvoeren", duration: 5000 },
    { label: "Motivatiebrief genereren", duration: Infinity },
];

export default function AnalyzingSection() {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar smoothly
        const interval = setInterval(() => {
            setProgress((prev) => {
                const target = ((currentStep + 1) / STEPS.length) * 100;
                if (prev >= target - 1) return prev;
                return prev + 0.5;
            });
        }, 30);
        return () => clearInterval(interval);
    }, [currentStep]);

    useEffect(() => {
        if (currentStep >= STEPS.length - 1) return;
        const timer = setTimeout(() => {
            setCurrentStep((s) => s + 1);
        }, STEPS[currentStep].duration);
        return () => clearTimeout(timer);
    }, [currentStep]);

    return (
        <div className="flex w-full flex-col gap-6 mt-10">
            <Progress value={progress} className="h-2" />

            <div className="flex flex-col gap-3">
                {STEPS.map((step, i) => {
                    const isDone = i < currentStep;
                    const isActive = i === currentStep;

                    return (
                        <div key={step.label} className="flex items-center gap-3">
                            {isDone ? (
                                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                            ) : isActive ? (
                                <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                            ) : (
                                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                            )}
                            <span
                                className={
                                    isDone
                                        ? "text-muted-foreground line-through text-sm"
                                        : isActive
                                        ? "text-sm font-medium"
                                        : "text-sm text-muted-foreground"
                                }
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
