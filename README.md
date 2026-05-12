# SAÉ 204 — Métadonnées des images

## Description

Ce projet permet d'extraire et d'afficher les métadonnées contenues dans des images, principalement au format JPEG.

L'objectif est de comprendre quelles informations peuvent être stockées dans une image, comme la date de prise de vue, le modèle de l'appareil, la résolution ou encore les coordonnées GPS lorsque celles-ci sont présentes.

Le projet utilise principalement les métadonnées EXIF. Certaines notions liées aux métadonnées IPTC et XMP sont aussi abordées dans la documentation.

## Fonctionnalités actuelles

- Lecture des métadonnées EXIF d'une image
- Affichage des informations principales dans le terminal
- Affichage des informations GPS si elles sont présentes
- Tests réalisés sur plusieurs photos prises avec un smartphone
- Utilisation d'un dossier `images/` pour stocker les fichiers testés

## Installation

Le projet a été développé sous WSL (Windows Subsystem for Linux).

Lors de la première tentative d'installation des bibliothèques, une erreur est apparue :

```bash
pip install Pillow exifread piexif
```

Erreur obtenue :

```text
externally-managed-environment
```

Cette erreur signifie que Python est géré par le système et qu'il ne faut pas installer de bibliothèques directement dans l'environnement global.

La solution utilisée a été de créer un environnement virtuel Python :

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install Pillow exifread piexif
```

Une fois l'environnement activé, le script peut être lancé avec :

```bash
python3 metadonnees.py
```

## Bibliothèques utilisées

- **Pillow** : ouverture d'images et lecture EXIF de base
- **exifread** : extraction complète des tags EXIF avec des noms lisibles
- **piexif** : lecture et écriture des données EXIF

## Travail réalisé pendant la séance 1

- Création du dépôt GitHub
- Installation et test des bibliothèques Python
- Création d'un premier script d'extraction EXIF
- Tests sur des photos prises avec un smartphone
- Transfert des images avec LocalSend pour conserver les métadonnées
- Observation du fait que Gmail peut supprimer certaines métadonnées
- Extraction de 47 tags EXIF sur une photo de test
- Affichage de tags comme `Make`, `Model`, `DateTimeOriginal`, `LensModel`, `FNumber` et `ISO`
- Début de comparaison entre Pillow, ExifRead et piexif

## Problèmes rencontrés

Lors de l'installation des bibliothèques sous WSL, l'erreur `externally-managed-environment` a empêché l'installation directe avec `pip`.

Un autre problème rencontré concerne le transfert des images. Certaines méthodes, comme l'envoi par Gmail, peuvent supprimer les métadonnées des photos.

## Solutions trouvées

Pour le problème d'installation, nous avons utilisé un environnement virtuel Python avec `venv`.

Pour le transfert des images, nous avons utilisé LocalSend afin de conserver les fichiers originaux et leurs métadonnées.

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
