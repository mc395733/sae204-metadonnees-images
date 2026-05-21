// Affiche l'aperçu dès qu'un fichier est choisi
document.getElementById('imageInput').addEventListener('change', function () {
    var file = this.files[0];
    if (!file) return;

    var url = URL.createObjectURL(file);
    document.getElementById('apercu').src = url;
    document.getElementById('nom-fichier').textContent = file.name + ' — ' + (file.size / 1024).toFixed(1) + ' Ko';
    document.getElementById('apercu-wrap').style.display = 'flex';
    document.getElementById('resultats').style.display = 'none';
    document.getElementById('erreur').style.display = 'none';
});

// Extraction et affichage des métadonnées
async function extractMetadata() {
    var input = document.getElementById('imageInput');
    var file = input.files[0];

    if (!file) {
        showError('Veuillez d\'abord sélectionner une image.');
        return;
    }

    try {
        var data = await exifr.parse(file, { gps: true });

        if (!data) {
            showError('Aucune métadonnée EXIF trouvée dans cette image.');
            return;
        }

        // Appareil photo
        fillBloc('bloc-appareil', [
            { cle: 'Fabricant',       valeur: data.Make },
            { cle: 'Modèle',          valeur: data.Model },
            { cle: 'Objectif',        valeur: data.LensModel },
            { cle: 'Ouverture',       valeur: data.FNumber ? 'f/' + data.FNumber : null },
            { cle: 'Vitesse obtu.',   valeur: data.ExposureTime ? data.ExposureTime + ' s' : null },
            { cle: 'ISO',             valeur: data.ISO },
            { cle: 'Flash',           valeur: data.Flash },
        ]);

        // Informations image
        fillBloc('bloc-image', [
            { cle: 'Largeur',         valeur: data.ImageWidth  ? data.ImageWidth  + ' px' : null },
            { cle: 'Hauteur',         valeur: data.ImageHeight ? data.ImageHeight + ' px' : null },
            { cle: 'Logiciel',        valeur: data.Software },
            { cle: 'Orientation',     valeur: data.Orientation },
            { cle: 'Espace colorim.', valeur: data.ColorSpace },
        ]);

        // Date
        fillBloc('bloc-date', [
            { cle: 'Prise de vue',    valeur: formatDate(data.DateTimeOriginal) },
            { cle: 'Modification',    valeur: formatDate(data.DateTime) },
        ]);

        // GPS
        if (data.latitude && data.longitude) {
            var lat = data.latitude.toFixed(6);
            var lon = data.longitude.toFixed(6);

            fillBloc('bloc-gps', [
                { cle: 'Latitude',    valeur: lat + '°' },
                { cle: 'Longitude',   valeur: lon + '°' },
                { cle: 'Altitude',    valeur: data.GPSAltitude ? Math.round(data.GPSAltitude) + ' m' : null },
            ]);

            var lien = document.createElement('a');
            lien.href = 'https://www.google.com/maps?q=' + lat + ',' + lon;
            lien.target = '_blank';
            lien.className = 'lien-maps';
            lien.textContent = '→ Voir la localisation sur Google Maps';
            document.getElementById('bloc-gps').appendChild(lien);

            document.getElementById('card-gps').style.display = 'block';
        } else {
            document.getElementById('card-gps').style.display = 'none';
        }

        document.getElementById('resultats').style.display = 'block';
        document.getElementById('erreur').style.display = 'none';

    } catch (err) {
        showError('Erreur de lecture : ' + err.message);
    }
}

// Remplit un bloc avec les paires clé/valeur
function fillBloc(id, champs) {
    var el = document.getElementById(id);
    var html = '';

    champs.forEach(function (c) {
        if (c.valeur !== null && c.valeur !== undefined && c.valeur !== '') {
            html += '<div class="ligne">'
                  + '<span class="cle">' + c.cle + '</span>'
                  + '<span class="valeur">' + c.valeur + '</span>'
                  + '</div>';
        }
    });

    el.innerHTML = html || '<p class="vide">Non disponible</p>';
}

// Formate une date
function formatDate(d) {
    if (!d) return null;
    if (d instanceof Date) return d.toLocaleString('fr-FR');
    return d;
}

function showError(msg) {
    var el = document.getElementById('erreur');
    el.textContent = msg;
    el.style.display = 'block';
    document.getElementById('resultats').style.display = 'none';
}
