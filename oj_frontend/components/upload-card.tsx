import React, { RefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadCardProps {
    fileInputRef: RefObject<HTMLInputElement | null>;
    selectedFile: File | null;
    handleClick: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadCard({
    fileInputRef,
    selectedFile,
    handleClick,
    handleFileChange,
}: UploadCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Upload className="w-4 h-4" />
                    Upload CV
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div
                    onClick={handleClick}
                    className={cn(
                        "flex flex-col items-center justify-center",
                        "border-2 border-dashed rounded-lg",
                        "p-10 cursor-pointer",
                        "hover:bg-muted transition",
                    )}
                >
                    <p className="text-sm text-muted-foreground">
                        Click to upload your PDF
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* show the selected file name */}
                    {selectedFile && (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileIcon className="w-4 h-4" />
                            {selectedFile.name}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
