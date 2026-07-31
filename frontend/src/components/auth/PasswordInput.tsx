import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

type PasswordInputProps = Readonly<{
    id: string;
    label?: string;
    placeholder?: string;
    name?: string;
}>;

export default function PasswordInput({
    id,
    label = "Password",
    placeholder = "Enter your password...",
    name,
}: PasswordInputProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    required
                    id={id}
                    name={name ?? id}
                    type="password"
                    placeholder={placeholder}
                    className="border-brand/25 bg-white pl-9"
                />
            </div>
        </Field>
    );
}
