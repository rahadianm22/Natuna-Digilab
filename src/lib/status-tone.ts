import type { BadgeTone } from "@/ui";
import type { TrackerStatus } from "@/lib/natuna-tracker";

// Status to Badge tone, so every status chip is the system's own Badge and a tone change reaches all of them.
export const trackerTone: Record<TrackerStatus, BadgeTone> = {
  Selesai: "success",
  "On Review": "info",
  OnProgress: "warning",
  Belum: "neutral",
};

export const componentStatusTone = {
  stable: "success",
  review: "info",
  beta: "warning",
  planned: "neutral",
} as const satisfies Record<string, BadgeTone>;
