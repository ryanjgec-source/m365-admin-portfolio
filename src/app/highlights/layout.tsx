import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Project Highlights & Case Studies | Microsoft 365 Admin Portfolio",
  description: "Explore real Microsoft 365 administration projects — from Teams telephony and Intune enrollments to Entra ID governance and tenant migrations.",
}

export default function HighlightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
