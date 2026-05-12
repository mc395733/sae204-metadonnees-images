![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python) ![License](https://img.shields.io/badge/Licence-MIT-green)

# SAÃ‰ 204 â€” MÃ©tadonnÃ©es des images

## Description

Ce projet a pour objectif dextraire et danalyser les **mÃ©tadonnÃ©es numÃ©riques** contenues dans des fichiers images (formats JPEG, PNG, TIFF).

Les mÃ©tadonnÃ©es Ã©tudiÃ©es couvrent trois standards :
- **EXIF** â€” informations techniques : date, modÃ¨le dappareil, coordonnÃ©es GPS, rÃ©solution, exposition...
- **IPTC** â€” informations Ã©ditoriales : auteur, lÃ©gende, mots-clÃ©s, droits...
- **XMP** â€” mÃ©tadonnÃ©es extensibles au format XML embarquÃ© dans limage

### Cas dusage

| Domaine | Application |
|---|---|
| Fact-checking | VÃ©rifier la date et le lieu rÃ©el dune photo |
| DÃ©sinformation | DÃ©tecter des images rÃ©utilisÃ©es hors contexte |
| Vie privÃ©e | Identifier les donnÃ©es personnelles exposÃ©es involontairement |
| Plagiat | Retrouver lauteur original dune image |

---

## Installation

Cloner le dÃ©pÃ´t puis installer les dÃ©pendances :

```bash
git clone https://github.com/mc395733/sae204-metadonnees-images.git
cd sae204-metadonnees-images
pip install Pillow exifread piexif
```

---

## Utilisation

```bash
python metadonnees.py <chemin_vers_image>
```

**Exemple :**

```bash
python metadonnees.py tests/images/photo.jpg
```

---

## BibliothÃ¨ques utilisÃ©es

| BibliothÃ¨que | RÃ´le |
|---|---|
| [Pillow](https://python-pillow.org/) | Ouverture et manipulation dimages, lecture EXIF de base |
| [exifread](https://pypi.org/project/ExifRead/) | Extraction complÃ¨te des balises EXIF/IPTC |
| [piexif](https://piexif.readthedocs.io/) | Lecture, modification et Ã©criture des donnÃ©es EXIF |

---

## Structure du projet

```
sae204-metadonnees-images/
â”œâ”€â”€ metadonnees.py       # Script principal
â”œâ”€â”€ tests/
â”‚   â””â”€â”€ images/          # Images de test
â”œâ”€â”€ docs/                # Documentation
â””â”€â”€ .gitignore
```

---

## Licence

DistribuÃ© sous licence **MIT**. Voir [LICENSE](LICENSE) pour plus dinformations.

