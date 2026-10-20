# RXperiences – كل ما يتعلق بالصيدلة

## The site's aim (keep this in mind for every change)

- **Easy to reach:** simple pages, fast on a phone, clear menu.
- **Easy to take away:** resources, studies and files should be easy to open and download.
- **Mostly free:** almost everything is free. Paid items (quiz cards, sticker packs) are few, cheap and clearly optional.
- **Rich, hard-to-find content:** pharmacy resources, Kuwait/GCC studies and MoH policies that are usually hard to locate, gathered in one place.

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

## 💊 Capsy, the site assistant

Capsy (the pink capsule in the corner) answers visitors' questions using **only this site's content**: articles, experiences, studies, MoH decisions and resources. When something isn't on the site, it says so and shows the Instagram link so visitors can suggest it.

- **Without an AI key** Capsy still works: it finds the closest pages by keywords.
- **To turn on the AI answers**: create an API key at console.anthropic.com, then in Vercel open the project → **Settings → Environment Variables** and add `ANTHROPIC_API_KEY` with the key. Redeploy. Set a monthly spending limit in the Anthropic console.
- Optional: `CAPSY_MODEL` to choose another Claude model (default `claude-haiku-5-5`).
- New articles, studies and decisions are picked up automatically on the next deploy.

## 📝 Get an experience from a student

**How it works:** you send the student the link **/share-experience**. They answer the questions, add up to 3 photos and press **أرسل تجربتي**. You get an email from GitHub, and nothing is published until you approve it.

**To approve or reject (from the GitHub email, the GitHub app, or github.com → Pull requests):**
1. Open the pull request named **«تجربة جديدة: …»**.
2. Wait for Vercel's comment with a **Preview** link and open it to see the article exactly as it will look on the site.
3. Want to fix something? **Files changed** → ⋯ next to the file → **Edit file**.
4. **Publish:** press **Merge pull request** → **Confirm merge**. It's live in about a minute.
5. **Reject:** press **Close pull request**.

**One-time setup** (until this is done, students get a "copy / download and send it yourself" screen instead):
1. github.com → your photo → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories → Pharmacy**. Permissions: **Contents: Read and write** and **Pull requests: Read and write**. Generate and copy the token.
3. Vercel → project **rxperiences** → **Settings → Environment Variables** → add `GITHUB_TOKEN` = the token → Save → **Redeploy**.
4. Make sure GitHub emails you about new pull requests: on the repository page press **Watch → All Activity**.

Note: the repository is public, so a submitted experience can be seen on GitHub before you approve it. To keep submissions private, make the repository private (repository Settings → Danger zone → Change visibility); Vercel keeps working.
