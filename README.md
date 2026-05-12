# SAÉ 204 — Métadonnées des images

## Description
Ce projet permet d'extraire et d'afficher les métadonnées contenues dans des images, principalement au format JPEG.
L'objectif est de comprendre quelles informations peuvent être stockées dans une image, comme la date de prise de vue, le modèle de l'appareil, la résolution ou encore les coordonnées GPS lorsque celles-ci sont présentes.
Le projet utilise principalement les métadonnées EXIF. Certaines notions liées aux métadonnées IPTC et XMP sont aussi abordées dans la documentation.

## Fonctionnalités
- Lecture des métadonnées EXIF d'une image
- Affichage des informations principales dans le terminal
- Détection des informations GPS si elles existent
- Tests réalisés sur plusieurs photos prises avec un smartphone
- Utilisation d'un dossier images/ pour stocker les fichiers testés

## Installation
```bash
git clone https://github.com/mc395733/sae204-metadonnees-images.git
cd sae204-metadonnees-images
pip install Pillow exifread piexif
```

## Utilisation
```bash
python metadonnees.py
```

## Bibliothèques utilisées
- **Pillow** : ouverture d'images et lecture EXIF de base
- **exifread** : extraction complète des tags EXIF avec noms lisibles
- **piexif** : lecture et écriture des données EXIF

## Comment on a travaillé
- Séance 1 : prise en main des bibliothèques, tests sur photos iPhone 17 transférées via LocalSend
- Gmail supprime automatiquement les métadonnées, LocalSend les préserve
- 47 tags EXIF extraits sur nos photos de test
- Pillow nécessite une conversion des IDs en noms lisibles
- ExifRead retourne directement les noms complets

## Ressources utilisées
- Documentation Pillow : https://pillow.readthedocs.io/
- Documentation ExifRead : https://github.com/ianare/exif-py
- Documentation piexif : https://piexif.readthedocs.io/
- Liste complète des tags EXIF : https://exiftool.org/TagNames/EXIF.html
- Convertisseur coordonnées GPS : https://www.gps-coordinates.net/

## Auteurs
Mathéo Coutant & Jules Charpentier
BUT Réseaux & Télécommunications — IUT Auxerre 2024-2025
Encadrant : A. Nectoux
