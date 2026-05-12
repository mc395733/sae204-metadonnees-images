from PIL import Image
from PIL.ExifTags import TAGS

def scoring(chemin):
    img = Image.open(chemin)
    exif = img._getexif()
    score = 0
    details = []

    if exif is None:
        print("Score : 0/10 — Aucune métadonnée. Image sûre.")
        return 0

    for tag_id, valeur in exif.items():
        nom = TAGS.get(tag_id, "")
        if nom == "GPSInfo":
            score += 4
            details.append("GPS présent +4 pts")
        elif nom == "Model" and valeur:
            score += 2
            details.append(f"Modèle : {valeur} +2 pts")
        elif nom == "Artist" and valeur:
            score += 2
            details.append(f"Auteur : {valeur} +2 pts")
        elif nom == "DateTimeOriginal" and valeur:
            score += 1
            details.append(f"Date : {valeur} +1 pt")
        elif nom == "Software" and valeur:
            score += 1
            details.append(f"Logiciel : {valeur} +1 pt")

    for d in details:
        print(f"  → {d}")

    print(f"\nSCORE : {score}/10")
    if score == 0:
        print("FAIBLE — Sûre à partager")
    elif score <= 3:
        print("MODÉRÉ — Appareil identifiable")
    elif score <= 6:
        print("ÉLEVÉ — Localisation exposée !")
    else:
        print("CRITIQUE — Ne pas partager !")

    return score

chemin = input("Chemin de l'image : ")
scoring(chemin)