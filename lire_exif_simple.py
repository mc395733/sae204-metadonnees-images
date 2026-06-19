from PIL import Image
from PIL.ExifTags import TAGS

def lire_exif(chemin):
    try:
        img = Image.open(chemin)
        exif_data = img._getexif()
        if not exif_data:
            print("Pas de données EXIF")
            return
        for tag_id, val in exif_data.items():
            tag_name = TAGS.get(tag_id, tag_id)
            print(f"{tag_name} : {val}")
    except Exception as e:
        print("Erreur :", e)

if __name__ == "__main__":
    chemin = input("Chemin de l'image : ")
    lire_exif(chemin)