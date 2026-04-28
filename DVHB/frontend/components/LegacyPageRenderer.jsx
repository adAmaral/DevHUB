import { loadLegacyHtml } from '@/lib/html-loader';

export async function LegacyPageRenderer({ source }) {
  const { bodyClass, bodyHtml } = await loadLegacyHtml(source);

  return (
    <main className={bodyClass}>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </main>
  );
}
