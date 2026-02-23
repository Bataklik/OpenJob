"use client";
import JobCard from "@/components/job-card";
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header";
import UploadCard from "@/components/upload-card";
import { useRef, useState } from "react";

export default function Home() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobText, setJobText] = useState("");
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
            <main className="flex min-h-screen w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <PageHeader>
                    <PageHeaderHeading>OpenJob Dashboard</PageHeaderHeading>
                    <PageHeaderDescription>
                        Upload your resume and the target job description to
                        analyze your fit, finding missing skills and generate a
                        cover letter.
                    </PageHeaderDescription>
                </PageHeader>
                <div className="flex flex-col w-full justify-evenly mt-10 gap-4 text-base font-medium sm:flex-row">
                    <UploadCard
                        fileInputRef={fileInputRef}
                        selectedFile={selectedFile}
                        handleClick={handleClick}
                        handleFileChange={handleFileChange}
                    />
                    <JobCard text={jobText} setText={setJobText} />
                </div>
            </main>
        </div>
    );
}
