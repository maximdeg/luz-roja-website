import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="lr-header-logo-link">
      <div className="lr-header-logo-mark">
        <Image
          src="/logos/One Line Logo - White.png"
          alt="Luz Roja Contenidos"
          width={120}
          height={78}
          className="lr-header-logo-img"
          priority
        />
      </div>
    </Link>
  );
}

