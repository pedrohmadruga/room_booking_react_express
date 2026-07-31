const FALLBACK_ROOM_IMAGE = "/images/missing-image.jpg";

export function resolveRoomImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
        return FALLBACK_ROOM_IMAGE;
    }

    if (imageUrl.startsWith("http") || imageUrl.startsWith("/images/")) {
        return imageUrl;
    }

    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
    return `${apiBase}${imageUrl}`;
}

export { FALLBACK_ROOM_IMAGE };
