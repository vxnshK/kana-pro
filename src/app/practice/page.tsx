"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import kanaData from "../../../kana.json";
import Navbar from "../../components/Navbar";
import WavePattern from "../../components/WavePattern";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface Kana {
  kana: string;
  romaji: string;
  type: string;
}

export default function Practice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "romaji-to-kana";
  const isRandomized = searchParams.get("randomized") === "true";
  const showTimer = searchParams.get("timer") === "true";
  const typesParam = searchParams.get("types");
  const selectedTypes = new Set(typesParam ? typesParam.split(',') : ['gojuon', 'dakuon', 'yuon']);

  const filterKanaByTypes = (types: Set<string>) => {
    const filtered = kanaData.filter(kana => types.has(kana.type));
    return filtered.length > 0 ? filtered : kanaData;
  };

  const filteredKanaData = filterKanaByTypes(selectedTypes);

  const getInitialKana = () => {
    if (isRandomized) {
      const randomIndex = Math.floor(Math.random() * filteredKanaData.length);
      return filteredKanaData[randomIndex];
    }
    return filteredKanaData[0];
  };

  const [startTime, setStartTime] = useState<number | null>(showTimer ? Date.now() : null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentKana, setCurrentKana] = useState<Kana>(getInitialKana());
  const [practiceHistory, setPracticeHistory] = useState<Kana[]>([getInitialKana()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedKanas, setCompletedKanas] = useState<Set<string>>(new Set());
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const isRomajiToKana = mode === "romaji-to-kana";
  const question = isRomajiToKana ? currentKana.romaji : currentKana.kana;
  const correctAnswer = isRomajiToKana ? currentKana.kana : currentKana.romaji;

  useEffect(() => {
    setUserInput("");
    setIsCorrect(null);
  }, [currentKana]);

  useEffect(() => {
    if (userInput === correctAnswer) {
      setIsCorrect(true);
      // Add to completed kanas
      setCompletedKanas(prev => new Set(prev).add(`${currentKana.kana}-${currentKana.romaji}`));
    } else if (userInput.length > 0) {
      setIsCorrect(false);
    } else {
      setIsCorrect(null);
    }
  }, [userInput, correctAnswer, currentKana]);

  // Timer effect
  useEffect(() => {
    if (showTimer && startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showTimer, startTime]);

  // Check for practice completion
  useEffect(() => {
    if (completedKanas.size === filteredKanaData.length && filteredKanaData.length > 0) {
      setShowCompletionDialog(true);
    }
  }, [completedKanas.size, filteredKanaData.length]);

  const getRandomKana = () => {
    const randomIndex = Math.floor(Math.random() * filteredKanaData.length);
    return filteredKanaData[randomIndex];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    let nextKana: Kana;

    if (isRandomized) {
      // Get a completely random kana
      nextKana = getRandomKana();
    } else {
      // Get next kana in order
      const currentIndexInData = filteredKanaData.findIndex(
        k => k.kana === currentKana.kana && k.romaji === currentKana.romaji
      );
      if (currentIndexInData < filteredKanaData.length - 1) {
        nextKana = filteredKanaData[currentIndexInData + 1];
      } else {
        return; // Already at last kana
      }
    }

    // If we're at the end of history, add new kana
    if (historyIndex === practiceHistory.length - 1) {
      setPracticeHistory([...practiceHistory, nextKana]);
      setHistoryIndex(historyIndex + 1);
    } else {
      // Moving forward in history
      setHistoryIndex(historyIndex + 1);
      nextKana = practiceHistory[historyIndex + 1];
    }

    setCurrentKana(nextKana);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isCorrect === true) {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] via-[#fef8f0] to-[#fff5f5] dark:from-[#1a1a1a] dark:via-[#1f1f23] dark:to-[#252528] relative">
      <WavePattern />
      <Navbar />

      <div className="flex items-center justify-center px-4 py-8">
        <main className="w-full max-w-2xl">
          <Card className="shadow-2xl bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl text-center font-[family-name:var(--font-shippori)]">
                {isRomajiToKana ? "Romaji → Kana" : "Kana → Romaji"}
              </CardTitle>
              <CardDescription className="text-center text-base">
                {isRomajiToKana
                  ? "Type the correct Hiragana character"
                  : "Type the correct romaji"}
              </CardDescription>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    Progress
                  </span>
                  <span className={`font-semibold ${
                    isRomajiToKana
                      ? "text-[#1e3a5f] dark:text-[#6a9bd8]"
                      : "text-[#d4508d] dark:text-[#e898c0]"
                  }`}>
                    {completedKanas.size} / {filteredKanaData.length} completed
                  </span>
                </div>
                <Progress
                  value={(completedKanas.size / filteredKanaData.length) * 100}
                  className={`h-2 ${
                    isRomajiToKana
                      ? "[&>div]:bg-[#1e3a5f]"
                      : "[&>div]:bg-[#d4508d]"
                  }`}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="text-center mb-6 flex items-center justify-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {isRandomized ? `Practice ${historyIndex + 1} • Randomized` : `${historyIndex + 1} / ${filteredKanaData.length}`}
                </span>
                {showTimer && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className={`text-sm font-mono font-semibold ${
                      isRomajiToKana
                        ? "text-[#1e3a5f] dark:text-[#6a9bd8]"
                        : "text-[#d4508d] dark:text-[#e898c0]"
                    }`}>
                      {formatTime(elapsedTime)}
                    </span>
                  </>
                )}
              </div>

              <div
                className={`${
                  isRomajiToKana
                    ? "bg-[#e8f0f8] dark:bg-[#1e3a5f]/20"
                    : "bg-[#ffeef5] dark:bg-[#d4508d]/20"
                } rounded-xl p-12`}
              >
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-2">
                    {isRomajiToKana ? "Romaji" : "Hiragana"}
                  </p>
                  <p
                    className={`text-6xl md:text-8xl font-bold ${
                      isRomajiToKana
                        ? "text-[#1e3a5f] dark:text-[#6a9bd8]"
                        : "text-[#d4508d] dark:text-[#e898c0]"
                    }`}
                  >
                    {question}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your answer:</Label>
                <Input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isRomajiToKana
                      ? "Type the Hiragana character"
                      : "Type the romaji"
                  }
                  className={`w-full text-4xl md:text-6xl text-center p-6 h-auto ${
                    isCorrect === true
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400"
                      : isCorrect === false
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400"
                      : ""
                  }`}
                  autoFocus
                />
              </div>

              {isCorrect === true && (
                <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-green-700 dark:text-green-400 font-semibold text-lg">
                    ✓ Correct! Press Enter to continue
                  </p>
                </div>
              )}

              {isCorrect === false && (
                <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 font-semibold">
                    Keep trying...
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleNext}
                  disabled={isCorrect !== true || (!isRandomized && historyIndex >= kanaData.length - 1)}
                  className={`px-8 ${
                    isRomajiToKana
                      ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]"
                      : "bg-[#d4508d] hover:bg-[#e06aa5]"
                  }`}
                  size="lg"
                >
                  Next →
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Tip: Press Enter when correct to go to the next character
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Congratulations Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center font-[family-name:var(--font-shippori)] mb-4">
              おめでとうございます！
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-center">
            <div className="text-6xl">🎉</div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Congratulations!</h3>
              <p className="text-muted-foreground">
                You've completed all {filteredKanaData.length} kana characters!
              </p>
            </div>

            {showTimer && startTime && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Time</p>
                <p className={`text-3xl font-bold font-mono ${
                  isRomajiToKana
                    ? "text-[#1e3a5f] dark:text-[#6a9bd8]"
                    : "text-[#d4508d] dark:text-[#e898c0]"
                }`}>
                  {formatTime(elapsedTime)}
                </p>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push('/')}
                className={`w-full text-lg ${
                  isRomajiToKana
                    ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]"
                    : "bg-[#d4508d] hover:bg-[#e06aa5]"
                }`}
                size="lg"
              >
                Return to Home
              </Button>

              <Button
                onClick={() => {
                  setShowCompletionDialog(false);
                  setCompletedKanas(new Set());
                  setCurrentKana(getInitialKana());
                  setPracticeHistory([getInitialKana()]);
                  setHistoryIndex(0);
                  setUserInput("");
                  setIsCorrect(null);
                  if (showTimer) {
                    setStartTime(Date.now());
                    setElapsedTime(0);
                  }
                }}
                variant="outline"
                className="w-full text-lg"
                size="lg"
              >
                Practice Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
