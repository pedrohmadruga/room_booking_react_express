import { useState } from "react";
import AuthFormLayout from "./AuthFormLayout";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Home, IdCard, MapPin, Phone, User } from "lucide-react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import { Button } from "@/components/ui/button";
import { register } from "@/services/auth";

function getFormString(data: FormData, key: string): string {
    const value = data.get(key);
    return typeof value === "string" ? value.trim() : "";
}

export default function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (loading || success) return;

        const form = event.currentTarget;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        form.password.setCustomValidity("");

        if (password !== confirmPassword) {
            form.password.setCustomValidity("Passwords do not match");
            form.password.reportValidity();
            return;
        }

        const data = new FormData(form);
        const phone = getFormString(data, "phone");
        const complement = getFormString(data, "complement");

        setLoading(true);
        try {
            await register({
                name: getFormString(data, "name"),
                email: getFormString(data, "email"),
                password: getFormString(data, "password"),
                cpf: getFormString(data, "cpf"),
                phone: phone || null,
                address: {
                    street: getFormString(data, "street"),
                    number: getFormString(data, "number"),
                    complement: complement || null,
                    neighborhood: getFormString(data, "neighborhood"),
                    cep: getFormString(data, "postalCode"),
                    city: getFormString(data, "city"),
                    state: getFormString(data, "state"),
                },
            });
            setSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthFormLayout
            title="Create your account"
            description="Fill in the information below to get started"
        >
            <div className="mb-4 text-brand">
                <p className="pb-4 text-sm font-semibold">Account information</p>
                <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                    <fieldset disabled={loading || success} className="min-w-0 border-0 p-0">
                        <FieldGroup>
                            <EmailInput />

                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <div className="relative">
                                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        required
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name..."
                                        className="border-brand/25 bg-white pl-9"
                                    />
                                </div>
                            </Field>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="cpf">National ID</FieldLabel>
                                    <div className="relative">
                                        <IdCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            required
                                            id="cpf"
                                            name="cpf"
                                            type="text"
                                            placeholder="Enter your national ID..."
                                            className="border-brand/25 bg-white pl-9"
                                        />
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="Enter your phone number..."
                                            className="border-brand/25 bg-white pl-9"
                                        />
                                    </div>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <PasswordInput id="password" name="password" />
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm password"
                                    placeholder="Confirm your password..."
                                />
                            </div>

                            <hr className="my-4 h-px border-0 bg-gray-200" />
                            <p className="pb-4 text-sm font-semibold">Address</p>

                            <Field>
                                <FieldLabel htmlFor="postalCode">Postal Code (ZIP)</FieldLabel>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        required
                                        id="postalCode"
                                        name="postalCode"
                                        type="text"
                                        placeholder="Enter your postal code..."
                                        className="border-brand/25 bg-white pl-9"
                                    />
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="street">Street</FieldLabel>
                                <div className="relative">
                                    <Home className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        required
                                        id="street"
                                        name="street"
                                        type="text"
                                        placeholder="Enter your street..."
                                        className="border-brand/25 bg-white pl-9"
                                    />
                                </div>
                            </Field>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="number">Number</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            required
                                            id="number"
                                            name="number"
                                            type="text"
                                            placeholder="Enter your residence number..."
                                            className="border-brand/25 bg-white"
                                        />
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="neighborhood">Neighborhood</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            required
                                            id="neighborhood"
                                            name="neighborhood"
                                            type="text"
                                            placeholder="Enter your neighborhood name..."
                                            className="border-brand/25 bg-white"
                                        />
                                    </div>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="city">City</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            required
                                            id="city"
                                            name="city"
                                            type="text"
                                            placeholder="Enter your city..."
                                            className="border-brand/25 bg-white"
                                        />
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="state">State</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            required
                                            id="state"
                                            name="state"
                                            type="text"
                                            placeholder="Enter your state abbreviation..."
                                            className="border-brand/25 bg-white"
                                            maxLength={2}
                                        />
                                    </div>
                                </Field>
                            </div>
                        </FieldGroup>
                    </fieldset>

                    {success ? (
                        <Button
                        size="lg"
                        disabled={true}
                        className="mt-6 w-full bg-green-500 text-white hover:bg-green-600"
                    >
                        Account created successfully!
                    </Button>
                    ) : (
                        <Button
                            size="lg"
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full bg-brand text-white hover:bg-brand-hover"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    )}
                </form>
            </div>
        </AuthFormLayout>
    );
}
