import { useState } from 'react';
import html2canvas from 'html2canvas';

export function CopyToClipboard() {
  const [showCopyMsg, setShowCopyMsg] = useState(false);

  const handleCopyClick = async () => {
    const chart = document.getElementById('home-tvl');
    if (!chart) return;

    const elementsToExclude = [
      document.getElementById('last-updated'),
      document.getElementById('copy-to-clipboard')
    ];

    elementsToExclude.forEach((element) => {
      if (element) {
        element.classList.add('exclude-from-screenshot');
      }
    });

    try {
      const canvas = await html2canvas(chart, {
        ignoreElements: (element) => {
          return element.classList.contains('exclude-from-screenshot');
        }
      });

      canvas.toBlob(function (blob) {
        if (!blob) return;

        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);

        setTimeout(() => {
          setShowCopyMsg(true);
          setTimeout(() => setShowCopyMsg(false), 1000);
        }, 10);
      });
    } finally {
      elementsToExclude.forEach((element) => {
        if (element) {
          element.classList.remove('exclude-from-screenshot');
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <div
        id="copy-to-clipboard"
        className="border border-white border-opacity-10 rounded p-2 bg-[#242424] hover:bg-[#222] duration-200 cursor-pointer flex items-center justify-center gap-2 relative"
        onClick={handleCopyClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
        <div
          className="absolute border border-white border-opacity-10 p-4 rounded-lg bg-[#111] w-[230px] text-center z-[100] shadow-xl text-sm select-none"
          style={{
            right: '0px',
            opacity: showCopyMsg ? '100%' : '0%',
            top: showCopyMsg ? '-65px' : '0px',
            transition: 'opacity 0.2s, top 0.3s',
            pointerEvents: 'none'
          }}
        >
          Image copied to clipboard! 🎉
        </div>
      </div>
    </div>
  );
}
