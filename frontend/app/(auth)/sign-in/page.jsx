import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-bold text-stone-900 mb-4">Sign In</h1>
      <p className="text-stone-600 mb-6">Auth is currently disabled. <Link href="/dashboard" className="text-orange-600 font-semibold hover:underline">Go to Dashboard →</Link></p>
    </div>
  );
}