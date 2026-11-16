# News & Awards

The homepage feature sits between the home trust strip and AboutStudio. It uses css/news.css and js/news.js. News copy works without JavaScript; the EN/ES controls are progressive enhancement.

## Current story: November 2026

Confirmed by Carolina: all artists who participated with Diroka received awards. The first publication uses this team-level statement only. The Diroka mark is decorative, not a photo of the convention.

Still needed to expand the report: convention name and exact dates; participating artists; each artist’s award, placement and category; a team photo and photos of the winning work. Do not infer participants from the current website roster or describe existing portfolio photos as the winning pieces.

When the material arrives, update both language copies of the feature and article. Replace .news-art with an optimized real photo, descriptive alt text, width/height and lazy loading. Put each confirmed award alongside the matching artwork and artist. Use existing .artist-book-btn / data-artist hooks on homepage artist links, with values verified in js/main.js, or link the article back to the artist’s existing booking flow.

## Later stories

Add a static HTML article under news/ with a canonical URL and unique title/description. Keep the newest story featured and at most two older compact links on the homepage; preserve earlier article URLs. Add article URLs to sitemap.xml. Extend scripts/check-local-references.js when introducing pages (it already scans news/ recursively). Avoid automatic carousels and fabricated stories or awards. There is no CMS; content is edited in this repository.

Run npm test, node --check js/news.js, and review mobile/desktop presentation and both languages before publishing.
