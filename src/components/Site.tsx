import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Phone, MapPin, Clock, Instagram, Facebook, Mail, MessageCircle, Check, Plus } from "lucide-react";
import logo from "@/assets/cevu-logo.png";
import hero from "@/assets/cevu-hero.png.asset.json";
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

//MID
export default function Site() {
  const [ready, setReady] = useState(false);
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
        <Categories />
        <Products />
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
