import { describe, it, expect } from "vitest";
import { buildDownloadEmail } from "./download-email";

const input = {
  emailComprador: "ana@example.com",
  productoTitulo: "Guía de marca",
  downloadUrl: "https://luzroja.vercel.app/api/download/abc.def"
};

describe("buildDownloadEmail", () => {
  it("addresses the buyer and names the product in the subject", () => {
    const email = buildDownloadEmail(input);
    expect(email.to).toBe("ana@example.com");
    expect(email.subject).toContain("Guía de marca");
  });

  it("puts the download link in both the text and html bodies", () => {
    const email = buildDownloadEmail(input);
    expect(email.text).toContain(input.downloadUrl);
    expect(email.html).toContain(input.downloadUrl);
  });

  it("escapes html-significant characters in the product title", () => {
    const email = buildDownloadEmail({ ...input, productoTitulo: "Pack <Marca> & Co" });
    expect(email.html).toContain("Pack &lt;Marca&gt; &amp; Co");
    expect(email.html).not.toContain("<Marca>");
  });
});
