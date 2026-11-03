# Zon-groen pergola — animatiefilm + verkenmodus

Interactieve 3D-film (9 scènes) en vrije verkenmodus met 22 informatiepunten over het concept *Zon-groen pergola* (terras boven de fietsenstalling, HAN-campus; projectzone 14 × 90 m).
Alles draait in de browser (Three.js r147, WebGL). Geen build-stap, geen server-code.

## Status
- **Voorlopige timing**: de film loopt nu op geschatte spreektijd (ondertitels lopen mee). Zodra de ingesproken mp3-bestanden er zijn, wordt de timing per zin vastgelegd.
- Geen browser- of computerstem: zonder audiobestand blijft het stil en toont de pagina een melding met de bestandsnaam.

## Mappen
```
index.html        pagina + besturing (Nederlandse interface)
support.js        runtime van de pagina
three.min.js      Three.js r147
film.js           wereld, regie en speler (gebundeld)
audio/            vo_aac.mp4 (AAC) en vo_opus.webm (Opus) — voice-over van de film (voorlopige synthetische stem, zie onder)
                  music_aac.mp4 en music_opus.webm — achtergrondmuziek, staat zacht onder de stem
pa/               <punt>.mp4 en <punt>.webm — één bestand per informatiepunt (22 punten)
.nojekyll         voor GitHub Pages
```
Punt-ID's: terrein, pergola, module, zonnedak, klim, bak, reservoir, capillair, vulbuis, habitat, bloemen, kruiden, sedum, droog, vochtig, combi, onderhoud, draagkracht, sensor, rood, lokaal, pad.

## Lokaal bekijken
De site moet via http worden geopend (niet via dubbelklik op index.html):
```
cd <deze map>
python3 -m http.server 8080
```
en open daarna http://localhost:8080.

## GitHub Pages
1. Maak een repository en zet de **inhoud van deze map** in de root (of in `/docs`).
2. Settings → Pages → *Deploy from a branch* → kies `main` en `/ (root)` (of `/docs`).
3. Na enkele minuten staat de site op `https://<naam>.github.io/<repo>/`. Alle paden zijn relatief; `.nojekyll` staat erbij.

## Audio toevoegen
- `audio/vo_aac.mp4` + `audio/vo_opus.webm`: de doorlopende voice-over.
- `pa/<id>.mp4` + `pa/<id>.webm`: de uitleg per informatiepunt.

**Let op:** de meegeleverde voice-over is een *voorlopige synthetische stem* (Piper `nl_NL-ronnie-medium`, CC0-dataset, uitspraak via espeak-ng), gemaakt omdat de ElevenLabs-credits op waren. Hij is technisch schoon maar klinkt niet als een menselijke opname. In `film.js` staat per beat de echte duur (`v`); bij een nieuwe opname moeten die tijden opnieuw worden bepaald.
Voorbeeld conversie: `ffmpeg -i vo.mp3 -c:a aac -b:a 128k vo_aac.mp4` en `ffmpeg -i vo.mp3 -c:a libopus -b:a 64k vo_opus.webm`.

## Geluid
Naast de voice-over klinken alleen natuurgeluiden (wind, regen, vogels, procedureel) en het muziekje (Muziekje_voor_achtergrond.mp3) als achtergrondmuziek. Tijdens spraak zakt de muziek automatisch naar ongeveer de helft. Muziek: "Time" — Toshiki Soejima & Nahokimama (aangeleverd door de opdrachtgever; licentievoorwaarden niet gecontroleerd). De bronvermelding staat ook op het startscherm.

## Besturing
- **Film**: spatie = pauze, knoppen onderin (herstart, spoelen, ondertiteling, geluid, volledig scherm).
- **Verkenmodus**: W A S D lopen · Shift rennen · Spatie springen · muis kijken · **E** uitleg openen/sluiten · **Esc** menu (lijst en teller van ontdekte punten, terug naar de film). Op touch: stick links, kijkvlak rechts, tik op een punt.
- Een informatiepunt is alleen actief binnen ca. 8 m én als je ernaar kijkt; er start niets automatisch.

## Bronnen en eerlijkheid
Zie `bronnenoverzicht.md`: wat is feit uit de documenten, bestaand voorbeeld, ontwerpkeuze of nog te toetsen. Afmetingen van module, bak en bank zijn **ontwerpkeuzes** in het model, niet uit de documenten.
