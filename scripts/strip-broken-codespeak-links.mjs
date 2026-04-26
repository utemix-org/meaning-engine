/**
 * Strip markdown links in docs_for_codespeak that do not resolve to an existing file
 * under the repository root. External URLs unchanged. Link text kept when non-empty;
 * [[n]] footnote refs removed entirely when target missing.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.join(repoRoot, "docs_for_codespeak");

/**
 * @param {string} fromFile
 * @param {string} href
 */
function resolveTarget(fromFile, href) {
  const trimmed = href.trim();
  if (!trimmed) return { skip: true };
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return { skip: true };

  const pathPart = trimmed.split("#")[0];
  let decoded = pathPart;
  try {
    decoded = decodeURIComponent(pathPart.replace(/\+/g, " "));
  } catch {
    decoded = pathPart;
  }
  if (!decoded) return { skip: true };

  const abs = path.normalize(path.resolve(path.dirname(fromFile), decoded));
  const repoN = path.normalize(repoRoot);
  // Windows drive letters may differ in case (R: vs r:).
  if (!abs.toLowerCase().startsWith(repoN.toLowerCase())) return { exists: false, abs };

  const exists = fs.existsSync(abs) && fs.statSync(abs).isFile();
  return { exists, abs };
}

// Footnotes / citation markers: [[1]](url) — must run before single-bracket link pass.
const doubleBracketRe = /\[\[([^\]]+)\]\]\(([^)]+)\)/g;

const linkRe = /\[([^\]]*)\]\(([^)]+)\)/g;

let filesTouched = 0;
let linksRemoved = 0;

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith(".md")) processFile(p);
  }
}

function processFile(fp) {
  let text = fs.readFileSync(fp, "utf8");
  const original = text;

  text = text.replace(doubleBracketRe, (full, label, href) => {
    const r = resolveTarget(fp, href);
    if (r.skip) return full;
    if (r.exists) return full;
    linksRemoved++;
    return "";
  });

  text = text.replace(linkRe, (full, label, href) => {
    const r = resolveTarget(fp, href);
    if (r.skip) return full;
    if (r.exists) return full;
    linksRemoved++;
    if (/^\[\[\d+\]\]$/.test(label)) return "";
    if (!label.trim()) return "";
    return label;
  });

  text = text.replace(/[ \t]{2,}/g, " ");
  text = text.replace(/\s+\./g, ".");
  text = text.replace(/\(\s*\)/g, "");

  if (text !== original) {
    fs.writeFileSync(fp, text, "utf8");
    filesTouched++;
  }
}

walk(root);
console.log(JSON.stringify({ root: root.replace(/\\/g, "/"), filesTouched, linksRemoved }, null, 2));
