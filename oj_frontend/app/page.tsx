"use client";
import AnalysePage from "@/components/results/SkillsAnalysisCard";
import CoverLetterCard from "@/components/results/CoverLetterCard";
import HeaderPage from "@/components/header/HeaderSection";
import ScoreCard from "@/components/results/ScoreCard";
import UploadPage from "@/components/upload/UploadSection";
import { useRef, useState } from "react";

export default function Home() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobText, setJobText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [score, setScore] = useState(null);
    const [matched, setMatched] = useState<string[]>([]);
    const [missing, setMissing] = useState<string[]>([]);
    const [letter, setLetter] = useState(null);
    const [matchText, setMatchText] = useState("None");
    const handleAnalyse = () => {
        if (!selectedFile) {
            alert("Selecteer eerst een PDF");
            return;
        }
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append("cv_file", selectedFile);
        formData.append("vacancy_text", jobText);

        fetch("http://localhost:8000/match", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Response van /match endpoint:", data);
                setScore(data.response.match_percentage);
                setMatched(data.response.matched_skills);
                setMissing(data.response.missing_skills);
                setLetter(data.response.motivation_letter);
                setMatchText(data.response.match_text);
            })
            .catch((err) => {
                console.error("Fout bij /match:", err);
            })
            .finally(() => {
                setIsAnalyzing(false);
            });
    };
    const handleClear = () => {
        setSelectedFile(null);
        setJobText("");
        setScore(null);
        setMatched([]);
        setMissing([]);
        setLetter(null);
        setMatchText("None");
    };
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
                        handleAnalyse={handleAnalyse}
                        handleClear={handleClear}
                        isAnalyzing={isAnalyzing}
                    />

                    <div className="flex w-full flex-col gap-4">
                        <div className="mt-10 flex w-full flex-col gap-6 text-base font-medium sm:flex-row">
                            <ScoreCard score={score} matchText={matchText} />
                            <AnalysePage matched={matched} missing={missing} />
                        </div>
                        <div>
                            <CoverLetterCard letter={letter} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
