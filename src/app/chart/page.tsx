"use client";

import { useState } from "react";
import kanaData from "../../../kana.json";
import Navbar from "../../components/Navbar";
import WavePattern from "../../components/WavePattern";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface Kana {
  kana: string;
  romaji: string;
  type: string;
}

export default function Chart() {
  const [hoveredKana, setHoveredKana] = useState<{ kana: Kana; x: number; y: number } | null>(null);
  const { speak, isSpeaking, isSupported } = useSpeechSynthesis();

  // Organize kana into a grid structure for Hiragana chart
  const createKanaGrid = () => {
    const grid: (Kana | null)[][] = [];

    // Basic vowels row
    const vowels = ['a', 'i', 'u', 'e', 'o'];

    // Consonant rows in order
    const rows = [
      ['', 'a', 'i', 'u', 'e', 'o'],  // Header row
      ['', 'あ', 'い', 'う', 'え', 'お'],
      ['k', 'か', 'き', 'く', 'け', 'こ'],
      ['s', 'さ', 'し', 'す', 'せ', 'そ'],
      ['t', 'た', 'ち', 'つ', 'て', 'と'],
      ['n', 'な', 'に', 'ぬ', 'ね', 'の'],
      ['h', 'は', 'ひ', 'ふ', 'へ', 'ほ'],
      ['m', 'ま', 'み', 'む', 'め', 'も'],
      ['y', 'や', '', 'ゆ', '', 'よ'],
      ['r', 'ら', 'り', 'る', 'れ', 'ろ'],
      ['w', 'わ', '', '', '', 'を'],
      ['n', 'ん', '', '', '', ''],
    ];

    return rows;
  };

  const createDakuonGrid = () => {
    return [
      ['', 'a', 'i', 'u', 'e', 'o'],
      ['g', 'が', 'ぎ', 'ぐ', 'げ', 'ご'],
      ['z', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
      ['d', 'だ', 'ぢ', 'づ', 'で', 'ど'],
      ['b', 'ば', 'び', 'ぶ', 'べ', 'ぼ'],
      ['p', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
    ];
  };

  const createYuonGrid = () => {
    return [
      ['', 'ya', 'yu', 'yo'],
      ['k', 'きゃ', 'きゅ', 'きょ'],
      ['s', 'しゃ', 'しゅ', 'しょ'],
      ['t', 'ちゃ', 'ちゅ', 'ちょ'],
      ['n', 'にゃ', 'にゅ', 'にょ'],
      ['h', 'ひゃ', 'ひゅ', 'ひょ'],
      ['m', 'みゃ', 'みゅ', 'みょ'],
      ['r', 'りゃ', 'りゅ', 'りょ'],
      ['g', 'ぎゃ', 'ぎゅ', 'ぎょ'],
      ['j', 'じゃ', 'じゅ', 'じょ'],
      ['b', 'びゃ', 'びゅ', 'びょ'],
      ['p', 'ぴゃ', 'ぴゅ', 'ぴょ'],
    ];
  };

  const findKanaData = (character: string): Kana | null => {
    if (!character) return null;
    return kanaData.find(k => k.kana === character) || null;
  };

  const renderGrid = (grid: string[][], title: string, colorClass: string) => {
    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-shippori)] mb-6 text-center bg-gradient-to-r from-[#1e3a5f] via-[#2a5a8f] to-[#d4508d] bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                  const isHeader = rowIndex === 0 || colIndex === 0;
                  const kanaInfo = !isHeader && cell ? findKanaData(cell) : null;

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        ${isHeader
                          ? 'bg-gradient-to-br from-[#1e3a5f]/10 to-[#2a5a8f]/10 dark:from-[#1e3a5f]/30 dark:to-[#2a5a8f]/30 font-bold text-[#1e3a5f] dark:text-[#6a9bd8]'
                          : cell
                            ? `${colorClass} cursor-pointer transform transition-all duration-200 hover:scale-110 hover:shadow-xl hover:z-10`
                            : 'bg-transparent'
                        }
                        ${cell ? 'border-2 border-gray-200 dark:border-gray-700' : ''}
                        rounded-lg p-4 flex flex-col items-center justify-center min-h-[80px] min-w-[80px] relative group
                      `}
                      onMouseEnter={(e) => {
                        if (kanaInfo) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredKana({
                            kana: kanaInfo,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10
                          });
                        }
                      }}
                      onMouseLeave={() => setHoveredKana(null)}
                      onClick={() => {
                        if (kanaInfo && isSupported) {
                          speak(kanaInfo.kana);
                        }
                      }}
                    >
                      <span className={`${isHeader ? 'text-sm' : 'text-3xl'} font-bold`}>
                        {cell}
                      </span>
                      <span className="text-sm font-bold">
                        {kanaInfo?.romaji}
                      </span>
                      {!isHeader && kanaInfo && isSupported && (
                        <Volume2
                          className="w-4 h-4 text-[#1e3a5f] dark:text-[#6a9bd8] opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] via-[#fef8f0] to-[#fff5f5] dark:from-[#1a1a1a] dark:via-[#1f1f23] dark:to-[#252528] relative">
      <WavePattern />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-shippori)] mb-4">
            <span className="bg-gradient-to-r from-[#1e3a5f] via-[#2a5a8f] to-[#d4508d] bg-clip-text text-transparent">
              Hiragana Chart
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore all Hiragana characters. Hover over any character to see its romaji pronunciation.
          </p>
        </div>

        {/* Main Charts */}
        <div className="space-y-12">
          {renderGrid(
            createKanaGrid(),
            'Gojūon (Basic Characters)',
            'bg-gradient-to-br from-[#e8f0f8] to-[#d4e8f8] dark:from-[#1e3a5f]/20 dark:to-[#2a5a8f]/20'
          )}

          {renderGrid(
            createDakuonGrid(),
            'Dakuon (Voiced Characters)',
            'bg-gradient-to-br from-[#fff0f5] to-[#ffe8f0] dark:from-[#d4508d]/20 dark:to-[#b83d75]/20'
          )}

          {renderGrid(
            createYuonGrid(),
            'Yōon (Combination Characters)',
            'bg-gradient-to-br from-[#f0e8ff] to-[#e8d8ff] dark:from-[#6a4c93]/20 dark:to-[#553c7a]/20'
          )}
        </div>

        {/* Floating Hover Card */}
        {/* {hoveredKana && (
          <div
            className="fixed pointer-events-auto z-50 transition-opacity duration-200"
            style={{
              left: `${hoveredKana.x}px`,
              top: `${hoveredKana.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
            onMouseEnter={() => {
              // Keep the hover card visible when hovering over it
            }}
            onMouseLeave={() => setHoveredKana(null)}
          >
            <div className="bg-white dark:bg-gray-800 border-2 border-[#1e3a5f] dark:border-[#6a9bd8] rounded-lg shadow-2xl p-4 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
              <div className="text-center">
                <div className="text-5xl mb-2 font-bold">{hoveredKana.kana.kana}</div>
                <div className="text-2xl font-semibold text-[#1e3a5f] dark:text-[#6a9bd8]">
                  {hoveredKana.kana.romaji}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </main>
    </div>
  );
}
