import { chromium } from "playwright-core";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(site, "dist");
const output = path.resolve(
  process.env.CANOPY_DRAFT_OUTPUT || path.join(dist, "draft-review"),
);
fs.mkdirSync(output, { recursive: true });
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".woff2": "font/woff2",
};
const server = http.createServer((request, response) => {
  try {
    let file = path.resolve(
      dist,
      "." +
        decodeURIComponent(new URL(request.url, "http://localhost").pathname),
    );
    if (file !== dist && !file.startsWith(dist + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
    });
    response.end(fs.readFileSync(file));
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.CANOPY_CHROMIUM || undefined,
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const failures = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(response.url());
  });
  await page.goto(`${address}/design/`, { waitUntil: "networkidle" });
  if ((await page.locator("html").getAttribute("data-draft-theme")) !== "ink")
    throw new Error("The selected Ink palette must be the default");
  if (!(await page.locator(".right-nav").isVisible()))
    throw new Error("The selected Forest layout must retain on-page navigation");
  const contrastRatios = {};
  const contrast = (first, second) => {
    const luminance = (hex) => {
      const channels = hex
        .slice(1)
        .match(/../g)
        .map((part) => parseInt(part, 16) / 255);
      const linear = channels.map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const a = luminance(first),
      b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  for (const theme of ["forest", "lantern", "ink"]) {
    await page.goto(`${address}/design/?theme=${theme}`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    const tokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return Object.fromEntries(
        ["ink", "muted", "bg", "panel", "accent", "accent-ink", "code"].map(
          (name) => [name, style.getPropertyValue("--learn-" + name).trim()],
        ),
      );
    });
    const ratios = [
      contrast(tokens.ink, tokens.bg),
      contrast(tokens.muted, tokens.panel),
      contrast(tokens.accent, tokens.code),
      contrast(tokens["accent-ink"], tokens.accent),
    ];
    if (ratios.some((ratio) => ratio < 4.5))
      throw new Error(`Text contrast failed for ${theme}`);
    contrastRatios[theme] = ratios.map((ratio) => Number(ratio.toFixed(2)));

    if ((await page.locator("html").getAttribute("data-draft-theme")) !== theme)
      throw new Error("Theme selection failed");
    await page.screenshot({
      path: path.join(output, `${theme}-desktop.png`),
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Add a fish" }).click();
  if ((await page.locator("[data-node-tree] li").count()) !== 3)
    throw new Error("Tree did not add fish");
  if (
    !(await page.locator("[data-node-code]").textContent()).includes(
      'EmptyNode("Fish 3")',
    )
  )
    throw new Error("Code did not follow fish count");
  await page.getByRole("button", { name: "Add a fish" }).click();
  if (!(await page.getByRole("button", { name: "Add a fish" }).isDisabled()))
    throw new Error("Preview limit not enforced");
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Remove a fish" }).click();
  if ((await page.locator("[data-node-tree] li").count()) !== 0)
    throw new Error("Empty tree failed");
  if (!(await page.getByRole("button", { name: "Remove a fish" }).isDisabled()))
    throw new Error("Removal lower bound failed");
  await page.locator("[data-reset-nodes]").click();
  await page.locator(".optional-question > summary").click();
  await page.getByRole("button", { name: "Fish 1", exact: true }).click();
  if (
    !(await page.locator("[data-node-feedback]").textContent()).includes(
      "sibling",
    )
  )
    throw new Error("Question explanation failed");
  await page.getByRole("button", { name: "Aquarium", exact: true }).click();
  if (
    !(await page.locator("[data-node-feedback]").textContent()).includes(
      "That’s it",
    )
  )
    throw new Error("Correct answer failed");
  await page.locator("[data-frame-walkthrough] > summary").click();
  for (let i = 0; i < 6; i++) await page.locator("[data-frame-next]").click();
  if (!(await page.locator("[data-frame-next]").isDisabled()))
    throw new Error("Frame sequence did not finish");
  if (
    !(await page.locator("[data-frame-description]").textContent()).includes(
      "Present:",
    )
  )
    throw new Error("Frame order failed");
  await page.locator("[data-frame-reset]").click();
  if (await page.locator("[data-frame-next]").isDisabled())
    throw new Error("Frame reset failed");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${address}/design/?theme=forest`, {
    waitUntil: "networkidle",
  });
  if (
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
  )
    throw new Error("Mobile horizontal overflow");
  await page.getByRole("button", { name: "Add a fish" }).click();
  if ((await page.locator("[data-node-tree] li").count()) !== 3)
    throw new Error("Mobile interaction failed");
  await page.locator("[data-reset-nodes]").click();
  await page.screenshot({
    path: path.join(output, "forest-mobile.png"),
    fullPage: true,
  });
  await page.locator("[data-add-fish]").focus();
  await page.keyboard.press("Enter");
  if ((await page.locator("[data-node-tree] li").count()) !== 3)
    throw new Error("Keyboard node activation failed");
  await page.reload({ waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(
    () => document.activeElement?.textContent,
  );
  if (!focused?.includes("Skip"))
    throw new Error("Keyboard skip link not reachable");
  if (errors.length || failures.length)
    throw new Error(JSON.stringify({ errors, failures }));
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const theme of ["forest", "lantern", "ink"]) {
      await page.goto(`${address}/design/?theme=${theme}`, {
        waitUntil: "networkidle",
      });
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        )
      )
        throw new Error(`Overflow in ${theme} at ${width}px`);
    }
  }
  const offline = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  const offlineErrors = [];
  offline.on("pageerror", (error) => offlineErrors.push(error.message));
  await offline.goto(`${address}/canopy-learning-draft.html`, {
    waitUntil: "networkidle",
  });
  await offline.context().setOffline(true);
  await offline.getByRole("button", { name: "Lantern", exact: true }).click();
  await offline.getByRole("button", { name: "Add a fish" }).click();
  if (
    (await offline.locator("[data-node-tree] li").count()) !== 3 ||
    offlineErrors.length
  )
    throw new Error("Offline draft failed");
  if (
    (await offline.locator("html").getAttribute("data-draft-theme")) !==
    "lantern"
  )
    throw new Error("Offline theme selection failed");
  if (
    await offline.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
  )
    throw new Error("Offline mobile overflow");
  fs.writeFileSync(
    path.join(output, "browser-checks.json"),
    JSON.stringify(
      {
        themes: 3,
        desktop: "1440×1200",
        mobile: "390×844",
        nodeControls: "pass",
        optionalQuestion: "pass",
        frameOrderAndReset: "pass",
        keyboardSkipLink: "pass",
        keyboardNodeActivation: "pass",
        mobileThemeWidths: [320, 390],
        mobileOverflow: "none",
        offlineDraft: "pass",
        contrastRatios,
        errors,
        failedRequests: failures,
      },
      null,
      2,
    ),
  );
  console.log("Offline exported draft interactions pass.");
  console.log(
    "Draft themes, node controls, optional question, frame walkthrough, mobile layout and keyboard checks pass.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
