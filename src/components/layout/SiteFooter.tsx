import type { Dictionary } from '@/locales/en'

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer
      id="legal"
      className="relative z-1 border-t border-white/10 bg-slag/80 px-6 py-10 text-sm text-steel"
    >
      <div className="mx-auto max-w-6xl grid gap-4 md:grid-cols-2">
        <div>
          <p className="font-display text-white text-base">{dict.footer.tradeName}</p>
          <p className="mt-1">{dict.footer.legalName}</p>
          <p className="mt-2 text-molten">{dict.footer.cnpj}</p>
          <p>
            {dict.footer.founded} · {dict.footer.location}
          </p>
          <p className="mt-1">{dict.footer.address}</p>
        </div>
        <div className="md:text-right">
          <p>{dict.footer.rights}</p>
          <p className="mt-2">
            <a
              className="text-molten hover:underline"
              href="https://github.com/andrechavesg/andrechaves.me"
            >
              github.com/andrechavesg/andrechaves.me
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
