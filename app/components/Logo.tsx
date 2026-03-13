import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/">
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: 32,
          backgroundColor: "transparent"
        }}
      >
        <Image
          src="/logos/One Line Logo - White.png"
          alt="Luz Roja Contenidos"
          width={120}
          height={78}
          style={{
            width: "auto",
            height: "100%",
            objectFit: "cover"
          }}
          priority
        />
      </div>
    </Link>
  );
}

