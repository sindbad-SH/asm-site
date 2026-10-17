/**
 * /llms.txt — a plain-markdown map of the publication for AI assistants
 * (llmstxt.org convention). SEO pass, 2026-10-17.
 *
 * Every summary line below is the page's OWN meta description, copied
 * verbatim — this file adds no new claims. Field notes and postcards are
 * listed from their data, so new ones appear automatically; the hand-listed
 * pages need a line here when a new story page ships (or a description
 * changes). URLs follow `site` + `base`, like the sitemap.
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../consts";
import { POSTCARDS } from "../data/postcards";

const PAGES: { section: string; items: [path: string, name: string, summary: string][] }[] = [
  {
    section: "Start here",
    items: [
      ["/home", "Home", "Adventure Storytelling Media publishes two kinds of hard-won stories from Boulder, Colorado — Adventure Stories from the field, Venture Stories from the market. One storyteller, research to final cut."],
      ["/about", "About", "Sindbad Horizon, founder of Adventure Storytelling Media, on why the publication covers two kinds of hard-won stories — the summit and the startup — from Boulder, Colorado."],
      ["/work", "Archive — all stories", "Every story published by Adventure Storytelling Media, indexed in one place — Adventure Stories and Venture Stories, together."],
      ["/forge-the-saga", "The Method", "Five stages, research first: how every Adventure Storytelling Media story gets scouted, mapped, forged, tested, and assessed."],
    ],
  },
  {
    section: "Adventure Stories",
    items: [
      ["/adventure", "Adventure Stories", "Expedition and adventure coverage — photo and film — from the Alps, Colorado's Front Range, and wherever the story leads. Field notes, postcards, and aerial work licensed through Amazing Aerial Agency."],
      ["/adventure/steel-and-dust", "Steel & Dust — the Colorado Medieval Festival from above", "Field Notes No. 01: full-contact jousting at the Colorado Medieval Festival in Loveland — the Knights of Mayhem, covered from the air and the ground."],
      ["/adventure/vybe", "In the Room with Vybe", "Two nights with Vybe, a Denver arts, music, and dance collective — the 2023 outdoor festival from the air and the 2024 Boogie Lights show, in frames and a short clip."],
      ["/adventure/field", "The Field — Travel Stories & Living Portraits", "The field gallery of Adventure Storytelling Media — living portraits and travel stories from the Alps, the Front Range, and wherever the work goes next."],
      ["/field-notes", "Field Notes — the log", "Field Notes — a running log of stories from the field, newest first."],
    ],
  },
  {
    section: "Venture Stories",
    items: [
      ["/venture", "Venture Stories", "Stories of ventures — founders, festivals, and the rooms where business gets done. Coverage with a market-research spine, every relationship stated at exactly what it is."],
      ["/venture/seriesfest", "SeriesFest — the same air, 2025–2026", "Five visits to SeriesFest across thirteen months — the 2025 festival, the Devil in Disguise screening, the Soul Power premiere, Fashion in Focus, and Season 12."],
      ["/venture/seriesfest-2025", "SeriesFest 2025", "SeriesFest Season 11 in Denver, Colorado, April 30 – May 4, 2025 — official-selection screenings, the Pitch-A-Thon, panels from Carnival Films to the showrunners room, the Soirée and the Awards Ceremony."],
      ["/venture/seriesfest-2025-devil-in-disguise", "Devil in Disguise: John Wayne Gacy at SeriesFest", "A SeriesFest screening and post-screening conversation in Denver, November 2025 — Devil in Disguise: John Wayne Gacy, with the creator and showrunner on stage."],
      ["/venture/seriesfest-2026", "SeriesFest 2026", "SeriesFest 2026 in Denver, Colorado — festival main stage, screenings, panels, and the Soirée."],
      ["/venture/seriesfest-2026-fashion-in-focus", "SeriesFest 2026 · Fashion in Focus", "SeriesFest 2026 Fashion in Focus in Denver, Colorado — a runway, a masterclass with costume designer Molly Rogers, and a salon's 20th anniversary."],
      ["/venture/seriesfest-2026-soul-power", "SeriesFest 2026 · Soul Power ABA Premiere", "SeriesFest 2026 Soul Power ABA premiere night in Denver, Colorado — the premiere wall and the screening room."],
      ["/venture/afm-2025", "American Film Market 2025", "American Film Market 2025 in Los Angeles, California — a week of AFM Sessions panels on finance, AI, gaming and independent film, the Pitch Conference, and the market floor itself."],
      ["/venture/dawn-patrol", "Pebble Beach Concours d'Elegance — Dawn Patrol to a green ribbon", "A full day at the Pebble Beach Concours d'Elegance, opening with the pre-dawn Dawn Patrol arrival — a photo essay following a restored 1967 Shelby Cobra 427 S/C, chassis CSX 3042, from the transporter lot to a green ribbon on the 18th fairway."],
      ["/venture/ko-law-workshops", "KO Law startup workshops", "KO Law's startup workshop series — on video and in photographs, from the boardroom to the stage."],
      ["/venture/meme", "MEME", "Member At-Large at MEME (Makeshift Entertainment Media Education), a Colorado nonprofit: Strategic Liaison and Scout for new storytellers."],
      ["/venture/amazing-aerial", "Amazing Aerial — the agency story", "How our aerial work reaches the market: an official agent with Amazing Aerial Agency since mid-2024. The collection is live and growing."],
    ],
  },
  {
    section: "Archive films",
    items: [
      ["/work/pitchboulder", "PitchBoulder — the Wednesday room in Boulder", "PitchBoulder is a weekly founder pitch event in Boulder, Colorado. One season of Wednesdays, the founders who took the front of the room, and the film that came out of it."],
      ["/work/shelby-pebble-beach", "A restored Shelby at Pebble Beach", "Covering a one-of-a-kind 1967 Shelby Cobra 427 S/C at the Concours d'Elegance — a story of legacy and craftsmanship, told on screen."],
      ["/work/vybe", "Vybe — two nights in Denver", "Vybe, a Denver arts and music collective — a 2023 outdoor festival from the air and the 2024 Boogie Lights show, in frames and a short clip."],
      ["/work/gigs-go-green", "Gigs Go Green — competition & pitch films", "Two short films produced for Gigs Go Green — a solar-energy competition piece and a fintech pitchfest film — with frames and short clips from each."],
      ["/work/amazing-aerial", "Top shots with Amazing Aerial", "A highlights reel of our aerial work — expedition frames from the Alps and Colorado, licensed through Amazing Aerial Agency."],
    ],
  },
];

const OPTIONAL: [path: string, name: string, summary: string][] = [
  ["/contact", "Contact", "Story tips, licensing enquiries, and letters to the publication — one email, real replies."],
  ["/licensing", "Licensing", "License the aerial photography and footage seen across Adventure Storytelling Media — represented worldwide by Amazing Aerial Agency, with direct enquiries welcome."],
  ["/privacy", "Privacy", "What this site does and doesn't collect. Short version: almost nothing."],
  ["/terms", "Terms", "The terms for using this site. Short version: look freely, link freely, don't take the work."],
];

export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const url = (path: string) => new URL(`${base}${path}/`, site).href;
  const line = ([path, name, summary]: [string, string, string]) => `- [${name}](${url(path)}): ${summary}`;

  const notes = (await getCollection("fieldNotes", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const noteLines = notes.map((n) =>
    line([`/field-notes/${n.id}`, n.data.title, [n.data.location, n.data.deck].filter(Boolean).join(" — ")]),
  );
  const postcardLines = POSTCARDS.map((pc) => line([`/postcards/${pc.slug}`, pc.title, pc.location]));

  const body = [
    `# ${SITE.name}`,
    "",
    `> ${PAGES[0]!.items[0]![2]}`,
    "",
    `A publication by ${SITE.person}, based in ${SITE.location}.`,
    "",
    ...PAGES.flatMap((s) => [`## ${s.section}`, "", ...s.items.map(line), ""]),
    "## Field notes",
    "",
    ...noteLines,
    "",
    "## Postcards",
    "",
    ...postcardLines,
    "",
    "## Optional",
    "",
    ...OPTIONAL.map(line),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
