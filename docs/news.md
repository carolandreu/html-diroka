# News & Awards

The full bilingual article sits between the home trust strip and AboutStudio. The approved Spanish article and its English translation are readable completely on the homepage, with no read-more link to another page. It uses css/news.css and js/news.js. The existing article URL remains available for old links and has the same content. Keep the two copies synchronized. News copy works without JavaScript; EN/ES controls and the gallery are progressive enhancement.

## Current story: November 2026

Confirmed by Carolina: the convention is Ink Masters Tattoo Show, and all artists who participated with Diroka received awards. Confirmed individual awards are listed below; do not infer details for other artists. Carolina supplied IMG_4836.jpeg as the team photo, now used unchanged at img/news/ink-masters-team-awards.jpeg. It shows the team with awards. Do not infer which person occupies which position.

### Diego Juarez — confirmed by Carolina

- Best Unusual: a geometric tattoo in the armpit.
- Best Small Color and Best Traditional: both awarded to the same traditional tattoo.
- Total: three awards across two tattoos. Preserve “Best Small Color”; the later shorthand “best color” refers to this same award. Do not add placements or details of the traditional design without confirmation.

### Julian Carvajal — confirmed by Carolina

- Small Black and Gray. Keep the category name exactly as supplied; no “Best” prefix or placement was specified.
- Carolina supplied IMG_4863.jpeg, a screenshot of Julian’s Instagram story, as the reference for his winning piece. Visible details: a classical-inspired figure with wings, detailed feathers, and black-and-gray facial shading. Do not identify a specific mythological figure or infer exact body placement or technique.
- The screenshot informs the EN/ES article description but is not a gallery slide. Original photographs are pending from Julian; use those for the gallery when Carolina supplies them.

### Arnold Camargo — confirmed by Carolina

- Best of Day Sunday. No tattoo details or photos supplied yet.

### Kevin Vargas — confirmed by Carolina

- Kevin is a new artist joining the shop.
- Best Large Black and Grey.
- Best of Show Black and Grey. Preserve the full category; do not describe it as an unrestricted overall Best of Show.
- Do not assume whether the same tattoo won both awards. No winning artwork or placement supplied yet.

The supplied awards add up to seven across four artists: Diego 3, Julian 1, Arnold 1, Kevin 2. This is a count of confirmed awards; do not invent additional wins or an edition/location.

Still needed to expand the report: exact event dates; any further participants or awards Carolina identifies; any award placements not stated; original photos and further details of the winning work. Do not infer participants from the current website roster or describe existing portfolio photos as the winning pieces.

## Gallery

The real team photo is the first and currently only slide. The full portrait photo is shown without cropping. On desktop the gallery sits to the right and stays visible while the story is read; on mobile it follows the headline and precedes the body.

To add confirmed artwork, append a figure.news-slide with data-news-slide, image dimensions, localized alt attributes, and both localized captions. Put hidden on new slides. Add the matching image to the repository and update both homepage and retained article. Navigation, swipe, keyboard arrows and a play/pause control activate only with two or more real photos. Automatic rotation is every seven seconds, pauses during hover/focus or when the tab is hidden, and is off for reduced-motion users. Manual navigation stops rotation. Do not use duplicate or unrelated work as public slides.

Original photos of the individual winning tattoos are pending. Julian’s screenshot has supplied visual context for the article; the other winning pieces still need visual references. Match each piece to its artist and category using Carolina’s confirmation.

## Later stories

Add a static HTML article under news/ with a canonical URL and unique title/description. Keep the newest story featured and at most two older compact links on the homepage; preserve earlier article URLs. Add article URLs to sitemap.xml. Extend scripts/check-local-references.js when introducing pages (it already scans news/ recursively). Avoid automatic carousels and fabricated stories or awards. There is no CMS; content is edited in this repository.

Run npm test, node --check js/news.js, and review mobile/desktop presentation and both languages before publishing.
