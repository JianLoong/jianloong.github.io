# Eccentric Eclipse 🌙

A personal blog built with Astro featuring sentiment analysis of Reddit comments using the AFINN lexicon.

## 🔥 Features

- [x] **Sentiment Analysis Component** - Real-time analysis of Reddit comments from r/HongKong subreddit
- [x] **AFINN Lexicon Integration** - Uses the AFINN-111 lexicon for sentiment scoring
- [x] **Interactive Charts** - Visual representation of sentiment data
- [x] **Type-safe markdown** - Built with TypeScript for better development experience
- [x] **Super fast performance** - Static site generation with Astro
- [x] **Accessible** - Keyboard/VoiceOver friendly
- [x] **Responsive** - Mobile-first design
- [x] **SEO-friendly** - Optimized for search engines
- [x] **Light & dark mode** - Automatic theme switching
- [x] **Fuzzy search** - Fast content discovery
- [x] **Draft posts & pagination** - Content management features
- [x] **Sitemap & RSS feed** - Better discoverability
- [x] **GitHub Pages deployment** - Automated CI/CD pipeline

## 🚀 Sentiment Analysis Feature

The blog includes a custom sentiment analysis component that:

- **Fetches Reddit Data**: Retrieves posts from r/HongKong subreddit using Reddit's JSON API
- **AFINN Lexicon**: Uses the AFINN-111 lexicon for sentiment scoring (-5 to +5 scale)
- **Real-time Analysis**: Processes comment sentiment on-the-fly
- **Visual Results**: Displays results in a clean, color-coded table
- **Error Handling**: Graceful fallbacks for API failures or CORS issues
- **Responsive Design**: Works seamlessly across all devices

### How It Works

1. **Data Fetching**: Uses jQuery with JSONP to bypass CORS restrictions
2. **Sentiment Processing**: Analyzes each comment using the AFINN lexicon
3. **Result Display**: Shows sentiment scores, averages, and distributions
4. **User Experience**: Provides clear error messages and loading states

## 🏗️ Project Structure

```bash
/
├── public/
│   ├── assets/
│   │   ├── scripts/
│   │   │   ├── afinn-111.js      # AFINN lexicon data
│   │   │   └── afinn-sentiment.js # Sentiment analysis logic
│   │   └── images/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── SentimentAnalysis.astro # Main sentiment analysis component
│   ├── data/
│   │   └── blog/
│   │       └── 2022/
│   │           └── reddit.md      # Blog post with sentiment analysis
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── astro.config.ts
```

## 💻 Tech Stack

**Main Framework** - [Astro](https://astro.build/)  
**Type Checking** - [TypeScript](https://www.typescriptlang.org/)  
**Styling** - [TailwindCSS](https://tailwindcss.com/)  
**Sentiment Analysis** - [AFINN-111 Lexicon](http://www2.imm.dtu.dk/pubdb/edoc/imm6006.pdf)  
**Data Fetching** - [jQuery](https://jquery.com/) with JSONP  
**Icons** - [Tabler Icons](https://tabler-icons.io/)  
**Code Formatting** - [Prettier](https://prettier.io/)  
**Deployment** - [GitHub Pages](https://pages.github.com/)  
**Linting** - [ESLint](https://eslint.org)

## 👨🏻‍💻 Running Locally

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd eccentric-eclipse
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

The site will be available at `http://localhost:4321`

## 🧞 Commands

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm run dev`         | Starts local dev server at `localhost:4321`     |
| `pnpm run build`       | Build your production site to `./dist/`         |
| `pnpm run preview`     | Preview your build locally, before deploying    |
| `pnpm run format`      | Format codes with Prettier                       |
| `pnpm run lint`        | Lint with ESLint                                 |

## 🚀 Deployment

The blog is automatically deployed to GitHub Pages via GitHub Actions:

1. **Push to `dev` branch** - Triggers automatic build and deployment
2. **GitHub Actions** - Builds the site and deploys to GitHub Pages
3. **Live Site** - Available at your GitHub Pages URL

The deployment workflow:
- Builds the Astro project
- Uploads artifacts using `actions/upload-pages-artifact@v3`
- Deploys to GitHub Pages environment

## 📝 Blog Posts

The blog includes various posts covering:
- **Sentiment Analysis**: Reddit comment analysis using AFINN lexicon
- **Technical Tutorials**: Development and programming topics
- **Personal Projects**: Showcase of various projects and experiments

## 🤝 Contributing

Feel free to open issues or submit pull requests for improvements.

## 📜 License

Licensed under the MIT License, Copyright © 2025

---

Built with 🤍 using [Astro](https://astro.build/) and the [AFINN lexicon](http://www2.imm.dtu.dk/pubdb/edoc/imm6006.pdf) for sentiment analysis.
