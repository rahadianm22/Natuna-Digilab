import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, XCircle } from "@phosphor-icons/react/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComponentSidebar, { ComponentMobileNav } from "@/components/ComponentSidebar";
import ComponentPreview from "@/components/ComponentPreview";
import CodeBlock from "@/components/CodeBlock";
import Demo from "@/components/demos";
import StatusBadge from "@/components/StatusBadge";
import { components, getComponent, trackerRow } from "@/lib/components-data";
import { componentDocs } from "@/lib/component-docs";
import { statusLabel, statusStyle } from "@/lib/natuna-tracker";
import { TRACKER_SNAPSHOT } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return { title: "Component not found" };
  return { title: component.name, description: component.summary };
}


export default async function ComponentDetail({ params }: Props) {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return notFound();
  const row = trackerRow(component.slug);
  const related = components.filter((c) => c.category === component.category && c.slug !== component.slug);

  // Only components built in src/ui have code to show; the rest are design-only so far.
  const doc = componentDocs[component.slug];
  const toc = [
    ...(doc ? [{ id: "import", label: "Import" }] : []),
    { id: "example", label: doc ? "Usage" : "Example" },
    ...(doc ? [{ id: "props", label: "Props" }] : []),
    { id: "when", label: "When to use" },
    { id: "practices", label: "Do and don't" },
    { id: "related", label: "Related" },
  ];
  const codeNote =
    component.category === "Documentation"
      ? "This is a Figma documentation frame, so it has no code component."
      : "The React component is not built yet. The example shows the design only.";

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header active="Components" />
      <ComponentMobileNav />
      <div className="mx-auto flex w-full max-w-[90rem]">
        <ComponentSidebar />
        <main className="min-w-0 flex-1 px-4 pb-20 pt-10 sm:px-10">
          <div className="mx-auto flex max-w-5xl gap-12">
            <article className="min-w-0 flex-1">
              <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link href="/components" className="rounded-sm hover:text-blue-700">Components</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>{component.category}</li>
                </ol>
              </nav>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{component.name}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">{component.summary}</p>

              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-gray-200 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <dt className="text-gray-600">Status</dt>
                  <dd className="flex items-center gap-2 text-gray-900">
                    {row ? (
                      <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${statusStyle[row.status]}`}>
                        {statusLabel[row.status]}
                      </span>
                    ) : (
                      <StatusBadge status={component.status} />
                    )}
                    {row?.buildDay ? <span>Build day {row.buildDay}</span> : null}
                    {!row && <span className="text-gray-600">Not in the tracker yet</span>}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-gray-600">Category</dt>
                  <dd className="text-gray-900">{component.category}</dd>
                </div>
              </dl>

              {component.status === "planned" && (
                <p role="note" className="mt-6 max-w-2xl rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-700">
                  Not built yet. The example shows the intended design, not a released component.
                </p>
              )}

              {doc ? (
                <>
                  <section aria-labelledby="import" className="mt-12 scroll-mt-24">
                    <h2 id="import" className="text-2xl font-bold tracking-tight text-gray-900">Import</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Built in <code className="font-mono-code text-[13px]">src/ui</code> of this repository. It is not
                      published to npm yet.
                    </p>
                    <div className="mt-4">
                      <CodeBlock code={doc.importCode} label="Import" />
                    </div>
                  </section>

                  <section aria-labelledby="example" className="mt-12 scroll-mt-24">
                    <h2 id="example" className="text-2xl font-bold tracking-tight text-gray-900">Usage</h2>
                    <p className="mt-2 text-sm text-gray-600">This demo is live. The code below it is the same code.</p>
                    <div className="mt-4 flex min-h-48 items-center justify-center rounded-xl border border-gray-200 bg-surface px-6 py-10">
                      <div className="w-full">
                        <Demo slug={component.slug} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <CodeBlock code={doc.usage} label="Usage" />
                    </div>
                  </section>
                </>
              ) : (
                <section aria-labelledby="example" className="mt-12 scroll-mt-24">
                  <h2 id="example" className="text-2xl font-bold tracking-tight text-gray-900">Example</h2>
                  <p className="mt-2 text-sm text-gray-600">{codeNote}</p>
                  <div className="mt-4 flex min-h-48 items-center justify-center rounded-xl border border-gray-200 bg-surface px-6 py-8">
                    <div className="w-full">
                      <ComponentPreview slug={component.slug} />
                    </div>
                  </div>
                </section>
              )}

              {doc && (
                <section aria-labelledby="props" className="mt-14 scroll-mt-24">
                  <h2 id="props" className="text-2xl font-bold text-gray-900">Props</h2>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-surface">
                    <table className="w-full min-w-[40rem] text-left text-sm">
                      <thead className="border-b border-gray-200 text-gray-600">
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
                <h2 id="when" className="text-2xl font-bold text-gray-900">When to use</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-gray-700">{component.usage}</p>
              </section>

              <section aria-labelledby="practices" className="mt-14 scroll-mt-24">
                <h2 id="practices" className="text-2xl font-bold text-gray-900">Do and don&apos;t</h2>
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
                      <XCircle size={20} weight="fill" className="text-red-700" aria-hidden="true" /> Don&apos;t
                    </h3>
                    <ul className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
                      {component.dont.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                </div>
              </section>

              <section aria-labelledby="related" className="mt-14 scroll-mt-24">
                <h2 id="related" className="text-2xl font-bold text-gray-900">Related</h2>
                <p className="mt-2 text-sm text-gray-600">Other {component.category.toLowerCase()} components.</p>
                <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                  {related.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/components/${c.slug}`} className="group flex min-h-12 items-center justify-between gap-4 py-3">
                        <span className="min-w-0">
                          <span className="font-medium text-gray-900 group-hover:text-blue-700">{c.name}</span>
                          <span className="block truncate text-sm text-gray-600">{c.summary}</span>
                        </span>
                        <StatusBadge status={c.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="mt-12 text-xs text-gray-600">Status reflects the component tracker snapshot of {TRACKER_SNAPSHOT}.</p>
            </article>

            <nav aria-label="On this page" className="sticky top-24 hidden h-fit w-44 shrink-0 xl:block">
              <div className="text-sm font-semibold text-gray-900">On this page</div>
              <ul className="mt-3 space-y-1 border-l border-gray-200 text-sm">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-px block border-l border-transparent py-1 pl-3 text-gray-600 hover:border-gray-400 hover:text-gray-900">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
