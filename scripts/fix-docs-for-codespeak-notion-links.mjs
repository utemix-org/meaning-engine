/**
 * One-off maintainer script: replace Notion page URLs inside docs_for_codespeak/*.md
 * with relative links to mirrored .md where seed.nodes.json + filename match finds them.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.join(repo, "docs_for_codespeak");
const nodesPath = path.join(repo, "worlds", "documentation-world", "seed.nodes.json");

const nodes = JSON.parse(fs.readFileSync(nodesPath, "utf8"));
/** @type {Record<string, string>} */
const titleByUrl = {};
for (const n of nodes) titleByUrl[n.id] = n.title;

/** @type {Record<string, string>} */
const map = {};

function walkCollect(dir, fn, acc) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkCollect(p, fn, acc);
    else if (fn(ent.name)) acc.push(p);
  }
}

for (const n of nodes) {
  const want = `${n.title}.md`;
  const hits = [];
  walkCollect(
    root,
    (name) => name === want,
    hits,
  );
  if (hits.length === 1) map[n.id] = hits[0];
}

const manual = {
  "https://www.notion.so/5a71404eb00941458c78832a43fc5446": path.join(
    root,
    "15 ME Readiness",
    "ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md",
  ),
};
for (const [k, v] of Object.entries(manual)) map[k] = v;

function rel(fromFile, toFile) {
  return path
    .relative(path.dirname(fromFile), toFile)
    .split(path.sep)
    .join("/")
    .replace(/ /g, "%20");
}

// Notion export quirk: closing is `</page>)`, not `)</page>)`.
const brokenPageRe =
  /<page url="\[(https:\/\/www\.notion\.so\/[a-f0-9]+)">([^<]+)<\/page>\]\(https:\/\/www\.notion\.so\/[a-f0-9]+"[^<]*<\/page>\)/gi;

/**
 * @param {string} fp
 */
function processFile(fp) {
  let c = fs.readFileSync(fp, "utf8");
  const orig = c;

  c = c.replace(brokenPageRe, (full, url, label) => {
    const target = map[url];
    if (target && fs.existsSync(target)) return `[${label}](${rel(fp, target)})`;
    return `*${label}* _(нет зеркала в docs_for_codespeak; исходник был в Notion)_`;
  });

  for (const [url, target] of Object.entries(map)) {
    if (!fs.existsSync(target)) continue;
    const tTitle = titleByUrl[url] || path.basename(target, ".md");
    const r = rel(fp, target);
    const esc = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    c = c.replace(new RegExp("`" + esc + "`", "g"), `[${tTitle}](${r})`);
  }

  // Spurious export lines: bare Notion home links mid-document
  c = c.replace(/\[https:\/\/www\.notion\.so\]\(https:\/\/www\.notion\.so\)\s*\n?/g, "");

  if (c !== orig) fs.writeFileSync(fp, c, "utf8");
}

function walkMd(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMd(p);
    else if (ent.name.endsWith(".md")) processFile(p);
  }
}

walkMd(root);
console.log("docs_for_codespeak: Notion URL pass complete");
