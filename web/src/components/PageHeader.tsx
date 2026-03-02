import React, { useState, useLayoutEffect, useRef } from 'react';
import { darkModeColors } from '../theme/config';

/**
 * Classified-intel redaction effect — right-to-left sweep.
 *
 * PageHeader lives in AppLayout and is NEVER remounted on navigation.
 * When `text` changes (new route):
 *   Phase 0 (~150ms)         — old title held so the user reads it
 *   Phase 1 (14ms × maxLen)  — redaction sweeps right→left; chars become █
 *   Phase 2 (~60ms)          — fully redacted
 *   Phase 3 (16ms × maxLen)  — declassify sweeps right→left; new chars emerge
 *
 * Always renders Math.max(prevLen, newLen) positions so the width never jumps:
 * extra trailing positions just silently become spaces when the reveal sweep passes them.
 */
type Phase = 'idle' | 'show-old' | 'redacting' | 'hold' | 'revealing';

const REDACT = '█';

const TitleRedact: React.FC<{ text: string }> = ({ text }) => {
  const prevRef  = useRef(text);
  const [prevText, setPrevText] = useState(text);
  const [phase,    setPhase]    = useState<Phase>('idle');
  const [progress, setProgress] = useState(1);

  useLayoutEffect(() => {
    const prev = prevRef.current;
    if (prev === text) return;

    // Sync-set "show-old" before browser paints so old title is visible from frame 0.
    setPrevText(prev);
    prevRef.current = text;
    setPhase('show-old');
    setProgress(0);

    const maxLen   = Math.max(prev.length, text.length);
    const PAUSE    = 150;
    const REDACT_D = Math.max(maxLen * 14, 80);
    const HOLD     = 60;
    const REVEAL   = Math.max(maxLen * 16, 90);
    const TOTAL    = PAUSE + REDACT_D + HOLD + REVEAL;

    let start: number | null = null;
    let raf: number;

    const animate = (ts: number) => {
      if (start === null) start = ts;
      const t = ts - start;

      if (t < PAUSE) {
        setPhase('show-old');
        setProgress(0);
      } else if (t < PAUSE + REDACT_D) {
        setPhase('redacting');
        setProgress((t - PAUSE) / REDACT_D);
      } else if (t < PAUSE + REDACT_D + HOLD) {
        setPhase('hold');
        setProgress(1);
      } else if (t < TOTAL) {
        setPhase('revealing');
        setProgress((t - PAUSE - REDACT_D - HOLD) / REVEAL);
      } else {
        setPhase('idle');
        setProgress(1);
        return;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  const maxLen    = Math.max(prevText.length, text.length);
  const isOldPhase = phase === 'show-old' || phase === 'redacting';

  return (
    <span>
      {Array.from({ length: maxLen }, (_, i) => {
        const ch = isOldPhase ? (prevText[i] ?? '') : (text[i] ?? '');

        // Right-to-left: rightmost char has ratio 0 (swept first), leftmost has ratio 1.
        const ratio = maxLen > 1 ? (maxLen - 1 - i) / (maxLen - 1) : 0;

        let redacted = false;

        if (phase === 'redacting') {
          if (i >= prevText.length) {
            // Position has no old char — pre-block it so hold has constant width.
            redacted = true;
          } else if (ch !== ' ') {
            redacted = ratio < progress;
          }
        } else if (phase === 'hold') {
          redacted = true;
        } else if (phase === 'revealing') {
          // Empty/space positions past the new title just silently become spaces.
          redacted = ch !== ' ' && ch !== '' && ratio >= progress;
        }

        if (!redacted && (ch === '' || ch === ' ')) {
          return <span key={i}> </span>;
        }

        return (
          <span
            key={i}
            style={redacted ? {
              color: '#f99e1a',
              textShadow: '0 0 8px rgba(249,158,26,0.9), 0 0 18px rgba(249,158,26,0.45)',
            } : undefined}
          >
            {redacted ? REDACT : ch}
          </span>
        );
      })}
    </span>
  );
};

interface PageHeaderProps {
  section: string;
  title: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ section, title, action }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 28,
    paddingBottom: 18,
    position: 'relative',
  }}>
    <div>
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '3px',
        textTransform: 'uppercase' as const,
        color: '#f99e1a',
        marginBottom: 5,
      }}>
        {section}
      </div>

      <h1 style={{
        margin: 0,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: '-0.5px',
        color: darkModeColors.text,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <TitleRedact text={title} />
      </h1>
    </div>

    {action && (
      <div style={{ flexShrink: 0 }}>
        {action}
      </div>
    )}

    {/* Gradient rule */}
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: 1,
      background: `linear-gradient(90deg, ${darkModeColors.tableBorderColor} 0%, transparent 70%)`,
    }} />

    {/* Orange accent bar */}
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0,
      height: 2, width: 48,
      background: '#f99e1a',
    }} />
  </div>
);
