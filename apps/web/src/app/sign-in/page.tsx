import { SignInFormContainer } from "@/features/account/components/sign-in-form-container";

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";

  return (
    <main>
      <h1>Sign in</h1>
      <SignInFormContainer defaultValues={{ email, password: "" }} />
    </main>
  );
}
