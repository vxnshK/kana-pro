export default function WavePattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M0,50 Q25,40 50,50 T100,50"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-[#1e3a5f]/20 dark:text-[#6a9bd8]/10"
            />
            <path
              d="M0,60 Q25,50 50,60 T100,60"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-[#d4508d]/20 dark:text-[#e898c0]/10"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wave-pattern)" />
      </svg>

      {/* Decorative wave curves */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#1e3a5f]/30 dark:text-[#6a9bd8]/20"
          d="M0,160 Q360,100 720,160 T1440,160"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#d4508d]/30 dark:text-[#e898c0]/20"
          d="M0,200 Q360,140 720,200 T1440,200"
        />
      </svg>
    </div>
  );
}
