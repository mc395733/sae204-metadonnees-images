from PIL import Image
from PIL.ExifTags import TAGS

img = Image.open("images/IMG_1491.JPG")
exif = img._getexif()

if exif is None:
    print("Pas de données EXIF")
else:
    print(f"Nombre de tags trouvés : {len(exif)}")
    print()
    for tag_id, valeur in exif.items():
        nom = TAGS.get(tag_id, tag_id)
        print(f"{nom} : {valeur}")

