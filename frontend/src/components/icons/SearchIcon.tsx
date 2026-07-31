import type { IconProps } from "./types";

export function SearchIcon({ className }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden
        >
            <circle
                cx="10.5"
                cy="10.5"
                r="6.25"
                stroke="currentColor"
                strokeWidth="1.75"
            />
            <path
                d="m15.5 15.5 4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
        </svg>
    );
}
