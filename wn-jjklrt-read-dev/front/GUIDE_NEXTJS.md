# Guide Next.js 

## Introduction

Next.js est un **framework** construit sur React qui ajoute des fonctionnalités puissantes pour le développement web.

---

## Concepts Clés à Connaître

### 1. **Server-Side Rendering (SSR) vs Client-Side Rendering**

**React classique :**
- Tout le rendu se fait côté client (dans le navigateur)
- Le HTML initial est souvent vide, JavaScript charge tout après
```jsx
<!-- Ce que le navigateur reçoit -->
<html>
  <body>
    <div id="root"></div>  <!-- Vide ! -->
    <script src="app.js"></script>
  </body>
</html>
<!-- Puis JavaScript génère tout après -->
```
**Next.js :**
- Peut rendre les pages côté serveur (SSR) ou côté client
- Le HTML est déjà généré quand il arrive au navigateur
- Meilleur pour le SEO et les performances initiales
```jsx
<!-- Ce que le navigateur reçoit -->
<html>
  <body>
    <div id="root">
      <h1>Articles</h1>
      <article>Article 1</article>
      <article>Article 2</article>
      <!-- Contenu déjà là ! -->
    </div>
    <script src="app.js"></script>
  </body>
</html>
```
### 2. **Le Système de Routage par Fichiers**

**React classique :**
```jsx
// Installer react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/articles" element={<Articles />} />
    <Route path="/articles/:id" element={<ArticleDetail />} />
  </Routes>
</BrowserRouter>
```

**Next.js (debut de structure du projet) :**
```
app/
  page.tsx                              → Route: /
  (read)/
    articles/
      page.tsx                          → Route: /articles
      [details]/
        page.tsx                        → Route: /articles/[details] (dynamique)
  a-propos/
    page.tsx                            → Route: /a-propos
```

**Exemple concret de notre code :**
- `app/page.tsx` → Page d'accueil qui affiche les 10 derniers articles
- `app/(read)/articles/page.tsx` → Liste de tous les articles
- `app/(read)/articles/[details]/page.tsx` → Détail d'un article (route dynamique)

**Pas besoin de configuration !** La structure de dossiers définit automatiquement les routes. Le dossier `(read)` est un "route group" - il n'apparaît pas dans l'URL mais permet d'organiser le code.

### 3. **Composants Serveur vs Client**

**React classique :**
- Tous les composants sont côté client

**Next.js :**
- **Composants Serveur (par défaut)** : Rendu sur le serveur, pas d'interactivité
- **Composants Client** : Ajoutez `"use client"` en haut du fichier

**Exemple de notre projet :**

**Composant Serveur (layout.tsx) :**
```tsx
// app/layout.tsx - Pas de "use client" car pas d'interactivité
import "./globals.css";
import Header from "./component/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
```

**Composant Client (page.tsx) :**
```tsx
// app/page.tsx - "use client" nécessaire car on utilise useState et useEffect
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.slice(0, 10));
        setLoading(false);
      });
  }, []);

  return <div>{/* ... */}</div>;
}
```

**Règle importante :** Utilisez `"use client"` uniquement quand vous avez besoin de :
- Hooks React (`useState`, `useEffect`, etc.)
- Événements (`onClick`, `onChange`, etc.)
- APIs du navigateur (`window`, `localStorage`, etc.)

### 4. **Les Hooks Next.js**

#### `usePathname()` - Remplacer `useLocation()`
```tsx
// React Router
import { useLocation } from 'react-router-dom';
const location = useLocation();
// location.pathname → "/articles"

// Next.js (exemple de notre Header)
import { usePathname } from 'next/navigation';
const pathname = usePathname();
// pathname → "/articles"
```

**Exemple: composant/layout/Header:**
```tsx
// app/component/layout/Header/Header.tsx
"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  const navLinks = [
    { href: "/", label: "World News" },
    { href: "/articles", label: "Articles" },
    { href: "/a-propos", label: "A propos" },
  ];

  return (
    <header>
      {navLinks.map((link) => {
        const isActive = 
          pathname === link.href || 
          (link.href === "/articles" && pathname?.startsWith("/articles"));
        // Détection de la route active pour le style
        return <Link href={link.href}>{link.label}</Link>;
      })}
    </header>
  );
}
```

#### `useRouter()` - Navigation
```tsx
// React Router
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/articles');

// Next.js
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/articles');
```

#### `useParams()` - Paramètres d'URL
```tsx
// React Router
import { useParams } from 'react-router-dom';
const { id } = useParams();
// Route: /articles/:id → id = "mon-article"

// Next.js (exemple de notre page de détail)
import { useParams } from 'next/navigation';
const params = useParams();
const articleTitle = decodeURIComponent(params.details as string);
// Route: /articles/[details] → params.details = "mon-article"
```

**Exemple: page de détail des articles :**
```tsx
// app/(read)/articles/[details]/page.tsx
"use client";

import { useParams } from "next/navigation";

export default function ArticleDetailPage() {
  const params = useParams();
  const articleTitle = decodeURIComponent(params.details as string);
  // Si l'URL est /articles/Lorem%20Ipsum
  // params.details = "Lorem%20Ipsum"
  // articleTitle = "Lorem Ipsum"
  
  // Utiliser articleTitle pour fetcher l'article...
}
```

### 5. **Le Composant `Link`**

**React Router :**
```tsx
import { Link } from 'react-router-dom';
<Link to="/articles">Articles</Link>
```

**Next.js :**
```tsx
import Link from 'next/link';
<Link href="/articles">Articles</Link>
```

**Exemple: composant/layout/Header:**

```tsx
// app/component/layout/Header/Header.tsx
import Link from "next/link";

<Link href={link.href} className="...">
  {link.label}
</Link>
```

**Exemples: page d'accueil :**
```tsx
// app/page.tsx
import Link from "next/link";

{articles.map((article) => (
  <Link
    key={article.title}
    href={`/articles/${encodeURIComponent(article.title)}`}
    className="block"
  >
    <article>
      <h2>{article.title}</h2>
      {/* ... */}
    </article>
  </Link>
))}
```

**Différence importante :** Next.js précharge automatiquement les pages liées pour des transitions ultra-rapides. Notez l'utilisation de `encodeURIComponent()` pour les URLs avec des caractères spéciaux.

---

##  Différences Majeures avec React

| Aspect | React | Next.js |
|--------|-------|---------|
| **Routage** | Bibliothèque externe (react-router) | Intégré, basé sur les fichiers |
| **Rendu** | Client uniquement | Serveur + Client (hybride) |
| **Build** | Configuration manuelle (Webpack/Vite) | Configuration automatique |
| **API Routes** | Backend séparé nécessaire | Peut créer des API dans `/app/api` |
| **Images** | `<img>` standard | Composant `<Image>` optimisé |
| **CSS** | CSS Modules ou styled-components | Support natif CSS Modules + Tailwind |

---

##  Avantages de Next.js par rapport à React

### 1. **Performance**
- **Pré-rendu** : Les pages sont générées à l'avance
- **Code Splitting** automatique : Chaque page charge uniquement son code
- **Optimisation d'images** : Le composant `Image` optimise automatiquement

### 2. **SEO (Search Engine Optimization)**
- Les moteurs de recherche voient le contenu HTML complet
- Pas besoin d'attendre que JavaScript charge

### 3. **Développement Plus Rapide**
- Pas besoin de configurer le routage
- Pas besoin de configurer Webpack/Vite
- Hot reload intégré et optimisé

### 4. **API Routes Intégrées**
```tsx
// app/api/articles/route.ts
export async function GET() {
  return Response.json({ articles: [...] });
}
```
Pas besoin d'un backend séparé pour des API simples !

### 5. **Optimisations Automatiques**
- Compression automatique
- Minification
- Tree shaking
- Lazy loading des composants

---

##  Inconvénients / Points d'Attention

### 1. **Courbe d'Apprentissage**
- Concepts supplémentaires à apprendre (SSR, Server Components, etc.)
- Certaines pratiques React ne fonctionnent pas de la même manière

### 2. **Complexité pour les Petits Projets**
- Pour une simple SPA, React seul peut être plus simple
- Next.js ajoute de la complexité qui n'est pas toujours nécessaire

### 3. **Compatibilité des Bibliothèques**
- Certaines bibliothèques React ne fonctionnent pas bien avec SSR
- Il faut vérifier la compatibilité avant d'utiliser une nouvelle librairie

### 4. **Déploiement**
- Nécessite un serveur Node.js (ou Vercel/Netlify)
- React seul peut être déployé sur n'importe quel hébergeur statique

### 5. **Server Components Limitations**
- Pas de hooks React dans les Server Components
- Pas d'événements utilisateur
- Doit comprendre quand utiliser Server vs Client

---

##  Bonnes Pratiques Next.js

### 1. **Structure des Dossiers (Notre Projet)**

```
app/
  layout.tsx                              # Layout partagé (comme un App.js)
  page.tsx                                # Page d'accueil (/)
  globals.css                             # Styles globaux
  (read)/                                 # Route group (n'apparaît pas dans l'URL)
    articles/
      page.tsx                            # Liste des articles (/articles)
      [details]/
        page.tsx                          # Détail d'un article (/articles/[details])
  a-propos/
    page.tsx                              # Page à propos (/a-propos)
  component/                              # Composants réutilisables
    layout/
      Header/
        Header.tsx                         # Composant Header
        index.ts                          # Export du Header
```

**Points importants :**
- `(read)` est un **route group** : il organise le code sans affecter l'URL
- `[details]` est un **segment dynamique** : il capture la valeur de l'URL
- `layout.tsx` à la racine s'applique à toutes les pages

### 2. **Quand Utiliser "use client"**
 **OUI** - Quand vous avez besoin de :
- `useState`, `useEffect`, `useContext`
- Événements : `onClick`, `onChange`, `onSubmit`
- APIs navigateur : `window`, `document`, `localStorage`

 **NON** - Pour :
- Composants de présentation simples
- Fetching de données (utilisez Server Components)
- Composants qui n'ont pas besoin d'interactivité

### 3. **Fetching de Données**

**Server Component (recommandé) :**
```tsx
// Pas besoin de "use client"
export default async function Articles() {
  const res = await fetch('http://api/articles');
  const articles = await res.json();
  
  return <div>{/* Afficher articles */}</div>;
}
```

**Client Component (exemple: page d'accueil) :**
```tsx
// app/page.tsx
"use client";

import { useEffect, useState } from 'react';

interface Article {
  title: string;
  sub_title: string;
  head: string;
  body: string;
  published_at: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/articles")
      .then((res) => res.json())
      .then((data) => {
        // Trier et prendre les 10 derniers
        const sortedArticles = data.sort((a: Article, b: Article) => 
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
        setArticles(sortedArticles.slice(0, 10));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des articles:", err);
        setLoading(false);
      });
  }, []);
  
  // Afficher les articles...
}
```

**Note :** Dans le projet, on utilise des Client Components car on fait du fetching côté client. On pourrait optimiser en utilisant des Server Components, mais cela nécessiterait de configurer le backend différemment.

### 4. **Navigation**

** BON - Utilisez Link pour la navigation (exemple de notre Header) :**
```tsx
// app/component/layout/Header/Header.tsx
import Link from 'next/link';

const navLinks = [
  { href: "/", label: "World News" },
  { href: "/articles", label: "Articles" },
  { href: "/a-propos", label: "A propos" },
];

{navLinks.map((link) => (
  <Link href={link.href} key={link.href}>
    {link.label}
  </Link>
))}
```

** BON - Link avec paramètres dynamiques (exemple de notre page d'accueil) :**
```tsx
// app/page.tsx
import Link from 'next/link';

{articles.map((article) => (
  <Link
    key={article.title}
    href={`/articles/${encodeURIComponent(article.title)}`}
  >
    {/* Contenu cliquable */}
  </Link>
))}
```

** ÉVITEZ - router.push() sauf pour redirections programmatiques :**
```tsx
// Seulement si nécessaire (après un submit, etc.)
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/articles');
```

**Note :** Dans le projet, on utilise uniquement `Link` pour la navigation, ce qui est la meilleure pratique.

---

##  Commandes Essentielles

```bash
# Développement
npm run dev          # Démarre le serveur de développement (port 3000)

# Production
npm run build        # Crée une version optimisée
npm run start        # Lance le serveur de production

# Linting
npm run lint         # Vérifie le code
```

---

##  Ressources Utiles

- [Documentation officielle Next.js](https://nextjs.org/docs)
- [App Router (Next.js 13+)](https://nextjs.org/docs/app)
- [Migration depuis React Router](https://nextjs.org/docs/app/building-your-application/routing/migrating)

---

##  Résumé Rapide

**Next.js = React + Routage + SSR + Optimisations**

Si vous savez React, vous savez déjà 80% de Next.js ! Les principales différences sont :
1. Le routage basé sur les fichiers
2. La distinction Server/Client Components
3. Les hooks de navigation différents (`usePathname` au lieu de `useLocation`)

**Conseil :** Commencez par créer des pages simples, puis ajoutez progressivement l'interactivité avec `"use client"` quand nécessaire.

---

### Flux de Navigation

1. **Page d'accueil (`/`)** : Affiche les 10 derniers articles
   - Utilise `"use client"` car elle fetch les données avec `useEffect`
   - Utilise `Link` pour naviguer vers les détails d'articles

2. **Liste des articles (`/articles`)** : Affiche tous les articles
   - Même structure que la page d'accueil mais sans limite

3. **Détail d'un article (`/articles/[details]`)** : Affiche un article complet
   - Utilise `useParams()` pour récupérer le titre de l'article depuis l'URL
   - Utilise `Link` pour revenir à la liste

4. **Header** : Navigation globale
   - Utilise `usePathname()` pour détecter la route active
   - Applique un style différent (soulignement bleu) pour la route active

### Points Clés de Notre Implémentation

✅ **Utilisation correcte de "use client"** : Seulement là où on a besoin de hooks React
✅ **Routage automatique** : Pas de configuration, juste la structure de fichiers
✅ **Navigation avec Link** : Préchargement automatique des pages
✅ **Hooks Next.js** : `usePathname()` et `useParams()` au lieu de React Router
✅ **TypeScript** : Interfaces définies pour les données (Article)

### Ce Qu'on Pourrait Améliorer

- Utiliser des Server Components pour le fetching de données (meilleur pour le SEO)
- Utiliser le composant `Image` de Next.js pour optimiser les images

