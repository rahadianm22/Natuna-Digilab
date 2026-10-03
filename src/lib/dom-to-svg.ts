/**
 * Turns a rendered DOM subtree into SVG that Figma pastes as editable layers: boxes become
 * rounded rectangles, borders become strokes, text stays live text, and inline SVG icons are
 * carried over as vectors. Each element becomes a named group, so the layer tree in Figma
 * mirrors the component's structure.
 *
 * It reads what the browser actually painted (getBoundingClientRect and computed styles), so the
 * export matches the preview in the current theme. Box shadows, images, and gradients are left
 * out; Figma users add effects from the Natuna styles instead.
 */

type Rgba = { hex: string; a: number };

let ctx: CanvasRenderingContext2D | null = null;
const colorCache = new Map<string, Rgba | null>();

/** Any CSS color string (rgb, color(srgb), oklab, color-mix results) to hex plus alpha, via canvas. */
function parseColor(value: string): Rgba | null {
  if (!value || value === "transparent") return null;
  const cached = colorCache.get(value);
  if (cached !== undefined) return cached;
  ctx ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
    willReadFrequently: true,
  });
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  const result = a === 0 ? null : { hex: `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`, a: a / 255 };
  colorCache.set(value, result);
  return result;
}

type Clip = { l: number; t: number; r: number; b: number };

function overlaps(r: DOMRect, c: Clip) {
  return r.right > c.l + 0.5 && r.left < c.r - 0.5 && r.bottom > c.t + 0.5 && r.top < c.b - 0.5;
}

function intersect(c: Clip, r: DOMRect): Clip {
  return { l: Math.max(c.l, r.left), t: Math.max(c.t, r.top), r: Math.min(c.r, r.right), b: Math.min(c.b, r.bottom) };
}

// Figma resolves the first family it has; Urbanist and IBM Plex Mono both ship with Figma's Google Fonts.
const FONT = "Urbanist, sans-serif";
const MONO = "IBM Plex Mono, monospace";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const n = (v: number) => Math.round(v * 100) / 100;

function fill(c: Rgba, opacity: number, attr = "fill") {
  const a = c.a * opacity;
  return `${attr}="${c.hex}"${a < 0.999 ? ` ${attr}-opacity="${n(a)}"` : ""}`;
}

function layerName(el: Element) {
  const label = el.getAttribute("aria-label") || el.getAttribute("data-figma-name");
  if (label) return label;
  const role = el.getAttribute("role");
  const tag = el.tagName.toLowerCase();
  // innerText keeps the spaces between child elements ("Bills Transfers"), textContent runs them together.
  const raw = el instanceof HTMLElement ? el.innerText : (el.textContent ?? "");
  const text = raw.trim().replace(/\s+/g, " ");
  const kinds: Record<string, string> = {
    button: "Button", a: "Link", input: "Input", textarea: "Textarea", select: "Select", label: "Label",
    ul: "List", ol: "List", li: "Item", nav: "Navigation", table: "Table", tr: "Row", th: "Cell", td: "Cell",
    fieldset: "Group", details: "Section", summary: "Header", form: "Form",
  };
  const kind = role ? role[0].toUpperCase() + role.slice(1) : kinds[tag];
  if (kind) return text ? `${kind} / ${text}` : kind;
  // A plain box named after what it holds reads better in the layer list than "Frame 7".
  if (text && el.children.length === 0) return text;
  // Containers are named by their layout, the way a designer would name an auto-layout frame.
  const cs = getComputedStyle(el);
  if (cs.display.includes("grid")) return "Grid";
  if (cs.display.includes("flex")) return cs.flexDirection.startsWith("column") ? "Stack" : "Row";
  return "Frame";
}

// Placeholder ids are numbered in a final pass, so numbering follows document order: parents before
// children, and the first "Item" is "Item", the second "Item 2".
const MARK = "\u0001";

function numberIds(svg: string) {
  // One counter per group, the way Figma's layer list reads: siblings are "Label", "Label 2", while a
  // label in another button starts again at "Label". Groups open a scope; their own name counts in the parent.
  const scopes: Map<string, number>[] = [new Map()];
  const name = (base: string) => {
    const used = scopes[scopes.length - 1];
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return esc(count ? `${base} ${count + 1}` : base);
  };
  const pattern = new RegExp(`<g\\b[^>]*>|</g>|${MARK}([^${MARK}]*)${MARK}`, "g");
  return svg.replace(pattern, (token: string, base?: string) => {
    if (token === "</g>") {
      if (scopes.length > 1) scopes.pop();
      return token;
    }
    if (token.startsWith("<g")) {
      const named = token.replace(new RegExp(`${MARK}([^${MARK}]*)${MARK}`), (_, b: string) => name(b));
      scopes.push(new Map());
      return named;
    }
    return name(base ?? "Layer");
  });
}

/** Points on a circle, with 0 degrees at 3 o'clock and angles growing clockwise, as SVG draws them. */
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [n(cx + r * Math.cos(a)), n(cy + r * Math.sin(a))];
}

export function domToSvg(root: HTMLElement, name = "Natuna component"): string {
  const origin = root.getBoundingClientRect();
  const W = Math.ceil(origin.width);
  const H = Math.ceil(origin.height);

  function id(base: string) {
    let clean = base.replace(/[^\w /&.,:%+-]/g, "").replace(/\s+/g, " ").trim() || "Layer";
    // Long names are cut at a word, never mid-word, so the layer list stays readable.
    if (clean.length > 32) clean = `${clean.slice(0, 32).replace(/\s+\S*$/, "")}…`;
    return `${MARK}${clean}${MARK}`;
  }

  let clipCount = 0;

  /** Dash pattern for a CSS border style, scaled to the border width. */
  function dash(style: string, width: number) {
    if (style === "dashed") return ` stroke-dasharray="${n(width * 3)} ${n(width * 2)}"`;
    if (style === "dotted") return ` stroke-dasharray="${n(width)} ${n(width)}" stroke-linecap="round"`;
    return "";
  }

  /** Rings (box-shadow with no offset and no blur) are outlines; real drop shadows are left to Figma effects. */
  function rings(cs: CSSStyleDeclaration, x: number, y: number, w: number, h: number, rx: number, opacity: number) {
    if (!cs.boxShadow || cs.boxShadow === "none") return "";
    let out = "";
    for (const part of cs.boxShadow.split(/,(?![^(]*\))/)) {
      const color = parseColor(part.match(/(rgba?|color|oklab|oklch)\([^)]*\)|#[0-9a-f]+/i)?.[0] ?? "");
      const nums = (part.replace(/(rgba?|color|oklab|oklch)\([^)]*\)/gi, "").match(/-?[\d.]+px/g) ?? []).map(parseFloat);
      const [ox = 0, oy = 0, blur = 0, spread = 0] = nums;
      if (!color || part.includes("inset") || ox || oy || blur || spread <= 0) continue;
      const half = spread / 2;
      out += `<rect id="${id("Ring")}" x="${n(x - half)}" y="${n(y - half)}" width="${n(w + spread)}" height="${n(h + spread)}"${
        rx ? ` rx="${n(rx + half)}"` : ""
      } fill="none" ${fill(color, opacity, "stroke")} stroke-width="${n(spread)}"/>`;
    }
    return out;
  }

  /** Text from consecutive text nodes of one element (React splits "Clicked {n}" into two), as one layer per line. */
  function textRuns(nodes: Text[], cs: CSSStyleDeclaration, opacity: number, clip: Clip, underline: boolean, label?: string): string {
    if (!nodes.some((t) => t.data.trim())) return "";
    const color = parseColor(cs.color);
    if (!color) return "";
    const size = parseFloat(cs.fontSize);
    const transform = cs.textTransform;
    const tracking = cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing);
    const family = /mono/i.test(cs.fontFamily) ? MONO : FONT;

    // Group words by the line they landed on, so wrapped text keeps its line breaks.
    const lines: { x: number; top: number; h: number; words: string[] }[] = [];
    const range = document.createRange();
    for (const node of nodes) {
      const re = /\S+/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(node.data))) {
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const r = range.getBoundingClientRect();
        if (!r.width || !overlaps(r, clip)) continue;
        const line = lines.find((l) => Math.abs(l.top - r.top) < size * 0.5);
        if (line) line.words.push(m[0]);
        else lines.push({ x: r.left, top: r.top, h: r.height, words: [m[0]] });
      }
    }

    return lines
      .map((l) => {
        let text = l.words.join(" ");
        if (transform === "uppercase") text = text.toUpperCase();
        else if (transform === "capitalize") text = text.replace(/\b\w/g, (c) => c.toUpperCase());
        const baseline = l.top - origin.top + l.h / 2 + size * 0.35;
        return `<text id="${id(label ?? text)}" x="${n(l.x - origin.left)}" y="${n(baseline)}" font-family="${family}" font-size="${n(size)}" font-weight="${cs.fontWeight}"${
          tracking ? ` letter-spacing="${n(tracking)}"` : ""
        }${cs.fontStyle === "italic" ? ' font-style="italic"' : ""}${underline ? ' text-decoration="underline"' : ""} ${fill(color, opacity)} xml:space="preserve">${esc(text)}</text>`;
      })
      .join("");
  }

  function fieldText(el: HTMLInputElement | HTMLTextAreaElement, cs: CSSStyleDeclaration, opacity: number) {
    const value = el.value || el.placeholder;
    if (!value || (el instanceof HTMLInputElement && ["checkbox", "radio", "range"].includes(el.type))) return "";
    const color = parseColor(cs.color);
    if (!color) return "";
    const r = el.getBoundingClientRect();
    const size = parseFloat(cs.fontSize);
    const x = r.left - origin.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
    const y = el instanceof HTMLTextAreaElement
      ? r.top - origin.top + parseFloat(cs.paddingTop) + size
      : r.top - origin.top + r.height / 2 + size * 0.35;
    const shown = el.value ? 1 : 0.6;
    return `<text id="${id(el.value ? "Value" : "Placeholder")}" x="${n(x)}" y="${n(y)}" font-family="${FONT}" font-size="${n(size)}" font-weight="${cs.fontWeight}" ${fill(color, opacity * shown)}>${esc(value)}</text>`;
  }

  function icon(svg: SVGSVGElement, opacity: number) {
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return "";
    const cs = getComputedStyle(svg);
    const color = parseColor(cs.color);
    // The bounding box of a rotated icon is not its layout box, so place it by its own size around the
    // painted center, then apply the rotation (a chevron turned 180deg when its section is open).
    const w = parseFloat(cs.width) || r.width;
    const h = parseFloat(cs.height) || r.height;
    const cx = r.left - origin.left + r.width / 2;
    const cy = r.top - origin.top + r.height / 2;
    // Tailwind 4 rotates with the individual `rotate` property; older code uses `transform`. Read both.
    let angle = 0;
    if (cs.rotate && cs.rotate !== "none") angle += parseFloat(cs.rotate) || 0;
    if (cs.transform && cs.transform !== "none") {
      const m = cs.transform.match(/matrix\(([^)]+)\)/)?.[1].split(",").map(Number);
      if (m) angle += Math.round((Math.atan2(m[1], m[0]) * 180) / Math.PI);
    }
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.removeAttribute("class");
    clone.removeAttribute("aria-hidden");
    clone.removeAttribute("style");
    clone.setAttribute("x", String(n(cx - w / 2)));
    clone.setAttribute("y", String(n(cy - h / 2)));
    clone.setAttribute("width", String(n(w)));
    clone.setAttribute("height", String(n(h)));
    if (!clone.getAttribute("viewBox")) clone.setAttribute("viewBox", `0 0 ${n(w)} ${n(h)}`);
    // A plain token stands in for the id: XMLSerializer would escape the numbering marker.
    clone.setAttribute("id", "natuna-icon-id");
    if (opacity < 1) clone.setAttribute("opacity", String(n(opacity)));
    const markup = new XMLSerializer()
      .serializeToString(clone)
      .replace(/currentColor/g, color?.hex ?? "#000000")
      .replace('id="natuna-icon-id"', `id="${id("Icon")}"`);
    return angle ? `<g id="${id("Icon rotated")}" transform="rotate(${angle} ${n(cx)} ${n(cy)})">${markup}</g>` : markup;
  }

  function box(el: Element, cs: CSSStyleDeclaration, opacity: number) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return "";
    // A rotating element (a spinner mid-turn) has a bounding box larger than itself. Use the layout size,
    // centered where the browser painted it.
    const w = n(el instanceof HTMLElement && el.offsetWidth ? el.offsetWidth : r.width);
    const h = n(el instanceof HTMLElement && el.offsetHeight ? el.offsetHeight : r.height);
    const x = n(r.left - origin.left + (r.width - w) / 2);
    const y = n(r.top - origin.top + (r.height - h) / 2);
    const rx = n(Math.min(parseFloat(cs.borderTopLeftRadius) || 0, Math.min(w, h) / 2));
    let out = "";

    const bg = parseColor(cs.backgroundColor);
    const widths = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map(parseFloat);
    const colors = [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor].map(parseColor);
    const styles = [cs.borderTopStyle, cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle];
    const visible = widths.map((bw, i) => bw > 0 && colors[i] && styles[i] !== "none");
    const uniform = visible.every(Boolean) && widths.every((bw) => bw === widths[0]) && colors.every((c) => c?.hex === colors[0]?.hex);

    const round = Math.abs(w - h) < 1 && rx >= w / 2 - 0.5;

    if (bg || uniform) {
      const stroke = uniform && colors[0] ? ` ${fill(colors[0], opacity, "stroke")} stroke-width="${widths[0]}"${dash(styles[0], widths[0])}` : "";
      const inset = uniform ? widths[0] / 2 : 0;
      out += `<rect id="${id(uniform && !bg ? "Border" : "Background")}" x="${n(x + inset)}" y="${n(y + inset)}" width="${n(w - inset * 2)}" height="${n(h - inset * 2)}"${rx ? ` rx="${n(Math.max(rx - inset, 0))}"` : ""} ${bg ? fill(bg, opacity) : 'fill="none"'}${stroke}/>`;
    }
    if (!uniform && round && visible.some(Boolean)) {
      // A circle whose sides differ, such as a spinner with one transparent side: one quarter arc per side.
      // CSS sides are centered on top 270deg, right 0deg, bottom 90deg, left 180deg.
      const bw = Math.max(...widths);
      const radius = w / 2 - bw / 2;
      const cx = x + w / 2;
      const cy = y + h / 2;
      [270, 0, 90, 180].forEach((center, i) => {
        if (!visible[i]) return;
        const [x1, y1] = polar(cx, cy, radius, center - 45);
        const [x2, y2] = polar(cx, cy, radius, center + 45);
        out += `<path id="${id("Arc")}" d="M ${x1} ${y1} A ${n(radius)} ${n(radius)} 0 0 1 ${x2} ${y2}" fill="none" ${fill(colors[i]!, opacity, "stroke")} stroke-width="${widths[i]}"/>`;
      });
    } else if (!uniform) {
      // Single-side borders, such as dividers and tab underlines, become lines centered in the border.
      const sides = [
        [x, y + widths[0] / 2, x + w, y + widths[0] / 2],
        [x + w - widths[1] / 2, y, x + w - widths[1] / 2, y + h],
        [x, y + h - widths[2] / 2, x + w, y + h - widths[2] / 2],
        [x + widths[3] / 2, y, x + widths[3] / 2, y + h],
      ];
      sides.forEach(([x1, y1, x2, y2], i) => {
        if (!visible[i]) return;
        out += `<line id="${id("Border")}" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" ${fill(colors[i]!, opacity, "stroke")} stroke-width="${widths[i]}"${dash(styles[i], widths[i])}/>`;
      });
    }
    return out + rings(cs, x, y, w, h, rx, opacity);
  }

  function walk(el: Element, parentOpacity: number, parentClip: Clip, parentUnderline = false): string {
    const cs = getComputedStyle(el);
    // checkVisibility also catches content inside a closed <details>, which keeps its own styles. It reports
    // display: contents wrappers (a Button's label span) as invisible, though their children paint, so skip those.
    if (cs.display !== "contents" && el.checkVisibility && !el.checkVisibility({ visibilityProperty: true })) return "";
    if (cs.display === "none" || cs.visibility === "hidden") return "";
    const opacity = parentOpacity * parseFloat(cs.opacity || "1");
    if (opacity <= 0.01 || el.classList.contains("sr-only")) return "";
    const rect = el.getBoundingClientRect();
    // Anything scrolled or collapsed out of a clipping ancestor (a closed accordion panel) is not painted.
    if (cs.display !== "contents" && rect.width + rect.height > 0 && !overlaps(rect, parentClip)) return "";
    if (el instanceof SVGSVGElement) return icon(el, opacity);

    const clips = cs.overflowX !== "visible" || cs.overflowY !== "visible";
    const clip = clips ? intersect(parentClip, rect) : parentClip;

    // Underlines are drawn by the ancestor that declares them, so the flag travels down to the text.
    const underline = parentUnderline || cs.textDecorationLine.includes("underline");

    // Reserve the group's name before its children, so numbering runs parent first.
    const own = el === root ? "" : box(el, cs, opacity);
    const leaf = el.children.length === 0;
    let groupName = layerName(el);
    if (groupName === "Frame" && own) groupName = "Container";
    const groupId = el === root ? "" : id(groupName);
    const pieces: string[] = [];
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) pieces.push(fieldText(el, cs, opacity));
    let pending: Text[] = [];
    // Text inside a named box is that box's label; repeating the box name on it reads as "Pending > Pending 2".
    const label = own && leaf ? "Label" : undefined;
    const flush = () => {
      pieces.push(textRuns(pending, cs, opacity, clip, underline, label));
      pending = [];
    };
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) pending.push(child as Text);
      else if (child instanceof Element) {
        flush();
        pieces.push(walk(child, opacity, clip, underline));
      }
    }
    flush();
    let kids = pieces.filter(Boolean);
    if (el === root) return kids.join("");
    if (!own && kids.length === 0) return "";
    // A wrapper that paints nothing and holds one thing adds a layer without adding meaning.
    if (!own && kids.length === 1) return kids[0];

    // A rounded box that clips its content (a drawer scrim inside a rounded frame) clips to its corners.
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    if (clips && radius > 0 && kids.length) {
      const cid = `clip-${++clipCount}`;
      const shape = `<rect x="${n(rect.left - origin.left)}" y="${n(rect.top - origin.top)}" width="${n(rect.width)}" height="${n(rect.height)}" rx="${n(radius)}"/>`;
      kids = [`<clipPath id="${cid}">${shape}</clipPath><g id="${id("Content")}" clip-path="url(#${cid})">${kids.join("")}</g>`];
    }
    return `<g id="${groupId}">${own}${kids.join("")}</g>`;
  }

  // The frame takes the first painted background at or above the root, so the export is never transparent.
  let surface: Rgba | null = null;
  for (let el: Element | null = root; el && !surface; el = el.parentElement) surface = parseColor(getComputedStyle(el).backgroundColor);
  const rootCs = getComputedStyle(root);
  const radius = n(parseFloat(rootCs.borderTopLeftRadius) || 0);
  const frame = `<rect id="${id("Background")}" width="${W}" height="${H}"${radius ? ` rx="${radius}"` : ""} fill="${surface?.hex ?? "#ffffff"}"/>`;

  const full: Clip = { l: origin.left, t: origin.top, r: origin.right, b: origin.bottom };
  const body = `<g id="${id(name)}">${frame}${walk(root, 1, full)}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">${numberIds(body)}</svg>`;
}
