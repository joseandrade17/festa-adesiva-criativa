import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Printer, Search, Sparkles, Trash2, Wand2 } from "lucide-react";
import { streamImage } from "@/lib/stream-image";
import { SHAPES, buildStickerPrompt, imageSizeFor, type Shape } from "@/lib/sticker-prompt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fábrica de Adesivos — adesivos de festa com IA" },
      { name: "description", content: "Crie adesivos personalizados de festa infantil com IA: escolha o tema, formato, tamanho, nome e idade." },
      { property: "og:title", content: "Fábrica de Adesivos — adesivos de festa com IA" },
      { property: "og:description", content: "Digite um tema e a IA cria adesivos personalizados com nome e idade da criança." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const THEMES = [
  "Mulher Maravilha", "Super-heroínas", "Princesas", "Unicórnio mágico", "Sereia", "Fadas",
  "Bailarina", "Borboletas", "Arco-íris", "Super-heróis", "Dinossauros", "Astronauta",
  "Fundo do mar", "Safari", "Circo", "Futebol", "Carros de corrida", "Piratas",
  "Gatinhos", "Cachorrinhos", "Confeitaria doce", "Jardim encantado", "Espaço sideral", "Robôs",
];

type Sticker = { id: string; src: string; theme: string; shape: Shape; w: number; h: number; name: string };

function Index() {
  const [theme, setTheme] = useState("Super-heroínas");
  const [search, setSearch] = useState("");
  const [shape, setShape] = useState<Shape>("redondo");
  const [w, setW] = useState(5);
  const [h, setH] = useState(5);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [extra, setExtra] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [final, setFinal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [printing, setPrinting] = useState<Sticker | null>(null);

  const squareish = shape !== "retangular" && shape !== "livre";
  const filtered = useMemo(
    () => THEMES.filter((t) => t.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  async function generate(themeOverride?: string) {
    const t = (themeOverride ?? theme).trim();
    if (!t) return setError("Digite um tema.");
    setTheme(t);
    setBusy(true); setError(null); setFinal(false); setPreview(null);
    const height = squareish ? w : h;
    try {
      let last = "";
      await streamImage(
        "/api/generate-sticker",
        { prompt: buildStickerPrompt({ theme: t, shape, name, age, extra }), size: imageSizeFor(shape, w, height) },
        (url, isFinal) => { last = url; setPreview(url); setFinal(isFinal); },
      );
      setStickers((s) => [{ id: crypto.randomUUID(), src: last, theme: t, shape, w, h: height, name }, ...s]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível criar o adesivo.");
    } finally {
      setBusy(false);
    }
  }

  function print(s: Sticker) {
    setPrinting(s);
    setTimeout(() => window.print(), 300);
  }

  function searchTheme() {
    if (search.trim()) generate(search);
  }

  const input = "w-full rounded-xl border-2 border-foreground/80 bg-card px-3 py-2 font-semibold outline-none focus:ring-4 focus:ring-primary/30";
  const label = "mb-1 block text-sm font-extrabold uppercase tracking-wide text-muted-foreground";

  return (
    <>
      <main className="no-print min-h-screen bg-dots">
        <header className="bg-party px-6 py-10 text-center text-primary-foreground">
          <h1 className="text-5xl font-bold drop-shadow md:text-6xl">Fábrica de Adesivos ✨</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg font-semibold">
            Diga o tema da festa e a IA cria adesivos únicos com o nome e a idade da criança.
          </p>
        </header>

        <div className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-[1.1fr_1fr] md:p-8">
          <section className="space-y-5 rounded-3xl border-2 border-foreground bg-card p-6 shadow-pop">
            <div>
              <label className={label}>Buscar tema</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input className={`${input} pl-9`} placeholder="Ex.: Mulher-Gato, Frozen, Patrulha..." value={search}
                    onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchTheme()} />
                </div>
                <button onClick={searchTheme} disabled={busy || !search.trim()}
                  className="rounded-xl border-2 border-foreground bg-secondary px-4 font-bold text-secondary-foreground shadow-pop-sm transition active:translate-y-0.5 disabled:opacity-50">
                  Criar
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filtered.map((t) => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={`rounded-full border-2 px-3 py-1 text-sm font-bold transition ${theme === t ? "border-foreground bg-primary text-primary-foreground" : "border-border bg-muted hover:border-primary"}`}>
                    {t}
                  </button>
                ))}
                {!filtered.length && <p className="text-sm text-muted-foreground">Tema novo! Clique em “Criar” e a IA inventa o adesivo.</p>}
              </div>
            </div>

            <div>
              <label className={label}>Tema escolhido</label>
              <input className={input} value={theme} onChange={(e) => setTheme(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><label className={label}>Nome da criança</label><input className={input} placeholder="Ex.: Laura" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><label className={label}>Idade</label><input className={input} placeholder="Ex.: 6 anos" value={age} onChange={(e) => setAge(e.target.value)} /></div>
            </div>

            <div>
              <label className={label}>Formato</label>
              <div className="grid grid-cols-3 gap-2">
                {SHAPES.map((s) => (
                  <button key={s.id} onClick={() => setShape(s.id)}
                    className={`rounded-xl border-2 py-2 text-sm font-bold transition ${shape === s.id ? "border-foreground bg-accent text-accent-foreground shadow-pop-sm" : "border-border bg-card hover:border-accent"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><label className={label}>{squareish ? "Tamanho (cm)" : "Largura (cm)"}</label>
                <input type="number" min={2} max={20} step={0.5} className={input} value={w} onChange={(e) => setW(Number(e.target.value) || 2)} /></div>
              {!squareish && <div><label className={label}>Altura (cm)</label>
                <input type="number" min={2} max={20} step={0.5} className={input} value={h} onChange={(e) => setH(Number(e.target.value) || 2)} /></div>}
            </div>

            <div>
              <label className={label}>Detalhes extras (opcional)</label>
              <textarea rows={2} className={input} placeholder="Ex.: cores rosa e dourado, com estrelinhas" value={extra} onChange={(e) => setExtra(e.target.value)} />
            </div>

            <button onClick={() => generate()} disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary py-4 font-display text-xl font-bold text-primary-foreground shadow-pop transition active:translate-y-1 disabled:opacity-60">
              {busy ? <Sparkles className="size-5 animate-spin" /> : <Wand2 className="size-5" />}
              {busy ? "Criando magia..." : "Criar adesivo"}
            </button>
            {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}
          </section>

          <section className="space-y-4">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border-2 border-foreground bg-checker shadow-pop">
              {preview ? (
                <img src={preview} alt="Adesivo criado" className={`h-full w-full object-contain p-4 transition-[filter] duration-500 ${final ? "blur-0" : "blur-2xl"}`} />
              ) : (
                <p className="px-8 text-center font-display text-xl text-muted-foreground">
                  {busy ? "Desenhando seu adesivo..." : "Seu adesivo aparece aqui 🎉"}
                </p>
              )}
            </div>

            {stickers.length > 0 && (
              <div className="rounded-3xl border-2 border-foreground bg-card p-4 shadow-pop">
                <h2 className="mb-3 text-2xl font-bold">Meus adesivos</h2>
                <div className="grid grid-cols-2 gap-3">
                  {stickers.map((s) => (
                    <div key={s.id} className="rounded-2xl border-2 border-border bg-checker p-2">
                      <img src={s.src} alt={s.theme} className="aspect-square w-full object-contain" />
                      <p className="truncate text-xs font-bold">{s.theme} · {s.w}×{s.h} cm</p>
                      <div className="mt-1 flex gap-1">
                        <a href={s.src} download={`adesivo-${s.name || s.theme}.png`} title="Baixar"
                          className="flex flex-1 justify-center rounded-lg bg-secondary py-1 text-secondary-foreground"><Download className="size-4" /></a>
                        <button onClick={() => print(s)} title="Imprimir folha" className="flex flex-1 justify-center rounded-lg bg-accent py-1 text-accent-foreground"><Printer className="size-4" /></button>
                        <button onClick={() => setStickers((l) => l.filter((x) => x.id !== s.id))} title="Remover" className="flex flex-1 justify-center rounded-lg bg-muted py-1"><Trash2 className="size-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {printing && (
        <div className="print-only flex-wrap content-start gap-[3mm]">
          {Array.from({ length: Math.max(1, Math.floor(19 / (printing.w + 0.3)) * Math.floor(28 / (printing.h + 0.3))) }).map((_, i) => (
            <img key={i} src={printing.src} alt="" style={{ width: `${printing.w}cm`, height: `${printing.h}cm` }} className="object-contain" />
          ))}
        </div>
      )}
    </>
  );
}
