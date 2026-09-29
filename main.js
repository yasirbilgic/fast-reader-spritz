/*
THIS IS A GENERATED FILE
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => FastReaderPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/spritz.ts
function coreWordForOrp(token) {
  const t = token.trim().replace(/[.!?,;:\u2013\u2014\-)"'\]\u00bb]+$/u, "");
  return t.length > 0 ? t : token.trim();
}
function getOrpIndex(word) {
  const len = word.length;
  if (len <= 2)
    return 0;
  if (len <= 5)
    return 1;
  if (len <= 9)
    return 2;
  if (len <= 13)
    return 3;
  return 4;
}
function getOrpIndexForToken(token) {
  const core = coreWordForOrp(token);
  const idx = getOrpIndex(core.length > 0 ? core : token);
  const max = Math.max(0, token.length - 1);
  return Math.min(idx, max);
}
function wordsToReadingTokens(words) {
  return words.map((word) => ({ word }));
}
var PUNCT_END = /[.!?,;:\u2013\u2014\-)"'\]\u00bb]$/;
var STRONG_END = /[.!?]$/;
function punctuationExtraMs(word, baseMs) {
  const w = word.trim();
  if (w.length === 0)
    return 0;
  if (STRONG_END.test(w))
    return baseMs;
  if (PUNCT_END.test(w))
    return Math.round(baseMs * 0.5);
  return 0;
}
function tokenize(text) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized)
    return [];
  const parts = normalized.split(/(\s+)/);
  const out = [];
  for (const p of parts) {
    if (!p)
      continue;
    if (/^\s+$/.test(p))
      continue;
    out.push(p);
  }
  return out;
}
function msPerWord(wpm) {
  const w = Math.max(60, Math.min(1200, wpm));
  return 6e4 / w;
}

// src/markdown-to-plain.ts
function stripFrontmatter(s) {
  return s.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/m, "");
}
function stripGlobalBlocks(s) {
  let t = s.replace(/```[\s\S]*?```/g, " ");
  t = t.replace(/!\[\[([^\]]*)\]\]/g, " ");
  t = t.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
    const pipe = inner.lastIndexOf("|");
    if (pipe >= 0)
      return inner.slice(pipe + 1).trim();
    return inner.trim();
  });
  return t;
}
function markdownToReadingTextInner(s) {
  let t = s.replace(/\r\n/g, "\n");
  t = t.replace(/`([^`]+)`/g, "$1");
  t = t.replace(
    /!\[([^\]]*)\]\([^)]*\)/g,
    (_, alt) => alt.trim() ? `${alt} ` : " "
  );
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  t = t.replace(/<https?:[^>\s]+>/gi, " ");
  t = t.replace(/<[^>\s]+@[^>\s]+>/g, " ");
  t = t.replace(/^\[[^\]]+\]:\s*\S+\s*$/gm, "");
  t = t.replace(/^\[\^[^\]]+\]:\s*.*$/gm, "");
  t = t.replace(/^#{1,6}\s+/gm, "");
  t = t.replace(/^>\s?/gm, "");
  t = t.replace(/^[\t ]*([-*_])(\s*\1){2,}[\t ]*$/gm, " ");
  t = t.replace(/^[\t ]*[-*+]\s+/gm, "");
  t = t.replace(/^[\t ]*\d+\.\s+/gm, "");
  t = t.replace(/\[[ xX]\]\s*/g, "");
  for (let i = 0; i < 3; i++) {
    t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
    t = t.replace(/__([^_]+)__/g, "$1");
    t = t.replace(/\*([^*]+)\*/g, "$1");
    t = t.replace(/_([^_]+)_/g, "$1");
    t = t.replace(/~~([^~]+)~~/g, "$1");
  }
  t = t.replace(/\[\^[^\]]+\]/g, "");
  t = t.replace(/<[^>]+>/g, " ");
  t = t.replace(/^\|.*\|$/gm, (line) => line.replace(/\|/g, " "));
  t = t.replace(/\s+/g, " ").trim();
  return t;
}
function isListItemLine(line) {
  return /^\s*(?:[-*+]\s|\d+\.\s)/.test(line);
}
function stripLeadingCalloutBlocks(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  const n = lines.length;
  while (i < n) {
    while (i < n && lines[i].trim() === "")
      i++;
    if (i >= n)
      break;
    if (!/^\s*>/.test(lines[i]))
      break;
    while (i < n) {
      const L = lines[i];
      if (/^\s*>/.test(L)) {
        i++;
        continue;
      }
      if (L.trim() === "") {
        i++;
        continue;
      }
      break;
    }
  }
  return lines.slice(i).join("\n");
}
function buildLineChunks(lines) {
  const chunks = [];
  let buf = [];
  const flushBuf = () => {
    if (buf.length > 0) {
      chunks.push(buf);
      buf = [];
    }
  };
  for (const line of lines) {
    if (!line.trim()) {
      flushBuf();
      continue;
    }
    if (isListItemLine(line)) {
      flushBuf();
      chunks.push([line]);
    } else {
      if (buf.length === 0)
        buf = [line];
      else
        buf.push(line);
    }
  }
  flushBuf();
  return chunks;
}
function markdownToReadingTokens(source, skipLeadingCallouts = true) {
  let s = source.replace(/\r\n/g, "\n");
  s = stripFrontmatter(s);
  s = stripGlobalBlocks(s);
  if (skipLeadingCallouts) {
    s = stripLeadingCalloutBlocks(s);
  }
  const lines = s.split("\n");
  const chunks = buildLineChunks(lines);
  const tokens = [];
  let anyEmitted = false;
  for (const chunkLines of chunks) {
    const chunkText = chunkLines.join(" ");
    const plain = markdownToReadingTextInner(chunkText);
    const words = tokenize(plain);
    for (let i = 0; i < words.length; i++) {
      tokens.push({
        word: words[i],
        blockStart: anyEmitted && i === 0
      });
    }
    if (words.length > 0)
      anyEmitted = true;
  }
  return tokens;
}

// src/spritz-view.ts
var import_obsidian2 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  wpm: 300,
  wpmStep: 50,
  punctuationDelayMs: 300,
  blockPauseMs: 300,
  fontSizePx: 56,
  showBlockHighlight: true,
  blockHighlightWidthPx: 2,
  orpColor: "#ff3b3b",
  orpTickWidthPx: 2,
  orpTickLengthEm: 0.42,
  orpTickGapEm: 0.1,
  skipLeadingCallouts: true
};
var ORP_HEX = /^#[0-9A-Fa-f]{6}$/;
function normalizeOrpColor(value) {
  const v = value.trim();
  if (ORP_HEX.test(v))
    return v;
  return "#ff3b3b";
}
function applySpritzAppearanceVars(el, s) {
  el.style.setProperty("--fast-reader-orp", normalizeOrpColor(s.orpColor));
  el.style.setProperty(
    "--fast-reader-orp-tick-width",
    `${Math.min(8, Math.max(1, s.orpTickWidthPx))}px`
  );
  el.style.setProperty(
    "--fast-reader-orp-tick-length",
    `${Math.min(1, Math.max(0.12, s.orpTickLengthEm))}em`
  );
  el.style.setProperty(
    "--fast-reader-orp-tick-gap",
    `${Math.min(0.45, Math.max(0, s.orpTickGapEm))}em`
  );
  el.style.setProperty(
    "--fast-reader-block-border-width",
    `${Math.min(8, Math.max(1, s.blockHighlightWidthPx))}px`
  );
}
var FastReaderSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.previewRoot = null;
    this.plugin = plugin;
  }
  hide() {
    this.plugin.settingsPreviewRedraw = null;
    this.previewRoot = null;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    this.previewRoot = null;
    containerEl.createEl("h2", { text: "Fast Reader (Spritz)" });
    new import_obsidian.Setting(containerEl).setName("Words per minute").setDesc("Default speed when opening the reader (60-1200).").addText(
      (text) => text.setPlaceholder(String(DEFAULT_SETTINGS.wpm)).setValue(String(this.plugin.settings.wpm)).onChange(async (value) => {
        const n = parseInt(value.replace(/\D/g, ""), 10);
        this.plugin.settings.wpm = Number.isFinite(n) ? Math.min(1200, Math.max(60, n)) : DEFAULT_SETTINGS.wpm;
        await this.plugin.saveSettings();
        this.plugin.refreshSpritzViewWpmUi();
      })
    );
    new import_obsidian.Setting(containerEl).setName("WPM step (+/- in reader)").setDesc("How much each speed button changes WPM (10-200).").addText(
      (text) => text.setPlaceholder(String(DEFAULT_SETTINGS.wpmStep)).setValue(String(this.plugin.settings.wpmStep)).onChange(async (value) => {
        const n = parseInt(value.replace(/\D/g, ""), 10);
        this.plugin.settings.wpmStep = Number.isFinite(n) ? Math.min(200, Math.max(10, n)) : DEFAULT_SETTINGS.wpmStep;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Punctuation pause").setDesc("Extra ms after strong punctuation (. ! ?). Half for lighter punctuation.").addText(
      (text) => text.setPlaceholder(String(DEFAULT_SETTINGS.punctuationDelayMs)).setValue(String(this.plugin.settings.punctuationDelayMs)).onChange(async (value) => {
        const n = parseInt(value.replace(/\D/g, ""), 10);
        this.plugin.settings.punctuationDelayMs = Number.isFinite(n) ? Math.min(2e3, Math.max(0, n)) : DEFAULT_SETTINGS.punctuationDelayMs;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("New block pause").setDesc("Extra ms on the first word after a new paragraph or list item.").addText(
      (text) => text.setPlaceholder(String(DEFAULT_SETTINGS.blockPauseMs)).setValue(String(this.plugin.settings.blockPauseMs)).onChange(async (value) => {
        const n = parseInt(value.replace(/\D/g, ""), 10);
        this.plugin.settings.blockPauseMs = Number.isFinite(n) ? Math.min(2e3, Math.max(0, n)) : DEFAULT_SETTINGS.blockPauseMs;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Skip leading callouts").setDesc(
      "When on, blockquote/callout lines (>) at the very start of the note are not read\u2014useful before a Notlar section. Turn off if your note starts with a quote you want to hear."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.skipLeadingCallouts).onChange(async (v) => {
        this.plugin.settings.skipLeadingCallouts = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Font size (px)").setDesc("Word display size in the Spritz pane.").addText(
      (text) => text.setPlaceholder(String(DEFAULT_SETTINGS.fontSizePx)).setValue(String(this.plugin.settings.fontSizePx)).onChange(async (value) => {
        const n = parseInt(value.replace(/\D/g, ""), 10);
        this.plugin.settings.fontSizePx = Number.isFinite(n) ? Math.min(120, Math.max(24, n)) : DEFAULT_SETTINGS.fontSizePx;
        await this.plugin.saveSettings();
        this.plugin.refreshSpritzViewFont();
      })
    );
    containerEl.createEl("h3", { text: "Look and preview" });
    this.buildPreview(containerEl);
    new import_obsidian.Setting(containerEl).setName("Highlight new block").setDesc("When on, the first word of a new paragraph or list item shows a frame highlight.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showBlockHighlight).onChange(async (v) => {
        this.plugin.settings.showBlockHighlight = v;
        await this.plugin.saveSettings();
        this.plugin.refreshSpritzAppearance();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Block frame width (px)").setDesc("Thickness of the inset border when block highlight is on (1-8).").addSlider(
      (slider) => slider.setLimits(1, 8, 1).setValue(this.plugin.settings.blockHighlightWidthPx).setDynamicTooltip().setInstant(true).onChange(async (value) => {
        this.plugin.settings.blockHighlightWidthPx = Math.round(value);
        await this.plugin.saveSettings();
        this.plugin.refreshSpritzAppearance();
      })
    );
    new import_obsidian.Setting(containerEl).setName("ORP marker color").setDesc("Color for the focal letter and its vertical ticks.").addColorPicker(
      (picker) => picker.setValue(this.plugin.settings.orpColor).onChange(async (v) => {
        this.plugin.settings.orpColor = v;
        await this.plugin.saveSettings();
        this.plugin.refreshSpritzAppearance();
      })
    );
    new import_obsidian.Setting(containerEl).setName("ORP tick thickness (px)").setDesc("Width of the red bars above and below the focal letter (1-8).").addSlider(
      (slider) => slider.setLimits(1, 8, 1).setValue(this.plugin.settings.orpTickWidthPx).setDynamicTooltip().setInstant(true).onChange(async (value) => {
        this.plugin.settings.orpTickWidthPx = Math.round(value);
        await this.plugin.saveSettings();
        this.plugin.refreshSpritzAppearance();
      })
    );
    new import_obsidian.Setting(containerEl).setName("ORP tick length (em)").setDesc("How tall each vertical bar is, relative to the word size (0.12-1).").addSlider(
      (slider) => slider.setLimits(0.12, 1, 0.02).setValue(this.plugin.settings.orpTickLengthEm).setDynamicTooltip().setInstant(true).onChange(async (value) => {
        this.plugin.settings.orpTickLengthEm = Math.round(Math.min(1, Math.max(0.12, value)) * 100) / 100;
        await this.plugin.saveSettings();
        this.plugin.refreshSpritzAppearance();
      })
    );
    new import_obsidian.Setting(containerEl).setName("ORP tick gap (em)").setDesc("Space between each bar and the focal letter (0-0.45).").addSlider(
      (slider) => slider.setLimits(0, 0.45, 0.01).setValue(this.plugin.settings.orpTickGapEm).setDynamicTooltip().setInstant(true).onChange(async (value) => {
        this.plugin.settings.orpTickGapEm = Math.round(Math.min(0.45, Math.max(0, value)) * 100) / 100;
        await this.plugin.saveSettings();
        this.plugin.refreshSpritzAppearance();
      })
    );
    this.plugin.settingsPreviewRedraw = () => this.syncPreview();
    this.syncPreview();
  }
  buildPreview(containerEl) {
    const host = containerEl.createDiv({ cls: "fast-reader-spritz-settings-preview-host" });
    host.createEl("div", {
      text: "Sample: new block + focal letter",
      cls: "setting-item-description"
    });
    this.previewRoot = host.createDiv({
      cls: "fast-reader-spritz-preview-root fast-reader-spritz-word-wrap fast-reader-spritz-block-start"
    });
    const row = this.previewRoot.createDiv({ cls: "fast-reader-spritz-word-row" });
    row.style.fontSize = "38px";
    const pivot = row.createDiv({ cls: "fast-reader-spritz-pivot-line" });
    pivot.createSpan({ cls: "fast-reader-spritz-before", text: "an" });
    pivot.createSpan({ cls: "fast-reader-spritz-orp", text: "a" });
    pivot.createSpan({ cls: "fast-reader-spritz-after", text: "lyze" });
  }
  syncPreview() {
    if (!this.previewRoot)
      return;
    applySpritzAppearanceVars(this.previewRoot, this.plugin.settings);
    this.previewRoot.toggleClass(
      "fast-reader-spritz-block-start",
      this.plugin.settings.showBlockHighlight
    );
  }
};

// src/spritz-view.ts
var SPRITZ_VIEW_TYPE = "fast-reader-spritz";
var SpritzView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.tokens = [];
    this.index = 0;
    this.playing = false;
    this.timer = null;
    this.plugin = plugin;
    this.currentFilePath = null;
    this.isHoveringOverWord = false;
  }
  getViewType() {
    return SPRITZ_VIEW_TYPE;
  }
  getDisplayText() {
    return "Spritz reader";
  }
  getIcon() {
    return "glasses";
  }
  async onOpen() {
    const root = this.contentEl;
    root.empty();
    root.addClass("fast-reader-spritz-root");
    const controls = root.createDiv({ cls: "fast-reader-spritz-controls" });
    const speedGroup = controls.createDiv({ cls: "fast-reader-spritz-speed" });
    const slowerBtn = speedGroup.createEl("button", { text: "-" });
    slowerBtn.setAttr("aria-label", "Slower");
    slowerBtn.addEventListener("click", () => this.adjustWpm(-1));
    this.wpmInputEl = speedGroup.createEl("input", { type: "text" });
    this.wpmInputEl.className = "fast-reader-spritz-wpm-input";
    this.wpmInputEl.setAttr("aria-label", "Words per minute");
    this.updateWpmLabel();
    this.wpmInputEl.addEventListener("change", (e) => {
      const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
      if (Number.isFinite(n)) {
        const next = Math.min(1200, Math.max(60, n));
        this.plugin.settings.wpm = next;
        void this.plugin.saveSettings();
        this.updateWpmLabel();
        if (this.playing) {
          this.stopTimer();
          this.scheduleAdvance();
        }
      } else {
        this.updateWpmLabel();
      }
    });
    const fasterBtn = speedGroup.createEl("button", { text: "+" });
    fasterBtn.setAttr("aria-label", "Faster");
    fasterBtn.addEventListener("click", () => this.adjustWpm(1));
    this.wordWrapEl = root.createDiv({ cls: "fast-reader-spritz-word-wrap" });
    this.wordWrapEl.addEventListener("mouseenter", () => {
      if (this.playing) {
        this.isHoveringOverWord = true;
        this.stopTimer();
      }
    });
    this.wordWrapEl.addEventListener("mouseleave", () => {
      if (this.isHoveringOverWord) {
        this.isHoveringOverWord = false;
        if (this.playing) {
          this.scheduleAdvance();
        }
      }
    });
    this.playBtn = this.wordWrapEl.createEl("button", { cls: "fast-reader-spritz-play-btn" });
    this.playBtn.addEventListener("click", () => this.togglePlay());
    this.updatePlayIcon();
    this.wordRowEl = this.wordWrapEl.createDiv({ cls: "fast-reader-spritz-word-row" });
    const leftBtn = this.wordWrapEl.createEl("button", { cls: "fast-reader-spritz-nav-btn fast-reader-spritz-nav-left", text: "<" });
    leftBtn.addEventListener("click", () => this.step(-1));
    const rightBtn = this.wordWrapEl.createEl("button", { cls: "fast-reader-spritz-nav-btn fast-reader-spritz-nav-right", text: ">" });
    rightBtn.addEventListener("click", () => this.step(1));
    this.progressEl = root.createDiv({ cls: "fast-reader-spritz-progress" });
    this.progressEl.setText(this.progressText());
    this.applyFontSize();
    this.applyAppearance();
    this.plugin.registerDomEvent(root, "keydown", (evt) => {
      if (evt.key === " " || evt.code === "Space") {
        evt.preventDefault();
        this.togglePlay();
      } else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        this.step(-1);
      } else if (evt.key === "ArrowRight") {
        evt.preventDefault();
        this.step(1);
      } else if (evt.key === "+" || evt.key === "=") {
        evt.preventDefault();
        evt.stopPropagation();
        this.adjustWpm(1);
      } else if (evt.key === "-" || evt.key === "_") {
        evt.preventDefault();
        evt.stopPropagation();
        this.adjustWpm(-1);
      } else if (evt.key === "Escape") {
        evt.preventDefault();
        void this.leaf.detach();
      }
    });
    root.tabIndex = 0;
    requestAnimationFrame(() => {
      this.syncTabChromeVisibility();
      root.focus();
    });
  }
  async onClose() {
    this.clearTabChromeVisibility();
    this.stopTimer();
    this.contentEl.empty();
  }
  /** Hide Obsidian tab strip when this pane is the only tab in its group (ribbon split). */
  syncTabChromeVisibility() {
    var _a;
    if (!((_a = this.contentEl) == null ? void 0 : _a.isConnected))
      return;
    const tabsRoot = this.contentEl.closest(".workspace-tabs");
    if (!tabsRoot)
      return;
    tabsRoot.removeClass("fast-reader-spritz-hide-tab-bar");
    let n = tabsRoot.querySelectorAll(".workspace-tab-header-tab").length;
    if (n === 0) {
      n = tabsRoot.querySelectorAll(".workspace-tab-container > .workspace-leaf").length;
    }
    if (n === 1) {
      tabsRoot.addClass("fast-reader-spritz-hide-tab-bar");
    }
  }
  clearTabChromeVisibility() {
    var _a;
    const tabsRoot = (_a = this.contentEl) == null ? void 0 : _a.closest(".workspace-tabs");
    tabsRoot == null ? void 0 : tabsRoot.removeClass("fast-reader-spritz-hide-tab-bar");
  }
  setTokens(tokens) {
    this.tokens = tokens;
    this.index = 0;
    this.stopTimer();
    this.playing = false;
    this.updatePlayIcon();
    this.renderWord();
    this.progressEl.setText(this.progressText());
  }
  startPlaying() {
    if (this.tokens.length === 0 || !this.playBtn)
      return;
    if (this.playing)
      return;
    this.playing = true;
    this.updatePlayIcon();
    this.scheduleAdvance();
  }
  applyFontSize() {
    const px = this.plugin.settings.fontSizePx;
    this.wordRowEl.style.fontSize = `${px}px`;
  }
  applyAppearance() {
    applySpritzAppearanceVars(this.contentEl, this.plugin.settings);
    this.renderWord();
  }
  updateWpmLabel() {
    if (this.wpmInputEl) {
      this.wpmInputEl.value = String(this.plugin.settings.wpm);
    }
  }
  adjustWpm(direction) {
    var _a;
    const step = (_a = this.plugin.settings.wpmStep) != null ? _a : 50;
    const delta = direction * step;
    const next = Math.min(1200, Math.max(60, this.plugin.settings.wpm + delta));
    if (next === this.plugin.settings.wpm)
      return;
    this.plugin.settings.wpm = next;
    void this.plugin.saveSettings();
    this.updateWpmLabel();
    if (this.playing) {
      this.stopTimer();
      this.scheduleAdvance();
    }
  }
  progressText() {
    const n = this.tokens.length;
    if (n === 0)
      return "No text";
    return `${this.index + 1} / ${n}`;
  }
  renderWord() {
    var _a, _b, _c;
    this.wordRowEl.empty();
    const showBlock = this.plugin.settings.showBlockHighlight && !!((_a = this.tokens[this.index]) == null ? void 0 : _a.blockStart);
    this.wordWrapEl.toggleClass("fast-reader-spritz-block-start", showBlock);
    if (this.tokens.length === 0) {
      this.wordRowEl.createSpan({ text: "\u2014", cls: "fast-reader-spritz-empty" });
      return;
    }
    const token = (_c = (_b = this.tokens[this.index]) == null ? void 0 : _b.word) != null ? _c : "";
    const orp = getOrpIndexForToken(token);
    const before = token.slice(0, orp);
    const pivot = token.charAt(orp) || "";
    const after = token.slice(orp + 1);
    const pivotLine = this.wordRowEl.createDiv({ cls: "fast-reader-spritz-pivot-line" });
    pivotLine.createSpan({ cls: "fast-reader-spritz-before", text: before });
    const orpEl = pivotLine.createSpan({ cls: "fast-reader-spritz-orp", text: pivot });
    pivotLine.createSpan({ cls: "fast-reader-spritz-after", text: after });
    if (!pivot) {
      orpEl.addClass("fast-reader-spritz-orp--empty");
    }
    pivotLine.addEventListener("click", (e) => e.stopPropagation());
  }
  togglePlay() {
    if (this.tokens.length === 0)
      return;
    this.playing = !this.playing;
    this.updatePlayIcon();
    if (this.playing)
      this.scheduleAdvance();
    else
      this.stopTimer();
  }
  updatePlayIcon() {
    if (this.playing) {
      this.playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="3rem" height="3rem" fill="currentColor"><rect x="5" y="4" width="4" height="16"/><rect x="15" y="4" width="4" height="16"/></svg>';
    } else {
      this.playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="3rem" height="3rem" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>';
    }
  }
  step(delta) {
    if (this.tokens.length === 0)
      return;
    this.index = Math.min(
      this.tokens.length - 1,
      Math.max(0, this.index + delta)
    );
    this.renderWord();
    this.progressEl.setText(this.progressText());
    if (this.playing) {
      this.stopTimer();
      this.scheduleAdvance();
    }
  }
  stopTimer() {
    if (this.timer != null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
  scheduleAdvance() {
    var _a;
    this.stopTimer();
    const tok = this.tokens[this.index];
    const word = (_a = tok == null ? void 0 : tok.word) != null ? _a : "";
    const base = msPerWord(this.plugin.settings.wpm);
    const punct = punctuationExtraMs(
      word,
      this.plugin.settings.punctuationDelayMs
    );
    const blockExtra = (tok == null ? void 0 : tok.blockStart) ? this.plugin.settings.blockPauseMs : 0;
    const delay = base + punct + blockExtra;
    this.timer = window.setTimeout(() => {
      this.timer = null;
      if (!this.playing)
        return;
      if (this.index >= this.tokens.length - 1) {
        this.playing = false;
        this.updatePlayIcon();
        return;
      }
      this.index += 1;
      this.renderWord();
      this.progressEl.setText(this.progressText());
      this.scheduleAdvance();
    }, delay);
  }
};

// src/main.ts
var FastReaderPlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.settingsPreviewRedraw = null;
    /** When true, Spritz reloads from the markdown leaf that becomes active. */
    this.spritzFollowsActiveMarkdown = false;
  }
  async onload() {
    await this.loadSettings();
    this.registerView(SPRITZ_VIEW_TYPE, (leaf) => new SpritzView(leaf, this));
    this.addSettingTab(new FastReaderSettingTab(this.app, this));
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        void this.maybeReloadSpritzFromActiveMarkdownLeaf(leaf);
      })
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        requestAnimationFrame(() => this.refreshSpritzTabChrome());
      })
    );
    this.addRibbonIcon("play", "Spritz: open reader below (click again to close)", () => {
      const open = this.app.workspace.getLeavesOfType(SPRITZ_VIEW_TYPE);
      if (open.length > 0) {
        this.spritzFollowsActiveMarkdown = false;
        this.app.workspace.detachLeavesOfType(SPRITZ_VIEW_TYPE);
        return;
      }
      void this.ribbonOpenSpritzBelow();
    });
    this.addCommand({
      id: "spritz-read-selection",
      name: "Spritz: Read selection",
      editorCallback: (editor) => {
        const text = editor.getSelection().trim();
        if (!text) {
          new import_obsidian3.Notice("Select some text first.");
          return;
        }
        void this.openSpritzWithText(text, true, false);
      }
    });
    this.addCommand({
      id: "spritz-read-note",
      name: "Spritz: Read entire note",
      callback: async () => {
        const file = this.app.workspace.getActiveFile();
        if (!file || file.extension !== "md") {
          new import_obsidian3.Notice("Open a markdown note.");
          return;
        }
        const text = await this.app.vault.read(file);
        if (!text.trim()) {
          new import_obsidian3.Notice("Note is empty.");
          return;
        }
        void this.openSpritzWithText(text, true, true);
      }
    });
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(SPRITZ_VIEW_TYPE);
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  refreshSpritzViewFont() {
    for (const leaf of this.app.workspace.getLeavesOfType(SPRITZ_VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof SpritzView)
        v.applyFontSize();
    }
  }
  refreshSpritzViewWpmUi() {
    for (const leaf of this.app.workspace.getLeavesOfType(SPRITZ_VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof SpritzView)
        v.updateWpmLabel();
    }
  }
  refreshSpritzAppearance() {
    var _a;
    for (const leaf of this.app.workspace.getLeavesOfType(SPRITZ_VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof SpritzView)
        v.applyAppearance();
    }
    (_a = this.settingsPreviewRedraw) == null ? void 0 : _a.call(this);
  }
  /** Re-evaluate whether to hide the tab bar (single-tab groups only). */
  refreshSpritzTabChrome() {
    for (const leaf of this.app.workspace.getLeavesOfType(SPRITZ_VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof SpritzView)
        v.syncTabChromeVisibility();
    }
  }
  async maybeReloadSpritzFromActiveMarkdownLeaf(leaf) {
    if (!this.spritzFollowsActiveMarkdown)
      return;
    if (!(leaf == null ? void 0 : leaf.view) || !(leaf.view instanceof import_obsidian3.MarkdownView))
      return;
    const file = leaf.view.file;
    if (!file || file.extension !== "md")
      return;
    const spritzLeaves = this.app.workspace.getLeavesOfType(SPRITZ_VIEW_TYPE);
    if (spritzLeaves.length === 0)
      return;
    const text = await this.app.vault.read(file);
    if (!text.trim())
      return;
    const tokens = markdownToReadingTokens(
      text,
      this.settings.skipLeadingCallouts
    );
    if (tokens.length === 0)
      return;
    for (const sl of spritzLeaves) {
      const v = sl.view;
      if (v instanceof SpritzView) {
        if (v.currentFilePath === file.path)
          continue;
        v.currentFilePath = file.path;
        v.setTokens(tokens);
      }
    }
  }
  async ribbonOpenSpritzBelow() {
    const mdView = this.app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
    if (!(mdView == null ? void 0 : mdView.file) || mdView.file.extension !== "md") {
      new import_obsidian3.Notice("Focus the markdown note to read, then try again.");
      return;
    }
    const text = await this.app.vault.read(mdView.file);
    if (!text.trim()) {
      new import_obsidian3.Notice("Note is empty.");
      return;
    }
    const tokens = markdownToReadingTokens(
      text,
      this.settings.skipLeadingCallouts
    );
    if (tokens.length === 0) {
      new import_obsidian3.Notice("No words to read.");
      return;
    }
    this.spritzFollowsActiveMarkdown = true;
    const existing = this.app.workspace.getLeavesOfType(SPRITZ_VIEW_TYPE)[0];
    if (existing) {
      await existing.setViewState({
        type: SPRITZ_VIEW_TYPE,
        active: true
      });
      this.app.workspace.revealLeaf(existing);
      const view2 = existing.view;
      if (view2 instanceof SpritzView) {
        view2.setTokens(tokens);
        this.app.workspace.setActiveLeaf(existing, { focus: true });
        view2.contentEl.focus();
      }
      return;
    }
    const splitLeaf = this.app.workspace.createLeafBySplit(
      mdView.leaf,
      "horizontal",
      false
    );
    await splitLeaf.setViewState({
      type: SPRITZ_VIEW_TYPE,
      active: true
    });
    const view = splitLeaf.view;
    if (view instanceof SpritzView) {
      view.setTokens(tokens);
      this.app.workspace.setActiveLeaf(splitLeaf, { focus: true });
      view.contentEl.focus();
    }
  }
  async openSpritzWithText(raw, stripMarkdown, followActiveMarkdown) {
    var _a;
    this.spritzFollowsActiveMarkdown = followActiveMarkdown;
    let tokens;
    if (stripMarkdown) {
      tokens = markdownToReadingTokens(
        raw,
        this.settings.skipLeadingCallouts
      );
    } else {
      const plain = raw.replace(/\r\n/g, "\n").trim();
      tokens = wordsToReadingTokens(tokenize(plain));
    }
    if (tokens.length === 0) {
      new import_obsidian3.Notice("No words to read.");
      return;
    }
    let leaf = this.app.workspace.getLeavesOfType(SPRITZ_VIEW_TYPE)[0];
    if (!leaf) {
      leaf = (_a = this.app.workspace.getRightLeaf(false)) != null ? _a : this.app.workspace.getLeaf("tab");
      await leaf.setViewState({
        type: SPRITZ_VIEW_TYPE,
        active: true
      });
    } else {
      this.app.workspace.revealLeaf(leaf);
    }
    const view = leaf.view;
    if (view instanceof SpritzView) {
      view.setTokens(tokens);
      this.app.workspace.setActiveLeaf(leaf, { focus: true });
      view.contentEl.focus();
    }
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL3Nwcml0ei50cyIsICJzcmMvbWFya2Rvd24tdG8tcGxhaW4udHMiLCAic3JjL3Nwcml0ei12aWV3LnRzIiwgInNyYy9zZXR0aW5ncy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHtcblx0RWRpdG9yLFxuXHRNYXJrZG93blZpZXcsXG5cdE5vdGljZSxcblx0UGx1Z2luLFxuXHRXb3Jrc3BhY2VMZWFmLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IG1hcmtkb3duVG9SZWFkaW5nVG9rZW5zIH0gZnJvbSBcIi4vbWFya2Rvd24tdG8tcGxhaW5cIjtcbmltcG9ydCB7IFNQUklUWl9WSUVXX1RZUEUsIFNwcml0elZpZXcgfSBmcm9tIFwiLi9zcHJpdHotdmlld1wiO1xuaW1wb3J0IHsgdG9rZW5pemUsIHdvcmRzVG9SZWFkaW5nVG9rZW5zLCB0eXBlIFJlYWRpbmdUb2tlbiB9IGZyb20gXCIuL3Nwcml0elwiO1xuaW1wb3J0IHtcblx0REVGQVVMVF9TRVRUSU5HUyxcblx0RmFzdFJlYWRlclNldHRpbmdUYWIsXG5cdHR5cGUgRmFzdFJlYWRlclNldHRpbmdzLFxufSBmcm9tIFwiLi9zZXR0aW5nc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYXN0UmVhZGVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcblx0c2V0dGluZ3M6IEZhc3RSZWFkZXJTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuXHRzZXR0aW5nc1ByZXZpZXdSZWRyYXc6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXHQvKiogV2hlbiB0cnVlLCBTcHJpdHogcmVsb2FkcyBmcm9tIHRoZSBtYXJrZG93biBsZWFmIHRoYXQgYmVjb21lcyBhY3RpdmUuICovXG5cdHByaXZhdGUgc3ByaXR6Rm9sbG93c0FjdGl2ZU1hcmtkb3duID0gZmFsc2U7XG5cblx0YXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG5cblx0XHR0aGlzLnJlZ2lzdGVyVmlldyhTUFJJVFpfVklFV19UWVBFLCAobGVhZikgPT4gbmV3IFNwcml0elZpZXcobGVhZiwgdGhpcykpO1xuXG5cdFx0dGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBGYXN0UmVhZGVyU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG5cdFx0dGhpcy5yZWdpc3RlckV2ZW50KFxuXHRcdFx0dGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsIChsZWFmKSA9PiB7XG5cdFx0XHRcdHZvaWQgdGhpcy5tYXliZVJlbG9hZFNwcml0ekZyb21BY3RpdmVNYXJrZG93bkxlYWYobGVhZik7XG5cdFx0XHR9KVxuXHRcdCk7XG5cblx0XHR0aGlzLnJlZ2lzdGVyRXZlbnQoXG5cdFx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHtcblx0XHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMucmVmcmVzaFNwcml0elRhYkNocm9tZSgpKTtcblx0XHRcdH0pXG5cdFx0KTtcblxuXHRcdHRoaXMuYWRkUmliYm9uSWNvbihcInBsYXlcIiwgXCJTcHJpdHo6IG9wZW4gcmVhZGVyIGJlbG93IChjbGljayBhZ2FpbiB0byBjbG9zZSlcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgb3BlbiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoU1BSSVRaX1ZJRVdfVFlQRSk7XG5cdFx0XHRpZiAob3Blbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHRoaXMuc3ByaXR6Rm9sbG93c0FjdGl2ZU1hcmtkb3duID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5kZXRhY2hMZWF2ZXNPZlR5cGUoU1BSSVRaX1ZJRVdfVFlQRSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZvaWQgdGhpcy5yaWJib25PcGVuU3ByaXR6QmVsb3coKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XG5cdFx0XHRpZDogXCJzcHJpdHotcmVhZC1zZWxlY3Rpb25cIixcblx0XHRcdG5hbWU6IFwiU3ByaXR6OiBSZWFkIHNlbGVjdGlvblwiLFxuXHRcdFx0ZWRpdG9yQ2FsbGJhY2s6IChlZGl0b3I6IEVkaXRvcikgPT4ge1xuXHRcdFx0XHRjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFNlbGVjdGlvbigpLnRyaW0oKTtcblx0XHRcdFx0aWYgKCF0ZXh0KSB7XG5cdFx0XHRcdFx0bmV3IE5vdGljZShcIlNlbGVjdCBzb21lIHRleHQgZmlyc3QuXCIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2b2lkIHRoaXMub3BlblNwcml0eldpdGhUZXh0KHRleHQsIHRydWUsIGZhbHNlKTtcblx0XHRcdH0sXG5cdFx0fSk7XG5cblx0XHR0aGlzLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6IFwic3ByaXR6LXJlYWQtbm90ZVwiLFxuXHRcdFx0bmFtZTogXCJTcHJpdHo6IFJlYWQgZW50aXJlIG5vdGVcIixcblx0XHRcdGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuXHRcdFx0XHRpZiAoIWZpbGUgfHwgZmlsZS5leHRlbnNpb24gIT09IFwibWRcIikge1xuXHRcdFx0XHRcdG5ldyBOb3RpY2UoXCJPcGVuIGEgbWFya2Rvd24gbm90ZS5cIik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHRleHQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xuXHRcdFx0XHRpZiAoIXRleHQudHJpbSgpKSB7XG5cdFx0XHRcdFx0bmV3IE5vdGljZShcIk5vdGUgaXMgZW1wdHkuXCIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2b2lkIHRoaXMub3BlblNwcml0eldpdGhUZXh0KHRleHQsIHRydWUsIHRydWUpO1xuXHRcdFx0fSxcblx0XHR9KTtcblx0fVxuXG5cdG9udW5sb2FkKCk6IHZvaWQge1xuXHRcdHRoaXMuYXBwLndvcmtzcGFjZS5kZXRhY2hMZWF2ZXNPZlR5cGUoU1BSSVRaX1ZJRVdfVFlQRSk7XG5cdH1cblxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oXG5cdFx0XHR7fSxcblx0XHRcdERFRkFVTFRfU0VUVElOR1MsXG5cdFx0XHRhd2FpdCB0aGlzLmxvYWREYXRhKClcblx0XHQpIGFzIEZhc3RSZWFkZXJTZXR0aW5ncztcblx0fVxuXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuXHR9XG5cblx0cmVmcmVzaFNwcml0elZpZXdGb250KCk6IHZvaWQge1xuXHRcdGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFNQUklUWl9WSUVXX1RZUEUpKSB7XG5cdFx0XHRjb25zdCB2ID0gbGVhZi52aWV3O1xuXHRcdFx0aWYgKHYgaW5zdGFuY2VvZiBTcHJpdHpWaWV3KSB2LmFwcGx5Rm9udFNpemUoKTtcblx0XHR9XG5cdH1cblxuXHRyZWZyZXNoU3ByaXR6Vmlld1dwbVVpKCk6IHZvaWQge1xuXHRcdGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFNQUklUWl9WSUVXX1RZUEUpKSB7XG5cdFx0XHRjb25zdCB2ID0gbGVhZi52aWV3O1xuXHRcdFx0aWYgKHYgaW5zdGFuY2VvZiBTcHJpdHpWaWV3KSB2LnVwZGF0ZVdwbUxhYmVsKCk7XG5cdFx0fVxuXHR9XG5cblx0cmVmcmVzaFNwcml0ekFwcGVhcmFuY2UoKTogdm9pZCB7XG5cdFx0Zm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoU1BSSVRaX1ZJRVdfVFlQRSkpIHtcblx0XHRcdGNvbnN0IHYgPSBsZWFmLnZpZXc7XG5cdFx0XHRpZiAodiBpbnN0YW5jZW9mIFNwcml0elZpZXcpIHYuYXBwbHlBcHBlYXJhbmNlKCk7XG5cdFx0fVxuXHRcdHRoaXMuc2V0dGluZ3NQcmV2aWV3UmVkcmF3Py4oKTtcblx0fVxuXG5cdC8qKiBSZS1ldmFsdWF0ZSB3aGV0aGVyIHRvIGhpZGUgdGhlIHRhYiBiYXIgKHNpbmdsZS10YWIgZ3JvdXBzIG9ubHkpLiAqL1xuXHRyZWZyZXNoU3ByaXR6VGFiQ2hyb21lKCk6IHZvaWQge1xuXHRcdGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFNQUklUWl9WSUVXX1RZUEUpKSB7XG5cdFx0XHRjb25zdCB2ID0gbGVhZi52aWV3O1xuXHRcdFx0aWYgKHYgaW5zdGFuY2VvZiBTcHJpdHpWaWV3KSB2LnN5bmNUYWJDaHJvbWVWaXNpYmlsaXR5KCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBtYXliZVJlbG9hZFNwcml0ekZyb21BY3RpdmVNYXJrZG93bkxlYWYoXG5cdFx0bGVhZjogV29ya3NwYWNlTGVhZiB8IG51bGxcblx0KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0aWYgKCF0aGlzLnNwcml0ekZvbGxvd3NBY3RpdmVNYXJrZG93bikgcmV0dXJuO1xuXHRcdGlmICghbGVhZj8udmlldyB8fCAhKGxlYWYudmlldyBpbnN0YW5jZW9mIE1hcmtkb3duVmlldykpIHJldHVybjtcblx0XHRjb25zdCBmaWxlID0gbGVhZi52aWV3LmZpbGU7XG5cdFx0aWYgKCFmaWxlIHx8IGZpbGUuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIHJldHVybjtcblxuXHRcdGNvbnN0IHNwcml0ekxlYXZlcyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoU1BSSVRaX1ZJRVdfVFlQRSk7XG5cdFx0aWYgKHNwcml0ekxlYXZlcy5sZW5ndGggPT09IDApIHJldHVybjtcblxuXHRcdGNvbnN0IHRleHQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xuXHRcdGlmICghdGV4dC50cmltKCkpIHJldHVybjtcblx0XHRjb25zdCB0b2tlbnMgPSBtYXJrZG93blRvUmVhZGluZ1Rva2Vucyhcblx0XHRcdHRleHQsXG5cdFx0XHR0aGlzLnNldHRpbmdzLnNraXBMZWFkaW5nQ2FsbG91dHNcblx0XHQpO1xuXHRcdGlmICh0b2tlbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cblx0XHRmb3IgKGNvbnN0IHNsIG9mIHNwcml0ekxlYXZlcykge1xuXHRcdFx0Y29uc3QgdiA9IHNsLnZpZXc7XG5cdFx0XHRpZiAodiBpbnN0YW5jZW9mIFNwcml0elZpZXcpIHYuc2V0VG9rZW5zKHRva2Vucyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyByaWJib25PcGVuU3ByaXR6QmVsb3coKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgbWRWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcblx0XHRpZiAoIW1kVmlldz8uZmlsZSB8fCBtZFZpZXcuZmlsZS5leHRlbnNpb24gIT09IFwibWRcIikge1xuXHRcdFx0bmV3IE5vdGljZShcIkZvY3VzIHRoZSBtYXJrZG93biBub3RlIHRvIHJlYWQsIHRoZW4gdHJ5IGFnYWluLlwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0ZXh0ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChtZFZpZXcuZmlsZSk7XG5cdFx0aWYgKCF0ZXh0LnRyaW0oKSkge1xuXHRcdFx0bmV3IE5vdGljZShcIk5vdGUgaXMgZW1wdHkuXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRva2VucyA9IG1hcmtkb3duVG9SZWFkaW5nVG9rZW5zKFxuXHRcdFx0dGV4dCxcblx0XHRcdHRoaXMuc2V0dGluZ3Muc2tpcExlYWRpbmdDYWxsb3V0c1xuXHRcdCk7XG5cdFx0aWYgKHRva2Vucy5sZW5ndGggPT09IDApIHtcblx0XHRcdG5ldyBOb3RpY2UoXCJObyB3b3JkcyB0byByZWFkLlwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnNwcml0ekZvbGxvd3NBY3RpdmVNYXJrZG93biA9IHRydWU7XG5cblx0XHRjb25zdCBleGlzdGluZyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoU1BSSVRaX1ZJRVdfVFlQRSlbMF07XG5cdFx0aWYgKGV4aXN0aW5nKSB7XG5cdFx0XHRhd2FpdCBleGlzdGluZy5zZXRWaWV3U3RhdGUoe1xuXHRcdFx0XHR0eXBlOiBTUFJJVFpfVklFV19UWVBFLFxuXHRcdFx0XHRhY3RpdmU6IHRydWUsXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGV4aXN0aW5nKTtcblx0XHRcdGNvbnN0IHZpZXcgPSBleGlzdGluZy52aWV3O1xuXHRcdFx0aWYgKHZpZXcgaW5zdGFuY2VvZiBTcHJpdHpWaWV3KSB7XG5cdFx0XHRcdHZpZXcuc2V0VG9rZW5zKHRva2Vucyk7XG5cdFx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGV4aXN0aW5nLCB7IGZvY3VzOiB0cnVlIH0pO1xuXHRcdFx0XHR2aWV3LmNvbnRlbnRFbC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNwbGl0TGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5jcmVhdGVMZWFmQnlTcGxpdChcblx0XHRcdG1kVmlldy5sZWFmLFxuXHRcdFx0XCJob3Jpem9udGFsXCIsXG5cdFx0XHRmYWxzZVxuXHRcdCk7XG5cdFx0YXdhaXQgc3BsaXRMZWFmLnNldFZpZXdTdGF0ZSh7XG5cdFx0XHR0eXBlOiBTUFJJVFpfVklFV19UWVBFLFxuXHRcdFx0YWN0aXZlOiB0cnVlLFxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgdmlldyA9IHNwbGl0TGVhZi52aWV3O1xuXHRcdGlmICh2aWV3IGluc3RhbmNlb2YgU3ByaXR6Vmlldykge1xuXHRcdFx0dmlldy5zZXRUb2tlbnModG9rZW5zKTtcblx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKHNwbGl0TGVhZiwgeyBmb2N1czogdHJ1ZSB9KTtcblx0XHRcdHZpZXcuY29udGVudEVsLmZvY3VzKCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBvcGVuU3ByaXR6V2l0aFRleHQoXG5cdFx0cmF3OiBzdHJpbmcsXG5cdFx0c3RyaXBNYXJrZG93bjogYm9vbGVhbixcblx0XHRmb2xsb3dBY3RpdmVNYXJrZG93bjogYm9vbGVhblxuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0aGlzLnNwcml0ekZvbGxvd3NBY3RpdmVNYXJrZG93biA9IGZvbGxvd0FjdGl2ZU1hcmtkb3duO1xuXHRcdGxldCB0b2tlbnM6IFJlYWRpbmdUb2tlbltdO1xuXHRcdGlmIChzdHJpcE1hcmtkb3duKSB7XG5cdFx0XHR0b2tlbnMgPSBtYXJrZG93blRvUmVhZGluZ1Rva2Vucyhcblx0XHRcdFx0cmF3LFxuXHRcdFx0XHR0aGlzLnNldHRpbmdzLnNraXBMZWFkaW5nQ2FsbG91dHNcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHBsYWluID0gcmF3LnJlcGxhY2UoL1xcclxcbi9nLCBcIlxcblwiKS50cmltKCk7XG5cdFx0XHR0b2tlbnMgPSB3b3Jkc1RvUmVhZGluZ1Rva2Vucyh0b2tlbml6ZShwbGFpbikpO1xuXHRcdH1cblx0XHRpZiAodG9rZW5zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0bmV3IE5vdGljZShcIk5vIHdvcmRzIHRvIHJlYWQuXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShTUFJJVFpfVklFV19UWVBFKVswXTtcblx0XHRpZiAoIWxlYWYpIHtcblx0XHRcdGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKSA/PyB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihcInRhYlwiKTtcblx0XHRcdGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcblx0XHRcdFx0dHlwZTogU1BSSVRaX1ZJRVdfVFlQRSxcblx0XHRcdFx0YWN0aXZlOiB0cnVlLFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHZpZXcgPSBsZWFmLnZpZXc7XG5cdFx0aWYgKHZpZXcgaW5zdGFuY2VvZiBTcHJpdHpWaWV3KSB7XG5cdFx0XHR2aWV3LnNldFRva2Vucyh0b2tlbnMpO1xuXHRcdFx0dGhpcy5hcHAud29ya3NwYWNlLnNldEFjdGl2ZUxlYWYobGVhZiwgeyBmb2N1czogdHJ1ZSB9KTtcblx0XHRcdHZpZXcuY29udGVudEVsLmZvY3VzKCk7XG5cdFx0fVxuXHR9XG59XG5cbiIsICJcdUZFRkYvKiogU3RyaXAgdHJhaWxpbmcgcHVuY3R1YXRpb24gZm9yIE9SUCBsZW5ndGggKGxldHRlcnMvZGlnaXRzL2Fwb3N0cm9waGUgaW5zaWRlIHdvcmQga2VwdCkuICovXG5leHBvcnQgZnVuY3Rpb24gY29yZVdvcmRGb3JPcnAodG9rZW46IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IHQgPSB0b2tlbi50cmltKCkucmVwbGFjZSgvWy4hPyw7OlxcdTIwMTNcXHUyMDE0XFwtKVwiJ1xcXVxcdTAwYmJdKyQvdSwgXCJcIik7XG5cdHJldHVybiB0Lmxlbmd0aCA+IDAgPyB0IDogdG9rZW4udHJpbSgpO1xufVxuXG4vKiogT3B0aW1hbCByZWNvZ25pdGlvbiBwb2ludCBpbmRleCAoMC1iYXNlZCkgZm9yIFNwcml0ei1zdHlsZSBkaXNwbGF5LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE9ycEluZGV4KHdvcmQ6IHN0cmluZyk6IG51bWJlciB7XG5cdGNvbnN0IGxlbiA9IHdvcmQubGVuZ3RoO1xuXHRpZiAobGVuIDw9IDIpIHJldHVybiAwO1xuXHRpZiAobGVuIDw9IDUpIHJldHVybiAxO1xuXHRpZiAobGVuIDw9IDkpIHJldHVybiAyO1xuXHRpZiAobGVuIDw9IDEzKSByZXR1cm4gMztcblx0cmV0dXJuIDQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPcnBJbmRleEZvclRva2VuKHRva2VuOiBzdHJpbmcpOiBudW1iZXIge1xuXHRjb25zdCBjb3JlID0gY29yZVdvcmRGb3JPcnAodG9rZW4pO1xuXHRjb25zdCBpZHggPSBnZXRPcnBJbmRleChjb3JlLmxlbmd0aCA+IDAgPyBjb3JlIDogdG9rZW4pO1xuXHRjb25zdCBtYXggPSBNYXRoLm1heCgwLCB0b2tlbi5sZW5ndGggLSAxKTtcblx0cmV0dXJuIE1hdGgubWluKGlkeCwgbWF4KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWFkaW5nVG9rZW4ge1xuXHR3b3JkOiBzdHJpbmc7XG5cdGJsb2NrU3RhcnQ/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd29yZHNUb1JlYWRpbmdUb2tlbnMod29yZHM6IHN0cmluZ1tdKTogUmVhZGluZ1Rva2VuW10ge1xuXHRyZXR1cm4gd29yZHMubWFwKCh3b3JkKSA9PiAoeyB3b3JkIH0pKTtcbn1cblxuY29uc3QgUFVOQ1RfRU5EID0gL1suIT8sOzpcXHUyMDEzXFx1MjAxNFxcLSlcIidcXF1cXHUwMGJiXSQvO1xuY29uc3QgU1RST05HX0VORCA9IC9bLiE/XSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gcHVuY3R1YXRpb25FeHRyYU1zKHdvcmQ6IHN0cmluZywgYmFzZU1zOiBudW1iZXIpOiBudW1iZXIge1xuXHRjb25zdCB3ID0gd29yZC50cmltKCk7XG5cdGlmICh3Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIDA7XG5cdGlmIChTVFJPTkdfRU5ELnRlc3QodykpIHJldHVybiBiYXNlTXM7XG5cdGlmIChQVU5DVF9FTkQudGVzdCh3KSkgcmV0dXJuIE1hdGgucm91bmQoYmFzZU1zICogMC41KTtcblx0cmV0dXJuIDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b2tlbml6ZSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSB0ZXh0LnJlcGxhY2UoL1xcclxcbi9nLCBcIlxcblwiKS50cmltKCk7XG5cdGlmICghbm9ybWFsaXplZCkgcmV0dXJuIFtdO1xuXHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZWQuc3BsaXQoLyhcXHMrKS8pO1xuXHRjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG5cdGZvciAoY29uc3QgcCBvZiBwYXJ0cykge1xuXHRcdGlmICghcCkgY29udGludWU7XG5cdFx0aWYgKC9eXFxzKyQvLnRlc3QocCkpIGNvbnRpbnVlO1xuXHRcdG91dC5wdXNoKHApO1xuXHR9XG5cdHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtc1BlcldvcmQod3BtOiBudW1iZXIpOiBudW1iZXIge1xuXHRjb25zdCB3ID0gTWF0aC5tYXgoNjAsIE1hdGgubWluKDEyMDAsIHdwbSkpO1xuXHRyZXR1cm4gNjAwMDAgLyB3O1xufVxyXG4iLCAiaW1wb3J0IHsgdG9rZW5pemUsIHR5cGUgUmVhZGluZ1Rva2VuIH0gZnJvbSBcIi4vc3ByaXR6XCI7XG5cbmZ1bmN0aW9uIHN0cmlwRnJvbnRtYXR0ZXIoczogc3RyaW5nKTogc3RyaW5nIHtcblx0cmV0dXJuIHMucmVwbGFjZSgvXi0tLVxccypcXG5bXFxzXFxTXSo/XFxuLS0tXFxzKlxcbj8vbSwgXCJcIik7XG59XG5cbmZ1bmN0aW9uIHN0cmlwR2xvYmFsQmxvY2tzKHM6IHN0cmluZyk6IHN0cmluZyB7XG5cdGxldCB0ID0gcy5yZXBsYWNlKC9gYGBbXFxzXFxTXSo/YGBgL2csIFwiIFwiKTtcblx0dCA9IHQucmVwbGFjZSgvIVxcW1xcWyhbXlxcXV0qKVxcXVxcXS9nLCBcIiBcIik7XG5cdHQgPSB0LnJlcGxhY2UoL1xcW1xcWyhbXlxcXV0rKVxcXVxcXS9nLCAoXywgaW5uZXI6IHN0cmluZykgPT4ge1xuXHRcdGNvbnN0IHBpcGUgPSBpbm5lci5sYXN0SW5kZXhPZihcInxcIik7XG5cdFx0aWYgKHBpcGUgPj0gMCkgcmV0dXJuIGlubmVyLnNsaWNlKHBpcGUgKyAxKS50cmltKCk7XG5cdFx0cmV0dXJuIGlubmVyLnRyaW0oKTtcblx0fSk7XG5cdHJldHVybiB0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFya2Rvd25Ub1JlYWRpbmdUZXh0SW5uZXIoczogc3RyaW5nKTogc3RyaW5nIHtcblx0bGV0IHQgPSBzLnJlcGxhY2UoL1xcclxcbi9nLCBcIlxcblwiKTtcblx0dCA9IHQucmVwbGFjZSgvYChbXmBdKylgL2csIFwiJDFcIik7XG5cdHQgPSB0LnJlcGxhY2UoLyFcXFsoW15cXF1dKilcXF1cXChbXildKlxcKS9nLCAoXywgYWx0OiBzdHJpbmcpID0+XG5cdFx0YWx0LnRyaW0oKSA/IGAke2FsdH0gYCA6IFwiIFwiXG5cdCk7XG5cdHQgPSB0LnJlcGxhY2UoL1xcWyhbXlxcXV0rKVxcXVxcKFteKV0qXFwpL2csIFwiJDFcIik7XG5cdHQgPSB0LnJlcGxhY2UoLzxodHRwcz86W14+XFxzXSs+L2dpLCBcIiBcIik7XG5cdHQgPSB0LnJlcGxhY2UoLzxbXj5cXHNdK0BbXj5cXHNdKz4vZywgXCIgXCIpO1xuXHR0ID0gdC5yZXBsYWNlKC9eXFxbW15cXF1dK1xcXTpcXHMqXFxTK1xccyokL2dtLCBcIlwiKTtcblx0dCA9IHQucmVwbGFjZSgvXlxcW1xcXlteXFxdXStcXF06XFxzKi4qJC9nbSwgXCJcIik7XG5cdHQgPSB0LnJlcGxhY2UoL14jezEsNn1cXHMrL2dtLCBcIlwiKTtcblx0dCA9IHQucmVwbGFjZSgvXj5cXHM/L2dtLCBcIlwiKTtcblx0dCA9IHQucmVwbGFjZSgvXltcXHQgXSooWy0qX10pKFxccypcXDEpezIsfVtcXHQgXSokL2dtLCBcIiBcIik7XG5cdHQgPSB0LnJlcGxhY2UoL15bXFx0IF0qWy0qK11cXHMrL2dtLCBcIlwiKTtcblx0dCA9IHQucmVwbGFjZSgvXltcXHQgXSpcXGQrXFwuXFxzKy9nbSwgXCJcIik7XG5cdHQgPSB0LnJlcGxhY2UoL1xcW1sgeFhdXFxdXFxzKi9nLCBcIlwiKTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcblx0XHR0ID0gdC5yZXBsYWNlKC9cXCpcXCooW14qXSspXFwqXFwqL2csIFwiJDFcIik7XG5cdFx0dCA9IHQucmVwbGFjZSgvX18oW15fXSspX18vZywgXCIkMVwiKTtcblx0XHR0ID0gdC5yZXBsYWNlKC9cXCooW14qXSspXFwqL2csIFwiJDFcIik7XG5cdFx0dCA9IHQucmVwbGFjZSgvXyhbXl9dKylfL2csIFwiJDFcIik7XG5cdFx0dCA9IHQucmVwbGFjZSgvfn4oW15+XSspfn4vZywgXCIkMVwiKTtcblx0fVxuXHR0ID0gdC5yZXBsYWNlKC9cXFtcXF5bXlxcXV0rXFxdL2csIFwiXCIpO1xuXHR0ID0gdC5yZXBsYWNlKC88W14+XSs+L2csIFwiIFwiKTtcblx0dCA9IHQucmVwbGFjZSgvXlxcfC4qXFx8JC9nbSwgKGxpbmUpID0+IGxpbmUucmVwbGFjZSgvXFx8L2csIFwiIFwiKSk7XG5cdHQgPSB0LnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcblx0cmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXJrZG93blRvUmVhZGluZ1RleHQoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRsZXQgcyA9IHNvdXJjZS5yZXBsYWNlKC9cXHJcXG4vZywgXCJcXG5cIik7XG5cdHMgPSBzdHJpcEZyb250bWF0dGVyKHMpO1xuXHRzID0gc3RyaXBHbG9iYWxCbG9ja3Mocyk7XG5cdHJldHVybiBtYXJrZG93blRvUmVhZGluZ1RleHRJbm5lcihzKTtcbn1cblxuZnVuY3Rpb24gaXNMaXN0SXRlbUxpbmUobGluZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiAvXlxccyooPzpbLSorXVxcc3xcXGQrXFwuXFxzKS8udGVzdChsaW5lKTtcbn1cblxuLyoqIERyb3AgY29udGlndW91cyBibG9ja3F1b3RlL2NhbGxvdXQgYmxvY2tzIChsaW5lcyBzdGFydGluZyB3aXRoIGA+YCkgYXQgdGhlIHZlcnkgc3RhcnQgb2YgdGhlIG5vdGUuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaXBMZWFkaW5nQ2FsbG91dEJsb2Nrcyhzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IGxpbmVzID0gc291cmNlLnJlcGxhY2UoL1xcclxcbi9nLCBcIlxcblwiKS5zcGxpdChcIlxcblwiKTtcblx0bGV0IGkgPSAwO1xuXHRjb25zdCBuID0gbGluZXMubGVuZ3RoO1xuXHR3aGlsZSAoaSA8IG4pIHtcblx0XHR3aGlsZSAoaSA8IG4gJiYgbGluZXNbaV0udHJpbSgpID09PSBcIlwiKSBpKys7XG5cdFx0aWYgKGkgPj0gbikgYnJlYWs7XG5cdFx0aWYgKCEvXlxccyo+Ly50ZXN0KGxpbmVzW2ldKSkgYnJlYWs7XG5cdFx0d2hpbGUgKGkgPCBuKSB7XG5cdFx0XHRjb25zdCBMID0gbGluZXNbaV07XG5cdFx0XHRpZiAoL15cXHMqPi8udGVzdChMKSkge1xuXHRcdFx0XHRpKys7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKEwudHJpbSgpID09PSBcIlwiKSB7XG5cdFx0XHRcdGkrKztcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0cmV0dXJuIGxpbmVzLnNsaWNlKGkpLmpvaW4oXCJcXG5cIik7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkTGluZUNodW5rcyhsaW5lczogc3RyaW5nW10pOiBzdHJpbmdbXVtdIHtcblx0Y29uc3QgY2h1bmtzOiBzdHJpbmdbXVtdID0gW107XG5cdGxldCBidWY6IHN0cmluZ1tdID0gW107XG5cdGNvbnN0IGZsdXNoQnVmID0gKCkgPT4ge1xuXHRcdGlmIChidWYubGVuZ3RoID4gMCkge1xuXHRcdFx0Y2h1bmtzLnB1c2goYnVmKTtcblx0XHRcdGJ1ZiA9IFtdO1xuXHRcdH1cblx0fTtcblx0Zm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG5cdFx0aWYgKCFsaW5lLnRyaW0oKSkge1xuXHRcdFx0Zmx1c2hCdWYoKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRpZiAoaXNMaXN0SXRlbUxpbmUobGluZSkpIHtcblx0XHRcdGZsdXNoQnVmKCk7XG5cdFx0XHRjaHVua3MucHVzaChbbGluZV0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoYnVmLmxlbmd0aCA9PT0gMCkgYnVmID0gW2xpbmVdO1xuXHRcdFx0ZWxzZSBidWYucHVzaChsaW5lKTtcblx0XHR9XG5cdH1cblx0Zmx1c2hCdWYoKTtcblx0cmV0dXJuIGNodW5rcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcmtkb3duVG9SZWFkaW5nVG9rZW5zKFxuXHRzb3VyY2U6IHN0cmluZyxcblx0c2tpcExlYWRpbmdDYWxsb3V0cyA9IHRydWVcbik6IFJlYWRpbmdUb2tlbltdIHtcblx0bGV0IHMgPSBzb3VyY2UucmVwbGFjZSgvXFxyXFxuL2csIFwiXFxuXCIpO1xuXHRzID0gc3RyaXBGcm9udG1hdHRlcihzKTtcblx0cyA9IHN0cmlwR2xvYmFsQmxvY2tzKHMpO1xuXHRpZiAoc2tpcExlYWRpbmdDYWxsb3V0cykge1xuXHRcdHMgPSBzdHJpcExlYWRpbmdDYWxsb3V0QmxvY2tzKHMpO1xuXHR9XG5cdGNvbnN0IGxpbmVzID0gcy5zcGxpdChcIlxcblwiKTtcblx0Y29uc3QgY2h1bmtzID0gYnVpbGRMaW5lQ2h1bmtzKGxpbmVzKTtcblx0Y29uc3QgdG9rZW5zOiBSZWFkaW5nVG9rZW5bXSA9IFtdO1xuXHRsZXQgYW55RW1pdHRlZCA9IGZhbHNlO1xuXHRmb3IgKGNvbnN0IGNodW5rTGluZXMgb2YgY2h1bmtzKSB7XG5cdFx0Y29uc3QgY2h1bmtUZXh0ID0gY2h1bmtMaW5lcy5qb2luKFwiIFwiKTtcblx0XHRjb25zdCBwbGFpbiA9IG1hcmtkb3duVG9SZWFkaW5nVGV4dElubmVyKGNodW5rVGV4dCk7XG5cdFx0Y29uc3Qgd29yZHMgPSB0b2tlbml6ZShwbGFpbik7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dG9rZW5zLnB1c2goe1xuXHRcdFx0XHR3b3JkOiB3b3Jkc1tpXSxcblx0XHRcdFx0YmxvY2tTdGFydDogYW55RW1pdHRlZCAmJiBpID09PSAwLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmICh3b3Jkcy5sZW5ndGggPiAwKSBhbnlFbWl0dGVkID0gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gdG9rZW5zO1xufVxuIiwgImltcG9ydCB7IEl0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBhcHBseVNwcml0ekFwcGVhcmFuY2VWYXJzIH0gZnJvbSBcIi4vc2V0dGluZ3NcIjtcbmltcG9ydCB0eXBlIEZhc3RSZWFkZXJQbHVnaW4gZnJvbSBcIi4vbWFpblwiO1xuaW1wb3J0IHR5cGUgeyBSZWFkaW5nVG9rZW4gfSBmcm9tIFwiLi9zcHJpdHpcIjtcbmltcG9ydCB7XG5cdGdldE9ycEluZGV4Rm9yVG9rZW4sXG5cdG1zUGVyV29yZCxcblx0cHVuY3R1YXRpb25FeHRyYU1zLFxufSBmcm9tIFwiLi9zcHJpdHpcIjtcblxuZXhwb3J0IGNvbnN0IFNQUklUWl9WSUVXX1RZUEUgPSBcImZhc3QtcmVhZGVyLXNwcml0elwiO1xuXG5leHBvcnQgY2xhc3MgU3ByaXR6VmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcblx0cGx1Z2luOiBGYXN0UmVhZGVyUGx1Z2luO1xuXHRwcml2YXRlIHRva2VuczogUmVhZGluZ1Rva2VuW10gPSBbXTtcblx0cHJpdmF0ZSBpbmRleCA9IDA7XG5cdHByaXZhdGUgcGxheWluZyA9IGZhbHNlO1xuXHRwcml2YXRlIHRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuXHRwcml2YXRlIHdvcmRXcmFwRWwhOiBIVE1MRWxlbWVudDtcblx0cHJpdmF0ZSB3b3JkUm93RWwhOiBIVE1MRWxlbWVudDtcblx0cHJpdmF0ZSBwcm9ncmVzc0VsITogSFRNTEVsZW1lbnQ7XG5cdHByaXZhdGUgcGxheUJ0biE6IEhUTUxCdXR0b25FbGVtZW50O1xuXHRwcml2YXRlIHdwbUxhYmVsRWwhOiBIVE1MRWxlbWVudDtcblxuXHRjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBwbHVnaW46IEZhc3RSZWFkZXJQbHVnaW4pIHtcblx0XHRzdXBlcihsZWFmKTtcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcblx0fVxuXG5cdGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFNQUklUWl9WSUVXX1RZUEU7XG5cdH1cblxuXHRnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcIlNwcml0eiByZWFkZXJcIjtcblx0fVxuXG5cdGdldEljb24oKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJnbGFzc2VzXCI7XG5cdH1cblxuXHRhc3luYyBvbk9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuXHRcdHJvb3QuZW1wdHkoKTtcblx0XHRyb290LmFkZENsYXNzKFwiZmFzdC1yZWFkZXItc3ByaXR6LXJvb3RcIik7XG5cblx0XHRjb25zdCBjb250cm9scyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1jb250cm9sc1wiIH0pO1xuXHRcdHRoaXMucGxheUJ0biA9IGNvbnRyb2xzLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJQbGF5XCIgfSk7XG5cdFx0dGhpcy5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZVBsYXkoKSk7XG5cblx0XHRjb25zdCBwcmV2QnRuID0gY29udHJvbHMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIlByZXZcIiB9KTtcblx0XHRwcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnN0ZXAoLTEpKTtcblxuXHRcdGNvbnN0IG5leHRCdG4gPSBjb250cm9scy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiTmV4dFwiIH0pO1xuXHRcdG5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc3RlcCgxKSk7XG5cblx0XHRjb25zdCBzcGVlZEdyb3VwID0gY29udHJvbHMuY3JlYXRlRGl2KHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1zcGVlZFwiIH0pO1xuXHRcdGNvbnN0IHNsb3dlckJ0biA9IHNwZWVkR3JvdXAuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIi1cIiB9KTtcblx0XHRzbG93ZXJCdG4uc2V0QXR0cihcImFyaWEtbGFiZWxcIiwgXCJTbG93ZXJcIik7XG5cdFx0c2xvd2VyQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmFkanVzdFdwbSgtMSkpO1xuXG5cdFx0dGhpcy53cG1MYWJlbEVsID0gc3BlZWRHcm91cC5jcmVhdGVTcGFuKHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei13cG0tbGFiZWxcIiB9KTtcblx0XHR0aGlzLnVwZGF0ZVdwbUxhYmVsKCk7XG5cblx0XHRjb25zdCBmYXN0ZXJCdG4gPSBzcGVlZEdyb3VwLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCIrXCIgfSk7XG5cdFx0ZmFzdGVyQnRuLnNldEF0dHIoXCJhcmlhLWxhYmVsXCIsIFwiRmFzdGVyXCIpO1xuXHRcdGZhc3RlckJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5hZGp1c3RXcG0oMSkpO1xuXG5cdFx0dGhpcy53b3JkV3JhcEVsID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwiZmFzdC1yZWFkZXItc3ByaXR6LXdvcmQtd3JhcFwiIH0pO1xuXHRcdHRoaXMud29yZFJvd0VsID0gdGhpcy53b3JkV3JhcEVsLmNyZWF0ZURpdih7IGNsczogXCJmYXN0LXJlYWRlci1zcHJpdHotd29yZC1yb3dcIiB9KTtcblxuXHRcdHRoaXMucHJvZ3Jlc3NFbCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1wcm9ncmVzc1wiIH0pO1xuXHRcdHRoaXMucHJvZ3Jlc3NFbC5zZXRUZXh0KHRoaXMucHJvZ3Jlc3NUZXh0KCkpO1xuXG5cdFx0dGhpcy5hcHBseUZvbnRTaXplKCk7XG5cdFx0dGhpcy5hcHBseUFwcGVhcmFuY2UoKTtcblxuXHRcdHRoaXMucGx1Z2luLnJlZ2lzdGVyRG9tRXZlbnQocm9vdCwgXCJrZXlkb3duXCIsIChldnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcblx0XHRcdGlmIChldnQua2V5ID09PSBcIiBcIiB8fCBldnQuY29kZSA9PT0gXCJTcGFjZVwiKSB7XG5cdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzLnRvZ2dsZVBsYXkoKTtcblx0XHRcdH0gZWxzZSBpZiAoZXZ0LmtleSA9PT0gXCJBcnJvd0xlZnRcIikge1xuXHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5zdGVwKC0xKTtcblx0XHRcdH0gZWxzZSBpZiAoZXZ0LmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIpIHtcblx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuc3RlcCgxKTtcblx0XHRcdH0gZWxzZSBpZiAoZXZ0LmtleSA9PT0gXCIrXCIgfHwgZXZ0LmtleSA9PT0gXCI9XCIpIHtcblx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0dGhpcy5hZGp1c3RXcG0oMSk7XG5cdFx0XHR9IGVsc2UgaWYgKGV2dC5rZXkgPT09IFwiLVwiIHx8IGV2dC5rZXkgPT09IFwiX1wiKSB7XG5cdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdHRoaXMuYWRqdXN0V3BtKC0xKTtcblx0XHRcdH0gZWxzZSBpZiAoZXZ0LmtleSA9PT0gXCJFc2NhcGVcIikge1xuXHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dm9pZCB0aGlzLmxlYWYuZGV0YWNoKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyb290LnRhYkluZGV4ID0gMDtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFx0dGhpcy5zeW5jVGFiQ2hyb21lVmlzaWJpbGl0eSgpO1xuXHRcdFx0cm9vdC5mb2N1cygpO1xuXHRcdH0pO1xuXHR9XG5cblx0YXN5bmMgb25DbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0aGlzLmNsZWFyVGFiQ2hyb21lVmlzaWJpbGl0eSgpO1xuXHRcdHRoaXMuc3RvcFRpbWVyKCk7XG5cdFx0dGhpcy5jb250ZW50RWwuZW1wdHkoKTtcblx0fVxuXG5cdC8qKiBIaWRlIE9ic2lkaWFuIHRhYiBzdHJpcCB3aGVuIHRoaXMgcGFuZSBpcyB0aGUgb25seSB0YWIgaW4gaXRzIGdyb3VwIChyaWJib24gc3BsaXQpLiAqL1xuXHRzeW5jVGFiQ2hyb21lVmlzaWJpbGl0eSgpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMuY29udGVudEVsPy5pc0Nvbm5lY3RlZCkgcmV0dXJuO1xuXHRcdGNvbnN0IHRhYnNSb290ID0gdGhpcy5jb250ZW50RWwuY2xvc2VzdChcIi53b3Jrc3BhY2UtdGFic1wiKTtcblx0XHRpZiAoIXRhYnNSb290KSByZXR1cm47XG5cdFx0dGFic1Jvb3QucmVtb3ZlQ2xhc3MoXCJmYXN0LXJlYWRlci1zcHJpdHotaGlkZS10YWItYmFyXCIpO1xuXHRcdGxldCBuID0gdGFic1Jvb3QucXVlcnlTZWxlY3RvckFsbChcIi53b3Jrc3BhY2UtdGFiLWhlYWRlci10YWJcIikubGVuZ3RoO1xuXHRcdGlmIChuID09PSAwKSB7XG5cdFx0XHRuID0gdGFic1Jvb3QucXVlcnlTZWxlY3RvckFsbChcIi53b3Jrc3BhY2UtdGFiLWNvbnRhaW5lciA+IC53b3Jrc3BhY2UtbGVhZlwiKVxuXHRcdFx0XHQubGVuZ3RoO1xuXHRcdH1cblx0XHRpZiAobiA9PT0gMSkge1xuXHRcdFx0dGFic1Jvb3QuYWRkQ2xhc3MoXCJmYXN0LXJlYWRlci1zcHJpdHotaGlkZS10YWItYmFyXCIpO1xuXHRcdH1cblx0fVxuXG5cdGNsZWFyVGFiQ2hyb21lVmlzaWJpbGl0eSgpOiB2b2lkIHtcblx0XHRjb25zdCB0YWJzUm9vdCA9IHRoaXMuY29udGVudEVsPy5jbG9zZXN0KFwiLndvcmtzcGFjZS10YWJzXCIpO1xuXHRcdHRhYnNSb290Py5yZW1vdmVDbGFzcyhcImZhc3QtcmVhZGVyLXNwcml0ei1oaWRlLXRhYi1iYXJcIik7XG5cdH1cblxuXHRzZXRUb2tlbnModG9rZW5zOiBSZWFkaW5nVG9rZW5bXSk6IHZvaWQge1xuXHRcdHRoaXMudG9rZW5zID0gdG9rZW5zO1xuXHRcdHRoaXMuaW5kZXggPSAwO1xuXHRcdHRoaXMuc3RvcFRpbWVyKCk7XG5cdFx0dGhpcy5wbGF5aW5nID0gZmFsc2U7XG5cdFx0dGhpcy5wbGF5QnRuLnNldFRleHQoXCJQbGF5XCIpO1xuXHRcdHRoaXMucmVuZGVyV29yZCgpO1xuXHRcdHRoaXMucHJvZ3Jlc3NFbC5zZXRUZXh0KHRoaXMucHJvZ3Jlc3NUZXh0KCkpO1xuXHR9XG5cblx0c3RhcnRQbGF5aW5nKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLnRva2Vucy5sZW5ndGggPT09IDAgfHwgIXRoaXMucGxheUJ0bikgcmV0dXJuO1xuXHRcdGlmICh0aGlzLnBsYXlpbmcpIHJldHVybjtcblx0XHR0aGlzLnBsYXlpbmcgPSB0cnVlO1xuXHRcdHRoaXMucGxheUJ0bi5zZXRUZXh0KFwiUGF1c2VcIik7XG5cdFx0dGhpcy5zY2hlZHVsZUFkdmFuY2UoKTtcblx0fVxuXG5cdGFwcGx5Rm9udFNpemUoKTogdm9pZCB7XG5cdFx0Y29uc3QgcHggPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb250U2l6ZVB4O1xuXHRcdHRoaXMud29yZFJvd0VsLnN0eWxlLmZvbnRTaXplID0gYCR7cHh9cHhgO1xuXHR9XG5cblx0YXBwbHlBcHBlYXJhbmNlKCk6IHZvaWQge1xuXHRcdGFwcGx5U3ByaXR6QXBwZWFyYW5jZVZhcnModGhpcy5jb250ZW50RWwsIHRoaXMucGx1Z2luLnNldHRpbmdzKTtcblx0XHR0aGlzLnJlbmRlcldvcmQoKTtcblx0fVxuXG5cdHVwZGF0ZVdwbUxhYmVsKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLndwbUxhYmVsRWwpIHtcblx0XHRcdHRoaXMud3BtTGFiZWxFbC5zZXRUZXh0KGAke3RoaXMucGx1Z2luLnNldHRpbmdzLndwbX0gd3BtYCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBhZGp1c3RXcG0oZGlyZWN0aW9uOiBudW1iZXIpOiB2b2lkIHtcblx0XHRjb25zdCBzdGVwID0gdGhpcy5wbHVnaW4uc2V0dGluZ3Mud3BtU3RlcCA/PyA1MDtcblx0XHRjb25zdCBkZWx0YSA9IGRpcmVjdGlvbiAqIHN0ZXA7XG5cdFx0Y29uc3QgbmV4dCA9IE1hdGgubWluKDEyMDAsIE1hdGgubWF4KDYwLCB0aGlzLnBsdWdpbi5zZXR0aW5ncy53cG0gKyBkZWx0YSkpO1xuXHRcdGlmIChuZXh0ID09PSB0aGlzLnBsdWdpbi5zZXR0aW5ncy53cG0pIHJldHVybjtcblx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy53cG0gPSBuZXh0O1xuXHRcdHZvaWQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0dGhpcy51cGRhdGVXcG1MYWJlbCgpO1xuXHRcdGlmICh0aGlzLnBsYXlpbmcpIHtcblx0XHRcdHRoaXMuc3RvcFRpbWVyKCk7XG5cdFx0XHR0aGlzLnNjaGVkdWxlQWR2YW5jZSgpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcHJvZ3Jlc3NUZXh0KCk6IHN0cmluZyB7XG5cdFx0Y29uc3QgbiA9IHRoaXMudG9rZW5zLmxlbmd0aDtcblx0XHRpZiAobiA9PT0gMCkgcmV0dXJuIFwiTm8gdGV4dFwiO1xuXHRcdHJldHVybiBgJHt0aGlzLmluZGV4ICsgMX0gLyAke259YDtcblx0fVxuXG5cdHByaXZhdGUgcmVuZGVyV29yZCgpOiB2b2lkIHtcblx0XHR0aGlzLndvcmRSb3dFbC5lbXB0eSgpO1xuXHRcdGNvbnN0IHNob3dCbG9jayA9XG5cdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93QmxvY2tIaWdobGlnaHQgJiZcblx0XHRcdCEhdGhpcy50b2tlbnNbdGhpcy5pbmRleF0/LmJsb2NrU3RhcnQ7XG5cdFx0dGhpcy53b3JkV3JhcEVsLnRvZ2dsZUNsYXNzKFwiZmFzdC1yZWFkZXItc3ByaXR6LWJsb2NrLXN0YXJ0XCIsIHNob3dCbG9jayk7XG5cdFx0aWYgKHRoaXMudG9rZW5zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0dGhpcy53b3JkUm93RWwuY3JlYXRlU3Bhbih7IHRleHQ6IFwiXFx1MjAxNFwiLCBjbHM6IFwiZmFzdC1yZWFkZXItc3ByaXR6LWVtcHR5XCIgfSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IHRva2VuID0gdGhpcy50b2tlbnNbdGhpcy5pbmRleF0/LndvcmQgPz8gXCJcIjtcblx0XHRjb25zdCBvcnAgPSBnZXRPcnBJbmRleEZvclRva2VuKHRva2VuKTtcblx0XHRjb25zdCBiZWZvcmUgPSB0b2tlbi5zbGljZSgwLCBvcnApO1xuXHRcdGNvbnN0IHBpdm90ID0gdG9rZW4uY2hhckF0KG9ycCkgfHwgXCJcIjtcblx0XHRjb25zdCBhZnRlciA9IHRva2VuLnNsaWNlKG9ycCArIDEpO1xuXG5cdFx0Y29uc3QgcGl2b3RMaW5lID0gdGhpcy53b3JkUm93RWwuY3JlYXRlRGl2KHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1waXZvdC1saW5lXCIgfSk7XG5cblx0XHRwaXZvdExpbmUuY3JlYXRlU3Bhbih7IGNsczogXCJmYXN0LXJlYWRlci1zcHJpdHotYmVmb3JlXCIsIHRleHQ6IGJlZm9yZSB9KTtcblx0XHRjb25zdCBvcnBFbCA9IHBpdm90TGluZS5jcmVhdGVTcGFuKHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1vcnBcIiwgdGV4dDogcGl2b3QgfSk7XG5cdFx0cGl2b3RMaW5lLmNyZWF0ZVNwYW4oeyBjbHM6IFwiZmFzdC1yZWFkZXItc3ByaXR6LWFmdGVyXCIsIHRleHQ6IGFmdGVyIH0pO1xuXG5cdFx0aWYgKCFwaXZvdCkge1xuXHRcdFx0b3JwRWwuYWRkQ2xhc3MoXCJmYXN0LXJlYWRlci1zcHJpdHotb3JwLS1lbXB0eVwiKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHRvZ2dsZVBsYXkoKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMudG9rZW5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRcdHRoaXMucGxheWluZyA9ICF0aGlzLnBsYXlpbmc7XG5cdFx0dGhpcy5wbGF5QnRuLnNldFRleHQodGhpcy5wbGF5aW5nID8gXCJQYXVzZVwiIDogXCJQbGF5XCIpO1xuXHRcdGlmICh0aGlzLnBsYXlpbmcpIHRoaXMuc2NoZWR1bGVBZHZhbmNlKCk7XG5cdFx0ZWxzZSB0aGlzLnN0b3BUaW1lcigpO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGVwKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcblx0XHRpZiAodGhpcy50b2tlbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdFx0dGhpcy5pbmRleCA9IE1hdGgubWluKFxuXHRcdFx0dGhpcy50b2tlbnMubGVuZ3RoIC0gMSxcblx0XHRcdE1hdGgubWF4KDAsIHRoaXMuaW5kZXggKyBkZWx0YSlcblx0XHQpO1xuXHRcdHRoaXMucmVuZGVyV29yZCgpO1xuXHRcdHRoaXMucHJvZ3Jlc3NFbC5zZXRUZXh0KHRoaXMucHJvZ3Jlc3NUZXh0KCkpO1xuXHRcdGlmICh0aGlzLnBsYXlpbmcpIHtcblx0XHRcdHRoaXMuc3RvcFRpbWVyKCk7XG5cdFx0XHR0aGlzLnNjaGVkdWxlQWR2YW5jZSgpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RvcFRpbWVyKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLnRpbWVyICE9IG51bGwpIHtcblx0XHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG5cdFx0XHR0aGlzLnRpbWVyID0gbnVsbDtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHNjaGVkdWxlQWR2YW5jZSgpOiB2b2lkIHtcblx0XHR0aGlzLnN0b3BUaW1lcigpO1xuXHRcdGNvbnN0IHRvayA9IHRoaXMudG9rZW5zW3RoaXMuaW5kZXhdO1xuXHRcdGNvbnN0IHdvcmQgPSB0b2s/LndvcmQgPz8gXCJcIjtcblx0XHRjb25zdCBiYXNlID0gbXNQZXJXb3JkKHRoaXMucGx1Z2luLnNldHRpbmdzLndwbSk7XG5cdFx0Y29uc3QgcHVuY3QgPSBwdW5jdHVhdGlvbkV4dHJhTXMoXG5cdFx0XHR3b3JkLFxuXHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MucHVuY3R1YXRpb25EZWxheU1zXG5cdFx0KTtcblx0XHRjb25zdCBibG9ja0V4dHJhID0gdG9rPy5ibG9ja1N0YXJ0XG5cdFx0XHQ/IHRoaXMucGx1Z2luLnNldHRpbmdzLmJsb2NrUGF1c2VNc1xuXHRcdFx0OiAwO1xuXHRcdGNvbnN0IGRlbGF5ID0gYmFzZSArIHB1bmN0ICsgYmxvY2tFeHRyYTtcblxuXHRcdHRoaXMudGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0aGlzLnRpbWVyID0gbnVsbDtcblx0XHRcdGlmICghdGhpcy5wbGF5aW5nKSByZXR1cm47XG5cdFx0XHRpZiAodGhpcy5pbmRleCA+PSB0aGlzLnRva2Vucy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdHRoaXMucGxheWluZyA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLnBsYXlCdG4uc2V0VGV4dChcIlBsYXlcIik7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMuaW5kZXggKz0gMTtcblx0XHRcdHRoaXMucmVuZGVyV29yZCgpO1xuXHRcdFx0dGhpcy5wcm9ncmVzc0VsLnNldFRleHQodGhpcy5wcm9ncmVzc1RleHQoKSk7XG5cdFx0XHR0aGlzLnNjaGVkdWxlQWR2YW5jZSgpO1xuXHRcdH0sIGRlbGF5KTtcblx0fVxufSIsICJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIEZhc3RSZWFkZXJQbHVnaW4gZnJvbSBcIi4vbWFpblwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZhc3RSZWFkZXJTZXR0aW5ncyB7XG5cdHdwbTogbnVtYmVyO1xuXHR3cG1TdGVwOiBudW1iZXI7XG5cdHB1bmN0dWF0aW9uRGVsYXlNczogbnVtYmVyO1xuXHRibG9ja1BhdXNlTXM6IG51bWJlcjtcblx0Zm9udFNpemVQeDogbnVtYmVyO1xuXHRzaG93QmxvY2tIaWdobGlnaHQ6IGJvb2xlYW47XG5cdGJsb2NrSGlnaGxpZ2h0V2lkdGhQeDogbnVtYmVyO1xuXHRvcnBDb2xvcjogc3RyaW5nO1xuXHRvcnBUaWNrV2lkdGhQeDogbnVtYmVyO1xuXHRvcnBUaWNrTGVuZ3RoRW06IG51bWJlcjtcblx0b3JwVGlja0dhcEVtOiBudW1iZXI7XG5cdC8qKiBSZW1vdmUgbGVhZGluZyBgPmAgY2FsbG91dCAvIHF1b3RlIGJsb2NrcyBiZWZvcmUgdG9rZW5pemluZyAoZS5nLiBWaWRlbyBLXHUwMEZDbnllc2kpLiAqL1xuXHRza2lwTGVhZGluZ0NhbGxvdXRzOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogRmFzdFJlYWRlclNldHRpbmdzID0ge1xuXHR3cG06IDMwMCxcblx0d3BtU3RlcDogNTAsXG5cdHB1bmN0dWF0aW9uRGVsYXlNczogMzAwLFxuXHRibG9ja1BhdXNlTXM6IDMwMCxcblx0Zm9udFNpemVQeDogNTYsXG5cdHNob3dCbG9ja0hpZ2hsaWdodDogdHJ1ZSxcblx0YmxvY2tIaWdobGlnaHRXaWR0aFB4OiAyLFxuXHRvcnBDb2xvcjogXCIjZmYzYjNiXCIsXG5cdG9ycFRpY2tXaWR0aFB4OiAyLFxuXHRvcnBUaWNrTGVuZ3RoRW06IDAuNDIsXG5cdG9ycFRpY2tHYXBFbTogMC4xLFxuXHRza2lwTGVhZGluZ0NhbGxvdXRzOiB0cnVlLFxufTtcbmNvbnN0IE9SUF9IRVggPSAvXiNbMC05QS1GYS1mXXs2fSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplT3JwQ29sb3IodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IHYgPSB2YWx1ZS50cmltKCk7XG5cdGlmIChPUlBfSEVYLnRlc3QodikpIHJldHVybiB2O1xuXHRyZXR1cm4gXCIjZmYzYjNiXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVNwcml0ekFwcGVhcmFuY2VWYXJzKFxuXHRlbDogSFRNTEVsZW1lbnQsXG5cdHM6IEZhc3RSZWFkZXJTZXR0aW5nc1xuKTogdm9pZCB7XG5cdGVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1mYXN0LXJlYWRlci1vcnBcIiwgbm9ybWFsaXplT3JwQ29sb3Iocy5vcnBDb2xvcikpO1xuXHRlbC5zdHlsZS5zZXRQcm9wZXJ0eShcblx0XHRcIi0tZmFzdC1yZWFkZXItb3JwLXRpY2std2lkdGhcIixcblx0XHRgJHtNYXRoLm1pbig4LCBNYXRoLm1heCgxLCBzLm9ycFRpY2tXaWR0aFB4KSl9cHhgXG5cdCk7XG5cdGVsLnN0eWxlLnNldFByb3BlcnR5KFxuXHRcdFwiLS1mYXN0LXJlYWRlci1vcnAtdGljay1sZW5ndGhcIixcblx0XHRgJHtNYXRoLm1pbigxLCBNYXRoLm1heCgwLjEyLCBzLm9ycFRpY2tMZW5ndGhFbSkpfWVtYFxuXHQpO1xuXHRlbC5zdHlsZS5zZXRQcm9wZXJ0eShcblx0XHRcIi0tZmFzdC1yZWFkZXItb3JwLXRpY2stZ2FwXCIsXG5cdFx0YCR7TWF0aC5taW4oMC40NSwgTWF0aC5tYXgoMCwgcy5vcnBUaWNrR2FwRW0pKX1lbWBcblx0KTtcblx0ZWwuc3R5bGUuc2V0UHJvcGVydHkoXG5cdFx0XCItLWZhc3QtcmVhZGVyLWJsb2NrLWJvcmRlci13aWR0aFwiLFxuXHRcdGAke01hdGgubWluKDgsIE1hdGgubWF4KDEsIHMuYmxvY2tIaWdobGlnaHRXaWR0aFB4KSl9cHhgXG5cdCk7XG59XG5cblxuZXhwb3J0IGNsYXNzIEZhc3RSZWFkZXJTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG5cdHBsdWdpbjogRmFzdFJlYWRlclBsdWdpbjtcblx0cHJpdmF0ZSBwcmV2aWV3Um9vdDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBGYXN0UmVhZGVyUGx1Z2luKSB7XG5cdFx0c3VwZXIoYXBwLCBwbHVnaW4pO1xuXHRcdHRoaXMucGx1Z2luID0gcGx1Z2luO1xuXHR9XG5cblx0aGlkZSgpOiB2b2lkIHtcblx0XHR0aGlzLnBsdWdpbi5zZXR0aW5nc1ByZXZpZXdSZWRyYXcgPSBudWxsO1xuXHRcdHRoaXMucHJldmlld1Jvb3QgPSBudWxsO1xuXHR9XG5cblx0ZGlzcGxheSgpOiB2b2lkIHtcblx0XHRjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cdFx0dGhpcy5wcmV2aWV3Um9vdCA9IG51bGw7XG5cblx0XHRjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJGYXN0IFJlYWRlciAoU3ByaXR6KVwiIH0pO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIldvcmRzIHBlciBtaW51dGVcIilcblx0XHRcdC5zZXREZXNjKFwiRGVmYXVsdCBzcGVlZCB3aGVuIG9wZW5pbmcgdGhlIHJlYWRlciAoNjAtMTIwMCkuXCIpXG5cdFx0XHQuYWRkVGV4dCgodGV4dCkgPT5cblx0XHRcdFx0dGV4dFxuXHRcdFx0XHRcdC5zZXRQbGFjZWhvbGRlcihTdHJpbmcoREVGQVVMVF9TRVRUSU5HUy53cG0pKVxuXHRcdFx0XHRcdC5zZXRWYWx1ZShTdHJpbmcodGhpcy5wbHVnaW4uc2V0dGluZ3Mud3BtKSlcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBuID0gcGFyc2VJbnQodmFsdWUucmVwbGFjZSgvXFxEL2csIFwiXCIpLCAxMCk7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy53cG0gPSBOdW1iZXIuaXNGaW5pdGUobilcblx0XHRcdFx0XHRcdFx0PyBNYXRoLm1pbigxMjAwLCBNYXRoLm1heCg2MCwgbikpXG5cdFx0XHRcdFx0XHRcdDogREVGQVVMVF9TRVRUSU5HUy53cG07XG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnJlZnJlc2hTcHJpdHpWaWV3V3BtVWkoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJXUE0gc3RlcCAoKy8tIGluIHJlYWRlcilcIilcblx0XHRcdC5zZXREZXNjKFwiSG93IG11Y2ggZWFjaCBzcGVlZCBidXR0b24gY2hhbmdlcyBXUE0gKDEwLTIwMCkuXCIpXG5cdFx0XHQuYWRkVGV4dCgodGV4dCkgPT5cblx0XHRcdFx0dGV4dFxuXHRcdFx0XHRcdC5zZXRQbGFjZWhvbGRlcihTdHJpbmcoREVGQVVMVF9TRVRUSU5HUy53cG1TdGVwKSlcblx0XHRcdFx0XHQuc2V0VmFsdWUoU3RyaW5nKHRoaXMucGx1Z2luLnNldHRpbmdzLndwbVN0ZXApKVxuXHRcdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IG4gPSBwYXJzZUludCh2YWx1ZS5yZXBsYWNlKC9cXEQvZywgXCJcIiksIDEwKTtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLndwbVN0ZXAgPSBOdW1iZXIuaXNGaW5pdGUobilcblx0XHRcdFx0XHRcdFx0PyBNYXRoLm1pbigyMDAsIE1hdGgubWF4KDEwLCBuKSlcblx0XHRcdFx0XHRcdFx0OiBERUZBVUxUX1NFVFRJTkdTLndwbVN0ZXA7XG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJQdW5jdHVhdGlvbiBwYXVzZVwiKVxuXHRcdFx0LnNldERlc2MoXCJFeHRyYSBtcyBhZnRlciBzdHJvbmcgcHVuY3R1YXRpb24gKC4gISA/KS4gSGFsZiBmb3IgbGlnaHRlciBwdW5jdHVhdGlvbi5cIilcblx0XHRcdC5hZGRUZXh0KCh0ZXh0KSA9PlxuXHRcdFx0XHR0ZXh0XG5cdFx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKFN0cmluZyhERUZBVUxUX1NFVFRJTkdTLnB1bmN0dWF0aW9uRGVsYXlNcykpXG5cdFx0XHRcdFx0LnNldFZhbHVlKFN0cmluZyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wdW5jdHVhdGlvbkRlbGF5TXMpKVxuXHRcdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IG4gPSBwYXJzZUludCh2YWx1ZS5yZXBsYWNlKC9cXEQvZywgXCJcIiksIDEwKTtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnB1bmN0dWF0aW9uRGVsYXlNcyA9IE51bWJlci5pc0Zpbml0ZShuKVxuXHRcdFx0XHRcdFx0XHQ/IE1hdGgubWluKDIwMDAsIE1hdGgubWF4KDAsIG4pKVxuXHRcdFx0XHRcdFx0XHQ6IERFRkFVTFRfU0VUVElOR1MucHVuY3R1YXRpb25EZWxheU1zO1xuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdCk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiTmV3IGJsb2NrIHBhdXNlXCIpXG5cdFx0XHQuc2V0RGVzYyhcIkV4dHJhIG1zIG9uIHRoZSBmaXJzdCB3b3JkIGFmdGVyIGEgbmV3IHBhcmFncmFwaCBvciBsaXN0IGl0ZW0uXCIpXG5cdFx0XHQuYWRkVGV4dCgodGV4dCkgPT5cblx0XHRcdFx0dGV4dFxuXHRcdFx0XHRcdC5zZXRQbGFjZWhvbGRlcihTdHJpbmcoREVGQVVMVF9TRVRUSU5HUy5ibG9ja1BhdXNlTXMpKVxuXHRcdFx0XHRcdC5zZXRWYWx1ZShTdHJpbmcodGhpcy5wbHVnaW4uc2V0dGluZ3MuYmxvY2tQYXVzZU1zKSlcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBuID0gcGFyc2VJbnQodmFsdWUucmVwbGFjZSgvXFxEL2csIFwiXCIpLCAxMCk7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5ibG9ja1BhdXNlTXMgPSBOdW1iZXIuaXNGaW5pdGUobilcblx0XHRcdFx0XHRcdFx0PyBNYXRoLm1pbigyMDAwLCBNYXRoLm1heCgwLCBuKSlcblx0XHRcdFx0XHRcdFx0OiBERUZBVUxUX1NFVFRJTkdTLmJsb2NrUGF1c2VNcztcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHQpO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIlNraXAgbGVhZGluZyBjYWxsb3V0c1wiKVxuXHRcdFx0LnNldERlc2MoXG5cdFx0XHRcdFwiV2hlbiBvbiwgYmxvY2txdW90ZS9jYWxsb3V0IGxpbmVzICg+KSBhdCB0aGUgdmVyeSBzdGFydCBvZiB0aGUgbm90ZSBhcmUgbm90IHJlYWRcdTIwMTR1c2VmdWwgYmVmb3JlIGEgTm90bGFyIHNlY3Rpb24uIFR1cm4gb2ZmIGlmIHlvdXIgbm90ZSBzdGFydHMgd2l0aCBhIHF1b3RlIHlvdSB3YW50IHRvIGhlYXIuXCJcblx0XHRcdClcblx0XHRcdC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cblx0XHRcdFx0dG9nZ2xlXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNraXBMZWFkaW5nQ2FsbG91dHMpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2KSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5za2lwTGVhZGluZ0NhbGxvdXRzID0gdjtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHQpO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIkZvbnQgc2l6ZSAocHgpXCIpXG5cdFx0XHQuc2V0RGVzYyhcIldvcmQgZGlzcGxheSBzaXplIGluIHRoZSBTcHJpdHogcGFuZS5cIilcblx0XHRcdC5hZGRUZXh0KCh0ZXh0KSA9PlxuXHRcdFx0XHR0ZXh0XG5cdFx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKFN0cmluZyhERUZBVUxUX1NFVFRJTkdTLmZvbnRTaXplUHgpKVxuXHRcdFx0XHRcdC5zZXRWYWx1ZShTdHJpbmcodGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9udFNpemVQeCkpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgbiA9IHBhcnNlSW50KHZhbHVlLnJlcGxhY2UoL1xcRC9nLCBcIlwiKSwgMTApO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9udFNpemVQeCA9IE51bWJlci5pc0Zpbml0ZShuKVxuXHRcdFx0XHRcdFx0XHQ/IE1hdGgubWluKDEyMCwgTWF0aC5tYXgoMjQsIG4pKVxuXHRcdFx0XHRcdFx0XHQ6IERFRkFVTFRfU0VUVElOR1MuZm9udFNpemVQeDtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4ucmVmcmVzaFNwcml0elZpZXdGb250KCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdCk7XG5cblx0XHRjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJMb29rIGFuZCBwcmV2aWV3XCIgfSk7XG5cdFx0dGhpcy5idWlsZFByZXZpZXcoY29udGFpbmVyRWwpO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIkhpZ2hsaWdodCBuZXcgYmxvY2tcIilcblx0XHRcdC5zZXREZXNjKFwiV2hlbiBvbiwgdGhlIGZpcnN0IHdvcmQgb2YgYSBuZXcgcGFyYWdyYXBoIG9yIGxpc3QgaXRlbSBzaG93cyBhIGZyYW1lIGhpZ2hsaWdodC5cIilcblx0XHRcdC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cblx0XHRcdFx0dG9nZ2xlXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dCbG9ja0hpZ2hsaWdodClcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHYpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dCbG9ja0hpZ2hsaWdodCA9IHY7XG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnJlZnJlc2hTcHJpdHpBcHBlYXJhbmNlKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdCk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiQmxvY2sgZnJhbWUgd2lkdGggKHB4KVwiKVxuXHRcdFx0LnNldERlc2MoXCJUaGlja25lc3Mgb2YgdGhlIGluc2V0IGJvcmRlciB3aGVuIGJsb2NrIGhpZ2hsaWdodCBpcyBvbiAoMS04KS5cIilcblx0XHRcdC5hZGRTbGlkZXIoKHNsaWRlcikgPT5cblx0XHRcdFx0c2xpZGVyXG5cdFx0XHRcdFx0LnNldExpbWl0cygxLCA4LCAxKVxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5ibG9ja0hpZ2hsaWdodFdpZHRoUHgpXG5cdFx0XHRcdFx0LnNldER5bmFtaWNUb29sdGlwKClcblx0XHRcdFx0XHQuc2V0SW5zdGFudCh0cnVlKVxuXHRcdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmJsb2NrSGlnaGxpZ2h0V2lkdGhQeCA9IE1hdGgucm91bmQodmFsdWUpO1xuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5yZWZyZXNoU3ByaXR6QXBwZWFyYW5jZSgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHQpO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIk9SUCBtYXJrZXIgY29sb3JcIilcblx0XHRcdC5zZXREZXNjKFwiQ29sb3IgZm9yIHRoZSBmb2NhbCBsZXR0ZXIgYW5kIGl0cyB2ZXJ0aWNhbCB0aWNrcy5cIilcblx0XHRcdC5hZGRDb2xvclBpY2tlcigocGlja2VyKSA9PlxuXHRcdFx0XHRwaWNrZXJcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mub3JwQ29sb3IpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2KSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcnBDb2xvciA9IHY7XG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnJlZnJlc2hTcHJpdHpBcHBlYXJhbmNlKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdCk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiT1JQIHRpY2sgdGhpY2tuZXNzIChweClcIilcblx0XHRcdC5zZXREZXNjKFwiV2lkdGggb2YgdGhlIHJlZCBiYXJzIGFib3ZlIGFuZCBiZWxvdyB0aGUgZm9jYWwgbGV0dGVyICgxLTgpLlwiKVxuXHRcdFx0LmFkZFNsaWRlcigoc2xpZGVyKSA9PlxuXHRcdFx0XHRzbGlkZXJcblx0XHRcdFx0XHQuc2V0TGltaXRzKDEsIDgsIDEpXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm9ycFRpY2tXaWR0aFB4KVxuXHRcdFx0XHRcdC5zZXREeW5hbWljVG9vbHRpcCgpXG5cdFx0XHRcdFx0LnNldEluc3RhbnQodHJ1ZSlcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5vcnBUaWNrV2lkdGhQeCA9IE1hdGgucm91bmQodmFsdWUpO1xuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5yZWZyZXNoU3ByaXR6QXBwZWFyYW5jZSgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHQpO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIk9SUCB0aWNrIGxlbmd0aCAoZW0pXCIpXG5cdFx0XHQuc2V0RGVzYyhcIkhvdyB0YWxsIGVhY2ggdmVydGljYWwgYmFyIGlzLCByZWxhdGl2ZSB0byB0aGUgd29yZCBzaXplICgwLjEyLTEpLlwiKVxuXHRcdFx0LmFkZFNsaWRlcigoc2xpZGVyKSA9PlxuXHRcdFx0XHRzbGlkZXJcblx0XHRcdFx0XHQuc2V0TGltaXRzKDAuMTIsIDEsIDAuMDIpXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm9ycFRpY2tMZW5ndGhFbSlcblx0XHRcdFx0XHQuc2V0RHluYW1pY1Rvb2x0aXAoKVxuXHRcdFx0XHRcdC5zZXRJbnN0YW50KHRydWUpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3Mub3JwVGlja0xlbmd0aEVtID1cblx0XHRcdFx0XHRcdFx0TWF0aC5yb3VuZChNYXRoLm1pbigxLCBNYXRoLm1heCgwLjEyLCB2YWx1ZSkpICogMTAwKSAvIDEwMDtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4ucmVmcmVzaFNwcml0ekFwcGVhcmFuY2UoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJPUlAgdGljayBnYXAgKGVtKVwiKVxuXHRcdFx0LnNldERlc2MoXCJTcGFjZSBiZXR3ZWVuIGVhY2ggYmFyIGFuZCB0aGUgZm9jYWwgbGV0dGVyICgwLTAuNDUpLlwiKVxuXHRcdFx0LmFkZFNsaWRlcigoc2xpZGVyKSA9PlxuXHRcdFx0XHRzbGlkZXJcblx0XHRcdFx0XHQuc2V0TGltaXRzKDAsIDAuNDUsIDAuMDEpXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm9ycFRpY2tHYXBFbSlcblx0XHRcdFx0XHQuc2V0RHluYW1pY1Rvb2x0aXAoKVxuXHRcdFx0XHRcdC5zZXRJbnN0YW50KHRydWUpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3Mub3JwVGlja0dhcEVtID1cblx0XHRcdFx0XHRcdFx0TWF0aC5yb3VuZChNYXRoLm1pbigwLjQ1LCBNYXRoLm1heCgwLCB2YWx1ZSkpICogMTAwKSAvIDEwMDtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4ucmVmcmVzaFNwcml0ekFwcGVhcmFuY2UoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0KTtcblxuXHRcdHRoaXMucGx1Z2luLnNldHRpbmdzUHJldmlld1JlZHJhdyA9ICgpID0+IHRoaXMuc3luY1ByZXZpZXcoKTtcblx0XHR0aGlzLnN5bmNQcmV2aWV3KCk7XG5cdH1cblxuXHRwcml2YXRlIGJ1aWxkUHJldmlldyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0XHRjb25zdCBob3N0ID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1zZXR0aW5ncy1wcmV2aWV3LWhvc3RcIiB9KTtcblx0XHRob3N0LmNyZWF0ZUVsKFwiZGl2XCIsIHtcblx0XHRcdHRleHQ6IFwiU2FtcGxlOiBuZXcgYmxvY2sgKyBmb2NhbCBsZXR0ZXJcIixcblx0XHRcdGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcblx0XHR9KTtcblx0XHR0aGlzLnByZXZpZXdSb290ID0gaG9zdC5jcmVhdGVEaXYoe1xuXHRcdFx0Y2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1wcmV2aWV3LXJvb3QgZmFzdC1yZWFkZXItc3ByaXR6LXdvcmQtd3JhcCBmYXN0LXJlYWRlci1zcHJpdHotYmxvY2stc3RhcnRcIixcblx0XHR9KTtcblx0XHRjb25zdCByb3cgPSB0aGlzLnByZXZpZXdSb290LmNyZWF0ZURpdih7IGNsczogXCJmYXN0LXJlYWRlci1zcHJpdHotd29yZC1yb3dcIiB9KTtcblx0XHRyb3cuc3R5bGUuZm9udFNpemUgPSBcIjM4cHhcIjtcblx0XHRjb25zdCBwaXZvdCA9IHJvdy5jcmVhdGVEaXYoeyBjbHM6IFwiZmFzdC1yZWFkZXItc3ByaXR6LXBpdm90LWxpbmVcIiB9KTtcblx0XHRwaXZvdC5jcmVhdGVTcGFuKHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1iZWZvcmVcIiwgdGV4dDogXCJhblwiIH0pO1xuXHRcdHBpdm90LmNyZWF0ZVNwYW4oeyBjbHM6IFwiZmFzdC1yZWFkZXItc3ByaXR6LW9ycFwiLCB0ZXh0OiBcImFcIiB9KTtcblx0XHRwaXZvdC5jcmVhdGVTcGFuKHsgY2xzOiBcImZhc3QtcmVhZGVyLXNwcml0ei1hZnRlclwiLCB0ZXh0OiBcImx5emVcIiB9KTtcblx0fVxuXG5cdHByaXZhdGUgc3luY1ByZXZpZXcoKTogdm9pZCB7XG5cdFx0aWYgKCF0aGlzLnByZXZpZXdSb290KSByZXR1cm47XG5cdFx0YXBwbHlTcHJpdHpBcHBlYXJhbmNlVmFycyh0aGlzLnByZXZpZXdSb290LCB0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XG5cdFx0dGhpcy5wcmV2aWV3Um9vdC50b2dnbGVDbGFzcyhcblx0XHRcdFwiZmFzdC1yZWFkZXItc3ByaXR6LWJsb2NrLXN0YXJ0XCIsXG5cdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93QmxvY2tIaWdobGlnaHRcblx0XHQpO1xuXHR9XG59Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUEsbUJBTU87OztBQ0xBLFNBQVMsZUFBZSxPQUF1QjtBQUNyRCxRQUFNLElBQUksTUFBTSxLQUFLLEVBQUUsUUFBUSx3Q0FBd0MsRUFBRTtBQUN6RSxTQUFPLEVBQUUsU0FBUyxJQUFJLElBQUksTUFBTSxLQUFLO0FBQ3RDO0FBR08sU0FBUyxZQUFZLE1BQXNCO0FBQ2pELFFBQU0sTUFBTSxLQUFLO0FBQ2pCLE1BQUksT0FBTztBQUFHLFdBQU87QUFDckIsTUFBSSxPQUFPO0FBQUcsV0FBTztBQUNyQixNQUFJLE9BQU87QUFBRyxXQUFPO0FBQ3JCLE1BQUksT0FBTztBQUFJLFdBQU87QUFDdEIsU0FBTztBQUNSO0FBRU8sU0FBUyxvQkFBb0IsT0FBdUI7QUFDMUQsUUFBTSxPQUFPLGVBQWUsS0FBSztBQUNqQyxRQUFNLE1BQU0sWUFBWSxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUs7QUFDdEQsUUFBTSxNQUFNLEtBQUssSUFBSSxHQUFHLE1BQU0sU0FBUyxDQUFDO0FBQ3hDLFNBQU8sS0FBSyxJQUFJLEtBQUssR0FBRztBQUN6QjtBQU9P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VSxNQUFNO0FBQ3JCLGFBQUssSUFBSSxVQUFVLGNBQWMsVUFBVSxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzFELFFBQUFBLE1BQUssVUFBVSxNQUFNO0FBQUEsTUFDdEI7QUFDQTtBQUFBLElBQ0Q7QUFFQSxVQUFNLFlBQVksS0FBSyxJQUFJLFVBQVU7QUFBQSxNQUNwQyxPQUFPO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxJQUNEO0FBQ0EsVUFBTSxVQUFVLGFBQWE7QUFBQSxNQUM1QixNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsSUFDVCxDQUFDO0FBRUQsVUFBTSxPQUFPLFVBQVU7QUFDdkIsUUFBSSxnQkFBZ0IsWUFBWTtBQUMvQixXQUFLLFVBQVUsTUFBTTtBQUNyQixXQUFLLElBQUksVUFBVSxjQUFjLFdBQVcsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUMzRCxXQUFLLFVBQVUsTUFBTTtBQUFBLElBQ3RCO0FBQUEsRUFDRDtBQUFBLEVBRUEsTUFBYyxtQkFDYixLQUNBLGVBQ0Esc0JBQ2dCO0FBeE5sQjtBQXlORSxTQUFLLDhCQUE4QjtBQUNuQyxRQUFJO0FBQ0osUUFBSSxlQUFlO0FBQ2xCLGVBQVM7QUFBQSxRQUNSO0FBQUEsUUFDQSxLQUFLLFNBQVM7QUFBQSxNQUNmO0FBQUEsSUFDRCxPQUFPO0FBQ04sWUFBTSxRQUFRLElBQUksUUFBUSxTQUFTLElBQUksRUFBRSxLQUFLO0FBQzlDLGVBQVMscUJBQXFCLFNBQVMsS0FBSyxDQUFDO0FBQUEsSUFDOUM7QUFDQSxRQUFJLE9BQU8sV0FBVyxHQUFHO0FBQ3hCLFVBQUksd0JBQU8sbUJBQW1CO0FBQzlCO0FBQUEsSUFDRDtBQUVBLFFBQUksT0FBTyxLQUFLLElBQUksVUFBVSxnQkFBZ0IsZ0JBQWdCLEVBQUUsQ0FBQztBQUNqRSxRQUFJLENBQUMsTUFBTTtBQUNWLGNBQU8sVUFBSyxJQUFJLFVBQVUsYUFBYSxLQUFLLE1BQXJDLFlBQTBDLEtBQUssSUFBSSxVQUFVLFFBQVEsS0FBSztBQUNqRixZQUFNLEtBQUssYUFBYTtBQUFBLFFBQ3ZCLE1BQU07QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNULENBQUM7QUFBQSxJQUNGLE9BQU87QUFDTixXQUFLLElBQUksVUFBVSxXQUFXLElBQUk7QUFBQSxJQUNuQztBQUVBLFVBQU0sT0FBTyxLQUFLO0FBQ2xCLFFBQUksZ0JBQWdCLFlBQVk7QUFDL0IsV0FBSyxVQUFVLE1BQU07QUFDckIsV0FBSyxJQUFJLFVBQVUsY0FBYyxNQUFNLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDdEQsV0FBSyxVQUFVLE1BQU07QUFBQSxJQUN0QjtBQUFBLEVBQ0Q7QUFDRDsiLAogICJuYW1lcyI6IFsiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJ2aWV3Il0KfQo=
