"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobCardProps {
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
}

export default function JobCard({ text, setText }: JobCardProps) {
    const handlePaste = async () => {
        const clipboardText = await navigator.clipboard.readText();
        setText(clipboardText);
    };

    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-base">Job Description</CardTitle>

                <Button size="sm" onClick={handlePaste}>
                    Paste Text
                </Button>
            </CardHeader>

            <CardContent>
                <textarea
                    className="w-full h-64 resize-none rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type the job description here..."
                />
            </CardContent>
        </Card>
    );
}
