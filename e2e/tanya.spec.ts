import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Every test mocks /api/tanya, so the suite never calls Z.ai and never spends tokens.

function mockReply(page: Page, chunks: string[]) {
  const body =
    chunks
      .map((c) => `data: ${JSON.stringify({ choices: [{ delta: { content: c } }] })}\n\n`)
      .join("") + "data: [DONE]\n\n";
  page.route("**/api/tanya", (route) => route.fulfill({ status: 200, contentType: "text/event-stream", body }));
}

const question = "Which components are ready in React?";
const answerPart = "Badge and Input";

async function ask(page: Page) {
  await page.getByLabel("Your message").fill(question);
  await page.getByRole("button", { name: "Send message" }).click();
}

test("launcher: ask from the home page and close with Escape", async ({ page }) => {
  mockReply(page, ["In React you find ", "**Button**, Badge and Input", " so far."]);
  await page.goto("/");
  await page.getByRole("button", { name: "Open Tanya Natuna chat" }).click();
  await ask(page);
  // The streamed chunks land in separate inline nodes, so match on the stable part.
  await expect(page.getByRole("log")).toContainText(answerPart);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("suggested question starts a conversation", async ({ page }) => {
  mockReply(page, ["The Button usage is: ", "`<Button size=\"lg\">Pay</Button>`"]);
  await page.goto("/tanya");
  await page.getByRole("button", { name: "How do I use the Button component?" }).click();
  await expect(page.getByRole("log")).toContainText("The Button usage is:");
});

test("a failed answer shows the error and Retry recovers", async ({ page }) => {
  await page.route("**/api/tanya", (route) => route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ error: "The AI service did not answer. Try again in a moment." }) }));
  await page.goto("/tanya");
  await ask(page);
  const errorText = page.getByText("The AI service did not answer");
  await expect(errorText).toBeVisible();

  mockReply(page, ["Recovered answer."]);
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("log")).toContainText("Recovered answer.");
  await expect(errorText).not.toBeVisible();
});

for (const mode of ["light", "dark"] as const) {
  test(`axe: /tanya (${mode})`, async ({ page }) => {
    await page.addInitScript((m) => localStorage.setItem("theme", m), mode);
    await page.goto("/tanya");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag2aaa"]).analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
    expect(summary).toEqual([]);
  });
}
