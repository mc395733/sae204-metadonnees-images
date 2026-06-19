// ════════════════════════════════════════════
//  SAE 204 — EXIF Analyzer — script.js
// ════════════════════════════════════════════

let donneesActuelles = null;
let nomFichierActuel = "image.jpg";
let fichierActuel = null;

// ── Drag & drop ──────────────────────────────────────────────────────
const uploadZone = document.getElementById('uploadZone');
const imageInput = document.getElementById('imageInput');

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  if (e.dataTransfer.files[0]) {
    imageInput.files = e.dataTransfer.files;
    chargerImage(e.dataTransfer.files[0]);
  }
});
imageInput.addEventListener('change', function () {
  if (this.files[0]) chargerImage(this.files[0]);
});

// ── Chargement de l'image ────────────────────────────────────────────
function chargerImage(file) {
  fichierActuel = file;
  nomFichierActuel = file.name;

  // Aperçu
  const url = URL.createObjectURL(file);
  document.getElementById('apercu').src = url;
  document.getElementById('nom-fichier').textContent = file.name;
  document.getElementById('taille-fichier').textContent = (file.size / 1024).toFixed(1) + ' Ko · ' + file.type;
  document.getElementById('apercu-wrap').style.display = 'flex';
  document.getElementById('erreur').style.display = 'none';

  // Analyse automatique
  extractMetadata();
}

// ── Extraction des métadonnées ───────────────────────────────────────
async function extractMetadata() {
  const file = imageInput.files[0];
  if (!file) { showError("Veuillez sélectionner une image."); return; }

  try {
    const data = await exifr.parse(file, { gps: true, tiff: true, ifd0: true, exif: true }) || {};
    donneesActuelles = data;

    if (Object.keys(data).length === 0) {
      showError("Aucune métadonnée EXIF trouvée dans cette image. Elle a peut-être été nettoyée (réseaux sociaux, capture d'écran...).");
      return;
    }

    afficherSynthese(data, file);
    afficherScoring(data);
    afficherFactcheck(data);
    afficherGPS(data);

    fillBloc('bloc-appareil', [
      { cle: 'Fabricant', valeur: data.Make },
      { cle: 'Modèle', valeur: data.Model },
      { cle: 'Objectif', valeur: data.LensModel },
      { cle: 'Ouverture', valeur: data.FNumber ? 'f/' + data.FNumber : null },
      { cle: 'Vitesse', valeur: data.ExposureTime ? data.ExposureTime + ' s' : null },
      { cle: 'ISO', valeur: data.ISO },
      { cle: 'Focale', valeur: data.FocalLength ? data.FocalLength + ' mm' : null },
    ]);

    fillBloc('bloc-image', [
      { cle: 'Largeur', valeur: data.ImageWidth ? data.ImageWidth + ' px' : null },
      { cle: 'Hauteur', valeur: data.ImageHeight ? data.ImageHeight + ' px' : null },
      { cle: 'Logiciel', valeur: data.Software },
      { cle: 'Orientation', valeur: data.Orientation },
      { cle: 'Résolution X', valeur: data.XResolution },
    ]);

    fillBloc('bloc-date', [
      { cle: 'Prise de vue', valeur: formatDate(data.DateTimeOriginal) },
      { cle: 'Modification', valeur: formatDate(data.DateTime) },
      { cle: 'Numérisation', valeur: formatDate(data.DateTimeDigitized) },
    ]);

    document.getElementById('resultats').style.display = 'block';
    document.getElementById('erreur').style.display = 'none';

  } catch (err) {
    showError('Erreur de lecture : ' + err.message);
  }
}

// ── Synthèse rapide ──────────────────────────────────────────────────
function afficherSynthese(data, file) {
  const gps = (data.latitude && data.longitude) ? '✓ Oui' : '✗ Non';
  const items = [
    { label: 'Format', value: file.type.split('/')[1]?.toUpperCase() || '?' },
    { label: 'Taille', value: (file.size / 1024).toFixed(0) + ' Ko' },
    { label: 'Appareil', value: data.Model || data.Make || '—' },
    { label: 'GPS', value: gps },
  ];
  document.getElementById('synthese').innerHTML = items.map(i =>
    `<div class="synthese-card"><div class="label">${i.label}</div><div class="value">${i.value}</div></div>`
  ).join('');
}

// ── SCORING (basé sur scoring.py) ────────────────────────────────────
function afficherScoring(data) {
  let score = 0;
  const details = [];

  if (data.latitude && data.longitude) { score += 4; details.push('GPS présent (+4 pts)'); }
  if (data.Model) { score += 2; details.push('Modèle : ' + data.Model + ' (+2 pts)'); }
  if (data.Artist) { score += 2; details.push('Auteur : ' + data.Artist + ' (+2 pts)'); }
  if (data.DateTimeOriginal) { score += 1; details.push('Date de prise de vue (+1 pt)'); }
  if (data.Software) { score += 1; details.push('Logiciel : ' + data.Software + ' (+1 pt)'); }

  let niveau, classe, couleur;
  if (score === 0) { niveau = 'FAIBLE — Sûre à partager'; classe = 'score-faible'; couleur = '#0a7a4a'; }
  else if (score <= 3) { niveau = 'MODÉRÉ — Appareil identifiable'; classe = 'score-modere'; couleur = '#8a5a00'; }
  else if (score <= 6) { niveau = 'ÉLEVÉ — Localisation exposée !'; classe = 'score-eleve'; couleur = '#aa3300'; }
  else { niveau = 'CRITIQUE — Ne pas partager !'; classe = 'score-critique'; couleur = '#cc2222'; }

  let html = `<div class="score-badge ${classe}">${score}/10 — ${niveau}</div>`;
  html += `<div class="score-barre"><div class="score-barre-fill" style="width:${score * 10}%;background:${couleur};"></div></div>`;
  details.forEach(d => { html += `<div class="score-detail">→ ${d}</div>`; });
  if (details.length === 0) html += `<div class="score-detail">Aucune donnée sensible détectée.</div>`;

  document.getElementById('bloc-scoring').innerHTML = html;
}

// ── FACT-CHECK (basé sur factcheck.py) ───────────────────────────────
function afficherFactcheck(data) {
  const alertes = [];

  if (data.Software) {
    const soft = data.Software.toLowerCase();
    ['photoshop', 'gimp', 'lightroom', 'affinity', 'darktable'].forEach(r => {
      if (soft.includes(r)) alertes.push('Logiciel de retouche détecté : ' + data.Software);
    });
  }

  if (data.DateTimeOriginal && data.DateTime) {
    const d1 = new Date(data.DateTimeOriginal).getTime();
    const d2 = new Date(data.DateTime).getTime();
    if (d1 !== d2) alertes.push('Dates incohérentes : prise de vue ≠ modification');
  }

  if (data.Model) {
    const modele = data.Model.toLowerCase();
    const smartphones = ['iphone', 'samsung', 'pixel', 'xiaomi', 'huawei', 'oneplus'];
    if (smartphones.some(s => modele.includes(s)) && !data.latitude) {
      alertes.push('Smartphone sans GPS : données peut-être supprimées');
    }
  }

  const html = alertes.length === 0
    ? '<p class="ok">✅ Aucune anomalie détectée — image a priori authentique</p>'
    : alertes.map(a => `<div class="alerte">⚠️ ${a}</div>`).join('');

  document.getElementById('bloc-factcheck').innerHTML = html;
}

// ── GPS + CARTE (basé sur gps.py) ────────────────────────────────────
function afficherGPS(data) {
  const cardGps = document.getElementById('card-gps');

  if (!data.latitude || !data.longitude) {
    cardGps.style.display = 'none';
    return;
  }

  const lat = data.latitude.toFixed(6);
  const lon = data.longitude.toFixed(6);
  const alt = data.GPSAltitude ? Math.round(data.GPSAltitude) + ' m' : '—';

  document.getElementById('bloc-gps').innerHTML = `
    <div class="gps-coords">
      <div class="gps-card"><div class="label">Latitude</div><div class="value">${lat}°</div></div>
      <div class="gps-card"><div class="label">Longitude</div><div class="value">${lon}°</div></div>
      <div class="gps-card"><div class="label">Altitude</div><div class="value">${alt}</div></div>
    </div>
    <a class="lien-maps" href="https://www.google.com/maps?q=${lat},${lon}" target="_blank">→ Voir sur Google Maps</a>
  `;

  // Carte OpenStreetMap intégrée
  const d = 0.01;
  const bbox = `${data.longitude - d},${data.latitude - d},${data.longitude + d},${data.latitude + d}`;
  document.getElementById('map-container').innerHTML =
    `<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}" loading="lazy"></iframe>`;

  cardGps.style.display = 'block';
}

// ── MODIFIER DIRECTEMENT & TÉLÉCHARGER (piexif.js) ───────────────────
function modifierEtTelecharger() {
  if (!fichierActuel) { showError("Aucune image chargée."); return; }

  const type = fichierActuel.type;
  if (type !== 'image/jpeg' && type !== 'image/jpg') {
    afficherMessageModif("⚠️ La modification directe ne fonctionne que sur les JPEG. Pour les autres formats, utilise le script Python.", false);
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    try {
      // Charger l'EXIF existant (ou créer un objet vide)
      let exifObj;
      try { exifObj = piexif.load(dataUrl); }
      catch (err) { exifObj = { "0th": {}, "Exif": {}, "GPS": {} }; }

      const v = id => document.getElementById(id).value.trim();
      const z = exifObj["0th"], ex = exifObj["Exif"];

      if (v('f_make')) z[piexif.ImageIFD.Make] = v('f_make');
      if (v('f_model')) z[piexif.ImageIFD.Model] = v('f_model');
      if (v('f_artist')) z[piexif.ImageIFD.Artist] = v('f_artist');
      if (v('f_copyright')) z[piexif.ImageIFD.Copyright] = v('f_copyright');
      if (v('f_description')) z[piexif.ImageIFD.ImageDescription] = v('f_description');
      if (v('f_datetime')) ex[piexif.ExifIFD.DateTimeOriginal] = v('f_datetime');

      // Réinjecter l'EXIF modifié dans l'image
      const exifBytes = piexif.dump(exifObj);
      const nouvelle = piexif.insert(exifBytes, dataUrl);

      // Télécharger
      const lien = document.createElement('a');
      lien.href = nouvelle;
      lien.download = 'modifie_' + nomFichierActuel;
      lien.click();

      afficherMessageModif("✅ Image modifiée téléchargée : modifie_" + nomFichierActuel, true);
    } catch (err) {
      afficherMessageModif("❌ Erreur : " + err.message, false);
    }
  };
  reader.readAsDataURL(fichierActuel);
}

function afficherMessageModif(msg, ok) {
  const el = document.getElementById('modif-result');
  el.textContent = msg;
  el.style.color = ok ? '#0a7a4a' : '#cc2222';
  el.style.display = 'block';
}

// ── MODIFIER LES MÉTADONNÉES (génère un script Python) ───────────────
function genererScript() {
  const v = id => document.getElementById(id).value.trim();
  const make = v('f_make'), model = v('f_model'), datetime = v('f_datetime');
  const artist = v('f_artist'), copyright = v('f_copyright'), desc = v('f_description');

  const lignes = [];
  if (make) lignes.push(`exif_dict["0th"][piexif.ImageIFD.Make] = b"${make}"`);
  if (model) lignes.push(`exif_dict["0th"][piexif.ImageIFD.Model] = b"${model}"`);
  if (artist) lignes.push(`exif_dict["0th"][piexif.ImageIFD.Artist] = b"${artist}"`);
  if (copyright) lignes.push(`exif_dict["0th"][piexif.ImageIFD.Copyright] = b"${copyright}"`);
  if (desc) lignes.push(`exif_dict["0th"][piexif.ImageIFD.ImageDescription] = b"${desc}"`);
  if (datetime) lignes.push(`exif_dict["Exif"][piexif.ExifIFD.DateTimeOriginal] = b"${datetime}"`);

  const script =
`import piexif
from PIL import Image

img = Image.open("${nomFichierActuel}")
raw = img.info.get("exif", b"")
exif_dict = piexif.load(raw) if raw else {"0th": {}, "Exif": {}, "GPS": {}}

${lignes.length ? lignes.join('\n') : '# Aucun champ renseigné'}

exif_bytes = piexif.dump(exif_dict)
img.save("modifie_${nomFichierActuel}", exif=exif_bytes)
print("Image sauvegardée : modifie_${nomFichierActuel}")`;

  document.getElementById('script-output').textContent = script;
  document.getElementById('script-wrap').style.display = 'block';
}

// ── SUPPRIMER LES MÉTADONNÉES & TÉLÉCHARGER ──────────────────────────
function supprimerEtTelecharger() {
  if (!fichierActuel) { showError("Aucune image chargée."); return; }

  const img = new Image();
  const url = URL.createObjectURL(fichierActuel);

  img.onload = function () {
    // Redessiner l'image dans un canvas = supprime toutes les métadonnées EXIF
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(function (blob) {
      const lien = document.createElement('a');
      lien.href = URL.createObjectURL(blob);
      lien.download = 'sans_exif_' + nomFichierActuel.replace(/\.[^.]+$/, '.jpg');
      lien.click();
      URL.revokeObjectURL(lien.href);
    }, 'image/jpeg', 0.95);

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

// ── EXPORT RAPPORT (impression / PDF) ────────────────────────────────
function exporterRapport() {
  window.print();
}

// ── COPIER LE SCRIPT ─────────────────────────────────────────────────
function copierScript() {
  navigator.clipboard.writeText(document.getElementById('script-output').textContent)
    .then(() => {
      const btn = document.querySelector('.copy-btn');
      btn.textContent = 'Copié ✓';
      setTimeout(() => btn.textContent = 'Copier', 2000);
    });
}

// ── UTILITAIRES ──────────────────────────────────────────────────────
function fillBloc(id, champs) {
  const el = document.getElementById(id);
  let html = '';
  champs.forEach(c => {
    if (c.valeur !== null && c.valeur !== undefined && c.valeur !== '') {
      html += `<div class="ligne"><span class="cle">${c.cle}</span><span class="valeur">${c.valeur}</span></div>`;
    }
  });
  el.innerHTML = html || '<p class="vide">Non disponible</p>';
}

function formatDate(d) {
  if (!d) return null;
  if (d instanceof Date) return d.toLocaleString('fr-FR');
  return d;
}

function showError(msg) {
  const el = document.getElementById('erreur');
  el.textContent = msg;
  el.style.display = 'block';
  document.getElementById('resultats').style.display = 'none';
}
