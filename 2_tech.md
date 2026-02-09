1. Primary Stack Selection PATH A : High-Performance / Simple Tool (Vanilla). Nous utilisons du HTML5, CSS3 (Tailwind CSS via CDN pour la rapidité) et du JavaScript natif (ES6+). Pas de framework lourd pour garantir que le fichier reste "portable" et facile à modifier.

2. Stack Justification Choix fait pour la vitesse de rendu et la facilité d'impression "Print to PDF". L'utilisation du JavaScript permet de charger dynamiquement les données JSON sans avoir à toucher au code HTML.

3. Exact Folder Structure (Deterministic)
/pdf-generator
  ├── index.html        (Point d'entrée unique)
  ├── /css
  │   └── style.css     (Règles d'impression + Design système)
  ├── /js
  │   ├── renderer.js   (Logique d'injection des données)
  │   └── app.js        (Initialisation et sélecteur de langue)
  ├── /data
  │   └── content.json  (La "Source de Vérité" : textes FR, EN, etc.)
  └── /assets           (Icons SVG uniquement)

  4. Data Structures Le fichier content.json est structuré par slugs de langue.

Exemple : "swap_ice_cream": { "fr": "Glace", "en": "Ice Cream" }.

Toute nouvelle langue est ajoutée simplement en créant une nouvelle clé dans l'objet JSON sans modifier la logique de rendu.

5. API Design & Logic Layer

Renderer : Une fonction JavaScript boucle sur les données JSON et génère dynamiquement les lignes du tableau et les items de la checklist.

Modularity : Chaque section (Header, Swaps, Checklist) possède son propre conteneur ID (#header-root, #matrix-root).

Print Logic : Utilisation des media queries CSS @media print pour forcer le format A4, supprimer les éléments de navigation web et garantir que les sauts de page (si Page 2) sont propres.

6. Performance Budgets

Temps de chargement : < 500ms.

Poids total : < 100KB (hors polices système).

Images : Utilisation de polices système (Inter, Roboto) pour éviter les requêtes réseau inutiles.

7. Security & Safety

Sanitization : Toutes les données injectées depuis le JSON sont traitées pour éviter toute erreur de rendu si un caractère spécial est utilisé (ex: japonais).

Fallback : Si une traduction est manquante dans une langue, le système affiche par défaut la version Anglaise.