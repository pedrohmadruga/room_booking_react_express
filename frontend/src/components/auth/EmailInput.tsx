import { Field, FieldLabel } from "@/components/ui/field";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EmailInput() {
    return (
        <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"/>
                <Input required id="email" name="email" type="email" placeholder="Enter your email..." className="border-brand/25 bg-white pl-9" />
            </div>
        </Field>
    )
}