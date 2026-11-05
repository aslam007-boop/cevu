import { createFileRoute } from "@tanstack/react-router";
import Site from "@/components/Site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cévu Optique — Opticienne optométriste à Sfax" },
      { name: "description", content: "Lunettes de vue, solaires et anti-lumière bleue à Sfax. Gucci édition limitée, examen de vue par optométriste. Noté 5.0★." },
      { property: "og:title", content: "Cévu Optique — Opticienne optométriste à Sfax" },
      { property: "og:description", content: "Trouver la paire parfaite, c'est plus qu'un choix… c'est une expérience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Site,
});
