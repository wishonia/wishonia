import { PWARedirect } from "@/components/pwa-redirect"
import {Poll} from "@/components/poll";

export default function Home() {
  return (
    <main>
      <Poll />
      <PWARedirect />
    </main>
  )
}
