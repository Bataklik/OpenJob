"use client";
import AnalysePage from "@/components/analyse-page";
import HeaderPage from "@/components/header-page";
import PageCard from "@/components/PageCard";
import ScorePage from "@/components/score-page";
import ScoreChart from "@/components/score-page/ScoreChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadPage from "@/components/upload-page";
import { useRef, useState } from "react";

export default function Home() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobText, setJobText] = useState("");
    const [score, setScore] = useState(null);
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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full flex-col items-center justify-between pb-32 px-16 bg-white dark:bg-black sm:items-start">
                <HeaderPage
                    title={"Find your perfect job match in seconds"}
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

                <div className="flex w-full flex-col justify-center items-center">
                    <div className="flex flex-col w-full justify-evenly mt-10 gap-4 text-base font-medium sm:flex-row">
                        <ScorePage
                            score={score}
                            matchText={
                                "Strong match for Bobba Bobba Developer."
                            }
                        />
                        <AnalysePage matched={matched} missing={missing} />
                    </div>
                </div>
            </main>
        </div>
    );
}
