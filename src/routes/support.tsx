import { createFileRoute } from "@tanstack/react-router";
import { DocList } from "@/components/doc-list";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support – Docify" },
      { name: "description", content: "Supportdokumentation, guider och felsökning." },
    ],
  }),
  component: () => <DocList type="support" />,
});
