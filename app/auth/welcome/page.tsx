'use client';

import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">AdsEarn</h1>
          <p className="text-stone-600 text-lg">Earn while you browse</p>
        </div>

        {/* Illustration placeholder */}
        <div className="w-full h-64 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">Start Earning</h3>
            <p className="text-stone-600 text-sm">Watch ads and earn rewards instantly</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/auth/signup"
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg text-center block hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
          >
            Get Started
          </Link>
          
          <Link
            href="/auth/login"
            className="w-full bg-white text-indigo-600 py-4 px-6 rounded-2xl font-semibold text-lg text-center block border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
          >
            I already have an account
          </Link>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-stone-500 mt-8">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-indigo-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-indigo-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
