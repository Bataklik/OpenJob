import BehindTheScencesCard from "@/components/BehindTheScencesCard";
import HeaderPage from "@/components/header/HeaderSection";
import HowToUseCard from "@/components/HowToUseCard";
import {
    Brain,
    ChartLine,
    ChartNoAxesCombined,
    FileText,
    SquareChevronRight,
    Upload,
} from "lucide-react";
import React from "react";

export default function HowToUse() {
    const steps = [
        {
            step: 1,
            icon: <Upload className="h-6 w-6 text-primary" />,
            title: "Upload Resume",
            description:
                "Start by uploading your current resume in PDF. Our AI parses your work history and education.",
            content: "Drop your file here",
        },
        {
            step: 2,
            icon: <FileText className="h-6 w-6 text-primary" />,
            title: "Paste Job description",
            description:
                "Found a role you love? Simply paste the job description. We'll identify the requirements and key performance ndicators recuiters are looking for.",
            content: null,
        },
        {
            step: 3,
            icon: <ChartNoAxesCombined className="h-6 w-6 text-primary" />,
            title: "Get AI Analysis",
            description:
                "Our engine evaluates your profile against the job criteria. You'll receive a compatibility score, a list of matching skills, and a detailed gap analysis with suggestions to improve your application.",
            content: null,
        },
    ];
    const behindTheScences = [
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Natural Language Processing",
            content:
                "Our Large Language Model (LLM) understand the semantic nuance of your professional journey beyond simple keywords.",
        },
        {
            icon: <SquareChevronRight className="w-6 h-6" />,
            title: "Skill Extraction",
            content:
                "Automatically, categorize hard technical skills specialized tools and soft skills from a PDF document.",
        },
        {
            icon: <ChartLine className="w-6 h-6" />,
            title: "Gap Analysis",
            content:
                "Identify exactly what's missing in your profile and get recommendations on how to bridge the gap.",
        },
    ];
    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <main className="w-full bg-white px-4 pb-32 pt-8 dark:bg-black">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
                    <HeaderPage
                        title={"How It works"}
                        description={
                            "Find your dream job with AI-powered precision. Our advanced engine analyzes your unique profile against market requirements in seconds."
                        }
                    />
                    <div className="relative flex flex-col gap-6">
                        {steps.map((step) =>
                            step.content == null ? (
                                <HowToUseCard
                                    key={step.step}
                                    icon={step.icon}
                                    step={step.step}
                                    title={step.title}
                                    description={step.description}
                                />
                            ) : (
                                <HowToUseCard
                                    key={step.step}
                                    icon={step.icon}
                                    step={step.step}
                                    title={step.title}
                                    description={step.description}
                                >
                                    {step.content}
                                </HowToUseCard>
                            ),
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-3xl lg:leading-[1.1] mb-4">
                            Behind the Scenes
                        </h1>
                        <div className="flex gap-4">
                            {behindTheScences.map((card) => (
                                <BehindTheScencesCard
                                    key={card.title}
                                    icon={card.icon}
                                    title={card.title}
                                    content={card.content}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
