import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart, Menu, X, Plus, Minus, Trash2, Upload, MessageCircle,
  ArrowRight, ArrowLeft, CheckCircle2, Phone, Mail, Instagram, Facebook,
  Layers, BookOpen, Coffee, Tag, ChevronRight, Sparkles, PackageCheck,
  ClipboardList, Send
} from "lucide-react";

/* ---------------------------------------------------------------
   DATA — in a real deployment these come from the admin database.
   Kept as plain objects here so prices are easy to find and edit.
------------------------------------------------------------------*/

const WHATSAPP_NUMBER = "5511999999999"; // TODO: trocar pelo número real da loja

const FOLHA_RANGES = [
  { id: "r1", label: "1 a 50 folhas", pb: 18, color: 38 },
  { id: "r2", label: "51 a 100 folhas", pb: 32, color: 68 },
  { id: "r3", label: "101 a 150 folhas", pb: 46, color: 98 },
  { id: "r4", label: "151 a 200 folhas", pb: 60, color: 128 },
  { id: "r5", label: "201 a 250 folhas", pb: 74, color: 158 },
  { id: "r6", label: "251 a 300 folhas", pb: 88, color: 188 },
  { id: "r7", label: "301 a 350 folhas", pb: 102, color: 218 },
  { id: "r8", label: "351 a 400 folhas", pb: 116, color: 248 },
  { id: "r9", label: "401 a 450 folhas", pb: 130, color: 278 },
  { id: "r10", label: "451 a 500 folhas", pb: 144, color: 308 },
];

const STICKER_SIZES = [
  { id: "3x3", label: "3 x 3 cm", price: 2.5 },
  { id: "4x4", label: "4 x 4 cm", price: 3.2 },
  { id: "5x5", label: "5 x 5 cm", price: 4.0 },
  { id: "6x6", label: "6 x 6 cm", price: 4.9 },
  { id: "7x7", label: "7 x 7 cm", price: 5.8 },
  { id: "8x8", label: "8 x 8 cm", price: 6.9 },
];

const MUG_PRICE_PERSONALIZADA = 42.9;
const MUG_PRICE_PRONTA = 39.9;

const THEMES = [
  { id: "frases-biblicas", label: "Frases bíblicas", icon: "✝️" },
  { id: "frases-motivacionais", label: "Frases motivacionais", icon: "💫" },
  { id: "agradecimento", label: "Agradecimento pela compra", icon: "🙏" },
  { id: "dia-das-maes", label: "Dia das Mães", icon: "🌷" },
  { id: "dia-dos-pais", label: "Dia dos Pais", icon: "🧢" },
  { id: "dia-das-criancas", label: "Dia das Crianças", icon: "🎈" },
  { id: "pascoa", label: "Páscoa", icon: "🐰" },
  { id: "natal", label: "Natal", icon: "🎄" },
  { id: "ano-novo", label: "Ano Novo", icon: "🎆" },
  { id: "aniversarios", label: "Aniversários", icon: "🎂" },
  { id: "dia-dos-namorados", label: "Dia dos Namorados", icon: "💌" },
  { id: "dia-dos-professores", label: "Dia dos Professores", icon: "🍎" },
  { id: "dia-da-mulher", label: "Dia da Mulher", icon: "🌸" },
  { id: "etiquetas-escolares", label: "Etiquetas escolares", icon: "🏷️" },
];

const STICKER_CATALOG = THEMES.flatMap((t) => [
  { id: t.id + "-1", themeId: t.id, name: t.label + " — Modelo 01", icon: t.icon },
  { id: t.id + "-2", themeId: t.id, name: t.label + " — Modelo 02", icon: t.icon },
]);

const MUG_CATALOG = THEMES.map((t) => ({
  id: t.id + "-caneca",
  themeId: t.id,
  name: "Caneca — " + t.label,
  icon: t.icon,
}));

function formatBRL(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------------------------------------------------------------
   SHARED UI BITS
------------------------------------------------------------------*/

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

      :root{
        --ink:#16213E; --ink-2:#1F2E52; --paper:#FAF6EC; --paper-alt:#F1E7D3;
        --coral:#FF5A36; --coral-dark:#E44420; --teal:#1FA898; --teal-dark:#136E63;
        --ochre:#F4B942; --ochre-dark:#8A6410; --text:#201C16; --text-soft:#5B5648;
      }
      .etk *{box-sizing:border-box;}
      .etk{ font-family:'Inter',sans-serif; color:var(--text); background:var(--paper); }
      .etk h1,.etk h2,.etk h3,.etk h4,.etk .font-display{ font-family:'Bricolage Grotesque',sans-serif; }

      .bg-ink{background:var(--ink);} .bg-ink-2{background:var(--ink-2);}
      .bg-paper{background:var(--paper);} .bg-paper-alt{background:var(--paper-alt);}
      .text-paper{color:var(--paper);} .text-ink{color:var(--ink);}
      .text-coral{color:var(--coral);} .text-soft{color:var(--text-soft);}
      .bg-coral{background:var(--coral);} .bg-teal{background:var(--teal);} .bg-ochre{background:var(--ochre);}

      .cut-line{ border:none; border-top:2px dashed rgba(22,33,62,0.18); margin:0; }
      .cut-line-light{ border:none; border-top:2px dashed rgba(250,246,236,0.22); margin:0; }

      .sticker-card{ position:relative; background:var(--paper); border-radius:20px;
        box-shadow: 0 14px 28px -14px rgba(22,33,62,0.45), 0 0 0 5px var(--paper);
        transition: transform .25s ease, box-shadow .25s ease; }
      .sticker-card:hover{ transform: translateY(-5px) rotate(0deg) !important;
        box-shadow: 0 18px 32px -14px rgba(22,33,62,0.5), 0 0 0 5px var(--paper); }
      .rot-a{ transform: rotate(-5deg);} .rot-b{transform:rotate(3deg);}
      .rot-c{transform:rotate(-2deg);} .rot-d{transform:rotate(4deg);}

      .tag{ display:inline-flex; align-items:center; gap:4px; font-weight:600; font-size:12px;
        padding:4px 10px; border-radius:999px; line-height:1.6; white-space:nowrap; }
      .tag-adesivo{ background: rgba(255,90,54,0.12); color:var(--coral-dark);}
      .tag-apostila{ background: rgba(31,168,152,0.14); color:var(--teal-dark);}
      .tag-caneca{ background: rgba(244,185,66,0.2); color:var(--ochre-dark);}

      .btn-primary{ background:var(--coral); color:white; font-weight:600; border-radius:999px;
        padding:13px 26px; display:inline-flex; align-items:center; gap:8px; border:none; cursor:pointer;
        transition: transform .15s ease, background .15s ease; font-family:'Inter',sans-serif; }
      .btn-primary:hover{ background:var(--coral-dark); transform:translateY(-2px);}
      .btn-primary:disabled{ opacity:.45; cursor:not-allowed; transform:none; }

      .btn-secondary{ background:transparent; border:2px solid var(--paper); color:var(--paper);
        font-weight:600; border-radius:999px; padding:11px 24px; display:inline-flex; align-items:center;
        gap:8px; cursor:pointer; font-family:'Inter',sans-serif; transition:.15s ease;}
      .btn-secondary:hover{ background: rgba(250,246,236,0.12);}

      .btn-outline-ink{ border:2px solid var(--ink); color:var(--ink); font-weight:600; border-radius:999px;
        padding:10px 22px; background:transparent; cursor:pointer; font-family:'Inter',sans-serif;
        display:inline-flex; align-items:center; gap:8px; transition:.15s ease;}
      .btn-outline-ink:hover{ background:var(--ink); color:var(--paper);}

      .chip{ border:2px solid rgba(22,33,62,0.15); border-radius:14px; padding:14px; cursor:pointer;
        transition:.15s ease; background:var(--paper); text-align:left; width:100%; font-family:'Inter',sans-serif;}
      .chip.active{ border-color:var(--coral); background: rgba(255,90,54,0.06);}
      .chip:hover{ border-color: rgba(22,33,62,0.4);}

      .toggle-btn{ border:2px solid rgba(22,33,62,0.15); border-radius:999px; padding:10px 20px;
        background:var(--paper); cursor:pointer; font-weight:600; transition:.15s ease; font-family:'Inter',sans-serif;}
      .toggle-btn.active{ background:var(--ink); color:var(--paper); border-color:var(--ink);}

      .field-input{ width:100%; border:2px solid rgba(22,33,62,0.15); border-radius:12px; padding:12px 14px;
        font-family:'Inter',sans-serif; font-size:15px; background:var(--paper); }
      .field-input:focus{ outline:none; border-color:var(--coral); }

      .receipt{ border:2px dashed rgba(22,33,62,0.35); border-radius:18px; background:var(--paper); }

      .nav-link{ position:relative; font-weight:500; color:var(--ink); cursor:pointer; background:none; border:none;
        font-family:'Inter',sans-serif; font-size:15px; padding:6px 2px;}
      .nav-link::after{ content:''; position:absolute; left:0; bottom:-2px; height:2px; width:0; background:var(--coral);
        transition: width .2s ease;}
      .nav-link:hover::after, .nav-link.active::after{ width:100%; }

      .etk *:focus-visible{ outline:3px solid var(--coral); outline-offset:2px; }

      @media (prefers-reduced-motion: reduce){ .etk *{ transition:none !important; animation:none !important; } }
    `}</style>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 100, background: "var(--ink)", color: "var(--paper)", padding: "14px 22px",
        borderRadius: 999, display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 10px 30px -8px rgba(0,0,0,0.5)", fontWeight: 600, fontSize: 14,
        maxWidth: "90vw",
      }}
    >
      <CheckCircle2 size={18} color="#1FA898" />
      {message}
    </div>
  );
}

/* ---------------------------------------------------------------
   HEADER / FOOTER
------------------------------------------------------------------*/

function Logo({ light }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <div
        style={{
          width: 42, height: 42, borderRadius: 12, background: "var(--coral)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: "rotate(-6deg)", flexShrink: 0,
        }}
      >
        <span className="font-display" style={{ color: "white", fontWeight: 800, fontSize: 20 }}>E.</span>
      </div>
      <div style={{ lineHeight: 1.05 }}>
        <div className="font-display" style={{ fontWeight: 800, fontSize: 18, color: light ? "var(--paper)" : "var(--ink)" }}>
          Etike.Tá
        </div>
        <div style={{ fontSize: 11, letterSpacing: 0.5, color: light ? "rgba(250,246,236,0.7)" : "var(--text-soft)" }}>
          impressos
        </div>
      </div>
    </div>
  );
}

function Header({ page, go, cartCount, openCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    { id: "home", label: "Início" },
    { id: "adesivos", label: "Adesivos" },
    { id: "apostilas", label: "Apostilas" },
    { id: "canecas", label: "Canecas" },
    { id: "como-funciona", label: "Como funciona", anchor: "como-funciona" },
    { id: "contato", label: "Contato" },
  ];
  return (
    <header className="bg-paper" style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "2px dashed rgba(22,33,62,0.15)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => go("home")}><Logo /></div>

        <nav style={{ display: "flex", gap: 28 }} className="hide-mobile">
          {items.map((it) => (
            <button
              key={it.id}
              className={"nav-link" + (page === it.id ? " active" : "")}
              onClick={() => go(it.anchor ? "home" : it.id, it.anchor)}
            >
              {it.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-outline-ink hide-mobile" onClick={() => go("carrinho")} style={{ position: "relative" }}>
            <ShoppingCart size={18} />
            Carrinho
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: -8, right: -8, background: "var(--coral)", color: "white",
                fontSize: 11, fontWeight: 700, borderRadius: 999, minWidth: 20, height: 20,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
              }}>{cartCount}</span>
            )}
          </button>
          <button
            onClick={() => go("carrinho")}
            aria-label="Carrinho"
            style={{ position: "relative", background: "none", border: "none", cursor: "pointer" }}
            className="show-mobile"
          >
            <ShoppingCart size={24} color="var(--ink)" />
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: -6, right: -6, background: "var(--coral)", color: "white",
                fontSize: 10, fontWeight: 700, borderRadius: 999, minWidth: 16, height: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{cartCount}</span>
            )}
          </button>
          <button className="show-mobile" style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={26} color="var(--ink)" /> : <Menu size={26} color="var(--ink)" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="show-mobile" style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map((it) => (
            <button
              key={it.id}
              className="nav-link"
              style={{ textAlign: "left", padding: "10px 4px" }}
              onClick={() => { go(it.anchor ? "home" : it.id, it.anchor); setMenuOpen(false); }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .hide-mobile{ display:flex; }
        .show-mobile{ display:none; }
        @media (max-width: 860px){
          .hide-mobile{ display:none !important; }
          .show-mobile{ display:flex !important; }
        }
      `}</style>
    </header>
  );
}

function Footer({ go }) {
  return (
    <footer className="bg-ink text-paper">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px 28px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 40 }}
        className="footer-grid">
        <div>
          <Logo light />
          <p style={{ marginTop: 16, color: "rgba(250,246,236,0.7)", fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
            Adesivos, apostilas e canecas personalizadas, feitos sob medida para o seu jeito de presentear, vender e organizar.
            Cada pedido ganha um número próprio, do orçamento até a entrega.
          </p>
        </div>
        <div>
          <div className="font-display" style={{ fontWeight: 700, marginBottom: 14 }}>Produtos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <button className="footer-link" onClick={() => go("adesivos")}>Adesivos personalizados</button>
            <button className="footer-link" onClick={() => go("apostilas")}>Impressão de apostilas</button>
            <button className="footer-link" onClick={() => go("canecas")}>Canecas personalizadas</button>
          </div>
        </div>
        <div>
          <div className="font-display" style={{ fontWeight: 700, marginBottom: 14 }}>Contato</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "rgba(250,246,236,0.85)" }}>
            <a className="footer-link" href={waLink("Olá! Vim pelo site da Etike.Tá Impressos e gostaria de tirar uma dúvida.")} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={16} /> WhatsApp
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={16} /> contato@etiketaimpressos.com.br</span>
            <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
              <Instagram size={20} />
              <Facebook size={20} />
            </div>
          </div>
        </div>
      </div>
      <hr className="cut-line-light" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 20px", fontSize: 12.5, color: "rgba(250,246,236,0.55)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span>© {new Date().getFullYear()} Etike.Tá Impressos. Todos os direitos reservados.</span>
        <span>Feito com capricho, pedido por pedido.</span>
      </div>
      <style>{`
        .footer-link{ background:none;border:none;color:rgba(250,246,236,0.75); text-align:left; cursor:pointer; font-family:'Inter',sans-serif; font-size:14px; padding:0; }
        .footer-link:hover{ color:var(--paper); text-decoration:underline; }
        @media (max-width: 760px){ .footer-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </footer>
  );
}

/* ---------------------------------------------------------------
   HOME PAGE
------------------------------------------------------------------*/

function Home({ go, addWaCTA }) {
  return (
    <div>
      {/* HERO */}
      <section className="bg-ink" style={{ padding: "72px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }} className="hero-grid">
          <div>
            <span className="tag" style={{ background: "rgba(250,246,236,0.1)", color: "var(--paper)" }}>
              <Sparkles size={13} /> impressão sob medida, do jeito que você imaginou
            </span>
            <h1 className="font-display" style={{ color: "var(--paper)", fontSize: "clamp(34px,5vw,54px)", fontWeight: 800, lineHeight: 1.05, margin: "20px 0" }}>
              Etike.Tá: sua ideia, impressa e pronta pra usar
            </h1>
            <p style={{ color: "rgba(250,246,236,0.75)", fontSize: 17, lineHeight: 1.7, maxWidth: 480 }}>
              Adesivos, apostilas e canecas personalizadas com preço calculado na hora, número de pedido próprio e confirmação direto pelo WhatsApp.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => go("adesivos")}>
                Ver produtos <ArrowRight size={18} />
              </button>
              <a className="btn-secondary" href={addWaCTA} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> Fale conosco
              </a>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div className="sticker-card rot-a" style={{ padding: "22px 18px", gridColumn: "1", marginTop: 30 }}>
              <div style={{ fontSize: 30 }}>🏷️</div>
              <div className="font-display" style={{ fontWeight: 700, marginTop: 8 }}>Adesivos</div>
              <div style={{ fontSize: 13, color: "var(--text-soft)" }}>à prova d'água, sua arte ou nossos temas</div>
            </div>
            <div className="sticker-card rot-b" style={{ padding: "22px 18px" }}>
              <div style={{ fontSize: 30 }}>📘</div>
              <div className="font-display" style={{ fontWeight: 700, marginTop: 8 }}>Apostilas</div>
              <div style={{ fontSize: 13, color: "var(--text-soft)" }}>preço por folha, P&B ou colorido</div>
            </div>
            <div className="sticker-card rot-c" style={{ padding: "22px 18px", gridColumn: "1 / span 2", marginTop: -6 }}>
              <div style={{ fontSize: 30 }}>☕</div>
              <div className="font-display" style={{ fontWeight: 700, marginTop: 8 }}>Canecas</div>
              <div style={{ fontSize: 13, color: "var(--text-soft)" }}>325 ml, com foto, logo, nome ou frase</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="cut-line" />

      {/* PRODUCT HIGHLIGHTS */}
      <section style={{ padding: "72px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: 30, fontWeight: 800, marginBottom: 10 }}>Nossos três produtos</h2>
          <p style={{ color: "var(--text-soft)", maxWidth: 520, marginBottom: 40 }}>
            Escolha o produto, personalize as opções e veja o preço se atualizar na hora.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="highlight-grid">
            <ProductHighlight
              icon={<Layers size={26} />}
              tagClass="tag-adesivo"
              tagLabel="adesivos"
              title="Adesivos personalizados"
              desc="Vinil branco ou transparente, à prova d'água, redondo, quadrado ou no formato da sua arte. Também temos adesivos prontos por tema."
              onClick={() => go("adesivos")}
            />
            <ProductHighlight
              icon={<BookOpen size={26} />}
              tagClass="tag-apostila"
              tagLabel="apostilas"
              title="Impressão de apostilas"
              desc="Cálculo por folha impressa, em preto e branco ou colorido. Capa transparente e contracapa preta inclusas."
              onClick={() => go("apostilas")}
            />
            <ProductHighlight
              icon={<Coffee size={26} />}
              tagClass="tag-caneca"
              tagLabel="canecas"
              title="Canecas personalizadas"
              desc="Canecas redondas de 325 ml com sua foto, logo, nome ou frase — ou escolha entre nossos modelos prontos."
              onClick={() => go("canecas")}
            />
          </div>
        </div>
      </section>

      <hr className="cut-line" />

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-paper-alt" style={{ padding: "72px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: 30, fontWeight: 800, marginBottom: 40 }}>Como funciona o pedido</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="steps-grid">
            {[
              { n: "1", t: "Escolha e personalize", d: "Selecione o produto, tamanho, quantidade ou modelo e veja o preço na hora." },
              { n: "2", t: "Envie sua arte", d: "Quando o produto pedir, envie a arte pelo próprio site (formatos de imagem ou documento)." },
              { n: "3", t: "Finalize o pedido", d: "Preencha seus dados e receba um número de pedido único, tipo Pedido #ETK-0001." },
              { n: "4", t: "Confirme pelo WhatsApp", d: "Use o número do pedido para confirmar os detalhes da arte com a nossa equipe." },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display" style={{ fontSize: 34, fontWeight: 800, color: "var(--coral)" }}>{s.n}</div>
                <div className="font-display" style={{ fontWeight: 700, fontSize: 17, margin: "8px 0 6px" }}>{s.t}</div>
                <div style={{ fontSize: 14, color: "var(--text-soft)", lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="cut-line" />

      {/* CONTATO */}
      <section id="contato-section" style={{ padding: "72px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Ficou com alguma dúvida?</h2>
            <p style={{ color: "var(--text-soft)", maxWidth: 440 }}>
              Fale direto com a nossa equipe pelo WhatsApp. Se já tiver um número de pedido, tenha ele em mãos.
            </p>
          </div>
          <a className="btn-primary" href={addWaCTA} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} /> Falar com a Etike.Tá
          </a>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px){
          .hero-grid{ grid-template-columns:1fr !important; }
          .highlight-grid{ grid-template-columns:1fr !important; }
          .steps-grid{ grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width: 520px){
          .steps-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ProductHighlight({ icon, tagClass, tagLabel, title, desc, onClick }) {
  return (
    <div className="sticker-card" style={{ padding: 26 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--paper-alt)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
          {icon}
        </div>
        <span className={"tag " + tagClass}>{tagLabel}</span>
      </div>
      <h3 className="font-display" style={{ fontSize: 19, fontWeight: 700, margin: "18px 0 8px" }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--text-soft)", lineHeight: 1.6, minHeight: 66 }}>{desc}</p>
      <button className="btn-outline-ink" style={{ marginTop: 14 }} onClick={onClick}>
        Ver detalhes <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   APOSTILAS PAGE
------------------------------------------------------------------*/

function PageHeader({ tagClass, tagLabel, title, desc }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <span className={"tag " + tagClass}>{tagLabel}</span>
      <h1 className="font-display" style={{ fontSize: 32, fontWeight: 800, margin: "12px 0 10px" }}>{title}</h1>
      <p style={{ color: "var(--text-soft)", maxWidth: 620, lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

function Apostilas({ addToCart }) {
  const [rangeId, setRangeId] = useState(null);
  const [tipo, setTipo] = useState("pb");
  const [obs, setObs] = useState("");

  const range = FOLHA_RANGES.find((r) => r.id === rangeId);
  const price = range ? (tipo === "pb" ? range.pb : range.color) : null;

  function handleAdd() {
    if (!range) return;
    addToCart({
      type: "Apostila",
      title: "Impressão de apostila",
      meta: `${range.label} · ${tipo === "pb" ? "Preto e branco" : "Colorido"}${obs ? " · obs: " + obs : ""}`,
      unitPrice: price,
      qty: 1,
    });
    setObs("");
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 20px 100px" }}>
      <PageHeader
        tagClass="tag-apostila" tagLabel="apostilas"
        title="Impressão de apostilas"
        desc="Monte sua apostila escolhendo a quantidade de folhas e o tipo de impressão. O preço é atualizado automaticamente."
      />

      <div className="receipt" style={{ padding: "16px 20px", marginBottom: 30, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <ClipboardList size={20} color="var(--ink)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 14, lineHeight: 1.7 }}>
          <strong>Atenção:</strong> o cálculo da impressão é feito por folhas impressas, e não por páginas.
          <br />
          As apostilas são confeccionadas com capa transparente e contracapa preta.
        </div>
      </div>

      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>1. Quantidade de folhas</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 30 }}>
        {FOLHA_RANGES.map((r) => (
          <button key={r.id} className={"chip" + (rangeId === r.id ? " active" : "")} onClick={() => setRangeId(r.id)}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 4 }}>
              a partir de {formatBRL(r.pb)}
            </div>
          </button>
        ))}
      </div>

      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>2. Tipo de impressão</h3>
      <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
        <button className={"toggle-btn" + (tipo === "pb" ? " active" : "")} onClick={() => setTipo("pb")}>Preto e branco</button>
        <button className={"toggle-btn" + (tipo === "color" ? " active" : "")} onClick={() => setTipo("color")}>Colorido</button>
      </div>

      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>3. Observações (opcional)</h3>
      <textarea
        className="field-input" rows={3} placeholder="Ex: encadernação, ordem das folhas, prazo desejado..."
        value={obs} onChange={(e) => setObs(e.target.value)} style={{ marginBottom: 30, resize: "vertical" }}
      />

      <div className="sticker-card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-soft)" }}>Valor calculado</div>
          <div className="font-display" style={{ fontSize: 30, fontWeight: 800 }}>{price ? formatBRL(price) : "—"}</div>
        </div>
        <button className="btn-primary" disabled={!range} onClick={handleAdd}>
          <ShoppingCart size={18} /> Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ADESIVOS PAGE (personalizados + prontos)
------------------------------------------------------------------*/

function FileUploadField({ file, setFile, hint }) {
  const inputRef = useRef(null);
  return (
    <div>
      <input
        ref={inputRef} type="file" accept="image/*,.pdf,.ai,.psd,.eps,.doc,.docx"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
      />
      <button
        type="button" className="btn-outline-ink" onClick={() => inputRef.current && inputRef.current.click()}
        style={{ width: "100%", justifyContent: "center" }}
      >
        <Upload size={18} /> {file ? "Trocar arquivo" : "Enviar arte (imagem ou documento)"}
      </button>
      {file && (
        <div style={{ marginTop: 8, fontSize: 13, color: "var(--teal-dark)", display: "flex", alignItems: "center", gap: 6 }}>
          <CheckCircle2 size={15} /> {file.name} selecionado
        </div>
      )}
      {hint && <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--text-soft)" }}>{hint}</div>}
    </div>
  );
}

function AdesivoPersonalizado({ addToCart }) {
  const [sizeId, setSizeId] = useState(null);
  const [material, setMaterial] = useState("branco");
  const [formato, setFormato] = useState("redondo");
  const [qty, setQty] = useState(1);
  const [file, setFile] = useState(null);
  const [obs, setObs] = useState("");

  const size = STICKER_SIZES.find((s) => s.id === sizeId);
  const price = size ? size.price * qty : null;

  function handleAdd() {
    if (!size) return;
    addToCart({
      type: "Adesivo personalizado",
      title: "Adesivo personalizado",
      meta: `${size.label} · ${material === "branco" ? "Vinil branco" : "Vinil transparente"} · formato ${formato === "redondo" ? "redondo" : formato === "quadrado" ? "quadrado" : "de acordo com a arte"}${file ? " · arte: " + file.name : ""}${obs ? " · obs: " + obs : ""}`,
      unitPrice: size.price,
      qty,
    });
    setQty(1); setObs("");
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: "var(--text-soft)", lineHeight: 1.7, marginBottom: 28, maxWidth: 620 }}>
        Adesivos de vinil branco ou transparente, à prova d'água, produzidos de acordo com a arte escolhida pelo cliente.
      </p>

      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>1. Tamanho</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12, marginBottom: 28 }}>
        {STICKER_SIZES.map((s) => (
          <button key={s.id} className={"chip" + (sizeId === s.id ? " active" : "")} onClick={() => setSizeId(s.id)}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 4 }}>{formatBRL(s.price)}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }} className="two-col">
        <div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>2. Material</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <button className={"toggle-btn" + (material === "branco" ? " active" : "")} onClick={() => setMaterial("branco")}>Vinil branco</button>
            <button className={"toggle-btn" + (material === "transparente" ? " active" : "")} onClick={() => setMaterial("transparente")}>Vinil transparente</button>
          </div>
        </div>
        <div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>3. Formato</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[["redondo", "Redondo"], ["quadrado", "Quadrado"], ["arte", "De acordo com a arte"]].map(([id, label]) => (
              <button key={id} className={"toggle-btn" + (formato === id ? " active" : "")} onClick={() => setFormato(id)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>4. Envie sua arte</h3>
      <div style={{ maxWidth: 420, marginBottom: 12 }}>
        <FileUploadField file={file} setFile={setFile} />
      </div>
      <div className="receipt" style={{ padding: "14px 18px", fontSize: 13, lineHeight: 1.7, marginBottom: 28, maxWidth: 620 }}>
        Após realizar o pedido, todas as informações e detalhes da arte serão confirmados pelo WhatsApp. Tenha em mãos o número do seu pedido.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 28, marginBottom: 28, alignItems: "start" }} className="two-col">
        <div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>Observações (opcional)</h3>
          <textarea className="field-input" rows={3} placeholder="Detalhes sobre a arte, cores, prazo..." value={obs} onChange={(e) => setObs(e.target.value)} style={{ resize: "vertical" }} />
        </div>
        <div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>Quantidade</h3>
          <QtyStepper qty={qty} setQty={setQty} />
        </div>
      </div>

      <div className="sticker-card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-soft)" }}>Valor calculado</div>
          <div className="font-display" style={{ fontSize: 30, fontWeight: 800 }}>{price ? formatBRL(price) : "—"}</div>
        </div>
        <button className="btn-primary" disabled={!size} onClick={handleAdd}>
          <ShoppingCart size={18} /> Adicionar ao carrinho
        </button>
      </div>

      <style>{`@media (max-width:640px){ .two-col{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

function QtyStepper({ qty, setQty }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, border: "2px solid rgba(22,33,62,0.15)", borderRadius: 999, padding: "6px 10px", width: "fit-content" }}>
      <button aria-label="Diminuir" style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }} onClick={() => setQty(Math.max(1, qty - 1))}>
        <Minus size={16} />
      </button>
      <span style={{ minWidth: 22, textAlign: "center", fontWeight: 600 }}>{qty}</span>
      <button aria-label="Aumentar" style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }} onClick={() => setQty(qty + 1)}>
        <Plus size={16} />
      </button>
    </div>
  );
}

function ThemeChips({ themes, selected, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 26 }}>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={"toggle-btn" + (selected === t.id ? " active" : "")}
          style={{ flexShrink: 0, whiteSpace: "nowrap" }}
        >
          <span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}
        </button>
      ))}
    </div>
  );
}

function ReadyStickerCard({ product, addToCart }) {
  const [sizeId, setSizeId] = useState("5x5");
  const [qty, setQty] = useState(1);
  const size = STICKER_SIZES.find((s) => s.id === sizeId);

  return (
    <div className="sticker-card" style={{ padding: 20 }}>
      <div style={{ fontSize: 40, textAlign: "center", background: "var(--paper-alt)", borderRadius: 14, padding: "22px 0", marginBottom: 14 }}>
        {product.icon}
      </div>
      <div className="font-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{product.name}</div>
      <select className="field-input" value={sizeId} onChange={(e) => setSizeId(e.target.value)} style={{ marginBottom: 10, fontSize: 13, padding: "8px 10px" }}>
        {STICKER_SIZES.map((s) => (
          <option key={s.id} value={s.id}>{s.label} — {formatBRL(s.price)}</option>
        ))}
      </select>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <QtyStepper qty={qty} setQty={setQty} />
        <div className="font-display" style={{ fontWeight: 800 }}>{formatBRL(size.price * qty)}</div>
      </div>
      <button
        className="btn-primary" style={{ width: "100%", justifyContent: "center" }}
        onClick={() => { addToCart({ type: "Adesivo pronto", title: product.name, meta: `${size.label}`, unitPrice: size.price, qty }); setQty(1); }}
      >
        Comprar
      </button>
    </div>
  );
}

function AdesivosProntos({ addToCart }) {
  const [theme, setTheme] = useState(THEMES[0].id);
  const products = STICKER_CATALOG.filter((p) => p.themeId === theme);
  return (
    <div>
      <p style={{ fontSize: 14, color: "var(--text-soft)", lineHeight: 1.7, marginBottom: 24, maxWidth: 620 }}>
        Artes já prontas — escolha o tema, o tamanho e a quantidade. Não é necessário enviar arquivo.
      </p>
      <ThemeChips themes={THEMES} selected={theme} onSelect={setTheme} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 18 }}>
        {products.map((p) => <ReadyStickerCard key={p.id} product={p} addToCart={addToCart} />)}
      </div>
      <div className="receipt" style={{ padding: "14px 18px", fontSize: 13, marginTop: 28 }}>
        Novos modelos e temas são adicionados regularmente pela nossa equipe.
      </div>
    </div>
  );
}

function AdesivosPage({ addToCart }) {
  const [tab, setTab] = useState("personalizar");
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 20px 100px" }}>
      <PageHeader
        tagClass="tag-adesivo" tagLabel="adesivos"
        title="Adesivos personalizados"
        desc="Envie sua própria arte ou escolha entre dezenas de adesivos prontos, organizados por tema."
      />
      <TabSwitch
        tabs={[["personalizar", "Personalize sua arte"], ["prontos", "Adesivos prontos"]]}
        active={tab} onChange={setTab}
      />
      {tab === "personalizar" ? <AdesivoPersonalizado addToCart={addToCart} /> : <AdesivosProntos addToCart={addToCart} />}
    </div>
  );
}

function TabSwitch({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 34, borderBottom: "2px solid rgba(22,33,62,0.1)" }}>
      {tabs.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Inter',sans-serif",
            fontSize: 15, padding: "10px 4px", marginRight: 20, borderBottom: active === id ? "3px solid var(--coral)" : "3px solid transparent",
            color: active === id ? "var(--ink)" : "var(--text-soft)",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   CANECAS PAGE (personalizada + prontas)
------------------------------------------------------------------*/

function CanecaPersonalizada({ addToCart }) {
  const [file, setFile] = useState(null);
  const [qty, setQty] = useState(1);
  const [obs, setObs] = useState("");
  const price = MUG_PRICE_PERSONALIZADA * qty;

  function handleAdd() {
    addToCart({
      type: "Caneca personalizada",
      title: "Caneca personalizada 325 ml",
      meta: `${file ? "arte: " + file.name : "arte a confirmar pelo WhatsApp"}${obs ? " · obs: " + obs : ""}`,
      unitPrice: MUG_PRICE_PERSONALIZADA,
      qty,
    });
    setQty(1); setObs("");
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: "var(--text-soft)", lineHeight: 1.7, marginBottom: 28, maxWidth: 620 }}>
        Caneca redonda de 325 ml personalizada com foto, logo, nome, frase ou a arte que você quiser.
      </p>

      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>1. Envie sua arte</h3>
      <div style={{ maxWidth: 420, marginBottom: 12 }}>
        <FileUploadField file={file} setFile={setFile} hint="Para melhor resultado na impressão, envie sua arte no tamanho de 21 x 9,5 cm." />
      </div>
      <div className="receipt" style={{ padding: "14px 18px", fontSize: 13, lineHeight: 1.7, marginBottom: 28, maxWidth: 620 }}>
        Após o pedido, todas as informações e detalhes da personalização serão confirmados pelo WhatsApp, usando o número do seu pedido.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 28, marginBottom: 28, alignItems: "start" }} className="two-col">
        <div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>Observações (opcional)</h3>
          <textarea className="field-input" rows={3} placeholder="Cores, posição da arte, prazo..." value={obs} onChange={(e) => setObs(e.target.value)} style={{ resize: "vertical" }} />
        </div>
        <div>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>Quantidade</h3>
          <QtyStepper qty={qty} setQty={setQty} />
        </div>
      </div>

      <div className="sticker-card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-soft)" }}>Valor calculado</div>
          <div className="font-display" style={{ fontSize: 30, fontWeight: 800 }}>{formatBRL(price)}</div>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <ShoppingCart size={18} /> Adicionar ao carrinho
        </button>
      </div>
      <style>{`@media (max-width:640px){ .two-col{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

function ReadyMugCard({ product, addToCart }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="sticker-card" style={{ padding: 20 }}>
      <div style={{ fontSize: 40, textAlign: "center", background: "var(--paper-alt)", borderRadius: 14, padding: "22px 0", marginBottom: 14 }}>
        {product.icon}
      </div>
      <div className="font-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{product.name}</div>
      <div style={{ fontSize: 13, color: "var(--text-soft)", marginBottom: 12 }}>Caneca redonda, 325 ml</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <QtyStepper qty={qty} setQty={setQty} />
        <div className="font-display" style={{ fontWeight: 800 }}>{formatBRL(MUG_PRICE_PRONTA * qty)}</div>
      </div>
      <button
        className="btn-primary" style={{ width: "100%", justifyContent: "center" }}
        onClick={() => { addToCart({ type: "Caneca pronta", title: product.name, meta: "modelo pronto", unitPrice: MUG_PRICE_PRONTA, qty }); setQty(1); }}
      >
        Comprar
      </button>
    </div>
  );
}

function CanecasProntas({ addToCart }) {
  const [theme, setTheme] = useState(THEMES[0].id);
  const products = MUG_CATALOG.filter((p) => p.themeId === theme);
  return (
    <div>
      <p style={{ fontSize: 14, color: "var(--text-soft)", lineHeight: 1.7, marginBottom: 24, maxWidth: 620 }}>
        Canecas com temas prontos — escolha o modelo e a quantidade. Esta seção está preparada para receber novos modelos.
      </p>
      <ThemeChips themes={THEMES} selected={theme} onSelect={setTheme} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 18 }}>
        {products.map((p) => <ReadyMugCard key={p.id} product={p} addToCart={addToCart} />)}
      </div>
    </div>
  );
}

function CanecasPage({ addToCart }) {
  const [tab, setTab] = useState("personalizar");
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 20px 100px" }}>
      <PageHeader
        tagClass="tag-caneca" tagLabel="canecas"
        title="Canecas personalizadas"
        desc="Canecas redondas de 325 ml: envie sua arte ou escolha um modelo pronto por tema."
      />
      <TabSwitch
        tabs={[["personalizar", "Personalize sua caneca"], ["prontas", "Canecas prontas"]]}
        active={tab} onChange={setTab}
      />
      {tab === "personalizar" ? <CanecaPersonalizada addToCart={addToCart} /> : <CanecasProntas addToCart={addToCart} />}
    </div>
  );
}

/* ---------------------------------------------------------------
   CARRINHO
------------------------------------------------------------------*/

function Carrinho({ cart, updateQty, removeItem, go }) {
  const total = cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <ShoppingCart size={44} color="var(--text-soft)" />
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: "18px 0 8px" }}>Seu carrinho está vazio</h2>
        <p style={{ color: "var(--text-soft)", marginBottom: 24 }}>Adicione adesivos, apostilas ou canecas para continuar.</p>
        <button className="btn-primary" onClick={() => go("adesivos")}>Ver produtos <ArrowRight size={18} /></button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 20px 100px" }}>
      <h1 className="font-display" style={{ fontSize: 30, fontWeight: 800, marginBottom: 30 }}>Seu carrinho</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
        {cart.map((item) => (
          <div key={item.cartId} className="sticker-card" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12, color: "var(--text-soft)", marginBottom: 3 }}>{item.type}</div>
              <div className="font-display" style={{ fontWeight: 700 }}>{item.title}</div>
              {item.meta && <div style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 4 }}>{item.meta}</div>}
              <div style={{ fontSize: 13, marginTop: 6 }}>{formatBRL(item.unitPrice)} / un.</div>
            </div>
            <QtyStepper qty={item.qty} setQty={(q) => updateQty(item.cartId, q)} />
            <div className="font-display" style={{ fontWeight: 800, minWidth: 90, textAlign: "right" }}>{formatBRL(item.unitPrice * item.qty)}</div>
            <button aria-label="Remover" onClick={() => removeItem(item.cartId)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Trash2 size={19} color="var(--coral)" />
            </button>
          </div>
        ))}
      </div>

      <div className="sticker-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 8 }}>
          <span>Subtotal</span><span>{formatBRL(total)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, borderTop: "2px dashed rgba(22,33,62,0.15)", paddingTop: 12, marginTop: 6 }}>
          <span>Total</span><span>{formatBRL(total)}</span>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
          <button className="btn-outline-ink" onClick={() => go("adesivos")}><ArrowLeft size={16} /> Continuar comprando</button>
          <button className="btn-primary" style={{ marginLeft: "auto" }} onClick={() => go("checkout")}>Finalizar pedido <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   CHECKOUT + CONFIRMAÇÃO
------------------------------------------------------------------*/

function Checkout({ cart, onConfirm, go }) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [obs, setObs] = useState("");
  const total = cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const valid = nome.trim() && whatsapp.trim();

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 20px 100px" }}>
      <h1 className="font-display" style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Finalizar pedido</h1>
      <p style={{ color: "var(--text-soft)", marginBottom: 30 }}>Preencha seus dados para gerar o número do pedido.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 30 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Nome completo</label>
          <input className="field-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="two-col">
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>WhatsApp</label>
            <input className="field-input" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>E-mail</label>
            <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Observações gerais / informações para produção</label>
          <textarea className="field-input" rows={3} value={obs} onChange={(e) => setObs(e.target.value)} style={{ resize: "vertical" }} />
        </div>
      </div>

      <div className="sticker-card" style={{ padding: 22, marginBottom: 26 }}>
        <div className="font-display" style={{ fontWeight: 700, marginBottom: 12 }}>Resumo do pedido</div>
        {cart.map((item) => (
          <div key={item.cartId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0" }}>
            <span>{item.qty}x {item.title}</span>
            <span>{formatBRL(item.unitPrice * item.qty)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, borderTop: "2px dashed rgba(22,33,62,0.15)", marginTop: 10, paddingTop: 10 }}>
          <span>Total</span><span>{formatBRL(total)}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <button className="btn-outline-ink" onClick={() => go("carrinho")}><ArrowLeft size={16} /> Voltar ao carrinho</button>
        <button className="btn-primary" disabled={!valid} style={{ marginLeft: "auto" }} onClick={() => onConfirm({ nome, whatsapp, email, obs })}>
          Confirmar pedido <Send size={17} />
        </button>
      </div>
      <style>{`@media (max-width:600px){ .two-col{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

function Confirmacao({ order, go }) {
  if (!order) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "100px 20px", textAlign: "center" }}>
        <p>Nenhum pedido encontrado.</p>
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => go("home")}>Voltar à loja</button>
      </div>
    );
  }

  const message = `Olá! Meu pedido é o ${order.number}. Nome: ${order.nome}. Gostaria de confirmar os detalhes da arte / personalização.`;

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "72px 20px 100px", textAlign: "center" }}>
      <PackageCheck size={46} color="var(--teal)" />
      <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, margin: "16px 0 6px" }}>Pedido realizado com sucesso!</h1>
      <p style={{ color: "var(--text-soft)", marginBottom: 30 }}>Guarde o número abaixo — ele será usado na confirmação pelo WhatsApp.</p>

      <div className="receipt" style={{ padding: "26px 20px", marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "var(--text-soft)", letterSpacing: 0.5 }}>número do pedido</div>
        <div className="font-display" style={{ fontSize: 38, fontWeight: 800, color: "var(--coral)", margin: "6px 0" }}>
          Pedido #{order.number}
        </div>
        <div style={{ fontSize: 14, color: "var(--text-soft)" }}>Total: {formatBRL(order.total)}</div>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-soft)", lineHeight: 1.7, marginBottom: 28 }}>
        Todos os detalhes da personalização e da arte serão confirmados pelo WhatsApp. Toque no botão abaixo — sua mensagem já vem com o número do pedido.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <a className="btn-primary" href={waLink(message)} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} /> Falar com a Etike.Tá pelo WhatsApp
        </a>
        <button className="btn-outline-ink" onClick={() => go("home")}>Voltar à loja</button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ROOT APP
------------------------------------------------------------------*/

export default function EtiketaImpressos() {
  const [page, setPage] = useState("home");
  const [pendingAnchor, setPendingAnchor] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [orderCounter, setOrderCounter] = useState(1);
  const [lastOrder, setLastOrder] = useState(null);
  const toastTimer = useRef(null);

  function showToast(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }

  function go(target, anchor) {
    if (anchor) {
      if (page === "home") {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        setPendingAnchor(anchor);
        setPage("home");
      }
      return;
    }
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (page === "home" && pendingAnchor) {
      const el = document.getElementById(pendingAnchor);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setPendingAnchor(null);
    }
  }, [page, pendingAnchor]);

  function addToCart(item) {
    setCart((prev) => [...prev, { ...item, cartId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }]);
    showToast(`${item.title} adicionado ao carrinho`);
  }

  function updateQty(cartId, qty) {
    setCart((prev) => prev.map((i) => (i.cartId === cartId ? { ...i, qty: Math.max(1, qty) } : i)));
  }

  function removeItem(cartId) {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  }

  function confirmOrder({ nome, whatsapp, email, obs }) {
    const number = `ETK-${String(orderCounter).padStart(4, "0")}`;
    const total = cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
    setLastOrder({ number, nome, whatsapp, email, obs, items: cart, total });
    setOrderCounter((c) => c + 1);
    setCart([]);
    showToast(`Pedido ${number} confirmado`);
    go("confirmacao");
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const homeWaCTA = waLink("Olá! Vim pelo site da Etike.Tá Impressos e gostaria de fazer um pedido.");

  let content;
  if (page === "home") content = <Home go={go} addWaCTA={homeWaCTA} />;
  else if (page === "adesivos") content = <AdesivosPage addToCart={addToCart} />;
  else if (page === "apostilas") content = <Apostilas addToCart={addToCart} />;
  else if (page === "canecas") content = <CanecasPage addToCart={addToCart} />;
  else if (page === "carrinho") content = <Carrinho cart={cart} updateQty={updateQty} removeItem={removeItem} go={go} />;
  else if (page === "checkout") content = cart.length ? <Checkout cart={cart} onConfirm={confirmOrder} go={go} /> : <Carrinho cart={cart} updateQty={updateQty} removeItem={removeItem} go={go} />;
  else if (page === "confirmacao") content = <Confirmacao order={lastOrder} go={go} />;
  else if (page === "contato") {
    content = (
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Fale com a Etike.Tá</h1>
        <p style={{ color: "var(--text-soft)", marginBottom: 26 }}>Estamos por aqui para tirar dúvidas, confirmar artes e acompanhar seu pedido.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <a className="btn-primary" href={homeWaCTA} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp</a>
          <div style={{ fontSize: 14, color: "var(--text-soft)", display: "flex", alignItems: "center", gap: 8 }}><Mail size={16} /> contato@etiketaimpressos.com.br</div>
        </div>
      </div>
    );
  } else content = <Home go={go} addWaCTA={homeWaCTA} />;

  return (
    <div className="etk" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <GlobalStyles />
      <Header page={page} go={go} cartCount={cartCount} />
      <main style={{ flex: 1 }}>{content}</main>
      <Footer go={go} />
      <Toast message={toast} />
    </div>
  );
}
