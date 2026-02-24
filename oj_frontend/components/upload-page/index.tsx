import React, { RefObject } from "react";
import UploadCard from "./upload-card";
import JobCard from "./job-card";
import { Button } from "../ui/button";

interface UploadPageProps {
    fileInputRef: RefObject<HTMLInputElement | null>;
    selectedFile: File | null;
    handleClick: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    jobText: string;
    setJobText: React.Dispatch<React.SetStateAction<string>>;
}

export default function UploadPage({
    fileInputRef,
    selectedFile,
    handleClick,
    handleFileChange,
    jobText,
    setJobText,
}: UploadPageProps) {
    return (
        <div className="flex w-full flex-col justify-center items-center">
            <div className="flex flex-col w-full justify-evenly mt-5 gap-4 text-base font-medium sm:flex-row">
                <UploadCard
                    fileInputRef={fileInputRef}
                    selectedFile={selectedFile}
                    handleClick={handleClick}
                    handleFileChange={handleFileChange}
                />
                <JobCard text={jobText} setText={setJobText} />
            </div>
            <Button className="mt-6 px-12 py-6 w-1/4">Analyze</Button>
        </div>
    );
}
