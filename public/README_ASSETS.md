# Guide de placement des assets

## Structure des dossiers

Placez vos fichiers dans les dossiers suivants :

### 📁 Videos (`public/videos/`)
- **presentation.mp4** : Vidéo de présentation de l'événement (utilisée dans la section hero)
- **reportage.mp4** : Vidéo reportage de l'événement (optionnelle, pour une section dédiée)

### 📁 Images - Événement (`public/images/event/`)
Placez toutes vos images de l'événement ici. Le code attend au moins 4 images nommées :
- **event1.jpg** (ou .png)
- **event2.jpg** (ou .png)
- **event3.jpg** (ou .png)
- **event4.jpg** (ou .png)

Vous pouvez ajouter plus d'images et mettre à jour le tableau `gallery` dans `src/App.tsx`.

- **poster.jpg** : Image de poster pour la vidéo (utilisée comme preview avant lecture)

### 📁 Images - Intervenants (`public/images/speakers/`)
Placez les photos des intervenants avec ces noms exacts :
- **img1.jpg** : Papy Sidy FALL - Journaliste animateur
- **img2.jpg** : Marieme DIAGNE - Directrice PAPILLON EVENTS
- **img3.jpg** : Ismaila NDIAYE - Responsable BIDEEW EVENTS
- **img4.jpg** : Yacine NGOM - Responsable FNAC

### 📁 Images - Partenaires (`public/images/partners/`)
Placez les logos de vos partenaires ici. Le code attend des fichiers nommés :
- **partner1.png** (ou .jpg, .svg)
- **partner2.png**
- **partner3.png**
- **partner4.png**

Vous pouvez ajouter plus de logos et mettre à jour le tableau `partners` dans `src/App.tsx` avec les noms réels.

### 📁 Logo (`public/images/`)
- **logo.png** (ou .jpg, .svg) : Logo principal de Baol Digital Show

## Notes importantes

- Les formats acceptés pour les images : `.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`
- Les formats acceptés pour les vidéos : `.mp4`, `.webm`
- Les chemins dans le code utilisent `/images/...` ou `/videos/...` (sans le préfixe `public/`)
- Si vous avez besoin de modifier les noms de fichiers, mettez à jour les références dans `src/App.tsx`

## Exemple de structure finale

```
public/
├── videos/
│   ├── presentation.mp4
│   └── reportage.mp4
├── images/
│   ├── logo.png
│   ├── event/
│   │   ├── event1.jpg
│   │   ├── event2.jpg
│   │   ├── event3.jpg
│   │   ├── event4.jpg
│   │   └── poster.jpg
│   ├── speakers/
│   │   ├── img1.jpg
│   │   ├── img2.jpg
│   │   ├── img3.jpg
│   │   └── img4.jpg
│   └── partners/
│       ├── partner1.png
│       ├── partner2.png
│       ├── partner3.png
│       └── partner4.png
└── README_ASSETS.md
```

