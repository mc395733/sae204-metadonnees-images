# modifier_exif_html.py
import piexif
from PIL import Image

def modifier_exif_html(chemin_image, make=None, model=None, datetime=None, artist=None, description=None):
    try:
        # Ouvrir l'image
        img = Image.open(chemin_image)
        raw = img.info.get("exif", b"")
        exif_dict = piexif.load(raw) if raw else {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": None}

        # Lire infos existantes pour retour
        infos = {}
        infos['Make'] = exif_dict["0th"].get(piexif.ImageIFD.Make, b'').decode(errors='ignore')
        infos['Model'] = exif_dict["0th"].get(piexif.ImageIFD.Model, b'').decode(errors='ignore')
        infos['Artist'] = exif_dict["0th"].get(piexif.ImageIFD.Artist, b'').decode(errors='ignore')
        infos['Description'] = exif_dict["0th"].get(piexif.ImageIFD.ImageDescription, b'').decode(errors='ignore')
        infos['DateTimeOriginal'] = exif_dict["Exif"].get(piexif.ExifIFD.DateTimeOriginal, b'').decode(errors='ignore')
        infos['Dimensions'] = img.size  # (width, height)

        gps = exif_dict.get("GPS", {})
        infos['GPSLatitude'] = gps.get(piexif.GPSIFD.GPSLatitude, None)
        infos['GPSLongitude'] = gps.get(piexif.GPSIFD.GPSLongitude, None)

        # Modifier les EXIF si des champs sont remplis
        if make:
            exif_dict["0th"][piexif.ImageIFD.Make] = make.encode()
        if model:
            exif_dict["0th"][piexif.ImageIFD.Model] = model.encode()
        if artist:
            exif_dict["0th"][piexif.ImageIFD.Artist] = artist.encode()
        if description:
            exif_dict["0th"][piexif.ImageIFD.ImageDescription] = description.encode()
        if datetime:
            exif_dict["Exif"][piexif.ExifIFD.DateTimeOriginal] = datetime.encode()

        # Sauvegarde nouvelle image
        exif_bytes = piexif.dump(exif_dict)
        nom_sortie = "modifie_" + chemin_image.split("/")[-1]
        img.save(nom_sortie, exif=exif_bytes)

        # Retour des infos pour affichage HTML
        return infos, nom_sortie

    except FileNotFoundError:
        return {"error": "Fichier non trouvé"}, None
    except Exception as e:
        return {"error": str(e)}, None

# Exemple d'utilisation :
# infos, fichier_modifie = modifier_exif_html("images/IMG_1493.JPG", make="Apple", model="iPhone 17")
# print(infos, fichier_modifie)