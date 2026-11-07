import React from "react";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-stone-100 flex flex-col">
      {/* Decorative top-left logo */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/orange-logo.png"
            alt="Servd Logo"
            width={40}
            height={40}
            className="w-10 h-10 group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Servd
          </span>
        </Link>
      </div>

      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-100/30 rounded-full blur-2xl" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <p className="text-stone-500 text-sm font-medium">
              AI-powered recipe platform for food lovers
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;