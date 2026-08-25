"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";

import { authClient } from "@/lib/auth/client";
import { authErrorStatus, describeAuthFailure } from "@/lib/auth/auth-error";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm({ redirectTo }: { redirectTo: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    setFormError(null);

    const fallback = "Could not sign you in. Please try again.";

    /**
     * Shared by the resolved and thrown paths so a failure reads the same
     * either way. Deliberately generic for a rejected credential:
     * distinguishing "no such account" from "wrong password" tells an attacker
     * which emails are registered. But only when the credential is what was
     * actually rejected — a 403 from an untrusted origin is a config fault,
     * and blaming the password for it sends people off resetting a password
     * that was never wrong.
     */
    const messageFor = (cause: unknown) => {
      const specific = describeAuthFailure(cause);
      if (specific) return specific;

      const status = authErrorStatus(cause);
      return status === 401 || status === 403
        ? "That email or password is incorrect."
        : fallback;
    };

    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setFormError(messageFor(error));
        return;
      }

      // Never leave the user on a form that appears to have done nothing.
      if (!data) {
        setFormError(
          "Signed in, but no session was returned. Please try again."
        );
        return;
      }

      // A full document load, not router.push(). The client router caches the
      // proxy redirect that sent an unauthenticated visitor here, so a soft
      // navigation to /dashboard replays that cached redirect straight back
      // to /login even though the session cookie is now set.
      window.location.assign(redirectTo);
    } catch (cause) {
      // This is the path that actually runs: authClient throws on every failed
      // response rather than resolving with `{ error }`. Without it the form
      // just sat there after a rejected sign-in.
      console.error("Sign-in failed", cause);
      setFormError(messageFor(cause));
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  placeholder="you@school.edu.ng"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}
