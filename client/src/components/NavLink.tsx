import { Link, useRoute } from "wouter";

type NavLinkProps = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const [isActive] = useRoute(href);

  return (
    <Link href={href} className="w-full">
      <a
        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-primary/5 ${
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
        }`}
      >
        <span>{label}</span>
      </a>
    </Link>
  );
}
