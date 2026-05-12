from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS


def convertir_nombre(valeur):
    """
    Convertit une valeur GPS en nombre décimal.
    Pillow peut renvoyer soit une fraction, soit déjà un nombre.
    """
    try:
        return float(valeur)
    except TypeError:
        return valeur[0] / valeur[1]


def to_decimal(valeur_gps, ref):
    """
    Convertit les coordonnées GPS du format degrés/minutes/secondes
    vers le format décimal utilisé par Google Maps.
    """
    deg = convertir_nombre(valeur_gps[0])
    minutes = convertir_nombre(valeur_gps[1])
    secondes = convertir_nombre(valeur_gps[2])

    decimal = deg + (minutes / 60.0) + (secondes / 3600.0)

    if ref in ["S", "W"]:
        decimal = -decimal

    return round(decimal, 7)


def extraire_gps(chemin):
    try:
        img = Image.open(chemin)
        exif = img._getexif()

        if exif is None:
            print("Pas de données EXIF")
            return None

        gps_brut = None

        for tag_id, valeur in exif.items():
            if TAGS.get(tag_id) == "GPSInfo":
                gps_brut = valeur
                break

        if gps_brut is None:
            print("Pas de GPS dans cette image")
            return None

        gps = {}

        for tag_id, valeur in gps_brut.items():
            nom = GPSTAGS.get(tag_id, tag_id)
            gps[nom] = valeur

        print("Tags GPS bruts :")
        for k, v in gps.items():
            print(f"  {k} : {v}")

        try:
            lat = to_decimal(gps["GPSLatitude"], gps["GPSLatitudeRef"])
            lon = to_decimal(gps["GPSLongitude"], gps["GPSLongitudeRef"])

            print(f"\nLatitude  : {lat}")
            print(f"Longitude : {lon}")
            print(f"\nGoogle Maps : https://www.google.com/maps?q={lat},{lon}")

            return lat, lon

        except KeyError as e:
            print(f"Données GPS incomplètes : {e}")
            return None

    except FileNotFoundError:
        print("Erreur : fichier introuvable")
    except Exception as e:
        print(f"Erreur : {e}")


chemin = input("Chemin de l'image : ")
extraire_gps(chemin)