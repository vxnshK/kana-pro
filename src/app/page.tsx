"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import WavePattern from "../components/WavePattern";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Home() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"romaji-to-kana" | "kana-to-romaji">("romaji-to-kana");
  const [isRandomized, setIsRandomized] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['gojuon', 'dakuon', 'yuon']));

  const isRomajiToKana = selectedMode === "romaji-to-kana";

  const handleCardClick = (mode: "romaji-to-kana" | "kana-to-romaji") => {
    setSelectedMode(mode);
    setShowDialog(true);
  };

  const handleStartPractice = () => {
    const params = new URLSearchParams({
      mode: selectedMode,
      randomized: isRandomized.toString(),
      timer: showTimer.toString(),
      types: Array.from(selectedTypes).join(',')
    });
    router.push(`/practice?${params.toString()}`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] via-[#fef8f0] to-[#fff5f5] dark:from-[#1a1a1a] dark:via-[#1f1f23] dark:to-[#252528] relative">
      <WavePattern />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-shippori)] mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#1e3a5f] via-[#2a5a8f] to-[#d4508d] bg-clip-text text-transparent">
              Kana Pro
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master Japanese Hiragana with interactive practice. Choose your
            learning mode and start practicing!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div onClick={() => handleCardClick("romaji-to-kana")} className="group cursor-pointer">
            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#1e3a5f] bg-card/80 backdrop-blur">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-[#e8f0f8] dark:bg-[#1e3a5f]/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">あ</span>
                </div>
                <CardTitle className="text-2xl font-[family-name:var(--font-shippori)]">Romaji → Kana</CardTitle>
                <CardDescription className="text-base">
                  See the romaji and type the correct Hiragana character
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#e8f0f8] dark:bg-[#1e3a5f]/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Example:
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-semibold text-[#1e3a5f] dark:text-[#6a9bd8]">
                      ka
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-semibold">
                      か
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div onClick={() => handleCardClick("kana-to-romaji")} className="group cursor-pointer">
            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#d4508d] bg-card/80 backdrop-blur">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-[#ffeef5] dark:bg-[#d4508d]/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">A</span>
                </div>
                <CardTitle className="text-2xl font-[family-name:var(--font-shippori)]">Kana → Romaji</CardTitle>
                <CardDescription className="text-base">
                  See the Hiragana character and type the correct romaji
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#ffeef5] dark:bg-[#d4508d]/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Example:
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-semibold">
                      か
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-semibold text-[#d4508d] dark:text-[#e898c0]">
                      ka
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">📝</div>
                  <h4 className="font-semibold mb-2">
                    Interactive Practice
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Type answers directly and get instant feedback
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-semibold mb-2">
                    All 101 Kana
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Practice with the complete Hiragana set
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">⌨️</div>
                  <h4 className="font-semibold mb-2">
                    Keyboard Shortcuts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Navigate easily with arrow keys
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Practice Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Character Order
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={isRandomized ? "default" : "outline"}
                  onClick={() => setIsRandomized(true)}
                  className={`${
                    isRandomized && (isRomajiToKana
                      ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]"
                      : "bg-[#d4508d] hover:bg-[#e06aa5]")
                  }`}
                >
                  Random
                </Button>
                <Button
                  variant={!isRandomized ? "default" : "outline"}
                  onClick={() => setIsRandomized(false)}
                  className={`${
                    !isRandomized && "bg-[#3d3d3d] hover:bg-[#4d4d4d]"
                  }`}
                >
                  In Order
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Character Types
              </Label>
              <div className="flex flex-col gap-2">
                <div className={`flex rounded-lg border-2 ${isRomajiToKana ? "border-[#1e3a5f]/30 dark:border-[#1e3a5f]" : "border-[#d4508d]/30 dark:border-[#d4508d]"} bg-muted p-1`}>
                  <Button
                    variant={selectedTypes.has('gojuon') ? "default" : "ghost"}
                    onClick={() => {
                      const newTypes = new Set(selectedTypes);
                      if (newTypes.has('gojuon')) {
                        newTypes.delete('gojuon');
                      } else {
                        newTypes.add('gojuon');
                      }
                      if (newTypes.size === 0) newTypes.add('gojuon');
                      setSelectedTypes(newTypes);
                    }}
                    className={`flex-1 ${
                      selectedTypes.has('gojuon')
                        ? isRomajiToKana ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]" : "bg-[#d4508d] hover:bg-[#e06aa5]"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>Gojūon</span>
                      <span className="text-xs opacity-75">(46)</span>
                    </div>
                  </Button>
                  <Button
                    variant={selectedTypes.has('dakuon') ? "default" : "ghost"}
                    onClick={() => {
                      const newTypes = new Set(selectedTypes);
                      if (newTypes.has('dakuon')) {
                        newTypes.delete('dakuon');
                      } else {
                        newTypes.add('dakuon');
                      }
                      if (newTypes.size === 0) newTypes.add('dakuon');
                      setSelectedTypes(newTypes);
                    }}
                    className={`flex-1 ${
                      selectedTypes.has('dakuon')
                        ? isRomajiToKana ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]" : "bg-[#d4508d] hover:bg-[#e06aa5]"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>Dakuon</span>
                      <span className="text-xs opacity-75">(25)</span>
                    </div>
                  </Button>
                  <Button
                    variant={selectedTypes.has('yuon') ? "default" : "ghost"}
                    onClick={() => {
                      const newTypes = new Set(selectedTypes);
                      if (newTypes.has('yuon')) {
                        newTypes.delete('yuon');
                      } else {
                        newTypes.add('yuon');
                      }
                      if (newTypes.size === 0) newTypes.add('yuon');
                      setSelectedTypes(newTypes);
                    }}
                    className={`flex-1 ${
                      selectedTypes.has('yuon')
                        ? isRomajiToKana ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]" : "bg-[#d4508d] hover:bg-[#e06aa5]"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>Yōon</span>
                      <span className="text-xs opacity-75">(36)</span>
                    </div>
                  </Button>
                </div>
                <Button
                  variant={selectedTypes.size === 3 ? "default" : "outline"}
                  onClick={() => {
                    if (selectedTypes.size === 3) {
                      setSelectedTypes(new Set(['gojuon']));
                    } else {
                      setSelectedTypes(new Set(['gojuon', 'dakuon', 'yuon']));
                    }
                  }}
                  className={`w-full ${
                    selectedTypes.size === 3
                      ? isRomajiToKana ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]" : "bg-[#d4508d] hover:bg-[#e06aa5]"
                      : ""
                  }`}
                >
                  {selectedTypes.size === 3 ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Timer
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={showTimer ? "default" : "outline"}
                  onClick={() => setShowTimer(true)}
                  className={`${
                    showTimer && (isRomajiToKana
                      ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]"
                      : "bg-[#d4508d] hover:bg-[#e06aa5]")
                  }`}
                >
                  Show Timer
                </Button>
                <Button
                  variant={!showTimer ? "default" : "outline"}
                  onClick={() => setShowTimer(false)}
                  className={`${
                    !showTimer && "bg-[#3d3d3d] hover:bg-[#4d4d4d]"
                  }`}
                >
                  No Timer
                </Button>
              </div>
            </div>

            <Button
              onClick={handleStartPractice}
              className={`w-full text-lg ${
                isRomajiToKana
                  ? "bg-[#1e3a5f] hover:bg-[#2a5a8f]"
                  : "bg-[#d4508d] hover:bg-[#e06aa5]"
              }`}
              size="lg"
            >
              Start Practice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
