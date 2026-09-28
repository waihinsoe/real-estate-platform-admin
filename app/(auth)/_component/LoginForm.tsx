"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, LoginFormValues } from "@/lib/validation/auth.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/use-auth"; // Import the hook
import { useRouter } from "next/navigation";
import { formatErrorMessage } from "@/lib/format/format-error";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "johndoe@example.com",
      password: "password123456",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // clear previous server errors
    clearErrors();

    login(data, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        const errorMessage = formatErrorMessage(error);
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      },
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your credentials to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-email-title">
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-form-email-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email address"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-password-title">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id="login-form-password-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {errors.root?.message && (
              <FieldError>{errors.root.message}</FieldError>
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button
          disabled={isPending}
          type="submit"
          form="login-form"
          className="w-full"
        >
          {isPending && <Loader2 className="animate-spin" />}
          Login
        </Button>
        {/* <CardDescription className="text-center">
          Don&apos;t have an account?{" "}
          <Link href={"/register"} className="underline underline-offset-4">
            Register here
          </Link>
        </CardDescription> */}
      </CardFooter>
    </Card>
  );
}
