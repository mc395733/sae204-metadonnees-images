import piexif
from PIL import Image

def modifier_exif_interactif():
    # Demande le chemin de l'image
    chemin_image = input("Chemin de l'image : ")

    try:
        img = Image.open(chemin_image)
        raw = img.info.get("exif", b"")
        exif_dict = piexif.load(raw) if raw else {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": None}

        # Saisie interactive pour chaque champ
        make = input("Fabricant (Make) : ")
        if make:
            exif_dict["0th"][piexif.ImageIFD.Make] = make.encode()

        model = input("Modèle (Model) : ")
        if model:
            exif_dict["0th"][piexif.ImageIFD.Model] = model.encode()

        datetime = input("Date et heure (YYYY:MM:DD HH:MM:SS) : ")
        if datetime:
            exif_dict["Exif"][piexif.ExifIFD.DateTimeOriginal] = datetime.encode()


        # Sauvegarder l'image modifiée
        exif_bytes = piexif.dump(exif_dict)
        nom_sortie = "modifie_" + chemin_image.split("/")[-1]
        img.save(nom_sortie, exif=exif_bytes)
        print(f"Image sauvegardée : {nom_sortie}")

    except FileNotFoundError:
        print("Erreur : le fichier n'existe pas.")
    except Exception as e:
        print("Erreur :", e)


if __name__ == "__main__":
    modifier_exif_interactif()