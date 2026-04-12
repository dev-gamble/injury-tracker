import { Oswald, Open_Sans } from "next/font/google"
import { TrackerShell } from "@/components/endex/tracker-shell"
import "./endex.css"

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export default function TrackerPage() {
  return (
    <div className={`endex-root ${oswald.className} ${openSans.className}`}>
      <TrackerShell />
    </div>
  )
}
