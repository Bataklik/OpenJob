"use client";
import AnalysePage from "@/components/results/SkillsAnalysisCard";
import CoverLetterCard from "@/components/results/CoverLetterCard";
import HeaderPage from "@/components/header/HeaderSection";
import PageCard from "@/components/layout/PageCard";
import ScoreCard from "@/components/results/ScoreCard";
import ScoreChart from "@/components/results/ScoreChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadPage from "@/components/upload/UploadSection";
import { useRef, useState } from "react";

export default function Home() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobText, setJobText] = useState("");
    const [score, setScore] = useState(40);
    const missing = ["Scala", "C++", "Go"];
    const matched = ["C#", "Java", ".Net", "Python"];
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed");
            return;
        }
        setSelectedFile(file);
    };
    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <main className="w-full bg-white px-4 pb-32 pt-8 dark:bg-black">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
                    <HeaderPage
                        title={"Find your perfect job match\nin seconds"}
                        description={
                            "Upload your resume and the target job description to get instant AI-powered analysis, skill gap detection and a cover letter."
                        }
                    />

                    <UploadPage
                        jobText={jobText}
                        setJobText={setJobText}
                        fileInputRef={fileInputRef}
                        selectedFile={selectedFile}
                        handleClick={handleClick}
                        handleFileChange={handleFileChange}
                    />

                    <div className="flex w-full flex-col gap-4">
                        <div className="mt-10 flex w-full flex-col gap-6 text-base font-medium sm:flex-row">
                            <ScoreCard
                                score={score}
                                matchText={
                                    "Strong match for Bobba Bobba Developer."
                                }
                            />
                            <AnalysePage matched={matched} missing={missing} />
                        </div>
                        <div className="">
                            <CoverLetterCard letter={null} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
