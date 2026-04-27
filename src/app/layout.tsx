import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Patente B - Allenati per l'Esame di Guida",
  description: "Applicazione di allenamento per l'esame della patente B italiana. 7.139 quiz ufficiali organizzati per capitoli con correzione istantanea e statistiche.",
  keywords: ["patente B", "quiz guida", "esame patente", "quiz patente italiana", "quiz B"],
  authors: [{ name: "Quiz Patente B" }],
  openGraph: {
    title: "Quiz Patente B - Allenati per l'Esame",
    description: "7.139 quiz ufficiali per prepararti all'esame della patente B italiana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
