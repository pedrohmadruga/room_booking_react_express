import type { Booking } from "@/types/booking";

const BUSINESS_TIME_ZONE = "America/Sao_Paulo";

const SHIFT_START_HOUR = {
    MORNING: 8,
    AFTERNOON: 13,
    EVENING: 18,
} as const;

type Shift = Booking["shift"];

function getZonedParts(date: Date, timeZone: string) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);

    const values: Record<string, string> = {};
    for (const part of parts) {
        if (part.type !== "literal") {
            values[part.type] = part.value;
        }
    }

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        hour: Number(values.hour),
        minute: Number(values.minute),
        second: Number(values.second),
    };
}

/** Instant in UTC for a wall-clock date/time in America/Sao_Paulo. */
function zonedDateTimeToUtc(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute = 0,
    second = 0,
): Date {
    const asUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);

    const offsetMs = (instant: Date) => {
        const parts = getZonedParts(instant, BUSINESS_TIME_ZONE);
        const localAsUtc = Date.UTC(
            parts.year,
            parts.month - 1,
            parts.day,
            parts.hour,
            parts.minute,
            parts.second,
        );
        return localAsUtc - instant.getTime();
    };

    let utcMs = asUtcMs - offsetMs(new Date(asUtcMs));
    utcMs = asUtcMs - offsetMs(new Date(utcMs));
    return new Date(utcMs);
}

/** Format booking day as calendar date (UTC date-only from API). */
export function formatBookingDay(day: string): string {
    return new Date(day).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
    });
}

const SHIFT_LABELS: Record<Shift, string> = {
    MORNING: "Morning",
    AFTERNOON: "Afternoon",
    EVENING: "Evening",
};

export function formatBookingShift(shift: Shift): string {
    return SHIFT_LABELS[shift] ?? shift;
}

/** Mirrors backend `isBookingInPast` (America/Sao_Paulo + shift start hours). */
export function isBookingInPast(day: string, shift: Shift): boolean {
    const parsed = new Date(day);
    if (Number.isNaN(parsed.getTime())) {
        return true;
    }

    const shiftStart = zonedDateTimeToUtc(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth() + 1,
        parsed.getUTCDate(),
        SHIFT_START_HOUR[shift],
    );

    return shiftStart.getTime() < Date.now();
}
