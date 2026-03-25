import ScoreCard from "./ScoreCard";
import AnalysePage from "./SkillsAnalysisCard";
import CoverLetterCard from "./CoverLetterCard";
import AnalyzingSection from "./AnalyzingSection";

interface ResultsSectionProps {
    score?: number;
    matchText?: string;
    matched: string[];
    missing: string[];
    letter?: string;
    isAnalyzing: boolean;
}

export default function ResultsSection({
    score,
    matchText,
    matched,
    missing,
    letter,
    isAnalyzing,
}: ResultsSectionProps) {
    if (isAnalyzing) {
        return <AnalyzingSection />;
    }

    if (score === undefined) return null;

    return (
        <div className="flex w-full flex-col gap-4 flex-2">
            <div className="mt-10 flex w-full flex-col gap-6 text-base font-medium sm:flex-row">
                <ScoreCard score={score} matchText={matchText} />
                <AnalysePage matched={matched} missing={missing} />
            </div>
            <div>
                <CoverLetterCard letter={letter} />
            </div>
        </div>
    );
}
