import type { IconProps } from "./types";

export function WifiIcon({ className }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden
        >
            <path
                d="M5.5 9.5c3.5-3.2 9.5-3.2 13 0"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <path
                d="M8 13c2.2-2 5.8-2 8 0"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <path
                d="M10.5 16.2c.9-.8 2.1-.8 3 0"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <circle cx="12" cy="19" r="1.15" fill="currentColor" />
        </svg>
    );
}
