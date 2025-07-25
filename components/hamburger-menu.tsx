"use client";

import { useState, useEffect } from "react";
import { Menu, X, Home, Phone, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      description: "Back to homepage",
    },
    {
      label: "Contact",
      href: "/contact",
      icon: Phone,
      description: "Get in touch with us",
    },
    {
      label: "Register",
      href: "/register",
      icon: UserPlus,
      description: "Create your account",
    },
    {
      label: "Login",
      href: "/signin",
      icon: LogIn,
      description: "Sign into your account",
    },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative z-50 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        aria-label="Toggle menu"
      >
        <div className="relative">
          {isOpen ? (
            <X className="h-6 w-6 text-black dark:text-white animate-in spin-in-180 duration-200" />
          ) : (
            <Menu className="h-6 w-6 text-black dark:text-white animate-in fade-in duration-200" />
          )}
        </div>
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 animate-in fade-in duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-40 transform transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">DailyEarn</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Navigation Menu</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMenu}
            className="h-8 w-8 hover:bg-white/50 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-black dark:text-white" />
          </Button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col p-6 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center space-x-4 p-4 rounded-xl hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-all duration-200 group border border-transparent hover:border-lime-200 dark:hover:border-lime-800 animate-in slide-in-from-right-5 duration-${300 + index * 100}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center group-hover:bg-lime-200 dark:group-hover:bg-lime-900/50 transition-colors">
                  <Icon className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                </div>
                <div className="flex-1">
                  <span className="block text-lg font-medium text-black dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                    {item.label}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Turn Screen Time into Cash
              </h3>
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start earning money today with simple tasks
            </p>
            <div className="mt-4">
              <Link
                href="/register"
                onClick={closeMenu}
                className="inline-flex items-center px-4 py-2 bg-lime-400 hover:bg-lime-500 text-black font-medium rounded-lg transition-colors"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
