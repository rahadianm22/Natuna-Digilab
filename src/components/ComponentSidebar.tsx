import { componentGroup, componentGroups, components, statusText } from "@/lib/components-data";
import { MobileComponentNav, SidebarAside, type SidebarData } from "./ComponentSidebarNav";

// Built on the server: the client sidebar gets names, tags and status, not the usage prose.
const data: SidebarData = {
  items: [...components]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({ slug: c.slug, name: c.name, tags: c.tags, group: componentGroup(c.slug), status: c.status })),
  groups: componentGroups,
  statusText,
};

export default function ComponentSidebar() {
  return <SidebarAside {...data} />;
}

export function ComponentMobileNav() {
  return <MobileComponentNav {...data} />;
}
