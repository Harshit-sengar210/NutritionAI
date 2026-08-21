import Link from "next/link";
import { NutritionLogo } from "@/components/brand/NutritionLogo";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-stone-100 p-8 flex flex-col items-center">
        <NutritionLogo className="w-16 h-16 mb-6" />
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">Sign Up Placeholder</h1>
        <p className="text-stone-500 text-center mb-8">
          This is a placeholder for the actual sign up form.
        </p>
        
        <Link href="/onboarding" className="w-full py-3.5 px-4 rounded-2xl bg-green-500 text-white font-medium hover:bg-green-600 transition-all text-center mb-4 block">
          Simulate Successful Sign Up & Go To Onboarding
        </Link>

        <Link href="/auth" className="text-stone-500 hover:text-stone-800 transition-colors">
          ← Back to Welcome
        </Link>
      </div>
    </div>
  );
}
