# RXperiences – كل ما يتعلق بالصيدلة

The pharmacy blog of Moudhi Aman. Every change you save on GitHub goes live automatically on Vercel within about a minute.

## ✍️ Add a new article (from phone or computer)

1. Open the folder **`src/content/posts`** on GitHub.
2. Tap **Add file → Create new file**.
3. Name it in English with dashes, ending in `.md` — e.g. `pharmacy-in-canada.md`. This becomes the link: `/posts/pharmacy-in-canada`.
4. Copy the template from **`templates/new-post.md`**, paste it, and write your article.
5. Tap **Commit changes**. Done.

**Categories** you can use in `categories:` (one or more):

| Write this | Shows as |
|---|---|
| `uk-ireland` | تجارب من بريطانيا و إيرلندا |
| `usa-canada` | تجارب من أمريكا و كندا |
| `arab-countries` | تجارب من دول عربية أخرى |
| `pharmacy-articles` | المقالات الصيدلانية |

Set `experience: true` to also list the article under **تجارب واقعية**.

**Hide an article without deleting it:** add `draft: true` under the title.

## 🖼️ Add a photo

1. Open **`public/images`** → **Add file → Upload files**, upload the photo, commit.
2. Use it in an article: `image: "/images/your-photo.jpg"` (cover), or inside the text: `![](/images/your-photo.jpg)`.

## 🛡️ Add an MoH policy

1. Open **`src/content/policies`** → **Add file → Create new file**, name it e.g. `decision-123-2026.yaml`.
2. Copy **`templates/new-policy.yaml`**, fill it in, commit.

## 🎨 Change colours, name or links

- Colours: top of **`src/styles/global.css`** (`--navy`, `--pink`, `--sunny`…). The design rules are written down in **`DESIGN.md`**.
- Site name, social links, booking link, category names: **`src/data/site.ts`**.

## Writing tips (Markdown)

| You type | You get |
|---|---|
| `## عنوان` | a heading |
| `**كلمة**` | **bold** |
| `- نقطة` | a bullet |
| `[نص](https://...)` | a link |
