import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">About Us</h3>
          <Link href="/aboutus" className="text-sm text-muted-foreground">About Minar Market</Link>
          <Link href="/careers" className="text-sm text-muted-foreground">Careers</Link>
          <Link href="/press" className="text-sm text-muted-foreground">Press</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Support</h3>
  
          <Link href="/safety-center" className="text-sm text-muted-foreground">Safety Center</Link>
          <Link href="/community-guidelines" className="text-sm text-muted-foreground">Community Guidelines</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Legal</h3>
          <Link href="/privacy" className="text-sm text-muted-foreground">Privacy Policy</Link>
          <Link href="/termsofservice" className="text-sm text-muted-foreground">Terms of Service</Link>
          <Link href="/cookiepolicy" className="text-sm text-muted-foreground">Cookie Policy</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Install App</h3>
          <p className="text-sm text-muted-foreground">Coming soon to iOS and Android</p>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex items-center justify-between py-4">
          <span className="text-sm text-muted-foreground">
            © 2025 Minar Market. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}

