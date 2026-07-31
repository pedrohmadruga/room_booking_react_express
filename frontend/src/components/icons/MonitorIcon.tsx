import type { IconProps } from "./types";

export function MonitorIcon({ className }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden
        >
            <rect
                x="3.5"
                y="4"
                width="17"
                height="12"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.75"
            />
            <path
                d="M9 20h6M12 16v4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
