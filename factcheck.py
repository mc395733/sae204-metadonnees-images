from PIL import Image
from PIL.ExifTags import TAGS


def detecter_manipulation(chemin):
    try:
        img = Image.open(chemin)
        exif = img._getexif()
        alertes = []

        if exif is None:
            print("Pas de données EXIF — authenticité invérifiable")
            return

        meta = {TAGS.get(k, k): v for k, v in exif.items()}

        # Vérif 1 : logiciel de retouche
        if "Software" in meta:
            soft = str(meta["Software"]).lower()
            retouche = ["photoshop", "gimp", "lightroom", "affinity", "darktable"]

            if any(r in soft for r in retouche):
                alertes.append(f"Logiciel de retouche détecté : {meta['Software']}")

        # Vérif 2 : dates incohérentes
        date_orig = meta.get("DateTimeOriginal", "")
        date_modif = meta.get("DateTime", "")

        if date_orig and date_modif and date_orig != date_modif:
            alertes.append("Dates incohérentes")
            alertes.append(f"  Prise de vue : {date_orig}")
            alertes.append(f"  Modification : {date_modif}")

        # Vérif 3 : smartphone sans GPS
        modele = str(meta.get("Model", "")).lower()
        smartphones = ["iphone", "samsung", "pixel", "xiaomi", "huawei", "oneplus"]

        if any(s in modele for s in smartphones) and "GPSInfo" not in meta:
            alertes.append("Smartphone sans GPS : données GPS absentes ou supprimées")

        if not alertes:
            print("Aucune anomalie détectée — image a priori authentique")
        else:
            print(f"{len(alertes)} alerte(s) :\n")
            for alerte in alertes:
                print(f"  → {alerte}")

    except FileNotFoundError:
        print("Erreur : fichier introuvable")
    except Exception as e:
        print(f"Erreur : {e}")


chemin = input("Chemin de l'image : ")
detecter_manipulation(chemin)