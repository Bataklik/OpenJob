import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import PageCard from "../layout/PageCard";

interface CoverLetterCardProps {
    letter: string | null;
}

export default function CoverLetterCard({ letter }: CoverLetterCardProps) {
    return (
        <PageCard className="">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                    Generated Cover Letter
                </CardTitle>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                        letter && navigator.clipboard.writeText(letter)
                    }
                >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                </Button>
            </CardHeader>

            <CardContent>
                {letter ? (
                    <div className="max-h-[400px] overflow-y-auto rounded-lg border bg-muted/30 p-6 text-sm leading-relaxed whitespace-pre-line">
                        {letter}
                    </div>
                ) : (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                        No cover letter generated yet.
                    </div>
                )}
            </CardContent>
        </PageCard>
    );
}
