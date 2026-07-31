import type { Prisma } from "../../generated/prisma/client.js";
import { Shift } from "../../generated/prisma/enums.js";
import type { JwtPayload } from "../middlewares/auth.js";

const BUSINESS_TIME_ZONE = "America/Sao_Paulo";

const SHIFT_START_HOUR = {
    MORNING: 8,
    AFTERNOON: 13,
    EVENING: 18,
} as const;

const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;

function utcDateOnly(year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month - 1, day));
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
    const date = utcDateOnly(year, month, day);
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

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

/** Instant in UTC for a wall-clock date/time in the given IANA time zone. */
function zonedDateTimeToUtc(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute = 0,
    second = 0,
    timeZone = BUSINESS_TIME_ZONE,
): Date {
    const asUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);

    const offsetMs = (instant: Date) => {
        const parts = getZonedParts(instant, timeZone);
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

export const bookingUserSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    cpf: true,
} satisfies Prisma.UserSelect;

export const bookingIncludeFull = {
    user: { select: bookingUserSelect },
    room: true,
} satisfies Prisma.BookingInclude;

export const bookingIncludeWithRoom = {
    room: true,
} satisfies Prisma.BookingInclude;

export function canAccessBooking(user: JwtPayload, bookingUserId: number): boolean {
    return user.isAdmin || user.userId === bookingUserId;
}

export function isBookingInPast(day: Date, shift: Shift): boolean {
    const shiftStart = zonedDateTimeToUtc(
        day.getUTCFullYear(),
        day.getUTCMonth() + 1,
        day.getUTCDate(),
        SHIFT_START_HOUR[shift],
        0,
        0,
        BUSINESS_TIME_ZONE,
    );

    return shiftStart.getTime() < Date.now();
}

/** Normalizes a booking day to UTC midnight of that calendar date (timezone-stable). */
export function parseBookingDay(day: unknown): Date | null {
    if (typeof day === "string") {
        const match = DATE_PREFIX.exec(day.trim());
        if (match) {
            const year = Number(match[1]);
            const month = Number(match[2]);
            const dayOfMonth = Number(match[3]);

            if (!isValidCalendarDate(year, month, dayOfMonth)) {
                return null;
            }

            return utcDateOnly(year, month, dayOfMonth);
        }
    }

    const parsed = day instanceof Date ? day : new Date(day as string | number);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return utcDateOnly(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth() + 1,
        parsed.getUTCDate(),
    );
}

type BookingUpdateFields = {
    roomId?: number | undefined;
    day?: string | Date | undefined;
    shift?: Shift | undefined;
};

type ExistingBooking = {
    roomId: number;
    day: Date;
    shift: Shift;
};

export function prepareBookingUpdate(
    existing: ExistingBooking,
    fields: BookingUpdateFields,
):
    | { ok: true; data: Prisma.BookingUpdateInput; nextDay: Date; nextShift: Shift }
    | { ok: false; status: 400; error: string } {
    const data: Prisma.BookingUpdateInput = {};
    let nextDay = existing.day;
    const nextShift = fields.shift ?? existing.shift;

    if (fields.roomId !== undefined) {
        data.room = { connect: { id: fields.roomId } };
    }

    if (fields.day !== undefined) {
        const bookingDay = parseBookingDay(fields.day);
        if (!bookingDay) {
            return { ok: false, status: 400, error: "Invalid day" };
        }
        nextDay = bookingDay;
        data.day = bookingDay;
    }

    if (fields.shift !== undefined) {
        data.shift = fields.shift;
    }

    if (isBookingInPast(nextDay, nextShift)) {
        return { ok: false, status: 400, error: "Cannot book a past day or shift" };
    }

    return { ok: true, data, nextDay, nextShift };
}
