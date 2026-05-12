![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python) ![License](https://img.shields.io/badge/Licence-MIT-green) ![Status](https://img.shields.io/badge/Statut-Fonctionnel-brightgreen)

# SAÉ 204 — Métadonnées des images

## Description

Ce projet extrait et analyse les **métadonnées numériques** contenues dans des fichiers images (JPEG, PNG, TIFF).

Standards couverts :
- **EXIF** — date, modèle d'appareil, coordonnées GPS, résolution, exposition...
- **IPTC** — auteur, légende, mots-clés, droits...
- **XMP** — métadonnées extensibles au format XML embarqué

> Script de base **fonctionnel et testé** sur des photos prises avec un **iPhone 17**.

### Cas d'usage

| Domaine | Application |
|---|---|
| Fact-checking | Vérifier la date et le lieu réel d'une photo |
| Désinformation | Détecter des images réutilisées hors contexte |
| Vie privée | Identifier les données personnelles exposées |
| Plagiat | Retrouver l'auteur original d'une image |

---

## Installation

```bash
git clone https://github.com/mc395733/sae204-metadonnees-images.git
cd sae204-metadonnees-images
pip install Pillow exifread piexif
```

---

## Utilisation

```bash
python metadonnees.py
```

Le script ouvre `images/IMG_1491.JPG`, extrait les données EXIF et les affiche tag par tag.

---

## Bibliothèques utilisées

| Bibliothèque | Rôle |
|---|---|
| [Pillow](https://python-pillow.org/) | Ouverture d'images, lecture EXIF |
| [exifread](https://pypi.org/project/ExifRead/) | Extraction complète EXIF/IPTC |
| [piexif](https://piexif.readthedocs.io/) | Lecture et écriture des données EXIF |

---

## Structure du projet

```
sae204-metadonnees-images/
├── metadonnees.py       # Script principal (fonctionnel)
├── tests/
│   ├── test1.py         # Premier test d'extraction
│   └── images/          # Images de test (iPhone 17)
├── docs/
└── .gitignore
```

---

## Licence

Distribué sous licence **MIT**.
