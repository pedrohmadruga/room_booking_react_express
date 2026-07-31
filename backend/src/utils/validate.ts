import type { Response } from "express";
import { z } from "zod";

export function parseWithZod<T>(schema: z.ZodType<T>, data: unknown) {
    const result = schema.safeParse(data);

    if (!result.success) {
        return {
            ok: false as const,
            error: {
                error: "Validation failed",
                details: z.treeifyError(result.error),
            },
        };
    }

    return { ok: true as const, data: result.data };
}

export function sendValidationError(
    res: Response,
    error: { error: string; details: unknown },
) {
    return res.status(400).json(error);
}
