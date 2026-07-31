import { FieldGroup } from "../ui/field";
import AuthFormLayout from "./AuthFormLayout";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import { Button } from "../ui/button";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function getFormString(data: FormData, key: string): string {
    const value = data.get(key);
    return typeof value === "string" ? value.trim() : "";
}

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        try {
            await login({
                email: getFormString(data, "email"),
                password: getFormString(data, "password"),
            });
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <AuthFormLayout
            title="Login to your account"
            description="Enter your email and password to login"
        >
            <div className="mb-4 text-brand">
                <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                    <FieldGroup>
                        <EmailInput />
                        <PasswordInput id="password" name="password" />
                    </FieldGroup>
                    <Button size="lg" type="submit" className="mt-6 w-full bg-brand text-white hover:bg-brand-hover">Login</Button>
                </form>
            </div>
        </AuthFormLayout>
    );
}