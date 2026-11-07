import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "mx-auto w-full",
          card: "rounded-3xl border border-orange-100 shadow-xl shadow-orange-100/50 bg-white/90 backdrop-blur-sm",
          headerTitle: "text-stone-900 font-extrabold",
          headerSubtitle: "text-stone-500",
          socialButtonsBlockButton:
            "border border-stone-200 hover:border-orange-300 hover:bg-orange-50 transition-colors rounded-2xl",
          formButtonPrimary:
            "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 rounded-2xl shadow-sm transition-all",
          footerActionLink: "text-orange-600 hover:text-orange-500",
          formFieldInput:
            "rounded-2xl border-stone-200 focus:border-orange-400 focus:ring-orange-200",
          dividerLine: "bg-stone-200",
          dividerText: "text-stone-400",
        },
      }}
    />
  );
}
