import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteModalProps = Readonly<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
}>;

export default function ConfirmDeleteModal({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
}: ConfirmDeleteModalProps) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleOpenChange(nextOpen: boolean) {
        if (deleting) return;
        if (!nextOpen) setError(null);
        onOpenChange(nextOpen);
    }

    async function handleConfirm() {
        setDeleting(true);
        setError(null);
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response
                    ?.data?.message ?? "Failed to delete";
            setError(message);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-white text-brand sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-brand">
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {error ? (
                    <div className="rounded-xl bg-brand px-4 py-3 text-sm text-white shadow-sm">
                        <p className="font-semibold">Could not delete</p>
                        <p className="mt-0.5 text-white/80">{error}</p>
                    </div>
                ) : null}

                <DialogFooter className="border-0 bg-transparent">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300 bg-white text-brand hover:bg-gray-100"
                        onClick={() => handleOpenChange(false)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleConfirm}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
