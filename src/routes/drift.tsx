import { createFileRoute } from "@tanstack/react-router";
import { DocList } from "@/components/doc-list";

export const Route = createFileRoute("/drift")({
  head: () => ({
    meta: [
      { title: "Driftdokumentation – Docify" },
      { name: "description", content: "Servrar, infrastruktur, åtkomst och driftansvar." },
    ],
  }),
  component: () => <DocList type="drift" />,
});
