# News & Awards

The homepage feature sits between the home trust strip and AboutStudio. It uses css/news.css and js/news.js. News copy works without JavaScript; the EN/ES controls are progressive enhancement.

## Current story: November 2026

Confirmed by Carolina: the convention is Ink Masters Tattoo Show, and all artists who participated with Diroka received awards. Confirmed individual awards are listed below; do not infer details for other artists. The Diroka mark is decorative, not a photo of the convention.

### Diego Juarez — confirmed by Carolina

- Best Unusual: a geometric tattoo in the armpit.
- Best Small Color and Best Traditional: both awarded to the same traditional tattoo.
- Total: three awards across two tattoos. Preserve “Best Small Color”; the later shorthand “best color” refers to this same award. Do not add placements or details of the traditional design without confirmation.

### Julian Carvajal — confirmed by Carolina

- Small Black and Gray. Keep the category name exactly as supplied; no “Best” prefix or placement was specified.
- The winning design, body placement, and photos have not yet been provided.

### Arnold Camargo — confirmed by Carolina

- Best of Day Sunday. No tattoo details or photos supplied yet.

### Kevin Vargas — confirmed by Carolina

- Kevin is a new artist joining the shop.
- Best Large Black and Grey.
- Best of Show Black and Grey. Preserve the full category; do not describe it as an unrestricted overall Best of Show.
- Do not assume whether the same tattoo won both awards. No winning artwork or placement supplied yet.

The supplied awards add up to seven across four artists: Diego 3, Julian 1, Arnold 1, Kevin 2. This is a count of confirmed awards; do not invent additional wins or an edition/location.

Still needed to expand the report: exact event dates; any further participants or awards Carolina identifies; any award placements not stated; a team photo and photos/details of the winning work. Do not infer participants from the current website roster or describe existing portfolio photos as the winning pieces.

When the material arrives, update both language copies of the feature and article. Replace .news-art with an optimized real photo, descriptive alt text, width/height and lazy loading. Put each confirmed award alongside the matching artwork and artist. Use existing .artist-book-btn / data-artist hooks on homepage artist links, with values verified in js/main.js, or link the article back to the artist’s existing booking flow.

## Later stories

Add a static HTML article under news/ with a canonical URL and unique title/description. Keep the newest story featured and at most two older compact links on the homepage; preserve earlier article URLs. Add article URLs to sitemap.xml. Extend scripts/check-local-references.js when introducing pages (it already scans news/ recursively). Avoid automatic carousels and fabricated stories or awards. There is no CMS; content is edited in this repository.

Run npm test, node --check js/news.js, and review mobile/desktop presentation and both languages before publishing.
