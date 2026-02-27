import React, { RefObject } from "react";
import UploadCard from "./UploadCvCard";
import JobCard from "./JobDescriptionCard";
import { Button } from "../ui/button";

interface UploadSectionProps {
    fileInputRef: RefObject<HTMLInputElement | null>;
    selectedFile: File | null;
    handleClick: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    jobText: string;
    setJobText: React.Dispatch<React.SetStateAction<string>>;
    handleAnalyse: () => void;
    handleClear: () => void;
    isAnalyzing: boolean;
}

export default function UploadSection({
    fileInputRef,
    selectedFile,
    handleClick,
    handleFileChange,
    jobText,
    setJobText,
    handleAnalyse,
    handleClear,
    isAnalyzing,
}: UploadSectionProps) {
    return (
        <div className="flex w-full flex-col flex-2">
            <div className="mt-10 flex w-full flex-col gap-6 text-base font-medium sm:flex-row">
                <UploadCard
                    fileInputRef={fileInputRef}
                    selectedFile={selectedFile}
                    handleClick={handleClick}
                    handleFileChange={handleFileChange}
                />
                <JobCard text={jobText} setText={setJobText} />
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={handleAnalyse}
                    disabled={isAnalyzing}
                    className="mt-6 px-12 py-6 w-1/4"
                >
                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                </Button>
                <Button onClick={handleClear} className="mt-6 px-12 py-6 w-1/4">
                    Clear
                </Button>
            </div>
        </div>
    );
}
