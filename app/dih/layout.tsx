import '../globals.css';
import type { Metadata } from 'next';
import { Navigation } from "./components/navigation";
import { Footer } from "./components/footer";

export const metadata: Metadata = {
  title: 'Decentralized Institutes of Health',
  description: 'Accelerating the end of disease through decentralized governance, universal medical freedom, and aligned incentives.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
    <Navigation />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
  );
}