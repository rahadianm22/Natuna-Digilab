import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, XCircle } from "@phosphor-icons/react/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OnThisPage from "@/components/OnThisPage";
import ComponentSidebar, { ComponentMobileNav } from "@/components/ComponentSidebar";
import ComponentPreview from "@/components/ComponentPreview";
import CodeBlock from "@/components/CodeBlock";
import FigmaFrame from "@/components/FigmaFrame";
import Demo from "@/components/demos";
import StatusBadge from "@/components/StatusBadge";
import { componentGroup, components, getComponent, trackerRow } from "@/lib/components-data";
import { componentDocs, fullUsage } from "@/lib/component-docs";
import { lastBuildDay, statusLabel, statusStyle } from "@/lib/natuna-tracker";

import { TRACKER_SNAPSHOT } from "@/lib/site";

const LAST_BUILD_DAY = lastBuildDay();

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return { title: "Component not found" };
  return { title: component.name, description: component.summary, alternates: { canonical: `/components/${slug}` } };
}


export default async function ComponentDetail({ params }: Props) {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return notFound();
  const row = trackerRow(component.slug);
  const group = componentGroup(component.slug);
  // Four neighbours from the same category, the ones teams can use today first. The rest stay one click away.
  const rank = { stable: 0, review: 1, beta: 2, planned: 3, untracked: 4 } as const;
  const sameCategory = components.filter((c) => c.category === component.category && c.slug !== component.slug);
  const related = [...sameCategory].sort((a, b) => rank[a.status] - rank[b.status] || a.name.localeCompare(b.name)).slice(0, 4);

  // Only components built in src/ui have code to show; the rest are design-only so far.
  const doc = componentDocs[component.slug];
  const toc = [
    { id: "example", label: doc ? "Usage" : "Example" },
    ...(doc ? [{ id: "props", label: "Props" }] : []),
    { id: "when", label: "When to use" },
    { id: "practices", label: "Do and don't" },
    { id: "related", label: "Related" },
  ];
  const codeNote =
    component.category === "Documentation"
      ? "This is a Figma documentation frame, so it has no code component."
      : component.status === "untracked"
        ? "Not in the component tracker, so it has no design sign-off and no code yet. The example is a sketch of the intent."
        : "The React component is not built yet. The example shows the design only.";

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Components" />
      <ComponentMobileNav />
      <div className="mx-auto flex w-full max-w-7xl">
        <ComponentSidebar />
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-6 pb-20 pt-10 lg:px-10">
          <div className="mx-auto flex max-w-5xl gap-12">
            <article className="min-w-0 flex-1">
              <nav aria-label="Breadcrumb" className="text-sm text-gray-700">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link href="/components" className="inline-flex min-h-11 items-center rounded-sm hover:text-blue-800">Components</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/components#group-${group.replace(/\s+/g, "-")}`} className="inline-flex min-h-11 items-center rounded-sm hover:text-blue-800">
                      {group}
                    </Link>
                  </li>
                </ol>
              </nav>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{component.name}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">{component.summary}</p>

              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-gray-200 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <dt className="text-gray-700">Status</dt>
                  <dd className="flex items-center gap-2 text-gray-900">
                    {row ? (
                      <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${statusStyle[row.status]}`}>
                        {statusLabel[row.status]}
                      </span>
                    ) : (
                      <StatusBadge status={component.status} />
                    )}
                    {row?.buildDay ? <span>Build day {row.buildDay} of {LAST_BUILD_DAY}</span> : null}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-gray-700">Category</dt>
                  <dd className="text-gray-900">{component.category}</dd>
                </div>
              </dl>

              {doc ? (
                <>
                  <section aria-labelledby="example" className="mt-14 scroll-mt-24">
                    <h2 id="example" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Usage</h2>
                    <p className="mt-2 text-sm text-gray-700">
                      This demo is live, and the code below it is the same code, imports included. The component lives in{" "}
                      <code className="font-mono-code text-[13px]">src/ui</code> of this repository and is not published to npm yet.
                    </p>
                    <div className="mt-4">
                      <FigmaFrame name={component.name} className="flex min-h-48 items-center justify-center bg-surface px-6 py-10">
                        <div className="w-full">
                          <Demo slug={component.slug} />
                        </div>
                      </FigmaFrame>
                    </div>
                    <div className="mt-3">
                      <CodeBlock code={fullUsage(doc)} label="Usage" collapseAfter={14} />
                    </div>
                  </section>
                </>
              ) : (
                <section aria-labelledby="example" className="mt-14 scroll-mt-24">
                  <h2 id="example" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Example</h2>
                  <p className="mt-2 text-sm text-gray-700">{codeNote}</p>
                  <div className="mt-4">
                    <FigmaFrame name={component.name} className="flex min-h-48 items-center justify-center bg-surface px-6 py-8">
                      <div className="w-full">
                        <ComponentPreview slug={component.slug} />
                      </div>
                    </FigmaFrame>
                  </div>
                </section>
              )}

              {doc && (
                <section aria-labelledby="props" className="mt-14 scroll-mt-24">
                  <h2 id="props" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Props</h2>
                  {/* Phones get one block per prop, so the description is never pushed off screen. */}
                  <dl className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-surface sm:hidden">
                    {doc.props.map((p) => (
                      <div key={p.name} className="px-4 py-3">
                        <dt className="font-mono-code text-[13px] font-semibold text-gray-900">{p.name}</dt>
                        <dd className="mt-1 break-words font-mono-code text-xs text-gray-700">
                          {p.type}
                          <span className="text-gray-700"> · default {p.default ?? "none"}</span>
                        </dd>
                        <dd className="mt-1.5 text-sm text-gray-700">{p.description}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 hidden overflow-x-auto rounded-xl border border-gray-200 bg-surface sm:block">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-gray-200 text-gray-700">
                        <tr>
                          <th scope="col" className="px-4 py-3 font-medium">Prop</th>
                          <th scope="col" className="px-4 py-3 font-medium">Type</th>
                          <th scope="col" className="px-4 py-3 font-medium">Default</th>
                          <th scope="col" className="px-4 py-3 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 align-top">
                        {doc.props.map((p) => (
                          <tr key={p.name}>
                            <th scope="row" className="px-4 py-3 font-mono-code text-[13px] font-semibold text-gray-900">{p.name}</th>
                            <td className="px-4 py-3 font-mono-code text-xs text-gray-700">{p.type}</td>
                            <td className="px-4 py-3 font-mono-code text-xs text-gray-700">{p.default ?? "none"}</td>
                            <td className="px-4 py-3 text-gray-700">{p.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <section aria-labelledby="when" className="mt-14 scroll-mt-24">
                <h2 id="when" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">When to use</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">{component.usage}</p>
              </section>

              <section aria-labelledby="practices" className="mt-14 scroll-mt-24">
                <h2 id="practices" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Do and don&apos;t</h2>
                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <div className="border-t-4 border-emerald-600 pt-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <CheckCircle size={20} weight="fill" className="text-emerald-700" aria-hidden="true" /> Do
                    </h3>
                    <ul className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
                      {component.do.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                  <div className="border-t-4 border-red-600 pt-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <XCircle size={20} weight="fill" className="text-red-800" aria-hidden="true" /> Don&apos;t
                    </h3>
                    <ul className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
                      {component.dont.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                </div>
              </section>

              <section aria-labelledby="related" className="mt-14 scroll-mt-24">
                <h2 id="related" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Related</h2>
                <p className="mt-2 text-sm text-gray-700">
                  {related.length < sameCategory.length
                    ? `${related.length} of ${sameCategory.length} other ${component.category.toLowerCase()} components, ready ones first.`
                    : `Other ${component.category.toLowerCase()} components.`}
                </p>
                <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                  {related.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/components/${c.slug}`} prefetch={false} className="group flex min-h-12 items-center justify-between gap-4 py-3">
                        <span className="min-w-0">
                          <span className="font-medium text-gray-900 group-hover:text-blue-800">{c.name}</span>
                          <span className="block truncate text-sm text-gray-700">{c.summary}</span>
                        </span>
                        <StatusBadge status={c.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
                {related.length < sameCategory.length && (
                  <Link href="/components" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-blue-800 underline-offset-4 hover:underline">
                    See all components
                  </Link>
                )}
              </section>

              <p className="mt-12 text-xs text-gray-700">Status reflects the component tracker snapshot of {TRACKER_SNAPSHOT}.</p>
            </article>

            <OnThisPage items={toc} className="hidden w-44 xl:block" />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
