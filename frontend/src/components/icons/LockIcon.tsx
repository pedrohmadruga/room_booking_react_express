import type { IconProps } from "./types";

export function LockIcon({ className }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden
        >
            <rect
                x="5.5"
                y="10.5"
                width="13"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.75"
            />
            <path
                d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <circle cx="12" cy="15.5" r="1.15" fill="currentColor" />
        </svg>
    );
}
