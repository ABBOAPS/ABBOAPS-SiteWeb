export interface Articolo {
  id: string;
  titolo: string;
  estratto: string;
  contenuto: string;
  data: string;
  descrizione: string;
  immagine: string;
  tags: string[];
}

const newsFiles = import.meta.glob("../content/news/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export const dataNews: Articolo[] = Object.entries(newsFiles).map(([path, content]) => {
  const filename = path.split('/').pop()?.replace('.md', '') || '';
  
  const frontmatterRegex = /---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  const metadata: Record<string, string> = {};
  let markdownContent = content;
  
  if (match) {
    match[1].split('\n').forEach(line => {
      const [key, ...values] = line.split(':');
      if (key && values.length > 0) metadata[key.trim()] = values.join(':').trim();
    });
    markdownContent = content.replace(frontmatterRegex, '').trim();
  }
  
  const title = metadata.title || "Untitled";
  const date = metadata.date || "";
  const descrizione = metadata.description || "";
  let cover = metadata.cover_image || "";
  // Check if someone accidentally included quotes
  if (cover.startsWith('"') && cover.endsWith('"')) { cover = cover.slice(1, -1); }
  if (cover.startsWith("'") && cover.endsWith("'")) { cover = cover.slice(1, -1); }

  const tagsStr = metadata.tags || "";
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

  // Extract first paragraph for the snippet
  const paragraphs = markdownContent.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
  const estratto = paragraphs.length > 0 ? paragraphs[0].replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/\[(.*?)\]\(.*?\)/g, '$1').substring(0, 150) + "..." : "";

  return {
    id: filename,
    titolo: title,
    estratto: estratto,
    contenuto: markdownContent,
    data: date,
    descrizione,
    immagine: cover || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80",
    tags: tags
  };
});
