from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def extraire_gps(chemin):
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

    def to_decimal(valeur_gps, ref):
        deg = valeur_gps[0][0] / valeur_gps[0][1]
        min = valeur_gps[1][0] / valeur_gps[1][1]
        sec = valeur_gps[2][0] / valeur_gps[2][1]
        decimal = deg + (min / 60.0) + (sec / 3600.0)
        if ref in ['S', 'W']:
            decimal = -decimal
        return round(decimal, 7)

    try:
        lat = to_decimal(gps['GPSLatitude'], gps['GPSLatitudeRef'])
        lon = to_decimal(gps['GPSLongitude'], gps['GPSLongitudeRef'])
        print(f"
Latitude  : {lat}")
        print(f"Longitude : {lon}")
        print(f"
Google Maps : https://www.google.com/maps?q={lat},{lon}")
        return (lat, lon)
    except KeyError as e:
        print(f"Données GPS incomplètes : {e}")
        return None

chemin = input("Chemin de l'image : ")
extraire_gps(chemin)
