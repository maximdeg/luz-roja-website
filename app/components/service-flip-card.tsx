"use client";

import Image from "next/image";
import { useState, type CSSProperties, type KeyboardEvent } from "react";

export interface ServiceFlipCardProps {
  variant: "light" | "dark";
  line1: string;
  line2: string;
  backLine1: string;
  backLine2?: string;
  /** Public URL (e.g. `/images/2.png`) for back face background with dark overlay */
  backImageUrl?: string;
}

function ServicesFlipIcon() {
  return (
    <Image
      src="/icons/rotate.png"
      alt=""
      width={22}
      height={22}
      className="lr-services-flip-icon-image"
    />
  );
}

interface ServiceCardLinesProps {
  line1: string;
  line2: string;
}

function ServiceCardLines(props: ServiceCardLinesProps) {
  return (
    <span className="lr-services-board-card-text">
      <span className="lr-services-board-card-line">{props.line1}</span>
      <span className="lr-services-board-card-line">{props.line2}</span>
    </span>
  );
}

interface ServiceCardBackLinesProps {
  lines: string[];
}

function splitWordsIntoLines(text: string, lineCount: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1 || lineCount <= 1) return [text.trim()].filter(Boolean);

  if (lineCount === 3 && words.length === 4) return [words[0], `${words[1]} ${words[2]}`, words[3]];

  if (lineCount === 3 && words.length === 5)
    return [`${words[0]} ${words[1]}`, `${words[2]} ${words[3]}`, words[4]];

  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  const target = Math.ceil(totalLength / lineCount);

  const lines: string[] = [];
  let current: string[] = [];
  let currentLen = 0;

  for (const word of words) {
    const nextLen = currentLen + word.length + (current.length > 0 ? 1 : 0);
    const shouldBreak =
      lines.length < lineCount - 1 && current.length > 0 && nextLen > target;

    if (shouldBreak) {
      lines.push(current.join(" "));
      current = [word];
      currentLen = word.length;
      continue;
    }

    current.push(word);
    currentLen = nextLen;
  }

  if (current.length > 0) lines.push(current.join(" "));
  return lines.filter(Boolean);
}

function getBackLines(line1: string, line2?: string) {
  const merged = [line1, line2].filter(Boolean).join(" ").trim();
  if (!merged) return [];

  const mergedWordCount = merged.split(/\s+/).filter(Boolean).length;
  const shouldUseThreeLines = merged.length >= 40 || (mergedWordCount >= 4 && merged.length >= 28);
  if (shouldUseThreeLines) return splitWordsIntoLines(merged, 3);

  return [line1, line2].filter(Boolean) as string[];
}

function ServiceCardBackLines(props: ServiceCardBackLinesProps) {
  const lines = props.lines.filter(Boolean);
  const hasSingleLine = lines.length === 1;

  return (
    <span className="lr-services-board-card-text lr-services-board-card-text--back">
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={[
            "lr-services-board-card-line",
            hasSingleLine ? "lr-services-board-card-line--back-single" : ""
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {line}
        </span>
      ))}
    </span>
  );
}

export function ServiceFlipCard({
  variant,
  line1,
  line2,
  backLine1,
  backLine2,
  backImageUrl
}: ServiceFlipCardProps) {
  // Tap/click toggle: Safari (iOS and macOS) never focuses non-input elements on
  // tap, so a CSS-only :focus-within flip is unreachable on Apple devices.
  const [flipped, setFlipped] = useState(false);
  const backVariant = variant === "light" ? "dark" : "light";
  const title = `${line1} ${line2}`.trim();
  const detail = [backLine1, backLine2].filter(Boolean).join(" ");
  const ariaLabel = `${title}. ${detail}`;
  const backLines = getBackLines(backLine1, backLine2);

  const backClassName = [
    "lr-services-board-card",
    "lr-services-board-card-face",
    "lr-services-board-card-face--back",
    `lr-services-board-card--${backVariant}`,
    backImageUrl ? "lr-services-board-card-back--photo" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const backStyle =
    backImageUrl !== undefined
      ? ({
          "--lr-card-back-image": `url("${backImageUrl}")`
        } as CSSProperties)
      : undefined;

  function toggleFlipped() {
    setFlipped((current) => !current);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleFlipped();
  }

  return (
    <div
      className="lr-services-flip"
      data-variant={variant}
      data-flipped={flipped ? "true" : undefined}
      tabIndex={0}
      role="button"
      aria-pressed={flipped}
      aria-label={ariaLabel}
      onClick={toggleFlipped}
      onKeyDown={handleKeyDown}
    >
      <span className="lr-services-flip-icon" aria-hidden>
        <ServicesFlipIcon />
      </span>
      <div className="lr-services-flip-inner">
        <div
          className={`lr-services-board-card lr-services-board-card-face lr-services-board-card-face--front lr-services-board-card--${variant}`}
        >
          <ServiceCardLines line1={line1} line2={line2} />
        </div>
        <div className={backClassName} style={backStyle} aria-hidden>
          <ServiceCardBackLines lines={backLines} />
        </div>
      </div>
    </div>
  );
}
