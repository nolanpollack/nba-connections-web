import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NBA Connections",
    description: "Visualize connections between NBA players",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full dark">
            <body
                className={
                    inter.className + " h-full bg-stone-300 dark:bg-stone-900"
                }
            >
                {children}
            </body>
        </html>
    );
}
