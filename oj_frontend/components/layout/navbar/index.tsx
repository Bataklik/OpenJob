"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
    NavigationMenu,
    navigationMenuTriggerStyle,
} from "../../ui/navigation-menu";
import { Button } from "../../ui/button";
import NavItem from "./nav-item";

const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/how-to-use", label: "How to use" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex w-full">
            {/* Desktop: logo links, items rechts */}
            <NavigationMenu className="hidden w-full max-w-full border-b border-solid bg-transparent px-4 py-5 dark:border-white/[.145] sm:flex">
                <div className="flex w-full items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        aria-label="OpenJob home"
                    >
                        <Image
                            className="dark:invert"
                            src="/openjobs.png"
                            alt="OpenJob logo"
                            width={180}
                            height={40}
                            priority
                        />
                        {/* <span className="hidden text-sm font-semibold sm:inline">
                            OpenJob
                        </span> */}
                    </Link>
                    <div className="ml-auto flex items-center gap-6 list-none">
                        {navLinks.map(({ href, label }) => (
                            <NavItem key={href} href={href}>
                                {label}
                            </NavItem>
                        ))}
                    </div>
                </div>
            </NavigationMenu>

            {/* Mobile: logo links, hamburger rechts + drawer */}
            <header className="flex w-full items-center justify-between border-b border-solid bg-transparent px-4 py-5 dark:border-white/[.145] sm:hidden">
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    aria-label="OpenJob home"
                    onClick={() => setMobileOpen(false)}
                >
                    <Image
                        className="dark:invert"
                        src="/next.svg"
                        alt="OpenJob logo"
                        width={100}
                        height={20}
                        priority
                    />
                    <span className="text-sm font-semibold">OpenJob</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu className="size-5" />
                </Button>
            </header>

            {/* Mobile drawer overlay */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 sm:hidden"
                        aria-hidden
                        onClick={() => setMobileOpen(false)}
                    />
                    <div
                        className="fixed right-0 top-0 z-50 flex h-full w-[min(280px,85vw)] flex-col gap-4 border-l border-solid bg-background p-6 pt-12 dark:border-white/[.145] sm:hidden"
                        role="dialog"
                        aria-label="Navigation menu"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4"
                            aria-label="Close menu"
                            onClick={() => setMobileOpen(false)}
                        >
                            <X className="size-5" />
                        </Button>
                        <nav className="flex flex-col gap-2">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={navigationMenuTriggerStyle()}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
}
