import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Eye, Gem, ShieldCheck, Star, Phone, MapPin, Clock, Instagram, Facebook, Mail, MessageCircle, Check } from "lucide-react";
import logo from "@/assets/cevu-logo.png";
import boutique from "@/assets/cevu-hero.png.asset.json";
import pSol from "@/assets/p-solaire.jpg";
import pVue from "@/assets/p-vue.jpg";
import pBleue from "@/assets/p-bleue.jpg";
import pLent from "@/assets/p-lentilles.jpg";

const PHONE1 = "74 221 618";
const PHONE2 = "74 619 650";
const WA = "https://wa.me/21674221618";

type Cat = "vue" | "solaire" | "bleue" | "lentilles";
const CATS: { id: Cat; title: string; desc: string; img: string }[] = [
  { id: "vue", title: "Lunettes de Vue", desc: "Montures d'exception, verres sur mesure.", img: pVue },
  { id: "solaire", title: "Lunettes Solaires", desc: "Éditions limitées & icônes de la mode.", img: pSol },
  { id: "lentilles", title: "Lentilles de contact", desc: "Confort et netteté, pour chaque regard.", img: pLent },
];
const PRODUCTS = [
  { name: "Gucci GG1325S Édition Limitée", brand: "Gucci", cat: "solaire" as Cat, img: pSol, price: "890 DT" },
  { name: "Persol Gold Round 2493", brand: "Persol", cat: "vue" as Cat, img: pVue, price: "620 DT" },
  { name: "Ray-Ban Blue Clubmaster", brand: "Ray-Ban", cat: "bleue" as Cat, img: pBleue, price: "410 DT" },
  { name: "Prada Symbole Écaille", brand: "Prada", cat: "solaire" as Cat, img: pSol, price: "760 DT" },
  { name: "Tom Ford FT5401 Optique", brand: "Tom Ford", cat: "vue" as Cat, img: pVue, price: "680 DT" },
  { name: "Cévu Screen Shield", brand: "Cévu", cat: "bleue" as Cat, img: pBleue, price: "220 DT" },
];
const BRANDS = ["GUCCI", "Ray-Ban", "PERSOL", "PRADA", "TOM FORD", "DIOR", "Carrera", "OAKLEY", "VERSACE", "Police"];
const REVIEWS = [
  { t: "Service au top !", a: "Lina" },
  { t: "Service top du top, personnel sympathique et sérieux", a: "Mariem H." },
  { t: "Service top du top 👍", a: "Eya H." },
];

function Loader({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src={logo}
            alt="Cévu Optique"
            className="h-24 w-24"
            initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 35 }), sy = useSpring(y, { stiffness: 400, damping: 35 });
  const [hover, setHover] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const m = (e: MouseEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      setHover(!!(e.target as HTMLElement).closest("a,button,[data-hover]"));
    };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full border border-accent mix-blend-multiply"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: hover ? 56 : 18, height: hover ? 56 : 18, backgroundColor: hover ? "color-mix(in oklab, var(--accent) 25%, transparent)" : "transparent" }}
    />
  );
}

function Nav() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = 0;
    const f = () => { const y = window.scrollY; setHidden(y > last && y > 120); last = y; };
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [["#collections", "Collections"], ["#produits", "Produits"], ["#rdv", "Rendez-vous"], ["#magasins", "Magasins"]];
  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-x-0 top-0 z-50 glass"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center gap-3">
          <img src={logo} alt="Cévu Optique logo" className="h-9 w-9" />
          <span className="font-serif text-2xl">Cévu <span className="italic text-muted-foreground">Optique</span></span>
        </a>
        <ul className="hidden gap-8 text-sm md:flex">
          {links.map(([h, l]) => (
            <li key={h}><a href={h} className="transition-colors hover:text-accent">{l}</a></li>
          ))}
        </ul>
        <a href="#rdv" className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition hover:bg-accent">
          Examen de vue
        </a>
      </nav>
    </motion.header>
  );
}

function Hero({ ready }: { ready: boolean }) {
  const h = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ready || !h.current) return;
    const st = new SplitType(h.current, { types: "words,chars" });
    gsap.from(st.chars, { yPercent: 110, opacity: 0, stagger: 0.015, duration: 0.9, ease: "power4.out" });
    return () => st.revert();
  }, [ready]);
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden bg-warm pb-20 pt-28">
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/25 blur-[140px]" />
      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-muted-foreground">Opticienne optométriste · Sfax</p>
          <h1 ref={h} className="text-5xl leading-[1.02] md:text-7xl [&_.char]:inline-block">
            Trouver la paire parfaite, c'est plus qu'un choix… <em className="text-accent">c'est une expérience</em>
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }} className="mt-10 flex flex-wrap gap-4">
            <a href="#produits" className="rounded-full bg-primary px-7 py-3.5 text-primary-foreground transition hover:bg-accent">Découvrir la collection</a>
            <a href="#rdv" className="rounded-full border border-foreground/20 px-7 py-3.5 transition hover:border-accent hover:text-accent">Prendre rendez-vous</a>
          </motion.div>
          <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex text-gold">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span>
            5.0 sur Google · 16,7k abonnés Instagram
          </div>
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!r.current) return;
    const ctx = gsap.context(() => {
      gsap.from(r.current!.querySelectorAll("[data-r]"), {
        y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: r.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);
  return <div ref={r} className={className}>{children}</div>;
}

function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10])), ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]));
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - b.left) / b.width - 0.5); y.set((e.clientY - b.top) / b.height - 0.5); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Title({ k, t }: { k: string; t: React.ReactNode }) {
  return (
    <div data-r className="mb-14 max-w-2xl">
      <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">{k}</p>
      <h2 className="text-4xl md:text-6xl">{t}</h2>
    </div>
  );
}

function Categories({ onPick }: { onPick: (c: Cat) => void }) {
  return (
    <section id="collections" className="py-28">
      <Reveal className="mx-auto max-w-7xl px-6">
        <Title k="Collections" t={<>Une vision, <em>trois univers</em></>} />
        <div className="grid gap-6 md:grid-cols-3">
          {CATS.map((c) => {
            const hasProducts = PRODUCTS.some((p) => p.cat === c.id);
            return (
            <div data-r key={c.id}>
              <a
                href={hasProducts ? "#produits" : undefined}
                onClick={hasProducts ? () => onPick(c.id) : undefined}
                aria-label={hasProducts ? `Voir les produits : ${c.title}` : undefined}
                className={`block ${hasProducts ? "" : "cursor-default"}`}
              >
              <Tilt className="border-glow group rounded-3xl bg-card p-3 shadow-soft">
                <div className="overflow-hidden rounded-2xl">
                  <img src={c.img} alt={c.title} loading="lazy" width={816} height={816} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="text-3xl">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </Tilt>
              </a>
            </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function Products({ f, setF }: { f: Cat | "all"; setF: (v: Cat | "all") => void }) {
  const [parent] = useAutoAnimate();
  const list = PRODUCTS.filter((p) => f === "all" || p.cat === f);
  const tabs: [Cat | "all", string][] = [["all", "Tout"], ["vue", "Vue"], ["solaire", "Solaire"], ["bleue", "Anti-bleue"]];
  return (
    <section id="produits" className="bg-secondary/50 py-28">
      <Reveal className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Title k="Sélection" t={<>Pièces <em>signatures</em></>} />
          <div data-r className="mb-14 flex flex-wrap gap-2">
            {tabs.map(([id, l]) => (
              <button key={id} onClick={() => setF(id)} className={`rounded-full px-5 py-2 text-sm transition ${f === id ? "bg-primary text-primary-foreground" : "border border-border hover:border-accent"}`}>{l}</button>
            ))}
          </div>
        </div>
        <div ref={parent} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.name} className="group overflow-hidden rounded-3xl bg-card shadow-soft">
              <div className="relative overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-xs uppercase tracking-widest">{p.brand}</span>
              </div>
              <div className="flex items-center justify-between p-6">
                <h3 className="text-xl">{p.name}</h3>
                <a href={`${WA}?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par " + p.name)}`} target="_blank" rel="noreferrer" className="relative h-6 overflow-hidden text-sm">
                  <span className="block transition-transform duration-500 group-hover:-translate-y-6">{p.price}</span>
                  <span className="block text-accent transition-transform duration-500 group-hover:-translate-y-6">Commander →</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Why() {
  const items = [
    { i: Eye, t: "Examen de vue", d: "Réalisé par une optométriste diplômée." },
    { i: Gem, t: "Verres de qualité", d: "Les meilleurs verriers, ajustés au millimètre." },
    { i: ShieldCheck, t: "Garantie", d: "Montures et verres garantis, suivi inclus." },
    { i: Star, t: "Service 5.0★", d: "Une équipe sérieuse et attentionnée." },
  ];
  return (
    <section className="relative overflow-hidden py-28">
      <Reveal className="mx-auto max-w-7xl px-6">
        <Title k="Pourquoi nous" t={<>L'exigence d'un <em>regard expert</em></>} />
        <div className="grid gap-5 md:grid-cols-4">
          {items.map(({ i: I, t, d }) => (
            <div data-r key={t} className="group relative overflow-hidden rounded-3xl glass p-7">
              <div className="absolute inset-x-0 top-0 h-px overflow-hidden"><div className="animate-beam h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent" /></div>
              <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <I className="h-6 w-6" />
              </motion.div>
              <h3 className="text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div data-r className="mt-16 overflow-hidden rounded-3xl">
          <img src={boutique.url} alt="Boutique Cévu Optique, mur de lunettes Gucci" loading="lazy" className="w-full object-cover" />
        </div>
      </Reveal>
    </section>
  );
}

function Marquee() {
  return (
    <section className="border-y border-border py-10" aria-label="Nos marques">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="animate-marquee flex w-max gap-16">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="font-serif text-4xl text-muted-foreground/70 md:text-5xl">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function EyeFollow() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const m = (e: MouseEvent) => {
      const b = ref.current?.getBoundingClientRect(); if (!b) return;
      const dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
      const a = Math.atan2(dy, dx), d = Math.min(14, Math.hypot(dx, dy) / 20);
      setP({ x: Math.cos(a) * d, y: Math.sin(a) * d });
    };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);
  return (
    <div ref={ref} data-hover onMouseEnter={() => setBlink(true)} onMouseLeave={() => setBlink(false)} className="flex h-24 w-40 items-center justify-center rounded-full bg-card shadow-soft">
      <motion.div animate={{ scaleY: blink ? 0.1 : 1 }} className="relative flex h-14 w-28 items-center justify-center overflow-hidden rounded-[50%] border-2 border-foreground">
        <motion.div animate={{ x: p.x, y: p.y }} className="h-10 w-10 rounded-full bg-accent p-2.5"><div className="h-full w-full rounded-full bg-foreground" /></motion.div>
      </motion.div>
    </div>
  );
}

function Reviews() {
  return (
    <section className="py-28">
      <Reveal className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Title k="Avis clients" t={<>Ils nous ont <em>confié leur regard</em></>} />
          <div data-r className="mb-14 flex items-center gap-6">
            <EyeFollow />
            <div className="rounded-2xl glass px-5 py-4">
              <p className="text-3xl font-serif">5.0 <span className="text-gold">★★★★★</span></p>
              <p className="text-xs text-muted-foreground">Google · 7 avis</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <motion.blockquote data-r key={r.a} whileHover={{ y: -8 }} className="rounded-3xl bg-card p-8 shadow-soft">
              <p className="text-gold">★★★★★</p>
              <p className="mt-4 font-serif text-2xl leading-snug">« {r.t} »</p>
              <footer className="mt-6 text-sm text-muted-foreground">— {r.a}</footer>
            </motion.blockquote>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Booking() {
  const [v, setV] = useState({ name: "", phone: "", store: "1", date: "", msg: "" });
  const [err, setErr] = useState<Partial<Record<"name" | "phone" | "date", string>>>({});
  const [ok, setOk] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<"name" | "phone" | "date", string>> = {};
    if (v.name.trim().length < 2) er.name = "Veuillez indiquer votre nom.";
    if (!/^[0-9 +]{8,15}$/.test(v.phone.trim())) er.phone = "Numéro de téléphone invalide.";
    if (!v.date) er.date = "Choisissez une date.";
    else if (new Date(v.date) < new Date(new Date().toDateString())) er.date = "La date doit être à venir.";
    setErr(er);
    if (Object.keys(er).length) return;
    setOk(true);
  };
  const store = v.store === "1" ? "Magasin 1 (centre ville)" : "Magasin 2 (Route Lafran)";
  const waText = `Bonjour Cévu Optique, je souhaite un examen de vue.\nNom: ${v.name}\nTél: ${v.phone}\n${store}\nDate: ${v.date}\n${v.msg}`;
  const field = "w-full rounded-xl border bg-background px-4 py-3.5 outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/30";
  const E = ({ k }: { k: "name" | "phone" | "date" }) => (err[k] ? <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-destructive">{err[k]}</motion.p> : null);
  return (
    <section id="rdv" className="bg-primary py-28 text-primary-foreground">
      <Reveal className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2">
        <div data-r>
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">Rendez-vous</p>
          <h2 className="text-4xl md:text-6xl">Prendre rendez-vous pour un <em>examen de vue</em></h2>
          <p className="mt-6 max-w-md text-primary-foreground/70">Un bilan visuel complet par notre optométriste, puis des conseils personnalisés pour trouver votre paire.</p>
          <div className="mt-8 space-y-2 text-primary-foreground/80">
            <a href="tel:+21674221618" className="flex items-center gap-3 hover:text-accent"><Phone className="h-4 w-4" /> {PHONE1}</a>
            <a href="tel:+21674619650" className="flex items-center gap-3 hover:text-accent"><Phone className="h-4 w-4" /> {PHONE2}</a>
          </div>
        </div>
        <div data-r className="rounded-3xl bg-background p-8 text-foreground">
          <AnimatePresence mode="wait">
            {ok ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check className="h-10 w-10" /></motion.div>
                <h3 className="mt-6 text-3xl">Merci {v.name} !</h3>
                <p className="mt-2 text-muted-foreground">Confirmez votre rendez-vous en un clic :</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href={`${WA}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-6 py-3 text-accent-foreground">Envoyer sur WhatsApp</a>
                  <a href={v.store === "1" ? "tel:+21674221618" : "tel:+21674619650"} className="rounded-full border border-border px-6 py-3">Appeler le magasin</a>
                </div>
              </motion.div>
            ) : (
              <motion.form key="f" onSubmit={submit} noValidate className="grid gap-5">
                <div><input className={`${field} ${err.name ? "border-destructive" : "border-input"}`} placeholder="Nom complet" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /><E k="name" /></div>
                <div><input className={`${field} ${err.phone ? "border-destructive" : "border-input"}`} placeholder="Téléphone" inputMode="tel" value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} /><E k="phone" /></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <select className={`${field} border-input`} value={v.store} onChange={(e) => setV({ ...v, store: e.target.value })}>
                    <option value="1">Magasin 1 — Centre ville</option>
                    <option value="2">Magasin 2 — Route Lafran</option>
                  </select>
                  <div><input type="date" className={`${field} ${err.date ? "border-destructive" : "border-input"}`} value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} /><E k="date" /></div>
                </div>
                <textarea rows={3} className={`${field} border-input`} placeholder="Message (facultatif)" value={v.msg} onChange={(e) => setV({ ...v, msg: e.target.value })} />
                <button className="rounded-full bg-primary py-4 text-primary-foreground transition hover:bg-accent">Demander mon rendez-vous</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

function Stores() {
  const s = [
    { n: "Magasin 1", a: "Avenue Taieb Mhiri, centre ville, Sfax", p: PHONE1, t: "+21674221618" },
    { n: "Magasin 2", a: "Route Lafran Km 5, Imm El Rayen, Sfax", p: PHONE2, t: "+21674619650" },
  ];
  return (
    <section id="magasins" className="py-28">
      <Reveal className="mx-auto max-w-7xl px-6">
        <Title k="Nos magasins" t={<>Deux adresses <em>à Sfax</em></>} />
        <div className="grid gap-6 lg:grid-cols-3">
          {s.map((m) => (
            <div data-r key={m.n} className="border-glow rounded-3xl bg-card p-8 shadow-soft">
              <h3 className="text-3xl">{m.n}</h3>
              <p className="mt-5 flex gap-3 text-muted-foreground"><MapPin className="h-5 w-5 shrink-0 text-accent" />{m.a}</p>
              <a href={`tel:${m.t}`} className="mt-3 flex gap-3 hover:text-accent"><Phone className="h-5 w-5 text-accent" />{m.p}</a>
              <p className="mt-3 flex gap-3 text-muted-foreground"><Clock className="h-5 w-5 text-accent" />Ouvert tous les jours · ferme à 19:30</p>
            </div>
          ))}
          <div data-r className="min-h-[280px] overflow-hidden rounded-3xl shadow-soft">
            <iframe title="Carte Cévu Optique" className="h-full min-h-[280px] w-full" loading="lazy" src="https://www.google.com/maps?q=QP8F%2BR8V%20Sfax%20Tunisia&output=embed" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-secondary/60 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Cévu Optique" className="h-16 w-16" />
            <p className="shimmer font-serif text-6xl md:text-8xl">Cévu Optique</p>
          </div>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/cevu_optique/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-border p-3 hover:border-accent hover:text-accent"><Instagram className="h-5 w-5" /></a>
            <a href="https://www.facebook.com/CevuOptique/" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-border p-3 hover:border-accent hover:text-accent"><Facebook className="h-5 w-5" /></a>
          </div>
        </div>
        <div className="mt-14 grid gap-8 border-t border-border pt-10 text-sm text-muted-foreground md:grid-cols-3">
          <p>Avenue Taieb Mhiri, centre ville, Sfax<br />☎ {PHONE1}</p>
          <p>Route Lafran Km 5, Imm El Rayen, Sfax<br />☎ {PHONE2}</p>
          <p><a href="mailto:hamzahager@gmail.com" className="flex items-center gap-2 hover:text-accent"><Mail className="h-4 w-4" />hamzahager@gmail.com</a>@cevu_optique</p>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} Cévu Optique — Opticienne optométriste, Sfax.</p>
      </div>
    </footer>
  );
}

export default function Site() {
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Cat | "all">("all");
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -70 }); else el.scrollIntoView();
    };
    document.addEventListener("click", onClick);
    const t = setTimeout(() => setReady(true), 1200);
    return () => { clearTimeout(t); document.removeEventListener("click", onClick); gsap.ticker.remove(tick); lenis?.destroy(); };
  }, []);
  return (
    <>
      <Loader done={ready} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Categories onPick={setFilter} />
        <Products f={filter} setF={setFilter} />
        <Marquee />
        <Why />
        <Reviews />
        <Booking />
        <Stores />
      </main>
      <Footer />
      <a href={WA} target="_blank" rel="noreferrer" aria-label="Commander sur WhatsApp" className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-soft transition hover:scale-110">
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}
