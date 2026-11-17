# Iqra · اقرأ

Application pour apprendre à lire l'arabe puis le Coran avec la méthode Qaida Nouraniya, 15 minutes par jour.
Expo (React Native + TypeScript) : iPhone, Android et web avec un seul code.

## Lancer

```bash
npm install
npx expo start        # puis scanner le QR code avec Expo Go
npx expo start --web  # version navigateur
```

## Contenu du prototype

- Leçons 1 à 5 de la Qaida : lettres isolées, lettres liées, lettres séparées, voyelles, tanwin.
- Geste central : toucher un élément pour l'écouter, maintenir le micro pour répéter, comparer sa voix au modèle.
- Mini-test de fin de séance (j'entends / je vois, je choisis), seuil 80 %.
- Progression enregistrée sur l'appareil, chemin des 17 leçons, Nouri la lanterne.

## À faire

- **Audio** : la voix actuelle est une synthèse provisoire. Ajouter les enregistrements d'un récitant
  (champ `audio` des items dans `src/content/`). Les indications d'articulation sont à faire valider par un enseignant.
- Leçons 6 à 17 et phase Coran.
- Police arabe dédiée (ex. KFGQPC Hafs, Amiri).
