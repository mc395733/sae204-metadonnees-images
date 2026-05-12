from PIL import Image
from PIL.ExifTags import TAGS

chemin = input("Chemin de l'image : ")

try:
    img = Image.open(chemin)
    exif = img._getexif()

    if exif is None:
        print("Pas de données EXIF")
    else:
        print(f"Nombre de tags trouvés : {len(exif)}")
        print()

        for tag_id, valeur in exif.items():
            nom = TAGS.get(tag_id, tag_id)
            print(f"{nom} : {valeur}")

except FileNotFoundError:
    print("Erreur : fichier introuvable")
except Exception as e:
    print(f"Erreur : {e}")
