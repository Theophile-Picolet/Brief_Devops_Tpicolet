"use client";

import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  href = "/articles",
  label = "Retour aux articles",
  className = "",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-[#5C6C73] text-white border border-[#C2E0E3] hover:bg-[#253337] transition-colors font-puritan ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4 sm:w-5 sm:h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
