/* ===== 01 · Script, chapters & helpers ===== */
(function (G) {
'use strict';

// Terrein: exact 14 x 90 m  (x = lengte, z = breedte). Eenheden = meters.
if (G.THREE && THREE.ColorManagement) THREE.ColorManagement.legacyMode = false; // hex-kleuren als sRGB
const SITE = { L: 90, W: 14 };

// Hoofdstukken (negen scènes)
const CHAPTERS = [
  'Introductie en locatie', 'Huidige situatie en ambitie', 'De zon-groene pergola', 'Groenmodules en plantenbakken',
  'Habitatbakken en biodiversiteit', 'Eén samenhangend ontwerp', 'Gebruik, beleving en meerwaarde', 'Aandachtspunten en haalbaarheid', 'Conclusie'
];

/* Ontwerpmaten (alle maten behalve het terrein 14 × 90 m zijn ONTWERPKEUZES voor de visualisatie, geen documentfeiten,
   behalve habitatmodule 100 × 40–50 cm, hoogte 30–50 cm (dia 9 habitatbakken: 'ontwerpmaat, geen getoetste specificatie')).
   Posities volgen de plattegrond: plattegrond-boven = x -45, plattegrond-links = z +7 (alleen verhoudingen, geen schaal). */
const CFG = {
  site: SITE,
  module: { W: 4.8, D: 3.6, H: 2.9 },
  planter: { L: 2.4, W: .9, H: .72 }, bench: { L: 2.4, D: .45, H: .46 },
  habitat: { L: 1.0, D: .5, H: .4, perSeg: 3 },
  path: { w: 2.0, mainW: 1.5 },
  big: [{ cx: -32.4, cz: -.95, nx: 4, nz: 2 }, { cx: 33.5, cz: -.95, nx: 4, nz: 2 }],
  small: [{ cx: -10.3, cz: 1.6, nx: 3, nz: 1 }, { cx: 8.3, cz: -3.74, nx: 3, nz: 1 }],
  planters: [ // [x, z, banksoort: +1 bank aan +x-kant, -1 aan -x-kant]
    [-14.15, 1.88, 1], [-6.5, 1.88, -1], [-14.15, -3.7, 1], [-6.5, -3.7, -1],
    [4.48, 1.88, 1], [11.97, 1.88, -1], [4.48, -3.7, 1], [11.97, -3.7, -1]],
  habitatSegs: [ // [x, z, types]  types: 0 bloemen 1 kruiden 2 sedum 3 droog 4 vochtig 5 combi
    [-19.8, 2.38, [0, 1, 2]], [-19.8, -1.22, [3, 4, 5]], [-19.8, -4.81, [0, 2, 1]],
    [-1.17, 1.85, [4, 5, 3]], [-1.17, -3.6, [1, 0, 2]],
    [21.0, 2.38, [2, 3, 0]], [21.0, -1.22, [5, 1, 4]], [21.0, -4.81, [3, 0, 5]]],
  mainPath: { x0: -44.7, x1: 44.7, z0: 4.4, z1: 6.4 },
  crossPaths: [-10.3, 8.2], stubs: [-32.4, 33.5],
  oldTables: [[-43.6, 1.0, Math.PI / 2], [-43.6, -2.8, Math.PI / 2], [17.9, 1.4, 0], [17.9, -3.0, 0]]
};
const HAB_NAMES = ['Bloemenbak', 'Kruiden & grassen', 'Sedumbak', 'Droge habitat', 'Vochtige habitat', 'Combinatiebak'];

/* Voice-over: 57 zinsblokken, 9 scènes. Elke zin is uit de aangeleverde documenten afgeleid (bronnen: zie bronoverzicht).
   key = 'S<scène>.<cue>'. v = [begin, eind] in het voice-over-bestand (null zolang de definitieve opname ontbreekt: dan loopt de film op
   voorlopige timing). s = zinnen met tijden t.o.v. het begin van het spreekdeel. */
const BEATS = [{"ch":0,"cue":"open","key":"S1.open","t":"Hoi! Ik ben student aan de HAN in Nijmegen, en ik neem je mee naar een plek die ik bijna elke dag zie: het dak van de fietsenstalling op de campus.","v":[0.0,9.17],"s":[["Hoi!",0.0,0.7],["Ik ben student aan de HAN in Nijmegen, en ik neem je mee naar een plek die ik bijna elke dag zie: het dak van de fietsenstalling op de campus.",1.0,9.17]],"spk":9.17},{"ch":0,"cue":"terras","key":"S1.terras","t":"Boven de stalling ligt een terras van veertien bij negentig meter. Het bestaat nu grotendeels uit bestrating, met een paar picknicktafels.","v":[10.47,18.95],"s":[["Boven de stalling ligt een terras van veertien bij negentig meter.",0.0,3.68],["Het bestaat nu grotendeels uit bestrating, met een paar picknicktafels.",4.14,8.48]],"spk":8.48},{"ch":0,"cue":"opdracht","key":"S1.opdracht","t":"Wij onderzoeken hoe deze plek beter gebruikt kan worden, voor biodiversiteit en als sociale ruimte voor studenten.","v":[20.25,27.61],"s":[["Wij onderzoeken hoe deze plek beter gebruikt kan worden, voor biodiversiteit en als sociale ruimte voor studenten.",0.0,7.36]],"spk":7.36},{"ch":0,"cue":"preview","key":"S1.preview","t":"Wat we bedachten is één samenhangend ontwerp: een pergola met zonnepanelen, zelfwatergevende plantenbakken en habitatbakken voor insecten. Ik laat je zien hoe dat samenwerkt.","v":[28.91,40.68],"s":[["Wat we bedachten is één samenhangend ontwerp: een pergola met zonnepanelen, zelfwatergevende plantenbakken en habitatbakken voor insecten.",0.0,9.18],["Ik laat je zien hoe dat samenwerkt.",9.64,11.77]],"spk":11.77},{"ch":1,"cue":"hitte","key":"S2.hitte","t":"Kijk maar eens om je heen. Tegels, een paar tafels, en op warme dagen warmt dit terras sterk op.","v":[41.98,48.59],"s":[["Kijk maar eens om je heen.",0.0,1.29],["Tegels, een paar tafels, en op warme dagen warmt dit terras sterk op.",1.75,6.61]],"spk":6.61},{"ch":1,"cue":"dak","key":"S2.dak","t":"En omdat we boven een fietsenstalling staan, is niet alles mogelijk. Draagkracht, waterafvoer en waterdichting van het dak bepalen wat kan.","v":[49.89,59.9],"s":[["En omdat we boven een fietsenstalling staan, is niet alles mogelijk.",0.0,4.98],["Draagkracht, waterafvoer en waterdichting van het dak bepalen wat kan.",5.44,10.01]],"spk":10.01},{"ch":1,"cue":"licht","key":"S2.licht","t":"Daarom zoeken we iets lichts en modulairs, dat niet in het dak verankerd hoeft te worden.","v":[61.2,66.19],"s":[["Daarom zoeken we iets lichts en modulairs, dat niet in het dak verankerd hoeft te worden.",0.0,4.99]],"spk":4.99},{"ch":1,"cue":"systeem","key":"S2.systeem","t":"Onze opdracht was: bedenk iets innovatiever dan een bijenhotel. Een bijenhotel is één voorziening. Wij zochten een systeem, dat energie, groen en onderwijs combineert.","v":[67.49,79.86],"s":[["Onze opdracht was: bedenk iets innovatiever dan een bijenhotel.",0.0,4.5],["Een bijenhotel is één voorziening.",4.96,7.11],["Wij zochten een systeem, dat energie, groen en onderwijs combineert.",7.57,12.38]],"spk":12.38},{"ch":1,"cue":"ambitie","key":"S2.ambitie","t":"De ambitie: schaduw, energie, biodiversiteit en ontmoeting, samen op één plek.","v":[81.16,87.63],"s":[["De ambitie: schaduw, energie, biodiversiteit en ontmoeting, samen op één plek.",0.0,6.47]],"spk":6.47},{"ch":2,"cue":"intro","key":"S3.intro","t":"Het hoofdconcept is de zon-groene pergola: een open overkapping, opgebouwd uit losse modules.","v":[88.93,95.5],"s":[["Het hoofdconcept is de zon-groene pergola: een open overkapping, opgebouwd uit losse modules.",0.0,6.57]],"spk":6.57},{"ch":2,"cue":"frame","key":"S3.frame","t":"Elke module heeft een frame met zonnepanelen als dak. Tussen de panelen is ruimte, of we gebruiken lichtdoorlatende panelen, zodat er genoeg licht naar beneden valt voor de planten.","v":[96.8,108.52],"s":[["Elke module heeft een frame met zonnepanelen als dak.",0.0,3.33],["Tussen de panelen is ruimte, of we gebruiken lichtdoorlatende panelen, zodat er genoeg licht naar beneden valt voor de planten.",3.79,11.71]],"spk":11.71},{"ch":2,"cue":"bakken","key":"S3.bakken","t":"Langs de zijkanten staan klimplanten in plantenbakken.","v":[109.82,113.12],"s":[["Langs de zijkanten staan klimplanten in plantenbakken.",0.0,3.3]],"spk":3.3},{"ch":2,"cue":"zit","key":"S3.zit","t":"Eronder staan banken en tafels, met een laadpunt voor laptop en telefoon. Een kleine accu vangt de piek op.","v":[114.42,122.06],"s":[["Eronder staan banken en tafels, met een laadpunt voor laptop en telefoon.",0.0,5.34],["Een kleine accu vangt de piek op.",5.8,7.64]],"spk":7.64},{"ch":2,"cue":"f1","key":"S3.f1","t":"De pergola draait om vier functies die elkaar versterken. Eén: stroom opwekken, voor het laadpunt, het rode licht en eventueel sensoren.","v":[123.36,133.93],"s":[["De pergola draait om vier functies die elkaar versterken.",0.0,3.73],["Eén: stroom opwekken, voor het laadpunt, het rode licht en eventueel sensoren.",4.19,10.57]],"spk":10.57},{"ch":2,"cue":"f2","key":"S3.f2","t":"Twee: schaduw en koeling. De panelen geven schaduw en de klimplanten koelen door verdamping. Bij een proefopstelling in Groningen, de Leaf, was het tot 8 graden koeler. Of dat ook hier zo is, moeten we nog meten.","v":[135.23,151.26],"s":[["Twee: schaduw en koeling.",0.0,2.09],["De panelen geven schaduw en de klimplanten koelen door verdamping.",2.55,7.01],["Bij een proefopstelling in Groningen, de Leaf, was het tot 8 graden koeler.",7.47,12.64],["Of dat ook hier zo is, moeten we nog meten.",13.1,16.02]],"spk":16.02},{"ch":2,"cue":"sydney","key":"S3.sydney","t":"In Sydney leverden zonnepanelen boven een volledig groen dak gemiddeld 11,1 procent meer stroom dan op een gewoon dak. Maar dat groene oppervlak is veel groter dan wat wij kunnen aanleggen, dus verwacht hier een kleiner effect.","v":[152.56,166.83],"s":[["In Sydney leverden zonnepanelen boven een volledig groen dak gemiddeld 11,1 procent meer stroom dan op een gewoon dak.",0.0,7.7],["Maar dat groene oppervlak is veel groter dan wat wij kunnen aanleggen, dus verwacht hier een kleiner effect.",8.16,14.27]],"spk":14.27},{"ch":2,"cue":"f3","key":"S3.f3","t":"Drie: groen en leefgebied. Klimplanten bieden nectar, bladmassa en schuilplek voor insecten en vogels. Maar een pergola alleen is nog geen volwaardig leefgebied. Daarom combineren we hem met bloemrijke beplanting en dood hout in de omgeving.","v":[168.13,185.91],"s":[["Drie: groen en leefgebied.",0.0,2.1],["Klimplanten bieden nectar, bladmassa en schuilplek voor insecten en vogels.",2.56,8.26],["Maar een pergola alleen is nog geen volwaardig leefgebied.",8.72,12.21],["Daarom combineren we hem met bloemrijke beplanting en dood hout in de omgeving.",12.67,17.78]],"spk":17.78},{"ch":2,"cue":"f4","key":"S3.f4","t":"En vier: leren en verblijven. Het is tegelijk een pauzeplek, een studieplek en een buitenlokaal.","v":[187.21,194.13],"s":[["En vier: leren en verblijven.",0.0,2.39],["Het is tegelijk een pauzeplek, een studieplek en een buitenlokaal.",2.85,6.92]],"spk":6.92},{"ch":2,"cue":"groot","key":"S3.groot","t":"Je kunt de modules aan elkaar rijgen. Zo ontstaat een grote pergola, zoals hier. Maar we beginnen klein: met een proef van één module, om schaduw, temperatuur en gebruik te meten.","v":[195.43,208.92],"s":[["Je kunt de modules aan elkaar rijgen.",0.0,2.18],["Zo ontstaat een grote pergola, zoals hier.",2.64,5.94],["Maar we beginnen klein: met een proef van één module, om schaduw, temperatuur en gebruik te meten.",6.4,13.49]],"spk":13.49},{"ch":3,"cue":"intro","key":"S4.intro","t":"De eerste uitbreiding is de zelfwatergevende plantenbak. Een plantenbak met een eigen waterreservoir, die de planten van water voorziet. Een bankje erbij is optioneel.","v":[210.22,221.52],"s":[["De eerste uitbreiding is de zelfwatergevende plantenbak.",0.0,3.69],["Een plantenbak met een eigen waterreservoir, die de planten van water voorziet.",4.15,8.89],["Een bankje erbij is optioneel.",9.35,11.3]],"spk":11.3},{"ch":3,"cue":"plaats","key":"S4.plaats","t":"Je ziet ze hier tussen de pergola’s staan, met een bankje erbij. Hoe ze precies komen te staan, hangt af van wat het dak aankan, en dat moeten we nog onderzoeken.","v":[222.82,232.87],"s":[["Je ziet ze hier tussen de pergola’s staan, met een bankje erbij.",0.0,3.87],["Hoe ze precies komen te staan, hangt af van wat het dak aankan, en dat moeten we nog onderzoeken.",4.33,10.06]],"spk":10.06},{"ch":3,"cue":"w1","key":"S4.w1","t":"Hoe werkt zo’n bak? Kijk mee in de doorsnede. Regenwater komt in het plantvak terecht en zakt door het substraat naar een reservoir onderin.","v":[234.17,244.01],"s":[["Hoe werkt zo’n bak?",0.0,1.13],["Kijk mee in de doorsnede.",1.75,3.56],["Regenwater komt in het plantvak terecht en zakt door het substraat naar een reservoir onderin.",4.02,9.83]],"spk":9.83},{"ch":3,"cue":"w2","key":"S4.w2","t":"Een draagplaat houdt het substraat boven het maximale waterniveau. Zo blijft er ook ruimte voor lucht.","v":[245.31,251.74],"s":[["Een draagplaat houdt het substraat boven het maximale waterniveau.",0.0,3.88],["Zo blijft er ook ruimte voor lucht.",4.34,6.43]],"spk":6.43},{"ch":3,"cue":"w3","key":"S4.w3","t":"Capillaire stroken zuigen het water omhoog en brengen het naar de wortelzone. Dat werkt zonder elektrische pomp.","v":[253.04,260.49],"s":[["Capillaire stroken zuigen het water omhoog en brengen het naar de wortelzone.",0.0,4.76],["Dat werkt zonder elektrische pomp.",5.22,7.44]],"spk":7.44},{"ch":3,"cue":"w4","key":"S4.w4","t":"Via de vulbuis kan beheer het reservoir controleren en bijvullen. En de overloop voert te veel water af.","v":[261.79,268.92],"s":[["Via de vulbuis kan beheer het reservoir controleren en bijvullen.",0.0,4.38],["En de overloop voert te veel water af.",4.84,7.14]],"spk":7.14},{"ch":3,"cue":"bestaat","key":"S4.bestaat","t":"Dit principe bestaat al. Op het Raadhuisplein in Boxmeer staan plantenbakken met een eigen watervoorziening en zitbanken. En bij de Waterbench vangt het poreuze zitvlak regenwater op voor de beplanting.","v":[270.22,283.08],"s":[["Dit principe bestaat al.",0.0,1.65],["Op het Raadhuisplein in Boxmeer staan plantenbakken met een eigen watervoorziening en zitbanken.",2.11,7.81],["En bij de Waterbench vangt het poreuze zitvlak regenwater op voor de beplanting.",8.27,12.86]],"spk":12.86},{"ch":3,"cue":"nuance","key":"S4.nuance","t":"Mooie inspiratie, maar geen bewijs dat het op ons dak kan. En zelfwatergevend is niet onderhoudsvrij: bij droogte moet je bijvullen. Hoe lang de voorraad meegaat met onze beplanting, moeten we nog testen, met een proefmodel.","v":[284.38,299.81],"s":[["Mooie inspiratie, maar geen bewijs dat het op ons dak kan.",0.0,3.89],["En zelfwatergevend is niet onderhoudsvrij: bij droogte moet je bijvullen.",4.35,9.17],["Hoe lang de voorraad meegaat met onze beplanting, moeten we nog testen, met een proefmodel.",9.63,15.44]],"spk":15.44},{"ch":4,"cue":"intro","key":"S5.intro","t":"De tweede uitbreiding zijn de habitatbakken: kleine, ingerichte leefomgevingen, in modules die je aan elkaar koppelt tot een lint. Ze kunnen insecten voedsel, beschutting en voortplantingskansen bieden.","v":[301.11,314.71],"s":[["De tweede uitbreiding zijn de habitatbakken: kleine, ingerichte leefomgevingen, in modules die je aan elkaar koppelt tot een lint.",0.0,8.16],["Ze kunnen insecten voedsel, beschutting en voortplantingskansen bieden.",8.62,13.6]],"spk":13.6},{"ch":4,"cue":"bloemen","key":"S5.bloemen","t":"Eerst de bloemenbak, met bloeiende inheemse soorten voor bijen, vlinders en zweefvliegen. Denk aan knoopkruid, beemdkroon en grasklokje.","v":[316.01,325.25],"s":[["Eerst de bloemenbak, met bloeiende inheemse soorten voor bijen, vlinders en zweefvliegen.",0.0,5.42],["Denk aan knoopkruid, beemdkroon en grasklokje.",5.88,9.24]],"spk":9.24},{"ch":4,"cue":"kruiden","key":"S5.kruiden","t":"Dan de bak met kruiden en grassen. Variatie in hoogte, bloei en beschutting is fijn voor insecten. Bijvoorbeeld wilde tijm en wilde marjolein.","v":[326.55,336.44],"s":[["Dan de bak met kruiden en grassen.",0.0,2.42],["Variatie in hoogte, bloei en beschutting is fijn voor insecten.",2.88,7.0],["Bijvoorbeeld wilde tijm en wilde marjolein.",7.46,9.89]],"spk":9.89},{"ch":4,"cue":"sedum","key":"S5.sedum","t":"De sedumbak heeft droogtetolerante vetplanten, met een relatief beperkte waterbehoefte.","v":[337.74,343.46],"s":[["De sedumbak heeft droogtetolerante vetplanten, met een relatief beperkte waterbehoefte.",0.0,5.72]],"spk":5.72},{"ch":4,"cue":"droog","key":"S5.droog","t":"In de droge habitat liggen zand, dood hout en holle stengels, voor specifieke insecten.","v":[344.76,350.66],"s":[["In de droge habitat liggen zand, dood hout en holle stengels, voor specifieke insecten.",0.0,5.9]],"spk":5.9},{"ch":4,"cue":"vochtig","key":"S5.vochtig","t":"De vochtige habitat heeft vochtminnende planten, zoals watermunt en kattenstaart. Die vraagt extra aandacht voor gewicht en waterbeheer.","v":[351.96,360.94],"s":[["De vochtige habitat heeft vochtminnende planten, zoals watermunt en kattenstaart.",0.0,5.15],["Die vraagt extra aandacht voor gewicht en waterbeheer.",5.61,8.98]],"spk":8.98},{"ch":4,"cue":"combi","key":"S5.combi","t":"En de combinatiebak heeft bloemen bovenin, en geschikte nestholtes in een afzonderlijk deel.","v":[362.24,368.41],"s":[["En de combinatiebak heeft bloemen bovenin, en geschikte nestholtes in een afzonderlijk deel.",0.0,6.17]],"spk":6.17},{"ch":4,"cue":"variatie","key":"S5.variatie","t":"Zes typen, en dat is bewust: een gevarieerde inrichting is waardevoller dan zes identieke bakken. Combineer vroege, midden- en late bloeiers, laat waar mogelijk stengels overwinteren en vermijd gif.","v":[369.71,384.01],"s":[["Zes typen, en dat is bewust: een gevarieerde inrichting is waardevoller dan zes identieke bakken.",0.0,6.76],["Combineer vroege, midden- en late bloeiers, laat waar mogelijk stengels overwinteren en vermijd gif.",7.22,14.3]],"spk":14.3},{"ch":4,"cue":"opbrengst","key":"S5.opbrengst","t":"Zo kan het terras meer variatie in nectar en pollen krijgen, schuilplekken en nestgelegenheid voor insecten, enige wateropvang, en een groenere campus met kansen voor onderwijs.","v":[385.31,397.57],"s":[["Zo kan het terras meer variatie in nectar en pollen krijgen, schuilplekken en nestgelegenheid voor insecten, enige wateropvang, en een groenere campus met kansen voor onderwijs.",0.0,12.26]],"spk":12.26},{"ch":5,"cue":"totaal","key":"S6.totaal","t":"Nu zet ik alles samen. Dit is het hele terras van veertien bij negentig meter, met alles op zijn plek.","v":[398.87,405.58],"s":[["Nu zet ik alles samen.",0.0,1.54],["Dit is het hele terras van veertien bij negentig meter, met alles op zijn plek.",2.0,6.71]],"spk":6.71},{"ch":5,"cue":"pergola","key":"S6.pergola","t":"Aan beide uiteinden staat een grote pergola, en in het midden twee kleinere. Ze vormen de ruimtelijke hoofdstructuur.","v":[406.88,415.11],"s":[["Aan beide uiteinden staat een grote pergola, en in het midden twee kleinere.",0.0,5.34],["Ze vormen de ruimtelijke hoofdstructuur.",5.8,8.23]],"spk":8.23},{"ch":5,"cue":"groen","key":"S6.groen","t":"Daartussen staan de zelfwatergevende plantenbakken met hun bankjes, en linten met habitatbakken. Op de plattegrond ligt gras op de ondergrond, en paden van zand, grind of tegels verbinden alles.","v":[416.41,429.98],"s":[["Daartussen staan de zelfwatergevende plantenbakken met hun bankjes, en linten met habitatbakken.",0.0,6.08],["Op de plattegrond ligt gras op de ondergrond, en paden van zand, grind of tegels verbinden alles.",6.54,13.56]],"spk":13.56},{"ch":5,"cue":"plan","key":"S6.plan","t":"Zo hebben we de onderdelen op de plattegrond geplaatst. De plattegrond bepaalt alleen waar alles ongeveer staat. De maten zijn die van het echte terras.","v":[431.28,441.23],"s":[["Zo hebben we de onderdelen op de plattegrond geplaatst.",0.0,3.16],["De plattegrond bepaalt alleen waar alles ongeveer staat.",3.62,7.07],["De maten zijn die van het echte terras.",7.53,9.95]],"spk":9.95},{"ch":5,"cue":"relatie","key":"S6.relatie","t":"Zo vormen pergola, groen en verblijf één plek, boven de fietsenstalling.","v":[442.53,447.57],"s":[["Zo vormen pergola, groen en verblijf één plek, boven de fietsenstalling.",0.0,5.05]],"spk":5.05},{"ch":6,"cue":"leven","key":"S7.leven","t":"Dan komt de plek tot leven. Studenten lopen langs de plantenbakken, pakken een bankje, of werken in de schaduw van de pergola.","v":[448.87,457.65],"s":[["Dan komt de plek tot leven.",0.0,1.78],["Studenten lopen langs de plantenbakken, pakken een bankje, of werken in de schaduw van de pergola.",2.24,8.78]],"spk":8.78},{"ch":6,"cue":"les","key":"S7.les","t":"Een docent kan hier les geven, want de pergola is ook een buitenlokaal. Groepjes werken samen aan tafel, anderen studeren zelfstandig.","v":[458.95,468.41],"s":[["Een docent kan hier les geven, want de pergola is ook een buitenlokaal.",0.0,4.39],["Groepjes werken samen aan tafel, anderen studeren zelfstandig.",4.85,9.45]],"spk":9.45},{"ch":6,"cue":"habitat","key":"S7.habitat","t":"En de habitatbakken nodigen uit tot kijken. Ze bieden kansen voor buitenonderwijs en onderzoek naar insecten, en passen bij de BioBlitz-activiteiten van de HAN.","v":[469.71,480.46],"s":[["En de habitatbakken nodigen uit tot kijken.",0.0,2.7],["Ze bieden kansen voor buitenonderwijs en onderzoek naar insecten, en passen bij de BioBlitz-activiteiten van de HAN.",3.16,10.76]],"spk":10.76},{"ch":6,"cue":"welzijn","key":"S7.welzijn","t":"Een groenere werkplek kan prettiger aanvoelen en mentale vermoeidheid helpen verminderen. We houden wel rekening met hinder door insecten, pollen of warmte, en houden werkplekken en looproutes vrij.","v":[481.76,494.57],"s":[["Een groenere werkplek kan prettiger aanvoelen en mentale vermoeidheid helpen verminderen.",0.0,5.41],["We houden wel rekening met hinder door insecten, pollen of warmte, en houden werkplekken en looproutes vrij.",5.87,12.81]],"spk":12.81},{"ch":6,"cue":"sensor","key":"S7.sensor","t":"Een sensor voor temperatuur en bodemvocht kan zichtbaar maken wat het ontwerp doet. Zo past de plek bij een levend laboratorium.","v":[495.87,504.3],"s":[["Een sensor voor temperatuur en bodemvocht kan zichtbaar maken wat het ontwerp doet.",0.0,5.16],["Zo past de plek bij een levend laboratorium.",5.62,8.42]],"spk":8.42},{"ch":6,"cue":"rood","key":"S7.rood","t":"En in de avond kan laag, gedimd rood licht op zonnestroom branden. Rood licht is minder verstorend voor vleermuizen dan wit, maar niet onschadelijk. Dat moeten we nog verifiëren.","v":[505.6,517.9],"s":[["En in de avond kan laag, gedimd rood licht op zonnestroom branden.",0.0,4.76],["Rood licht is minder verstorend voor vleermuizen dan wit, maar niet onschadelijk.",5.22,10.07],["Dat moeten we nog verifiëren.",10.53,12.3]],"spk":12.3},{"ch":7,"cue":"eerlijk","key":"S8.eerlijk","t":"Eerlijk is eerlijk: dit is een concept, nog niet getoetst op draagkracht, kosten en beheer.","v":[519.2,525.98],"s":[["Eerlijk is eerlijk: dit is een concept, nog niet getoetst op draagkracht, kosten en beheer.",0.0,6.79]],"spk":6.79},{"ch":7,"cue":"gewicht","key":"S8.gewicht","t":"Het grootste vraagteken is het dak. We weten nog niet hoeveel extra belasting het aankan. Het gewicht bestaat uit de bak, verzadigd substraat, planten en opgeslagen water, en een bank en gebruikers komen daar nog bij.","v":[527.28,542.77],"s":[["Het grootste vraagteken is het dak.",0.0,2.57],["We weten nog niet hoeveel extra belasting het aankan.",3.03,6.18],["Het gewicht bestaat uit de bak, verzadigd substraat, planten en opgeslagen water, en een bank en gebruikers komen daar nog bij.",6.64,15.49]],"spk":15.49},{"ch":7,"cue":"plaats","key":"S8.plaats","t":"Een constructeur en een dakexpert moeten beoordelen waar de bakken veilig kunnen staan. Ook wind en kantelrisico: de constructie moet bij storm stabiel blijven.","v":[544.07,554.71],"s":[["Een constructeur en een dakexpert moeten beoordelen waar de bakken veilig kunnen staan.",0.0,5.15],["Ook wind en kantelrisico: de constructie moet bij storm stabiel blijven.",5.61,10.63]],"spk":10.63},{"ch":7,"cue":"dak","key":"S8.dak","t":"Verder moeten dakbedekking en afvoeren beschermd en bereikbaar blijven, en moeten looproutes en toegankelijkheid kloppen.","v":[556.01,563.64],"s":[["Verder moeten dakbedekking en afvoeren beschermd en bereikbaar blijven, en moeten looproutes en toegankelijkheid kloppen.",0.0,7.64]],"spk":7.64},{"ch":7,"cue":"onderhoud","key":"S8.onderhoud","t":"En onderhoud. Bakken drogen sneller uit dan volle grond, dus in warme periodes controleren we wekelijks het vocht. Verder per seizoen en jaarlijks. Wie dat doet, moeten we nog afspreken.","v":[564.94,578.47],"s":[["En onderhoud.",0.0,0.95],["Bakken drogen sneller uit dan volle grond, dus in warme periodes controleren we wekelijks het vocht.",1.41,7.98],["Verder per seizoen en jaarlijks.",8.44,10.55],["Wie dat doet, moeten we nog afspreken.",11.01,13.52]],"spk":13.52},{"ch":7,"cue":"onbekend","key":"S8.onbekend","t":"Ook elektra en brandveiligheid, licht voor de planten, vandalisme en kosten zijn nog niet onderzocht.","v":[579.77,586.68],"s":[["Ook elektra en brandveiligheid, licht voor de planten, vandalisme en kosten zijn nog niet onderzocht.",0.0,6.92]],"spk":6.92},{"ch":7,"cue":"bewijs","key":"S8.bewijs","t":"En de bestaande voorbeelden, van Sydney tot Boxmeer, laten zien dat de onderdelen bestaan. Ze bewijzen niet dat het op ons dak kan.","v":[587.98,597.45],"s":[["En de bestaande voorbeelden, van Sydney tot Boxmeer, laten zien dat de onderdelen bestaan.",0.0,6.59],["Ze bewijzen niet dat het op ons dak kan.",7.05,9.47]],"spk":9.47},{"ch":8,"cue":"stappen","key":"S9.stappen","t":"De volgende stap: dakgegevens opvragen en met de constructeur en dakexpert bepalen wat kan. Daarna een proefmodel van de plantenbak voor wateropname en overloop, en afspraken over beheer.","v":[598.75,611.24],"s":[["De volgende stap: dakgegevens opvragen en met de constructeur en dakexpert bepalen wat kan.",0.0,6.36],["Daarna een proefmodel van de plantenbak voor wateropname en overloop, en afspraken over beheer.",6.82,12.49]],"spk":12.49},{"ch":8,"cue":"totaal","key":"S9.totaal","t":"Zo komen zon, water, groen en ontmoeting samen: een pergola als hoofdstructuur, zelfwatergevende plantenbakken en habitatbakken met verschillende leefgebieden.","v":[612.54,624.98],"s":[["Zo komen zon, water, groen en ontmoeting samen: een pergola als hoofdstructuur, zelfwatergevende plantenbakken en habitatbakken met verschillende leefgebieden.",0.0,12.44]],"spk":12.44},{"ch":8,"cue":"einde","key":"S9.einde","t":"Dat was het. Een ontwerp voor studenten, en voor insecten. Nu ben jij aan de beurt: ontdek het terrein zelf.","v":[626.28,634.35],"s":[["Dat was het.",0.0,0.89],["Een ontwerp voor studenten, en voor insecten.",1.35,4.39],["Nu ben jij aan de beurt: ontdek het terrein zelf.",4.85,8.07]],"spk":8.07}];
const BEAT_IDX = {}; BEATS.forEach((b, i) => { BEAT_IDX[b.key] = i; });
const VO_CHARS = BEATS.reduce((a, b) => a + b.t.length, 0);

/* ---------- helpers ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const smoother = t => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); };
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const backOut = t => { t = clamp(t); const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const seg = (t, a, b) => clamp((t - a) / (b - a)); // 0..1 binnen [a,b]
const angDiff = (a, b) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };
const lerpAng = (a, b, t) => a + angDiff(a, b) * t;
// deterministische random
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

G.PF = G.PF || {};
Object.assign(G.PF, { SITE, CFG, HAB_NAMES, CHAPTERS, BEATS, BEAT_IDX, VO_CHARS, clamp, lerp, smooth, smoother, easeOut, easeInOut, backOut, seg, angDiff, lerpAng, rng });
})(window);
/* ===== 02 · World: terras 14x90 m, fietsenstalling, witte polygon-maquette ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { SITE, rng, clamp, smooth } = PF;

const COL = {
  sky: 0xeef1f6, sun: 0xfff0d8, tile: 0xd9d3c8, terracotta: 0xd9a692, concrete: 0xa9b8ae, concreteDk: 0x7f9186,
  parapet: 0xf2efe9, wood: 0xb78556, woodDk: 0x8a5e3a, steel: 0x5b6670, panel: 0x1f3a63, panelHi: 0x3f6aa8,
  green1: 0x4f8a5c, green2: 0x6aa56a, green3: 0x3c7450, soil: 0x6b5443, white: 0xf6f6f4
};
PF.COL = COL;
PF.SUN_DIR = new THREE.Vector3(-0.42, 0.78, 0.46).normalize(); // richting naar de zon

/* polygon-offset: lagen die vlak op elkaar liggen krijgen een vaste volgorde, zodat ze op afstand niet flikkeren */
function POFF(m, k) { m.polygonOffset = true; m.polygonOffsetFactor = k; m.polygonOffsetUnits = k; return m; }
function canvasTex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
PF.canvasTex = canvasTex; PF.POFF = POFF;

/* ---- landschap (heightfield + gebakken polygonschaduw) ---- */
function buildLandscape() {
  const S = 760, N = 52, BASE = -4.25;
  const r = rng(7);
  const grid = []; for (let i = 0; i <= 32; i++) { grid[i] = []; for (let j = 0; j <= 32; j++) grid[i][j] = r(); }
  const vnoise = (x, z, sc) => {
    x = x / sc + 16; z = z / sc + 16; const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi;
    const a = grid[((xi % 32) + 32) % 32][((zi % 32) + 32) % 32], b = grid[(((xi + 1) % 32) + 32) % 32][((zi % 32) + 32) % 32];
    const c = grid[((xi % 32) + 32) % 32][(((zi + 1) % 32) + 32) % 32], d = grid[(((xi + 1) % 32) + 32) % 32][(((zi + 1) % 32) + 32) % 32];
    const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
    return (a + (b - a) * sx) * (1 - sz) + (c + (d - c) * sx) * sz;
  };
  const hf = (x, z) => {
    const d = Math.max(Math.abs(x) - 58, Math.abs(z) - 22, 0);
    const k = smooth(d / 90);
    const n = vnoise(x, z, 95) * 1.0 + vnoise(x + 40, z - 10, 38) * 0.45 + Math.abs(vnoise(x - 70, z + 33, 60) - .5) * 0.9;
    return BASE + k * (n * 46 - 8) + smooth(d / 14) * 2.2;
  };
  const g = new THREE.PlaneGeometry(S, S, N, N); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    // lichte jitter zodat vlakken hoekig en onregelmatig worden
    const x = p.getX(i), z = p.getZ(i);
    const edge = Math.abs(x) > S / 2 - 1 || Math.abs(z) > S / 2 - 1;
    const jx = edge ? 0 : (r() - .5) * 6, jz = edge ? 0 : (r() - .5) * 6;
    p.setX(i, x + jx); p.setZ(i, z + jz);
    p.setY(i, hf(x + jx, z + jz));
  }
  const ng = g.toNonIndexed(); ng.computeVertexNormals();
  const pos = ng.attributes.position, nor = ng.attributes.normal, col = new Float32Array(pos.count * 3);
  const L = PF.SUN_DIR, tmp = new THREE.Vector3();
  const mix = (a, b, t) => a + (b - a) * t;
  for (let f = 0; f < pos.count; f += 3) {
    const cx = (pos.getX(f) + pos.getX(f + 1) + pos.getX(f + 2)) / 3, cy = (pos.getY(f) + pos.getY(f + 1) + pos.getY(f + 2)) / 3, cz = (pos.getZ(f) + pos.getZ(f + 1) + pos.getZ(f + 2)) / 3;
    tmp.set(nor.getX(f), nor.getY(f), nor.getZ(f));
    const lam = tmp.dot(L);
    // werpschaduw: marcheer richting zon over het heightfield
    let blocked = 0; for (let s = 1; s <= 28; s++) { const d = s * 7; if (hf(cx + L.x * d, cz + L.z * d) > cy + L.y * d - 0.4) { blocked = 1; break; } }
    const j = (r() - .5) * 0.035;
    let v;
    if (blocked) v = lam < 0.12 && r() < 0.3 ? 0.26 : mix(0.42, 0.58, r());
    else if (lam < 0.02) v = mix(0.50, 0.68, clamp(lam + 0.5));
    else v = mix(0.84, 1.0, clamp(lam * 1.25));
    v = clamp(v + j, .3, 1);
    const lin = Math.pow(v, 2.2); for (let k = 0; k < 3; k++) { col[(f + k) * 3] = lin * 0.985; col[(f + k) * 3 + 1] = lin * 0.99; col[(f + k) * 3 + 2] = Math.min(1, lin * 1.0 + (1 - v) * 0.03); }
  }
  ng.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.Mesh(ng, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
  m.frustumCulled = false;
  return { mesh: m, hf };
}

/* ---- kleine bouwstenen ---- */
const matCache = {};
function mat(color, o) { const k = color + JSON.stringify(o || {}); return matCache[k] || (matCache[k] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: .85, metalness: 0 }, o || {}))); }
PF.mat = mat;
function box(w, h, d, m, x, y, z, parent) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; if (parent) parent.add(o); return o; }
PF.box = box;

function buildTree(r, scale) {
  const g = new THREE.Group();
  box(1.5, .7, 1.5, mat(COL.white, { roughness: .9 }), 0, .35, 0, g);
  box(1.3, .08, 1.3, mat(COL.soil), 0, .72, 0, g);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.07, .12, 2.2, 6), mat(COL.woodDk)); trunk.position.y = 1.8; trunk.castShadow = true; g.add(trunk);
  const crown = new THREE.Group(); crown.position.y = 3.0; g.add(crown);
  [[0, .2, 0, 1.15, COL.green1], [.5, -.1, .2, .8, COL.green2], [-.45, -.05, -.3, .85, COL.green3], [.1, .85, -.1, .7, COL.green2]].forEach(a => {
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(a[3], 1), new THREE.MeshStandardMaterial({ color: a[4], roughness: .9, flatShading: true }));
    s.position.set(a[0], a[1], a[2]); s.castShadow = true; crown.add(s);
  });
  g.scale.setScalar(scale || 1); g.userData.crown = crown; g.userData.ph = r() * 6.28;
  return g;
}
PF.buildTree = buildTree;

function buildPicnic() {
  const g = new THREE.Group(), wd = mat(COL.wood), wk = mat(COL.woodDk);
  box(2.2, .07, .8, wd, 0, .76, 0, g);
  box(2.2, .06, .3, wd, 0, .46, 1.0, g); box(2.2, .06, .3, wd, 0, .46, -1.0, g);
  [-.8, .8].forEach(x => { box(.07, .78, .07, wk, x, .38, .15, g); box(.07, .78, .07, wk, x, .38, -.15, g);
    box(.07, .46, .07, wk, x, .23, .95, g); box(.07, .46, .07, wk, x, .23, -.95, g); box(.07, .07, 2.0, wk, x, .3, 0, g); });
  return g;
}
PF.buildPicnic = buildPicnic;

function buildBench(len) {
  const g = new THREE.Group(); len = len || 1.8;
  box(len, .06, .38, mat(COL.wood), 0, .46, 0, g); box(len, .05, .1, mat(COL.steel), 0, .41, 0, g);
  [-1, 1].forEach(s => box(.06, .42, .3, mat(COL.steel), s * (len / 2 - .15), .21, 0, g));
  return g;
}
PF.buildBench = buildBench;

/* ---- hele wereld ---- */
function createWorld() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COL.sky); scene.userData.sky = COL.sky;
  scene.fog = new THREE.Fog(COL.sky, 230, 900);

  // licht: één consistente zon + zachte hemel
  const hemi = new THREE.HemisphereLight(0xeaf1ff, 0xd4ccbd, 0.85); scene.add(hemi);
  const sun = new THREE.DirectionalLight(COL.sun, 1.75);
  sun.position.copy(PF.SUN_DIR).multiplyScalar(110); sun.target.position.set(0, 0, 0);
  sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  const sc = sun.shadow.camera; sc.left = -68; sc.right = 68; sc.top = 36; sc.bottom = -36; sc.near = 20; sc.far = 260;
  sun.shadow.bias = -0.00035; sun.shadow.normalBias = 0.05;
  scene.add(sun); scene.add(sun.target);

  const land = buildLandscape(); scene.add(land.mesh);

  const site = new THREE.Group(); scene.add(site);
  const colliders = []; // {x0,x1,z0,z1,top}
  const addCol = (x0, x1, z0, z1, top) => colliders.push({ x0, x1, z0, z1, top });

  // sokkel (model-plint) + fietsenstalling
  box(SITE.L + 4, 1.5, SITE.W + 4, mat(0xe9e8e4, { roughness: .95 }), 0, -3.5, 0, site).castShadow = false;
  const facade = canvasTex(2048, 256, (c, w, h) => {
    c.fillStyle = '#a9b8ae'; c.fillRect(0, 0, w, h);
    const bays = 15, bw = w / bays;
    for (let i = 0; i < bays; i++) {
      const x = i * bw;
      c.fillStyle = '#7f9186'; c.fillRect(x, 0, 14, h);
      c.fillStyle = '#2f3b3a'; c.fillRect(x + 22, 62, bw - 44, h - 62);
      c.fillStyle = '#55665f'; c.fillRect(x + 22, 62, bw - 44, 14);
      c.strokeStyle = '#c8d3cc'; c.lineWidth = 4; c.lineCap = 'round';
      for (let b = 0; b < 5; b++) { const bx = x + 40 + b * ((bw - 80) / 4.4); const by = h - 22;
        c.beginPath(); c.arc(bx, by - 18, 18, 0, 6.3); c.stroke(); c.beginPath(); c.arc(bx + 40, by - 18, 18, 0, 6.3); c.stroke();
        c.beginPath(); c.moveTo(bx, by - 18); c.lineTo(bx + 18, by - 52); c.lineTo(bx + 40, by - 18); c.moveTo(bx + 18, by - 52); c.lineTo(bx + 28, by - 56); c.stroke(); }
    }
    c.fillStyle = '#e4ebe6'; c.fillRect(0, 0, w, 26);
  });
  const sideMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: facade, roughness: .95 });
  const wallMat = mat(COL.concrete, { roughness: .95 });
  const shelter = new THREE.Mesh(new THREE.BoxGeometry(SITE.L, 4.0, SITE.W), [wallMat, wallMat, wallMat, wallMat, sideMat, sideMat]);
  shelter.position.set(0, -2.2, 0); shelter.receiveShadow = true; shelter.castShadow = true; site.add(shelter);
  // dakrand (dikte van de vloer)
  const slabMat = mat(0xcfcac0); POFF(slabMat, 3); box(SITE.L + .04, .4, SITE.W + .04, slabMat, 0, -.2, 0, site);

  // betegeling bovenop
  const tileTex = canvasTex(512, 512, (c, w, h) => {
    const r = rng(3); c.fillStyle = '#d6d0c5'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const v = 205 + r() * 18; c.fillStyle = `rgb(${v},${v - 5},${v - 14})`; c.fillRect(i * 128 + 2, j * 128 + 2, 124, 124); }
  }, [SITE.L / 2.4, SITE.W / 2.4]);
  const topMat = new THREE.MeshStandardMaterial({ map: tileTex, roughness: .92 }); POFF(topMat, -1);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(SITE.L, SITE.W), topMat);
  top.rotation.x = -Math.PI / 2; top.position.y = .002; top.receiveShadow = true; site.add(top);
  // lage dakrand (parapet) rondom
  const pm = mat(COL.parapet);
  box(SITE.L + .6, .38, .3, pm, 0, .19, SITE.W / 2 - .15, site); box(SITE.L + .6, .38, .3, pm, 0, .19, -SITE.W / 2 + .15, site);
  box(.3, .38, SITE.W - .6, pm, SITE.L / 2 - .15, .19, 0, site); box(.3, .38, SITE.W - .6, pm, -SITE.L / 2 + .15, .19, 0, site);

  // bestaande inrichting: enkele picknicktafels (PDF p.3: 'bestrating met enkele picknicktafels'; plaats = ontwerpkeuze in het model)
  const oldTables = [];
  PF.CFG.oldTables.forEach(a => {
    const t = buildPicnic(); t.position.set(a[0], 0, a[1]); t.rotation.y = a[2]; site.add(t); oldTables.push(t);
    const c = Math.abs(Math.cos(a[2])) > .5 ? [1.2, 1.3] : [1.3, 1.2]; addCol(a[0] - c[0], a[0] + c[0], a[1] - c[1], a[1] + c[1], .8); t.userData.col = colliders[colliders.length - 1]; t.userData.x = a[0];
  });
  const trees = [], poles = [];

  // warme hitte-overlay (scène 2) + hittelijnen
  const heatMat = new THREE.MeshBasicMaterial({ color: 0xffb066, transparent: true, opacity: 0, depthWrite: false }); POFF(heatMat, -4);
  const heat = new THREE.Mesh(new THREE.PlaneGeometry(SITE.L, SITE.W), heatMat); heat.rotation.x = -Math.PI / 2; heat.position.y = .03; heat.renderOrder = 2; site.add(heat);
  const waveTex = canvasTex(64, 256, (c, w, h) => { const g = c.createLinearGradient(0, h, 0, 0); g.addColorStop(0, 'rgba(255,170,90,0)'); g.addColorStop(.4, 'rgba(255,170,90,.55)'); g.addColorStop(1, 'rgba(255,170,90,0)'); c.fillStyle = g; c.fillRect(w * .35, 0, w * .3, h); });
  const waves = [];
  const rw = rng(55);
  for (let i = 0; i < 70; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(.5, 3.2), new THREE.MeshBasicMaterial({ map: waveTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    m.userData = { x: -45 + rw() * 90, z: -6 + rw() * 12, ph: rw() * 6.28, sp: .35 + rw() * .4 }; m.renderOrder = 3; site.add(m); waves.push(m);
  }

  const world = {
    THREE, scene, sun, hemi, site, land, colliders, addCol, oldTables, trees, poles, heat, waves, heatLevel: 0, faceCam: null,
    bounds: { x: SITE.L / 2 - .55, z: SITE.W / 2 - .55 },
    groundAt() { return 0; },
    setHeat(v) { this.heatLevel = v; heatMat.opacity = .13 * v; },
    update(t, dt, cam) {
      trees.forEach(tr => { const c = tr.userData.crown; const ph = tr.userData.ph; c.rotation.z = Math.sin(t * .9 + ph) * .018; c.rotation.x = Math.sin(t * .7 + ph * 1.7) * .014; c.scale.setScalar(1 + Math.sin(t * 1.3 + ph) * .008); });
      const hv = this.heatLevel;
      for (let i = 0; i < waves.length; i++) {
        const w = waves[i], u = w.userData, k = (t * u.sp + u.ph) % 1;
        w.visible = hv > .01;
        if (w.visible) {
          w.position.set(u.x + Math.sin(t * 1.3 + u.ph) * .25, .2 + k * 2.2 + 1.2, u.z);
          w.material.opacity = hv * Math.sin(k * Math.PI) * .55;
          w.scale.set(1, 1, 1); if (cam) w.rotation.y = Math.atan2(cam.position.x - w.position.x, cam.position.z - w.position.z);
        }
      }
    }
  };
  return world;
}
PF.createWorld = createWorld;
})(window);
/* ===== 03 · Zon-groen pergola: modules, opbouw-animatie en effecten ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { COL, mat, box, rng, clamp, seg, easeOut, easeInOut, backOut, smooth, canvasTex } = PF;

const MW = 4.8, MD = 3.6, H = 2.9; // modulemaat (ontwerpkeuze, geen documentfeit)
PF.MOD = { W: MW, D: MD, H };

let panelTex = null, panelGeo = null, frameMat = null, leafGeo = null;
function sharedAssets() {
  if (panelGeo) return;
  panelTex = canvasTex(128, 192, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#2a4f86'); g.addColorStop(1, '#182f57'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(190,210,240,.55)'; c.lineWidth = 1.4;
    for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(i * w / 6, 0); c.lineTo(i * w / 6, h); c.stroke(); }
    for (let j = 1; j < 10; j++) { c.beginPath(); c.moveTo(0, j * h / 10); c.lineTo(w, j * h / 10); c.stroke(); }
    c.strokeStyle = 'rgba(230,238,250,.9)'; c.lineWidth = 5; c.strokeRect(2, 2, w - 4, h - 4);
  });
  panelGeo = new THREE.BoxGeometry(1.04, .05, 1.62);
  frameMat = mat(0xcfd6dd, { roughness: .45, metalness: .5 });
  leafGeo = new THREE.IcosahedronGeometry(.085, 0); leafGeo.scale(1.2, .55, 1);
}

const WOOD = () => mat(0x8c6a4c, { roughness: .8 });
const WOODL = () => mat(0xb89a78, { roughness: .8 });

/* ---------- onderdelen die een animatie krijgen ---------- */
function Mod(P, i, j) {
  const m = { i, j, parts: [], g: new THREE.Group(), leafSets: [], wheels: [], lights: [], panels: [] };
  m.g.position.set((i - (P.nx - 1) / 2) * MW, 0, (j - (P.nz - 1) / 2) * MD);
  P.group.add(m.g);
  m.part = (obj, a, b, kind, o) => {
    obj.userData.rest = { p: obj.position.clone(), s: obj.scale.clone(), r: obj.rotation.clone() };
    m.parts.push({ obj, a, b, kind, o: o || {} }); (obj.parent || m.g).add(obj); return obj;
  };
  return m;
}

function applyPart(pt, q) {
  const o = pt.obj, u = seg(q, pt.a, pt.b), r = o.userData.rest;
  o.visible = q > pt.a;
  if (u <= 0) return;
  o.position.copy(r.p); o.scale.copy(r.s); o.rotation.copy(r.r);
  switch (pt.kind) {
    case 'rise': o.scale.y = r.s.y * Math.max(.001, easeOut(u)); break;
    case 'grow': o.scale.copy(r.s).multiplyScalar(Math.max(.001, backOut(u))); break;
    case 'drop': { const e = easeOut(u); o.position.y = r.p.y + (1 - e) * pt.o.h; o.rotation.z = r.r.z + (1 - e) * (pt.o.tilt || 0); o.rotation.x = r.r.x + (1 - e) * (pt.o.tiltX || 0); break; }
    case 'slide': { const e = easeOut(u), d = (1 - e) * pt.o.d; o.position.x = r.p.x + pt.o.dx * d; o.position.y = r.p.y + (pt.o.dy || 0) * d; o.position.z = r.p.z + pt.o.dz * d;
      if (pt.o.roll && o.userData.wheels) o.userData.wheels.forEach(w => { w.rotation.z = -(d * (pt.o.dx || pt.o.dz) ) / .09; }); break; }
    case 'draw': o.scale.x = r.s.x * Math.max(.001, easeOut(u)); break;
    case 'vine': o.scale.y = r.s.y * Math.max(.001, easeInOut(u)); break;
  }
}

/* ---------- een volledige pergola (nx × nz modules) ---------- */
function createPergola(world, opt) {
  sharedAssets();
  const nx = opt.nx, nz = opt.nz;
  const P = { world, nx, nz, group: new THREE.Group(), mods: [], progress: 0, name: opt.name || 'pergola' };
  P.group.position.set(opt.cx, 0, opt.cz); world.site.add(P.group);
  const W = nx * MW, D = nz * MD; P.size = { W, D };
  P.footprint = { x0: opt.cx - W / 2, x1: opt.cx + W / 2, z0: opt.cz - D / 2, z1: opt.cz + D / 2 };
  P.center = new THREE.Vector3(opt.cx, 0, opt.cz);
  const wood = WOOD(), woodL = WOODL(), steel = mat(COL.steel, { roughness: .6, metalness: .3 });
  const rnd = rng(opt.seed || 9);
  const interior = (a, b) => a > 0 && a < nx && b > 0 && b < nz && (a % 2 === 1 && opt.skipInterior);
  const vineList = [], bees = [], flies = [], panelList = [], planters = [], tables = [], flows = [];
  const mods = P.mods;

  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) mods.push(Mod(P, i, j));
  const modAt = (i, j) => mods[j * nx + i];
  const nodeLocal = (mi, mj, a, b) => new THREE.Vector3((a - .5) * MW, 0, (b - .5) * MD); // a,b ∈ {0,1}

  mods.forEach(m => {
    const { i, j } = m, last = i === nx - 1, lastR = j === nz - 1;
    const seq = (m.i + m.j * nx);
    // lokale tijdschaal per module — golf van links naar rechts
    const stg = opt.stagger != null ? opt.stagger : .085; m.t0 = seq * (nx * nz > 1 ? stg : 0); m.span = nx * nz > 1 ? 1 - (nx * nz - 1) * stg : 1;

    // --- ballast + palen
    const nodes = [[0, 0]]; if (last) nodes.push([1, 0]); if (lastR) nodes.push([0, 1]); if (last && lastR) nodes.push([1, 1]);
    nodes.push();
    const own = [[0, 0]]; if (last) own.push([1, 0]); if (lastR) own.push([0, 1]); if (last && lastR) own.push([1, 1]);
    own.forEach((n, k) => {
      const gi = i + n[0], gj = j + n[1];
      if (interior(gi, gj)) return;
      const pos = nodeLocal(i, j, n[0], n[1]);
      const ballast = new THREE.Group(); ballast.position.copy(pos);
      box(.55, .2, .55, mat(0xbfbdb7, { roughness: .95 }), 0, .1, 0, ballast);
      m.part(ballast, 0.02, .12, 'grow');
      const post = new THREE.Group(); post.position.copy(pos); post.position.y = .2;
      box(.15, H - .24, .15, wood, 0, (H - .24) / 2, 0, post);
      m.part(post, .08 + k * .025, .3 + k * .025, 'rise');
      world.addCol(opt.cx + m.g.position.x + pos.x - .2, opt.cx + m.g.position.x + pos.x + .2, opt.cz + m.g.position.z + pos.z - .2, opt.cx + m.g.position.x + pos.x + .2 + 0, 99);
      // (collider z-max fix hieronder)
      world.colliders[world.colliders.length - 1].z1 = opt.cz + m.g.position.z + pos.z + .2;
    });

    // --- liggers (balken) — eigendom per module om duplicaten te vermijden
    const beam = (x0, z0, x1, z1, a, b, dir) => {
      const L = Math.hypot(x1 - x0, z1 - z0), g = new THREE.Group(); g.position.set((x0 + x1) / 2, H - .1, (z0 + z1) / 2);
      const xb = Math.abs(x1 - x0) > 0, par = (i + j) & 1; // naastliggende liggers net anders van maat: geen vlakken die samenvallen (flikkeren)
      box(xb ? L + .23 : .17 + .012 * par, xb ? .2 + .012 * par : .176 + .012 * par, xb ? .17 + .012 * par : L + .23, wood, 0, 0, 0, g);
      m.part(g, a, b, 'slide', { dx: dir[0], dz: dir[1], dy: .25, d: 1.4 });
    };
    beam(-MW / 2, -MD / 2, MW / 2, -MD / 2, .28, .42, [0, -1]);
    if (lastR) beam(-MW / 2, MD / 2, MW / 2, MD / 2, .3, .44, [0, 1]);
    beam(-MW / 2, -MD / 2, -MW / 2, MD / 2, .3, .44, [-1, 0]);
    if (last) beam(MW / 2, -MD / 2, MW / 2, MD / 2, .32, .46, [1, 0]);
    // dwarsbalken (rafters) langs z, voor de panelen
    for (let k = 0; k < (last ? 5 : 4); k++) {
      const x = -MW / 2 + k * (MW / 4);
      const g = new THREE.Group(); g.position.set(x, H + .02, 0);
      box(.08, .07, MD, woodL, 0, 0, 0, g);
      m.part(g, .4 + k * .015, .52 + k * .015, 'drop', { h: .9 });
    }

    // --- zonnepanelen (2 rijen × 4, met ruimte ertussen voor licht)
    let pi = 0;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
      const g = new THREE.Group(); g.position.set(-MW / 2 + MW / 8 + c * MW / 4, H + .1, -MD / 4 + r * MD / 2);
      const pm = new THREE.MeshStandardMaterial({ map: panelTex, color: 0xffffff, roughness: .32, metalness: .2, emissive: 0x3d6fc4, emissiveIntensity: 0 });
      const pl = new THREE.Mesh(panelGeo, [frameMat, frameMat, pm, frameMat, frameMat, frameMat]); pl.castShadow = pl.receiveShadow = true; pl.rotation.x = .09; pl.userData.mat = pm; g.add(pl);
      m.part(g, .52 + pi * .04, .64 + pi * .04, 'drop', { h: 2.2, tilt: (c % 2 ? 1 : -1) * .35, tiltX: .15 });
      m.panels.push(pm); panelList.push({ mat: pm, idx: panelList.length, x: i * MW + g.position.x, mod: seq }); pi++;
    }

    // --- plantenbakken met klimplanten (op de buitenrand)
    const edgeNodes = []; // [a,b, uitwaaierrichting dx,dz]
    if (j === 0) { edgeNodes.push([0, 0, 0, -1]); if (last) edgeNodes.push([1, 0, 0, -1]); }
    if (lastR) { edgeNodes.push([0, 1, 0, 1]); if (last) edgeNodes.push([1, 1, 0, 1]); }
    if (i === 0) { if (nz > 1 || true) { /* hoeken zijn al gedekt */ } }
    edgeNodes.forEach((en, k) => {
      const base = nodeLocal(i, j, en[0], en[1]);
      const pg = new THREE.Group(); pg.position.set(base.x + (en[0] ? .15 : -.15), 0, base.z + en[3] * .5);
      box(.95, .46, .48, mat(0x8fa596, { roughness: .8 }), 0, .34, 0, pg);
      box(.82, .05, .36, mat(COL.soil), 0, .59, 0, pg);
      pg.userData.wheels = [];
      box(.86, .11, .4, mat(0x6f7f76, { roughness: .9 }), 0, .055, 0, pg); // sokkel (geen wielen)
      m.part(pg, .6 + k * .03, .76 + k * .03, 'slide', { dx: 0, dz: en[3], d: 1.8, roll: false });
      const gx = opt.cx + m.g.position.x + pg.position.x, gz = opt.cz + m.g.position.z + pg.position.z;
      world.addCol(gx - .5, gx + .5, gz - .26, gz + .26, .62);
      planters.push(pg);
      // klimplant
      const vg = new THREE.Group(); vg.position.set(base.x, .55, base.z + en[3] * .12);
      const pts = []; for (let s = 0; s <= 18; s++) { const t = s / 18, a = t * 9 + rnd() * .3; pts.push(new THREE.Vector3(Math.cos(a) * .11, t * (H - .55), Math.sin(a) * .11)); }
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 70, .018, 5), mat(0x2f6b3c, { roughness: .85 })); tube.castShadow = true; vg.add(tube);
      const NL = 46, inst = new THREE.InstancedMesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85, flatShading: true }), NL); inst.castShadow = true; inst.frustumCulled = false;
      const leaves = [];
      for (let s = 0; s < NL; s++) {
        const t = .06 + (s / NL) * .94, a = t * 9 + rnd() * 1.2, rr = .12 + rnd() * .1;
        let px = Math.cos(a) * rr, py = t * (H - .55), pz = Math.sin(a) * rr;
        if (s > NL - 14) { // hangende bladeren langs de balk (zoals in het concept)
          const f = (s - (NL - 14)) / 14; px = (en[0] ? -1 : 1) * f * 1.5 + (rnd() - .5) * .2; pz = en[3] * -(rnd() * .25) + (rnd() - .5) * .15; py = H - .55 - rnd() * .28; leaves.push({ px, py, pz, f: .82 + f * .16, sc: .9 + rnd() * .7 }); continue;
        }
        leaves.push({ px, py, pz, f: t, sc: .8 + rnd() * .9 });
      }
      leaves.forEach((l, s) => inst.setColorAt(s, new THREE.Color().setHSL(.31 + rnd() * .05, .5 + rnd() * .15, .2 + rnd() * .12)));
      vg.add(inst); m.leafSets.push({ inst, leaves, vg });
      // struikjes in de bak
      const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(.28, 1), new THREE.MeshStandardMaterial({ color: COL.green2, roughness: .9, flatShading: true })); bush.scale.set(1.5, .7, .9); bush.position.set(0, .22, 0); bush.castShadow = true; pg.add(bush);
      m.part(vg, .74, .98, 'vine', {}); vineList.push({ vg, base: vg.position.clone(), mod: m });
    });

    // --- meubilair onder de pergola
    (opt.furn ? opt.furn(i, j) : [{ k: 'table', x: 0, z: 0, r: 0 }]).forEach((f, k) => {
      const g = new THREE.Group(); g.position.set(f.x, 0, f.z); g.rotation.y = f.r || 0;
      if (f.k === 'table') {
        const T = PF.buildPicnic(); T.scale.set(f.len || 1, 1, 1); g.add(T);
        // laadpunt (stekkerdoos + led) op tafelrand
        const lp = new THREE.Group(); lp.position.set(.75 * (f.len || 1), .8, .38); box(.2, .05, .08, mat(0x2b3033), 0, 0, 0, lp);
        const led = new THREE.Mesh(new THREE.SphereGeometry(.018, 8, 8), new THREE.MeshBasicMaterial({ color: 0x3df08a })); led.position.set(.07, .03, 0); lp.add(led); m.lights.push(led); g.add(lp);
        world.addCol(opt.cx + m.g.position.x + f.x - 1.3, opt.cx + m.g.position.x + f.x + 1.3, opt.cz + m.g.position.z + f.z - 1.4, opt.cz + m.g.position.z + f.z + 1.4, .8);
        tables.push(g);
      } else if (f.k === 'bench') { g.add(PF.buildBench(f.len || 1.8)); world.addCol(opt.cx + m.g.position.x + f.x - 1, opt.cx + m.g.position.x + f.x + 1, opt.cz + m.g.position.z + f.z - .3, opt.cz + m.g.position.z + f.z + .3, .5); }
      else if (f.k === 'seat') { box(.5, .06, .5, mat(COL.wood), 0, .45, 0, g); box(.06, .45, .06, mat(COL.steel), 0, .22, 0, g); box(.5, .4, .06, mat(COL.wood), 0, .7, -.24, g); }
      m.part(g, .66 + k * .035, .8 + k * .035, 'rise');
      (P.furn = P.furn || []).push({ g, mod: m, k: f.k, base: { x: f.x, z: f.z, r: f.r || 0 }, alt: f.alt || null });
    });

    // --- accu (rechtsachter), geleiding omhoog (geel), goot (voorzijde), sensor
    const acc = new THREE.Group(); const ap = nodeLocal(i, j, 1, 0); acc.position.set(ap.x + .55, 0, ap.z + .05);
    const accuTex = canvasTex(512, 256, (c, w, h) => { c.fillStyle = '#2f6b3f'; c.fillRect(0, 0, w, h); c.fillStyle = '#e9b23a'; c.fillRect(0, 0, w, 26); c.fillRect(0, h - 26, w, 26); c.fillStyle = '#ffffff'; c.font = '800 138px "DM Sans", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('ACCU', w / 2, h / 2 + 4); });
    box(.5, .34, .3, new THREE.MeshStandardMaterial({ map: accuTex, roughness: .6 }), 0, .17, 0, acc);
    m.part(acc, .8, .9, 'grow');
    const cab = new THREE.Group(); cab.position.set(ap.x + .09, .2, ap.z); box(.03, H - .2, .03, mat(0xe9a400, { roughness: .6, emissive: 0x3a2800 }), 0, (H - .2) / 2, 0, cab);
    m.part(cab, .78, .9, 'rise');
    if (lastR || true) {
      const gu = new THREE.Group(); gu.position.set(-MW / 2, H - .02, MD / 2 + .02); box(MW, .06, .08, mat(0x8d9aa3, { roughness: .5, metalness: .4 }), MW / 2, 0, 0, gu);
      m.part(gu, .74, .88, 'draw');
    }
    if ((opt.sensors || []).some(q => q[0] === m.i && q[1] === m.j)) {
      const s = new THREE.Group(); const sp = nodeLocal(i, j, 0, 0); s.position.set(sp.x + .09, 1.7, sp.z + .12);
      box(.12, .16, .07, mat(0xf2f2ee), 0, 0, 0, s); const dot = new THREE.Mesh(new THREE.SphereGeometry(.014, 8, 8), new THREE.MeshBasicMaterial({ color: 0x57d2ff })); dot.position.set(0, .05, .045); s.add(dot); m.lights.push(dot); box(.01, .12, .01, mat(0x666), .04, .13, 0, s);
      m.part(s, .9, .96, 'grow'); m.sensor = s;
    }
    // rood avondlicht
    const lamp = new THREE.Group(); lamp.position.set(0, H - .1, 0); box(.01, .5, .01, mat(0x222), 0, -.25, 0, lamp);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 12), new THREE.MeshBasicMaterial({ color: 0x3a1210 })); bulb.position.y = -.55; lamp.add(bulb);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(64, 64, (c, w, h) => { const g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,60,40,.9)'); g.addColorStop(.35, 'rgba(255,50,30,.28)'); g.addColorStop(1, 'rgba(255,40,20,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
    halo.scale.setScalar(1.9); halo.position.y = -.55; lamp.add(halo); m.part(lamp, .92, .98, 'grow'); m.bulb = bulb; m.halo = halo;
  });

  /* ---- eigenschappen: schaduw-aanduiding, regen, energiestroom, insecten ---- */
  // zonnestralen (energie) — dunne gloeiende banen langs de zonrichting naar de panelen
  const rayMat = new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const rays = new THREE.Group(); P.group.add(rays);
  const rr = rng(4);
  for (let k = 0; k < 14; k++) { const m2 = new THREE.Mesh(new THREE.PlaneGeometry(.09, 9), rayMat); const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), PF.SUN_DIR); m2.quaternion.copy(q);
    m2.position.set((rr() - .5) * (W - .8), H + 4.6 * PF.SUN_DIR.y, (rr() - .5) * (D - .6)).addScaledVector(PF.SUN_DIR, 0); m2.position.addScaledVector(PF.SUN_DIR, 0); m2.userData.ph = rr() * 6; rays.add(m2); }
  // regen
  const NR = 160, rain = new THREE.InstancedMesh(new THREE.BoxGeometry(.012, .42, .012), new THREE.MeshBasicMaterial({ color: 0x6aa8e8, transparent: true, opacity: .8 }), NR);
  rain.frustumCulled = false; rain.visible = false; P.group.add(rain);
  const rdat = []; for (let k = 0; k < NR; k++) rdat.push({ x: (rr() - .5) * (W + 1.5), z: (rr() - .5) * (D + 1.5), y: rr() * 7, v: 9 + rr() * 4 });
  // druppels langs goot -> bak
  const NDr = 40, drops = new THREE.InstancedMesh(new THREE.SphereGeometry(.035, 6, 6), new THREE.MeshBasicMaterial({ color: 0x57b4ff }), NDr); drops.visible = false; drops.frustumCulled = false; P.group.add(drops);
  // energiepulsen
  const NE = 10, pulses = new THREE.InstancedMesh(new THREE.SphereGeometry(.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffd44a, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }), NE * Math.max(1, nx * nz)); pulses.visible = false; pulses.frustumCulled = false; P.group.add(pulses);
  // insecten
  const beeG = new THREE.SphereGeometry(.03, 8, 6), beeM = new THREE.MeshBasicMaterial({ color: 0xf2b705 });
  for (let k = 0; k < 8 * nx * nz; k++) { const b = new THREE.Mesh(beeG, beeM); b.userData = { cx: (rr() - .5) * (W + 1), cz: (rr() < .5 ? -1 : 1) * (D / 2 + .4), cy: 1 + rr() * 1.6, ph: rr() * 6, sp: .8 + rr() * .9, a: .5 + rr() * .6 }; b.visible = false; P.group.add(b); bees.push(b); }
  const wingMat = new THREE.MeshBasicMaterial({ color: 0xffa34d, side: THREE.DoubleSide });
  for (let k = 0; k < 4 * nx * nz; k++) { const g = new THREE.Group(); const w1 = new THREE.Mesh(new THREE.PlaneGeometry(.1, .08), new THREE.MeshBasicMaterial({ color: k % 2 ? 0xffa34d : 0xf6f6f0, side: THREE.DoubleSide })), w2 = w1.clone(); w1.position.x = -.05; w2.position.x = .05; g.add(w1, w2); g.userData = { w1, w2, cx: (rr() - .5) * W, cz: (rr() - .5) * D * 1.3, cy: 1.2 + rr() * 1.2, ph: rr() * 6, sp: .5 + rr() * .5 }; g.visible = false; P.group.add(g); flies.push(g); }
  // koele-zone onder de pergola
  const coolTex = canvasTex(64, 64, (c, w, h) => { const g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(90,170,255,.55)'); g.addColorStop(1, 'rgba(90,170,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const cool = new THREE.Mesh(new THREE.PlaneGeometry(W + 2, D + 2), new THREE.MeshBasicMaterial({ map: coolTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); cool.rotation.x = -Math.PI / 2; cool.position.y = .05; P.group.add(cool);

  // grondmarkering (blauwdruk) vóór de opbouw
  const marks = new THREE.Group(); P.group.add(marks);
  const lineM = new THREE.MeshBasicMaterial({ color: 0xe9a400, transparent: true, opacity: 0, depthWrite: false });
  const edges = [[0, -D / 2, W, .08], [0, D / 2, W, .08], [-W / 2, 0, .08, D], [W / 2, 0, .08, D]];
  edges.forEach(e => { const l = new THREE.Mesh(new THREE.PlaneGeometry(e[2], e[3]), lineM); l.rotation.x = -Math.PI / 2; l.position.set(e[0], .045, e[1]); marks.add(l); });
  P.marks = marks; P.markMat = lineM;

  const fx = { rays: 0, rain: 0, energy: 0, life: 0, cool: 0, red: 0, glint: -1, sensor: 0 };
  P.fx = fx; P.mods = mods;
  P.p2 = 0; P.split = !!opt.split;
  P.setProgress = function (p, p2) {
    P.progress = p;
    if (p2 != null) P.p2 = p2;
    mods.forEach(m => { let q; if (P.split) { if (m.i === 0 && m.j === 0) q = clamp(p); else { const kk = m.i + m.j * nx - 1, st = .05, sp = 1 - (mods.length - 2) * st; q = clamp((P.p2 - kk * st) / sp); } } else q = clamp((p - m.t0) / m.span); m.q = q; m.parts.forEach(pt => applyPart(pt, q));
      m.leafSets.forEach(ls => { const u = seg(q, .74, .98); const dummy = PF._d || (PF._d = new THREE.Object3D()); ls.leaves.forEach((l, s) => {
        const g = easeOut(seg(u, l.f * .8, l.f * .8 + .25)); dummy.position.set(l.px, l.py * (1), l.pz); dummy.rotation.set(l.f * 3, l.f * 7, l.f * 2); dummy.scale.setScalar(Math.max(.0001, l.sc * g)); dummy.updateMatrix(); ls.inst.setMatrixAt(s, dummy.matrix); });
        ls.inst.instanceMatrix.needsUpdate = true; ls.vg.scale.y = 1; // bladeren volgen de ranken niet-uniform: niet schalen
        ls.vg.children[0].scale.y = Math.max(.001, easeInOut(u)); ls.vg.userData.rest && (ls.vg.scale.y = 1); }); });
    const mk = seg(p, 0, .08) * (1 - seg(p, .2, .42)); P.markMat.opacity = mk * .9; marks.visible = mk > .01;
    marks.scale.set(1 + (1 - easeOut(seg(p, 0, .08))) * .03, 1, 1 + (1 - easeOut(seg(p, 0, .08))) * .03);
    P.group.visible = p > 0.001;
  };
  P.setFx = function (o) { Object.assign(fx, o); };
  P.layout = 0;
  P.setLayout = function (k) { // schuif meubilair (studenten kiezen zelf de opstelling)
    P.layout = k; (P.furn || []).forEach(f => { if (!f.alt) return; const r = f.g.userData.rest; r.p.x = f.base.x + (f.alt.x - f.base.x) * k; r.p.z = f.base.z + (f.alt.z - f.base.z) * k; r.r.y = f.base.r + (f.alt.r - f.base.r) * k; });
    P.setProgress(P.progress);
  };
  const dm = PF._d || (PF._d = new THREE.Object3D());
  P.update = function (t, dt) {
    const showRays = fx.rays > .01; rays.visible = showRays; rayMat.opacity = fx.rays * .16;
    if (showRays) rays.children.forEach(r => { r.material === rayMat && (r.scale.y = 1); const k = .6 + .4 * Math.sin(t * 1.6 + r.userData.ph); r.scale.x = k; r.position.y += 0; });
    rain.visible = fx.rain > .01;
    if (rain.visible) { for (let k = 0; k < NR; k++) { const d = rdat[k]; d.y -= d.v * dt; if (d.y < 0) { d.y = 7; d.x = (Math.random() - .5) * (W + 1.5); d.z = (Math.random() - .5) * (D + 1.5); } const onRoof = Math.abs(d.x) < W / 2 && Math.abs(d.z) < D / 2; const yy = onRoof && d.y < H + .12 ? -99 : d.y; dm.position.set(d.x, yy, d.z); dm.rotation.set(0, 0, -.12); dm.scale.setScalar(k < NR * fx.rain ? 1 : 0.0001); dm.updateMatrix(); rain.setMatrixAt(k, dm.matrix); } rain.instanceMatrix.needsUpdate = true; }
    // druppels: langs de goot naar een bak
    drops.visible = fx.rain > .01 && (mods[0].q || 0) > .9;
    if (drops.visible) { const m0 = mods[0]; for (let k = 0; k < NDr; k++) { const u = ((t * .38 + k / NDr) % 1); const gx = -W / 2 + u * W * .9, onGutter = u < .75; const x = gx, y = onGutter ? H - .02 - u * .1 : H - .1 - (u - .75) / .25 * (H - .65), z = D / 2 + .05; dm.position.set(onGutter ? x : -W / 2 + .75 * W * .9, y, z); dm.rotation.set(0, 0, 0); dm.scale.setScalar(onGutter ? .7 : 1); dm.updateMatrix(); drops.setMatrixAt(k, dm.matrix); } drops.instanceMatrix.needsUpdate = true; }
    // energie: pulsen van paneel naar accu + laadpunt
    pulses.visible = fx.energy > .01 && (mods[0].q || 0) > .8;
    if (pulses.visible) { let idx = 0; mods.forEach(m => { const ax = m.g.position.x + MW / 2 + .09, az = m.g.position.z - MD / 2; for (let k = 0; k < NE; k++) { const u = ((t * .5 + k / NE) % 1); dm.rotation.set(0, 0, 0); dm.position.set(u < .25 ? m.g.position.x + (MW / 2 + .09) * (u / .25) * 1 : ax, H + .1 - Math.max(0, (u - .25) / .75) * (H - .2), az); if (u < .25) dm.position.set(m.g.position.x + ((u / .25) - .5) * MW * .9, H + .14, az + 0); dm.scale.setScalar(fx.energy); dm.updateMatrix(); pulses.setMatrixAt(idx++, dm.matrix); } }); pulses.instanceMatrix.needsUpdate = true; pulses.count = idx; }
    mods.forEach(m => { m.lights.forEach((l, k) => { l.material.opacity = 1; l.scale.setScalar(m.q > .85 ? 1 + .35 * Math.sin(t * 5 + k) * fx.sensor : 1); });
      if (m.bulb) { m.bulb.material.color.setRGB(.25 + fx.red * .75, .08 + fx.red * .05, .06 + fx.red * .04); m.halo.material.opacity = fx.red; m.halo.scale.setScalar(1.6 + fx.red * .5 + Math.sin(t * 2) * .05 * fx.red); } });
    // glint: golf over de panelen
    const xr = fx.xray || 0; panelList.forEach(pn => { pn.mat.transparent = xr > .01; pn.mat.opacity = 1 - .88 * xr; pn.mat.depthWrite = xr < .05; let g = 0; if (fx.glint >= 0) { const d = fx.glint * (nx * MW + 6) - 3 - (pn.x + (nx * MW) / 2 - MW / 2) ; g = Math.exp(-d * d / 1.6); } pn.mat.emissiveIntensity = g * .9 + fx.rays * .08; });
    cool.visible = fx.cool > .01; cool.material.opacity = fx.cool * (.55 + .12 * Math.sin(t * 2));
    bees.forEach((b, k) => { const u = b.userData; b.visible = fx.life > .01 && k < bees.length * fx.life && (mods[0].q || 0) > .9; if (!b.visible) return; const a = t * u.sp + u.ph; b.position.set(u.cx + Math.sin(a) * u.a * 1.4, u.cy + Math.sin(a * 2.1) * .15, u.cz + Math.sin(a * 2) * u.a * .6); });
    flies.forEach((f, k) => { const u = f.userData; f.visible = fx.life > .01 && k < flies.length * fx.life && (mods[0].q || 0) > .9; if (!f.visible) return; const a = t * u.sp + u.ph; f.position.set(u.cx + Math.sin(a) * 1.2, u.cy + Math.sin(a * 1.7) * .3, u.cz + Math.cos(a * .8) * .9); f.rotation.y = a + Math.PI / 2; const fl = Math.sin(t * 22 + k) * .9; u.w1.rotation.z = fl; u.w2.rotation.z = -fl; });
  };
  P.panelCount = panelList.length;
  P.setProgress(0);
  return P;
}
PF.createPergola = createPergola;
})(window);
/* ===== 04 · De student: gestileerd 3D-personage met procedurele animatie ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { clamp, lerp, smooth, easeOut } = PF;
const V3 = THREE.Vector3, Q = THREE.Quaternion;

const M = (c, r) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? .75 : r });
function cap(r, len, m, par, x, y, z) { const o = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 5, 10), m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; par && par.add(o); return o; }
function sph(r, m, par, x, y, z, sx, sy, sz) { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m); o.position.set(x || 0, y || 0, z || 0); o.scale.set(sx || 1, sy || 1, sz || 1); o.castShadow = true; par && par.add(o); return o; }
// kritisch gedempte veer (follow-through / secundaire beweging)
function spring(s, target, k, dt) { const c = 2 * Math.sqrt(k); s.v += (k * (target - s.x) - c * s.v) * dt; s.x += s.v * dt; return s.x; }
const SP = () => ({ x: 0, v: 0 });

function createStudent(o) {
  o = o || {};
  const skin = M(o.skin || 0xe3b08a, .8), hoodie = M(o.hoodie || 0xe0a526, .9), jeans = M(o.jeans || 0x2c3e5e, .9), shoe = M(0xf4f2ee, .7), sole = M(0x30343a, .8), hair = M(o.hair || 0x4b3426, .9), pack = M(o.pack || 0x333c46, .9);
  const root = new THREE.Group(), hips = new THREE.Group(); root.add(hips); hips.position.y = .93;
  const S = { root, hips, t: 0, phase: 0, sp: { lean: SP(), armR: SP(), armL: SP(), elbR: SP(), elbL: SP(), head: SP(), headY: SP() }, blink: 0, nextBlink: 2, mouth: 0 };

  // romp
  const torso = new THREE.Group(); hips.add(torso);
  cap(.17, .1, jeans, hips, 0, -.05, 0).scale.set(1.05, .78, .8);
  const chest = cap(.19, .26, hoodie, torso, 0, .3, 0); chest.scale.set(1.08, 1, .8);
  cap(.16, .1, hoodie, torso, 0, .12, 0).scale.set(1.0, 1, .85);
  const hem = sph(.215, hoodie, torso, 0, .07, 0, 1.0, .5, .78);
  // nek + hoofd (iets groter dan realistisch: zacht gestileerd)
  const neck = cap(.055, .06, skin, torso, 0, .62, 0);
  const head = new THREE.Group(); head.position.set(0, .8, 0); torso.add(head);
  const skull = sph(.145, skin, head, 0, .05, 0, 1, 1.08, 1.02);
  sph(.03, skin, head, 0, .02, .152, 1, .9, 1).scale.z = 1.1; // neus
  sph(.02, M(0xd99c78), head, -.138, .02, 0, .5, 1, 1); sph(.02, M(0xd99c78), head, .138, .02, 0, .5, 1, 1);
  // haar
  const hr = new THREE.Mesh(new THREE.SphereGeometry(.153, 18, 12, 0, Math.PI * 2, 0, Math.PI * .52), hair); hr.position.set(0, .075, -.012); hr.rotation.x = -.18; hr.scale.set(1.02, 1.08, 1.06); hr.castShadow = true; head.add(hr);
  const fringe = new THREE.Mesh(new THREE.BoxGeometry(.2, .05, .06), hair); fringe.position.set(.01, .15, .11); fringe.rotation.set(.35, 0, -.08); head.add(fringe);
  // ogen, wenkbrauwen, mond
  const eyes = new THREE.Group(); head.add(eyes); const eyeL = [], pup = [];
  [-1, 1].forEach(s => { const e = new THREE.Group(); e.position.set(s * .052, .07, .128); const w = sph(.026, M(0xffffff, .3), e, 0, 0, 0, 1, 1.1, .6); const p = sph(.0145, M(0x25201c, .3), e, 0, 0, .014, 1, 1, .6); eyes.add(e); eyeL.push(e); pup.push(p); });
  const brows = []; [-1, 1].forEach(s => { const b = new THREE.Mesh(new THREE.BoxGeometry(.05, .01, .012), hair); b.position.set(s * .054, .115, .14); b.rotation.z = -s * .08; head.add(b); brows.push(b); });
  const mouth = new THREE.Group(); mouth.position.set(0, -.04, .138); head.add(mouth);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(.03, .006, 6, 16, Math.PI), M(0xa4524a, .6)); lip.rotation.z = Math.PI; lip.position.y = .008; mouth.add(lip);
  const maw = sph(.026, M(0x2a1212, .5), mouth, 0, -.003, -.01, 1, .12, .5); S.maw = maw;
  const cheekM = M(0xf0a493, .9); [-1, 1].forEach(s => { const c = sph(.022, cheekM, head, s * .09, -.015, .115, 1, .7, .3); c.material = cheekM; c.material.transparent = true; c.material.opacity = .45; });

  // armen (schouder-pivot -> elbow-pivot)
  function arm(s) {
    const sh = new THREE.Group(); sh.position.set(s * .245, .52, 0); torso.add(sh);
    sph(.075, hoodie, sh, 0, 0, 0);
    const up = cap(.055, .2, hoodie, sh, 0, -.17, 0);
    const el = new THREE.Group(); el.position.set(0, -.33, 0); sh.add(el);
    cap(.05, .17, hoodie, el, 0, -.13, 0); sph(.06, skin, el, 0, -.31, 0, 1, 1.15, .8);
    sph(.052, hoodie, el, 0, 0, 0);
    return { sh, el };
  }
  const A = { R: arm(1), L: arm(-1) };
  // benen
  function leg(s) {
    const hp = new THREE.Group(); hp.position.set(s * .095, -.08, 0); hips.add(hp);
    cap(.085, .26, jeans, hp, 0, -.24, 0);
    const kn = new THREE.Group(); kn.position.set(0, -.46, 0); hp.add(kn);
    sph(.082, jeans, kn, 0, 0, 0, 1, 1, 1.04); sph(.04, jeans, kn, 0, .005, .06, 1, 1, .8); // knie + knieschijf
    cap(.07, .26, jeans, kn, 0, -.24, 0);
    const ak = new THREE.Group(); ak.position.set(0, -.47, 0); kn.add(ak);
    const ft = new THREE.Mesh(new THREE.BoxGeometry(.11, .075, .27), shoe); ft.position.set(0, -.02, .06); ft.castShadow = true; ak.add(ft);
    const so = new THREE.Mesh(new THREE.BoxGeometry(.115, .03, .28), sole); so.position.set(0, -.065, .06); ak.add(so);
    return { hp, kn, ak, so };
  }
  const Lg = { R: leg(1), L: leg(-1) };
  const _inv = new THREE.Matrix4(), _v = new THREE.Vector3(), SOLE = [[-.058, -.015, -.14], [.058, -.015, -.14], [-.058, -.015, .14], [.058, -.015, .14]];
  function soleMinY() { root.updateMatrixWorld(true); _inv.copy(root.matrixWorld).invert(); let m = 1e9; ['R', 'L'].forEach(k => { const so = Lg[k].so; SOLE.forEach(c => { _v.set(c[0], c[1], c[2]).applyMatrix4(so.matrixWorld).applyMatrix4(_inv); if (_v.y < m) m = _v.y; }); }); return m; }

  if (o.lite) { eyes.visible = false; brows.forEach(b => b.visible = false); fringe.visible = false; maw.visible = false; lip.visible = false; }
  root.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = false; } });
  const sc = o.scale || 1; root.scale.setScalar(sc);
  S.height = 1.78 * sc;
  S.headPos = () => head.getWorldPosition(new V3());

  const tmpV = new V3(), tmpQ = new Q(), tmpQ2 = new Q(), qRest = new Q();
  const down = new V3(0, -1, 0);

  /* st: {speed, talk, pointAt, pointW, lookAt, lookW, gesture, gestW, pose, expr, seated amount} */
  S.update = function (t, dt, st) {
    st = st || {}; S.t = t; dt = Math.min(dt, .05);
    const speed = st.speed || 0, walkW = clamp(speed / 1.2, 0, 1.2), talk = st.talk || 0, pose = st.pose || 'stand';
    const sitW = pose === 'sit' || pose === 'type' ? 1 : 0, sitK = S.sitK = lerp(S.sitK || 0, sitW, 1 - Math.exp(-dt * 7));
    // cyclus gekoppeld aan afgelegde afstand (voet-glijden voorkomen): 1 cyclus = 1.45 m
    S.phase += speed * dt / 1.45 * Math.PI * 2;
    const ph = S.phase, w = clamp(walkW, 0, 1), swing = Math.sin(ph), swing2 = Math.sin(ph + Math.PI);
    const idleB = Math.sin(t * 1.7 + (o.seed || 0)) * .5 + .5;
    // heupen/romp
    hips.position.y = lerp(.93, .62, sitK) - Math.abs(Math.cos(ph)) * .035 * w + idleB * .004;
    hips.position.z = lerp(0, -.0, sitK);
    hips.rotation.y = Math.sin(ph) * .09 * w; hips.rotation.z = Math.sin(ph) * .025 * w;
    const lean = spring(S.sp.lean, .06 * w + (talk > .05 ? .015 : 0) + (st.leanIn || 0), 60, dt);
    torso.rotation.x = lean * (1 - sitK * .3); torso.rotation.y = -Math.sin(ph) * .12 * w; torso.rotation.z = -Math.sin(ph) * .02 * w;
    // benen
    const idle = 1 - w;
    [['R', swing], ['L', swing2]].forEach(([k, sw]) => {
      const L = Lg[k];
      let thigh = sw * .62 * w, knee = Math.max(0, Math.sin((k === 'R' ? ph : ph + Math.PI) - 1.5)) * 1.05 * w + .04, foot = -Math.max(0, sw) * .1 * w;
      thigh = lerp(thigh, -1.52, sitK); knee = lerp(knee, 1.5, sitK); foot = lerp(foot, 0, sitK);
      L.hp.rotation.x = thigh + (k === 'R' ? .02 : -.02) * idle; L.kn.rotation.x = knee; L.ak.rotation.x = foot + (sitK > .5 ? 0 : 0);
      L.hp.rotation.z = (k === 'R' ? -1 : 1) * (.03 + sitK * .05);
    });
    // voeten echt op de vloer: laagste zool raakt y = 0 (niet bij zitten: daar bepaalt de bank de hoogte)
    { const mn = soleMinY(); const lift = -mn * (1 - sitK); if (Math.abs(lift) < .6) hips.position.y += lift; }
    // armen: basis = pendelen of zwaaien
    const bp0 = { R: swing2 * .5 * w, L: swing * .5 * w };
    const talkB = talk * (Math.sin(t * 9.1) * .6 + Math.sin(t * 5.3) * .4);
    ['R', 'L'].forEach(k => {
      const a = A[k], sgn = k === 'R' ? 1 : -1, sh = a.sh, el = a.el;
      // rust/pendel
      let rx = bp0[k] * .9 - .06, rz = sgn * (.1 + .02 * idleB), ex = -.16 - Math.abs(bp0[k]) * .5 - w * .15;
      // 'open handpalm' uitlegbaar: onderarmen omhoog en iets naar buiten
      const gw = st.gesture === 'open' ? (st.gestW == null ? 1 : st.gestW) : 0;
      if (gw > 0) { rx = lerp(rx, -.55 + talkB * .12 + Math.sin(t * 1.3 + sgn) * .06, gw); rz = lerp(rz, sgn * (.28 + talkB * .06), gw); ex = lerp(ex, -1.05 + talkB * .25, gw); }
      // typen / zitten: handen naar voren
      if (pose === 'type') { rx = lerp(rx, -.85, sitK); rz = lerp(rz, sgn * .1, sitK); ex = lerp(ex, -.85 + Math.sin(t * 14 + sgn) * .06, sitK); }
      else if (pose === 'sit') { rx = lerp(rx, -.5, sitK); ex = lerp(ex, -1.0, sitK); }
      if (pose === 'raise' && k === 'R') { rx = -2.75; rz = .12 + Math.sin(t * 7) * .22; ex = -.25 + Math.sin(t * 7 + 1) * .2; }
      const sx = spring(S.sp['arm' + k], rx, 70, dt), ex2 = spring(S.sp['elb' + k], ex, 55, dt);
      sh.quaternion.setFromEuler(new THREE.Euler(sx, 0, rz)); el.rotation.x = ex2;
      // wijzen (rechterarm) — richting target in romp-ruimte
      if (k === 'R' && st.pointAt && (st.pointW || 0) > .001) {
        torso.updateWorldMatrix(true, false);
        tmpV.copy(st.pointAt); torso.worldToLocal(tmpV); tmpV.sub(sh.position).normalize();
        tmpQ.setFromUnitVectors(down, tmpV); const pw = clamp(st.pointW);
        tmpQ2.copy(sh.quaternion); sh.quaternion.copy(tmpQ2.slerp(tmpQ, smooth(pw)));
        el.rotation.x = lerp(el.rotation.x, -.12, pw);
      }
    });
    // hoofd: kijkt naar target (met vertraging), praat-bobbing
    let hy = Math.sin(t * .6 + (o.seed || 0)) * .05, hx = Math.sin(t * .8) * .02 + (talk * (Math.sin(t * 6.7) * .03));
    if (st.lookAt && (st.lookW || 0) > .001) {
      head.updateWorldMatrix(true, false); tmpV.copy(st.lookAt); const loc = torso.worldToLocal(tmpV.clone()); loc.sub(head.position);
      const yaw = clamp(Math.atan2(loc.x, loc.z), -1.15, 1.15), pit = clamp(-Math.atan2(loc.y, Math.hypot(loc.x, loc.z)), -.5, .55);
      hy = lerp(hy, yaw, clamp(st.lookW)); hx = lerp(hx, pit, clamp(st.lookW));
    }
    head.rotation.y = spring(S.sp.headY, hy, 38, dt); head.rotation.x = spring(S.sp.head, hx + (st.nod ? Math.sin(t * 10) * .06 : 0), 52, dt);
    head.rotation.z = Math.sin(t * .9) * .015 + (talk > .05 ? Math.sin(t * 3.1) * .02 : 0);
    // ogen: knipperen + pupil volgt kijkrichting licht
    S.nextBlink -= dt; if (S.nextBlink < 0) { S.blink = 1; S.nextBlink = 2 + Math.random() * 3.2; }
    S.blink = Math.max(0, S.blink - dt * 8); const bl = Math.sin(S.blink * Math.PI);
    eyeL.forEach(e => e.scale.y = 1 - bl * .92);
    // mond: syllaben-enveloppe + glimlach
    const sy = (st.level != null && talk > .05) ? clamp(st.level * 1.35, 0, 1) * (.78 + .22 * Math.abs(Math.sin(t * 9.7))) : talk * (Math.abs(Math.sin(t * 11.3)) * .6 + Math.abs(Math.sin(t * 7.1 + 1.3)) * .4);
    S.mouth += (sy - S.mouth) * (1 - Math.exp(-dt * 30));
    const smile = st.smile == null ? .5 : st.smile;
    maw.scale.set(1 + S.mouth * .1 + smile * .1, .1 + S.mouth * 1.25, .5); maw.position.y = -.003 - S.mouth * .006;
    lip.scale.set(1 + smile * .15, .5 + smile * .9, 1); lip.rotation.z = Math.PI + (smile - .5) * .0; lip.position.y = .008 + smile * .006 - S.mouth * .008;
    brows.forEach((b, i) => { b.position.y = .115 + (st.brow || 0) * .014 + talk * Math.max(0, Math.sin(t * 2.4 + i)) * .004; });
  };
  S.setColors = (c) => { if (c.hoodie) hoodie.color.setHex(c.hoodie); if (c.hair) hair.color.setHex(c.hair); if (c.jeans) jeans.color.setHex(c.jeans); };
  return S;
}
PF.createStudent = createStudent;
})(window);
/* ===== 05 · Stage: 3D-typografie, functie-tokens, dak-doorsnede, kaart ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { COL, mat, box, canvasTex, clamp, seg, easeOut, backOut, easeInOut, smooth } = PF;

const FONT_D = '"Bricolage Grotesque","DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif';
const FONT_B = '"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif';

/* ---------- labels (billboards in de 3D-wereld) ---------- */
function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// card: witte plaquette met titel (+ optioneel badge-nummer en subregel). height = wereldhoogte in meters
function makeLabel(o) {
  const title = o.text, sub = o.sub || '', badge = o.badge, S = 3;
  const tf = `700 ${46 * S}px ${FONT_D}`, sf = `500 ${28 * S}px ${FONT_B}`;
  const m = document.createElement('canvas').getContext('2d'); m.font = tf; const tw = m.measureText(title).width; m.font = sf; const sw = sub ? m.measureText(sub).width : 0;
  const pad = 30 * S, bw = badge ? 64 * S : 0, W = Math.ceil(Math.max(tw, sw) + pad * 2 + (badge ? bw + 14 * S : 0)), Hh = Math.ceil((sub ? 112 : 78) * S + 10 * S);
  const c = document.createElement('canvas'); c.width = W + 16 * S; c.height = Hh + 16 * S; const x = c.getContext('2d');
  x.translate(8 * S, 4 * S);
  x.shadowColor = 'rgba(30,40,50,.22)'; x.shadowBlur = 14 * S; x.shadowOffsetY = 5 * S;
  x.fillStyle = o.bg || '#fffdf8'; rrect(x, 0, 0, W, Hh - 8 * S, 22 * S); x.fill(); x.shadowColor = 'transparent';
  let tx = pad;
  if (badge) { x.fillStyle = o.accent || '#e9a400'; x.beginPath(); x.arc(pad + 26 * S, (Hh - 8 * S) / 2, 26 * S, 0, 6.3); x.fill(); x.fillStyle = '#1b1a17'; x.font = `800 ${32 * S}px ${FONT_D}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(badge), pad + 26 * S, (Hh - 8 * S) / 2 + 2 * S); tx = pad + bw + 14 * S - 8 * S; }
  x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillStyle = o.fg || '#1b1a17'; x.font = tf; x.fillText(title, tx, sub ? 40 * S : (Hh - 8 * S) / 2 + 2 * S);
  if (sub) { x.fillStyle = o.subfg || '#4a4f55'; x.font = sf; x.fillText(sub, tx, 82 * S); }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false, opacity: 0 })); // labels altijd bovenop: nooit achter balken of figuren verstopt
  const hgt = o.h || .5; sp.userData.base = new THREE.Vector3(hgt * c.width / c.height, hgt, 1); sp.scale.copy(sp.userData.base).multiplyScalar(.001); sp.visible = false;
  sp.renderOrder = 10; sp.center.set(.5, .0);
  return sp;
}
// grote typografie (cijfers) zonder kaart
function makeBig(o) {
  const S = 2, nf = `800 ${150 * S}px ${FONT_D}`, lf = `600 ${40 * S}px ${FONT_B}`, sf = `500 ${26 * S}px ${FONT_B}`;
  const m = document.createElement('canvas').getContext('2d'); m.font = nf; const nw = m.measureText(o.num).width; m.font = lf; const lw = m.measureText(o.label).width;
  const W = Math.ceil(Math.max(nw, lw) + 70 * S), Hh = (o.src ? 270 : 232) * S; const c = document.createElement('canvas'); c.width = W; c.height = Hh; const x = c.getContext('2d');
  x.fillStyle = 'rgba(255,255,255,.0)'; x.fillRect(0, 0, W, Hh);
  x.shadowColor = 'rgba(255,255,255,.9)'; x.shadowBlur = 18 * S;
  x.fillStyle = o.hl || '#f2b705'; x.globalAlpha = .55; x.fillRect(24 * S, 150 * S, nw + 12 * S, 34 * S); x.globalAlpha = 1;
  x.shadowColor = 'transparent'; x.textBaseline = 'alphabetic'; x.fillStyle = '#17181a'; x.font = nf; x.fillText(o.num, 30 * S, 150 * S);
  x.font = lf; x.fillStyle = '#2b3036'; x.fillText(o.label, 32 * S, 208 * S);
  if (o.src) { x.font = sf; x.fillStyle = '#5b636b'; x.fillText(o.src, 32 * S, 250 * S); }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false, opacity: 0 }));
  const hgt = o.h || 1.4; sp.userData.base = new THREE.Vector3(hgt * c.width / c.height, hgt, 1); sp.scale.copy(sp.userData.base).multiplyScalar(.001); sp.visible = false; sp.renderOrder = 10; sp.center.set(.5, 0);
  return sp;
}
// toon/verberg met pop-animatie  u: 0..1
const _lp = new THREE.Vector3();
// minimale schermgrootte: labels die ver weg staan worden meegeschaald zodat ze leesbaar blijven (max. 2,4×)
function labelBoost(sp) { const cam = PF.labelCam; if (!cam) return 1; sp.getWorldPosition(_lp); const d = _lp.distanceTo(cam.position); const need = d * .075 * (cam.fov / 40); return Math.min(3.4, Math.max(1, need / sp.userData.base.y)); }
function popLabel(sp, u) { const a = clamp(u); sp.visible = a > .001; if (!sp.visible) return; const k = backOut(a) * labelBoost(sp); sp.scale.set(sp.userData.base.x * k, sp.userData.base.y * k, 1); sp.material.opacity = smooth(a * 1.6); }
PF.makeLabel = makeLabel; PF.makeBig = makeBig; PF.popLabel = popLabel;

/* ---------- zon-sprite aan de hemel ---------- */
function makeSun() {
  const t = canvasTex(256, 256, (c, w, h) => { const g = c.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(.08, 'rgba(255,244,205,.95)'); g.addColorStop(.25, 'rgba(255,225,160,.35)'); g.addColorStop(1, 'rgba(255,210,140,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false })); s.scale.setScalar(150); s.position.copy(PF.SUN_DIR).multiplyScalar(560); s.renderOrder = -1; return s;
}
PF.makeSun = makeSun;

/* ---------- vier functies: tokens ---------- */
function plinth() { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(.95, 1.05, .16, 36), mat(0xfdfcf8, { roughness: .6 })); b.position.y = .08; b.castShadow = b.receiveShadow = true; g.add(b);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.97, .025, 8, 48), new THREE.MeshBasicMaterial({ color: 0xe9a400 })); ring.rotation.x = Math.PI / 2; ring.position.y = .17; g.add(ring); return g; }
function miniPanel(w, d) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, .05, d), [mat(0xcfd6dd, { metalness: .4 }), mat(0xcfd6dd), new THREE.MeshStandardMaterial({ color: 0x24457d, roughness: .3, metalness: .2 }), mat(0xcfd6dd), mat(0xcfd6dd), mat(0xcfd6dd)]); m.castShadow = true; return m; }
function tokenGlyph(k) {
  const g = new THREE.Group(), anim = {};
  if (k === 1) {
    const p = miniPanel(1.3, .86); p.position.set(0, .75, 0); p.rotation.set(.45, 0, 0); g.add(p);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(.2, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffc83a })); sun.position.set(-.55, 1.55, -.2); g.add(sun); anim.sun = sun;
    const rays = new THREE.Group(); rays.position.copy(sun.position); for (let i = 0; i < 8; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(.05, .2, .03), new THREE.MeshBasicMaterial({ color: 0xffc83a })); r.position.set(Math.cos(i * .785) * .38, Math.sin(i * .785) * .38, 0); r.rotation.z = i * .785 - Math.PI / 2; rays.add(r); } g.add(rays); anim.rays = rays;
    const sh = new THREE.Shape(); [[.08, .5], [-.1, 0], [.02, 0], [-.08, -.5], [.14, .08], [.02, .08], [.14, .5]].forEach((q, i) => i ? sh.lineTo(q[0], q[1]) : sh.moveTo(q[0], q[1]));
    const bolt = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .06, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0xffb300, emissive: 0x7a4a00, roughness: .5 })); bolt.scale.setScalar(.95); bolt.position.set(.65, .5, 0); g.add(bolt); anim.bolt = bolt;
  } else if (k === 2) {
    const p = miniPanel(1.4, 1.0); p.position.y = 1.35; g.add(p);
    [[-.62, -.4], [.62, -.4], [-.62, .4], [.62, .4]].forEach(a => { const s = box(.05, 1.3, .05, mat(0x8c6a4c), a[0], .75, a[1], g); });
    const sh = new THREE.Mesh(new THREE.CircleGeometry(.78, 28), new THREE.MeshBasicMaterial({ color: 0x31465f, transparent: true, opacity: .28 })); sh.rotation.x = -Math.PI / 2; sh.position.y = .19; g.add(sh);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.45, .03, 8, 36), new THREE.MeshBasicMaterial({ color: 0x57b4ff, transparent: true, opacity: .8 })); ring.rotation.x = Math.PI / 2; ring.position.y = .5; g.add(ring); anim.ring = ring;
    for (let i = 0; i < 3; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0x57b4ff })); d.position.set(-.3 + i * .3, .6, 0); g.add(d); (anim.drops = anim.drops || []).push(d); }
  } else if (k === 3) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.03, .05, 1.1, 6), mat(0x2f6b3c)); stem.position.y = .75; g.add(stem);
    const lm = new THREE.MeshStandardMaterial({ color: 0x4f9c5c, roughness: .8, flatShading: true });
    for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(.2, 0), lm); l.scale.set(1.3, .35, .8); const a = i * 2.4; l.position.set(Math.cos(a) * .22, .45 + i * .14, Math.sin(a) * .22); l.rotation.set(0, -a, .4); g.add(l); }
    const fl = new THREE.Mesh(new THREE.SphereGeometry(.14, 12, 10), new THREE.MeshStandardMaterial({ color: 0xf3c14a, emissive: 0x5c4200 })); fl.position.y = 1.4; g.add(fl);
    const bee = new THREE.Group(); const bb = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), new THREE.MeshBasicMaterial({ color: 0xf2b705 })); bb.scale.set(1.4, 1, 1); bee.add(bb); const st = new THREE.Mesh(new THREE.BoxGeometry(.03, .1, .1), new THREE.MeshBasicMaterial({ color: 0x222 })); bee.add(st); g.add(bee); anim.bee = bee;
  } else {
    const t = PF.buildPicnic(); t.scale.setScalar(.45); t.position.y = .16; g.add(t);
    const bk = box(.34, .05, .24, mat(0xe9a400), 0, .6, 0, g); const bk2 = box(.34, .05, .24, mat(0x4f8a5c), 0, .65, 0, g); bk.rotation.y = .3; bk2.rotation.y = -.15;
    const lp = box(.4, .02, .28, mat(0xcfd6dd, { metalness: .4 }), .25, .62, .15, g); const sc = box(.4, .26, .02, mat(0x2b3033), .25, .75, .03, g); sc.rotation.x = -.2; anim.book = bk;
  }
  return { g, anim };
}
function makeToken(k) {
  const root = new THREE.Group(), base = plinth(), gl = tokenGlyph(k); root.add(base); const inner = new THREE.Group(); inner.add(gl.g); inner.position.y = .16; root.add(inner);
  root.userData = { inner, anim: gl.anim, k };
  root.traverse(n => { if (n.isMesh) n.castShadow = true; }); root.visible = false;
  return root;
}
function updateToken(tk, t, u, active) {
  const a = clamp(u); tk.visible = a > .001; if (!tk.visible) return;
  const k = backOut(a); tk.scale.setScalar(Math.max(.001, k)); const d = tk.userData;
  d.inner.rotation.y = Math.sin(t * .6 + d.k) * .45 + t * (active ? .35 : .08); d.inner.position.y = .16 + (active ? .08 + Math.sin(t * 2) * .04 : 0);
  const an = d.anim; if (an.rays) { an.rays.rotation.z = t * .6; an.sun.scale.setScalar(1 + .06 * Math.sin(t * 3)); an.bolt.scale.setScalar(.95 + (active ? .12 * Math.sin(t * 5) : 0)); }
  if (an.ring) { an.ring.scale.setScalar(1 + .25 * Math.sin(t * 2.2)); an.drops.forEach((q, i) => q.position.y = .5 + ((t * .5 + i * .33) % 1) * .6); }
  if (an.bee) { an.bee.position.set(Math.cos(t * 2.2) * .55, 1.1 + Math.sin(t * 3) * .1, Math.sin(t * 2.2) * .55); an.bee.rotation.y = -t * 2.2; }
}
PF.makeToken = makeToken; PF.updateToken = updateToken;

/* ---------- dak-doorsnede (draagkracht / waterafvoer / waterdichting) ---------- */
function makeRoofSample() {
  const g = new THREE.Group(), L = 3.6, Dp = 2.4;
  const defs = [['tegels', 0xd9d3c8, .2], ['membraan', 0x2d3236, .06], ['vloer', 0xb4b8b2, .34]];
  const layers = defs.map((d, i) => { const m = box(L, d[2], Dp, mat(d[1], { roughness: .9 }), 0, 0, 0, g); return m; });
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 1.1, 12), mat(0x7e8b94, { metalness: .3, roughness: .5 })); pipe.position.set(L / 2 - .3, -.3, 0); g.add(pipe);
  const arrows = []; for (let i = 0; i < 3; i++) { const a = new THREE.Group(); const sh = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .7, 10), new THREE.MeshStandardMaterial({ color: 0xe9503a, emissive: 0x4a1208 })); sh.position.y = .35; const hd = new THREE.Mesh(new THREE.ConeGeometry(.22, .36, 12), sh.material); hd.rotation.x = Math.PI; hd.position.y = -.1; a.add(sh, hd); a.position.set(-1.2 + i * 1.2, 2.4, 0); g.add(a); arrows.push(a); }
  const NDr = 28, drops = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0x57b4ff }), NDr); drops.frustumCulled = false; g.add(drops);
  g.userData = { layers, arrows, drops, NDr, pipe, L, Dp }; g.traverse(n => { if (n.isMesh) n.castShadow = n.receiveShadow = true; }); g.visible = false;
  return g;
}
const _o = new THREE.Object3D();
function updateRoofSample(s, t, ex, vis) { // ex: 0 = gestapeld, 1 = uiteengetrokken; vis: 0..1
  const d = s.userData; s.visible = vis > .001; if (!s.visible) return; s.scale.setScalar(Math.max(.001, backOut(vis)));
  const e = easeInOut(ex), h = [.36 + .1 + e * 1.35, .26 + e * .75, .17 + e * .15 - 0.0];
  d.layers[0].position.y = h[0]; d.layers[1].position.y = .17 + .06 + e * .7; d.layers[2].position.y = .17 * 1;
  d.layers[0].position.y = .504 + e * 1.34; d.layers[1].position.y = .372 + e * .65; d.layers[2].position.y = .17;
  d.arrows.forEach((a, i) => { const k = seg(ex, .3 + i * .08, .6 + i * .08); a.visible = k > 0; a.position.y = 2.7 - Math.sin(t * 3 + i) * .08 - (1 - easeOut(k)) * .8; a.scale.setScalar(.001 + backOut(k)); });
  d.drops.visible = ex > .35; if (d.drops.visible) for (let i = 0; i < d.NDr; i++) { const u = (t * .3 + i / d.NDr) % 1; _o.position.set(-d.L / 2 + .3 + u * (d.L - .6), .372 + e * .65 + .06 + Math.sin(u * 20) * .01, -.9 + ((i * 37) % 19) / 19 * 1.8); if (u > .9) _o.position.y -= (u - .9) * 6; _o.scale.setScalar(1); _o.updateMatrix(); d.drops.setMatrixAt(i, _o.matrix); } d.drops.instanceMatrix.needsUpdate = true;
}
PF.makeRoofSample = makeRoofSample; PF.updateRoofSample = updateRoofSample;

/* ---------- kaart (Europa als witte maquette) ---------- */
const EU = [[-9.5, 37], [-9.5, 43.2], [-1.8, 43.4], [-1.2, 46], [-4.7, 48.4], [-1.5, 48.7], [-1.3, 49.6], [1.5, 50.2], [2.5, 51.1], [4.5, 52.3], [5, 53.4], [8.7, 53.9], [8.5, 55.5], [8.2, 57], [10.5, 57.7], [10.5, 56], [11, 54.7], [14, 54], [18.5, 54.8], [21, 55.5], [21, 57.5], [24, 58], [24, 59.5], [29, 60], [30, 56], [31, 52], [30, 48], [28, 45], [25, 44], [22, 41], [20, 40], [19, 42], [14, 45.5], [13.5, 44], [16, 41.5], [18.5, 40.2], [16, 38], [15.7, 40], [12, 41.8], [10, 43.5], [8, 44], [6.5, 43], [3.2, 43.3], [3, 42], [0, 39], [-.5, 38], [-2, 36.8], [-5.5, 36], [-7, 37]];
const PINS = [
  { name: 'Groningen', sub: 'Leaf of Groningen · tot 8 °C koeler', lon: 6.6, lat: 53.2, dx: -.2, dy: 1.7 },
  { name: 'Utrecht', sub: 'Zonnepergola De Syp · op een dak', lon: 5.1, lat: 52.1, dx: -1.2, dy: .9 },
  { name: 'Praag', sub: 'Studenten: 2 laptops + 4 telefoons', lon: 14.4, lat: 50.1, dx: 1.0, dy: 1.5 },
  { name: 'Madrid', sub: 'PV-pergola met rustplek op kantoordak', lon: -3.7, lat: 40.4, dx: 0, dy: 1.3 }
];
function makeMap() {
  const g = new THREE.Group(), K = .24, proj = (lon, lat) => [(lon - 8) * Math.cos(50 * Math.PI / 180) * K, (lat - 47.5) * K];
  const sh = new THREE.Shape(); EU.forEach((p, i) => { const q = proj(p[0], p[1]); i ? sh.lineTo(q[0], q[1]) : sh.moveTo(q[0], q[1]); });
  const geo = new THREE.ExtrudeGeometry(sh, { depth: .22, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 1 }); geo.rotateX(-Math.PI / 2);
  const slab = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xf4f3ef, roughness: .95, flatShading: true })); slab.castShadow = slab.receiveShadow = true; g.add(slab);
  const base = new THREE.Mesh(geo.clone(), new THREE.MeshStandardMaterial({ color: 0xcfd3d6, roughness: 1 })); base.scale.set(1.05, .35, 1.05); base.position.set(0, -.12, 0); g.add(base);
  const pins = PINS.map(p => { const q = proj(p.lon, p.lat); const pg = new THREE.Group(); pg.position.set(q[0], .24, -q[1]);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 1, 6), new THREE.MeshBasicMaterial({ color: 0x1b1a17 })); stem.position.y = .5; const head = new THREE.Mesh(new THREE.SphereGeometry(.09, 14, 10), new THREE.MeshStandardMaterial({ color: 0xe9a400, emissive: 0x6a4700 })); head.position.y = 1.0;
    pg.add(stem, head); const lab = makeLabel({ text: p.name, sub: p.sub, h: .5 }); lab.position.set(0, 1.12, 0); pg.add(lab); pg.userData = { lab, head, stem }; g.add(pg); return pg; });
  g.userData = { pins }; g.visible = false; return g;
}
PF.makeMap = makeMap;
})(window);
/* ===== 05b · Ontwerp-onderdelen: plantenbak + bankje, doorsnede (waterkringloop), habitatbakken, gras en paden, insecten ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { COL, mat, box, canvasTex, rng, clamp, seg, smooth, easeOut, backOut, lerp, CFG, POFF } = PF;

const WOODB = () => mat(0xb48a5c, { roughness: .8 });
const SHELL = () => mat(0x8fa596, { roughness: .8 });
let G_ = null;
function shared() {
  if (G_) return G_;
  const blob = new THREE.IcosahedronGeometry(1, 1);
  G_ = { blob, leafM: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9, flatShading: true }), stem: new THREE.CylinderGeometry(.006, .008, 1, 5), flower: new THREE.IcosahedronGeometry(1, 0), drop: new THREE.SphereGeometry(1, 8, 6) };
  return G_;
}

/* ---------- plantenbak + bankje (zelfwatergevend) ---------- */
function buildPlanter(side, seed) {
  const { planter: P, bench: B } = CFG, r = rng(seed || 1), g = new THREE.Group(), sh = shared();
  // lange as langs z; bankje aan de x-kant 'side'
  box(P.W, P.H - .06, P.L, SHELL(), 0, (P.H - .06) / 2, 0, g);
  const rim = mat(0xb9c7bd, { roughness: .75 });
  box(P.W + .04, .06, P.L + .04, rim, 0, P.H - .03, 0, g);
  const soil = box(P.W - .14, .03, P.L - .14, mat(COL.soil), 0, P.H + .005, 0, g); soil.castShadow = false;
  // beplanting: struiken + bloemetjes (illustratief; geen specifieke soorten)
  const cols = [0x4f8a5c, 0x6aa56a, 0x3c7450, 0x7fb06a];
  for (let k = 0; k < 8; k++) { const s = new THREE.Mesh(sh.blob, new THREE.MeshStandardMaterial({ color: cols[k % 4], roughness: .9, flatShading: true })); const q = .16 + r() * .12;
    s.scale.set(q * 1.2, q * .8, q * 1.2); s.position.set((r() - .5) * (P.W - .35), P.H + .1 + q * .3, (k / 7 - .5) * (P.L - .5) + (r() - .5) * .1); s.castShadow = true; g.add(s); }
  const fc = [0xf2b705, 0xd96aa0, 0x8a4fc0, 0xf6f3e8];
  for (let k = 0; k < 9; k++) { const f = new THREE.Mesh(sh.flower, new THREE.MeshBasicMaterial({ color: fc[k % 4] })); f.scale.setScalar(.035); f.position.set((r() - .5) * (P.W - .3), P.H + .3 + r() * .1, (k / 8 - .5) * (P.L - .4)); g.add(f); }
  // bankje vast aan de bak
  const seatMat = WOODB();
  [side, -side].forEach(sd => { const x0 = sd * (P.W / 2 + B.D / 2); // een bankje aan beide kanten (ontwerpkeuze)
    box(B.D, .06, B.L, seatMat, x0, B.H - .03, 0, g);
    box(B.D - .04, B.H - .08, .07, mat(0x7f6a50, { roughness: .85 }), x0, (B.H - .08) / 2, -B.L / 2 + .25, g);
    box(B.D - .04, B.H - .08, .07, mat(0x7f6a50, { roughness: .85 }), x0, (B.H - .08) / 2, B.L / 2 - .25, g); });
  // vulbuis (kopeind) en overloop (andere kopeind): zie doorsnede
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .26, 10), mat(0xe9e2cf, { roughness: .5 })); tube.position.set(-side * (P.W / 2 - .08), P.H + .12, P.L / 2 - .12); tube.castShadow = true; g.add(tube);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .03, 10), mat(0x3a7ab8)); cap.position.set(tube.position.x, P.H + .26, tube.position.z); g.add(cap);
  const ov = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .14, 8), mat(0xe9e2cf)); ov.rotation.z = Math.PI / 2; ov.position.set(-side * (P.W / 2 + .06), .22, -P.L / 2 + .14); g.add(ov);
  g.userData = { side, tube, cap };
  return g;
}
PF.buildPlanter = buildPlanter;

/* ---------- doorsnede-model: schematische ontwerpkeuze, niet op schaal ----------
   Lagen: waterreservoir (onder), draagplaat (boven max. waterniveau, met luchtruimte), substraat met wortelzone, beplanting;
   capillaire stroken, vulbuis, overloop. Bron: HAN groenmodules, dia 2. */
const SEC = { Lx: 3.0, Dz: .9, H: 1.5, resH: .5, plateY: .6, subTop: 1.15, maxW: .46 };
function buildSection() {
  const g = new THREE.Group(), S = SEC, sh = shared(), r = rng(9);
  const layers = {}; // groepen die bij 'ex' (uit elkaar trekken) verschuiven
  layers.tank = new THREE.Group(); layers.plate = new THREE.Group(); layers.sub = new THREE.Group(); layers.plant = new THREE.Group();
  Object.values(layers).forEach(l => g.add(l));
  const wall = mat(0xc9d0cc, { roughness: .6 });
  // reservoir: bodem, achterwand, kopwanden (de voorkant is open = doorsnede)
  box(S.Lx, .06, S.Dz, wall, 0, .03, 0, layers.tank);
  box(S.Lx, S.resH, .05, wall, 0, .06 + S.resH / 2, -S.Dz / 2 + .025, layers.tank);
  box(.05, S.resH, S.Dz, wall, -S.Lx / 2 + .025, .06 + S.resH / 2, 0, layers.tank);
  box(.05, S.resH, S.Dz, wall, S.Lx / 2 - .025, .06 + S.resH / 2, 0, layers.tank);
  const wMat = new THREE.MeshStandardMaterial({ color: 0x4aa0e0, transparent: true, opacity: .62, roughness: .15, metalness: 0, depthWrite: false });
  const water = new THREE.Mesh(new THREE.BoxGeometry(S.Lx - .12, 1, S.Dz - .1), wMat); water.position.set(0, .06, .0); water.renderOrder = 2; layers.tank.add(water);
  // maximaal waterniveau (lijn op de achterwand)
  const lvl = new THREE.Mesh(new THREE.PlaneGeometry(S.Lx - .1, .02), new THREE.MeshBasicMaterial({ color: 0x1b5f9e })); lvl.position.set(0, .06 + S.maxW, -S.Dz / 2 + .052); layers.tank.add(lvl);
  // draagplaat (ligt boven het maximale waterniveau; gaten voor de capillaire stroken)
  box(S.Lx - .1, .05, S.Dz - .1, mat(0x8b949b, { roughness: .6 }), 0, S.plateY, 0, layers.plate);
  const holeM = new THREE.MeshBasicMaterial({ color: 0x2a2f33 });
  const stripX = [-1.05, -.35, .35, 1.05];
  stripX.forEach(x => { const h = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .006, 16), holeM); h.position.set(x, S.plateY + .028, .12); layers.plate.add(h); });
  // substraat (gezien in doorsnede: voorvlak met textuur) + wortelzone
  const subTex = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#6b5443'; c.fillRect(0, 0, w, h); const q = rng(3); for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(${60 + q() * 60},${45 + q() * 40},${30 + q() * 30},.7)`; c.fillRect(q() * w, q() * h, 2 + q() * 4, 2 + q() * 3); }
    const gr = c.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, 'rgba(255,240,200,.28)'); gr.addColorStop(.6, 'rgba(255,240,200,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const subH = S.subTop - S.plateY - .03;
  const subM = [mat(0x6b5443), mat(0x6b5443), mat(0x6b5443), mat(0x6b5443), new THREE.MeshStandardMaterial({ map: subTex, roughness: .95 }), mat(0x6b5443)];
  const sub = new THREE.Mesh(new THREE.BoxGeometry(S.Lx - .1, subH, S.Dz - .1), subM); sub.position.set(0, S.plateY + .025 + subH / 2, 0); sub.castShadow = sub.receiveShadow = true; layers.sub.add(sub);
  // capillaire stroken: van de reservoirbodem door de plaat omhoog naar de wortelzone
  const stripM = mat(0xefe6c8, { roughness: .8 }), strips = [];
  stripX.forEach(x => { const sH = S.subTop - .75 - .1; const st = new THREE.Mesh(new THREE.BoxGeometry(.08, 1, .04), stripM); st.userData = { x, y0: .12, y1: S.subTop - .22 }; st.position.set(x, 0, .43); g.add(st); strips.push(st); });
  // wortels (dunne, lichte lijnen) rond de stroken
  const rootM = new THREE.MeshBasicMaterial({ color: 0xf1ead2 }); const roots = [];
  stripX.forEach((x, k) => { for (let q = 0; q < 4; q++) { const rt = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .3 + r() * .15, 4), rootM); rt.position.set(x + (q - 1.5) * .07, S.subTop - .33, .425); rt.rotation.z = (r() - .5) * .9; layers.sub.add(rt); roots.push(rt); } });
  // beplanting boven het substraat (illustratief)
  const lm = [0x4f8a5c, 0x6aa56a, 0x3c7450, 0x7fb06a]; const leafMats = [];
  for (let k = 0; k < 11; k++) { const mm = new THREE.MeshStandardMaterial({ color: lm[k % 4], roughness: .9, flatShading: true, emissive: 0x0b3a14, emissiveIntensity: 0 }); leafMats.push(mm); const s = new THREE.Mesh(sh.blob, mm); const q = .2 + r() * .1; s.scale.set(q * 1.1, q * .9, q); s.position.set(-1.25 + k * .25 + (r() - .5) * .08, S.subTop + .1 + q * .6, (r() - .5) * .35); s.castShadow = true; layers.plant.add(s); }
  // vulbuis (rechts) en overloop (links)
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 1, 12), mat(0xe9e2cf, { roughness: .5 })); tube.position.set(1.35, 0, .5); tube.userData = { y0: .1, y1: S.subTop + .5 }; g.add(tube);
  const tcap = new THREE.Mesh(new THREE.CylinderGeometry(.065, .065, .05, 12), mat(0x3a7ab8)); tcap.position.set(1.35, S.subTop + .52, .5); g.add(tcap);
  const ovp = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .32, 10), mat(0xe9e2cf)); ovp.rotation.z = Math.PI / 2; ovp.position.set(-S.Lx / 2 - .1, .06 + S.maxW - .03, -.1); g.add(ovp);
  // bak-voet
  box(S.Lx + .1, .05, S.Dz + .1, mat(0x7e8a82), 0, -.025, 0, g);
  // druppels (één InstancedMesh: regen, doorzakken, capillair, vulbuis, overloop)
  const NDR = 96, drops = new THREE.InstancedMesh(sh.drop, new THREE.MeshBasicMaterial({ color: 0x6bb8f2 }), NDR); drops.frustumCulled = false; g.add(drops);
  const dd = []; for (let k = 0; k < NDR; k++) dd.push({ x: (r() - .5) * (S.Lx - .5), z: (r() - .5) * (S.Dz - .3), ph: r(), v: .7 + r() * .6 });
  g.userData = { S, layers, water, wMat, strips, roots, leafMats, tube, tcap, ovp, drops, dd, lvl };
  g.visible = false; return g;
}
const _dm = new THREE.Object3D();
/* p: {vis, ex, rain, seep, level, cap, up, fill, over}  (alles 0..1) */
function updateSection(sec, T, p) {
  const U = sec.userData, S = SEC; sec.visible = p.vis > .001; if (!sec.visible) return;
  sec.scale.setScalar(Math.max(.001, backOut(p.vis)));
  const ex = smooth(p.ex || 0);
  U.layers.plate.position.y = ex * .22; U.layers.sub.position.y = ex * .44; U.layers.plant.position.y = ex * .62;
  // water
  const wh = Math.max(.001, (S.maxW - .04) * (p.level || 0) + .02 * (p.level > 0 ? 1 : 0)); U.water.scale.y = wh; U.water.position.y = .06 + wh / 2;
  // stroken en buizen rekken mee met de uit-elkaar-getrokken lagen
  U.strips.forEach(st => { const y1 = st.userData.y1 + ex * .44, h = y1 - st.userData.y0; st.scale.y = h; st.position.y = st.userData.y0 + h / 2; st.material.color.setHex(0xefe6c8).lerp(new THREE.Color(0x9ec9ee), (p.cap || 0) * .75); });
  U.tube.scale.y = U.tube.userData.y1 + ex * .44 - U.tube.userData.y0; U.tube.position.y = U.tube.userData.y0 + U.tube.scale.y / 2; U.tcap.position.y = U.tube.userData.y1 + ex * .44 + .02;
  U.leafMats.forEach(m => { m.emissiveIntensity = (p.up || 0) * (.35 + .15 * Math.sin(T * 3)); });
  // druppels: 0-23 regen | 24-47 doorzakken | 48-71 capillair | 72-83 vulbuis | 84-95 overloop
  const dd = U.dd; let on = 0; const S2 = S;
  for (let k = 0; k < dd.length; k++) {
    const d = dd[k]; let a = 0, x = d.x, y = 0, z = d.z, sc = .04;
    const u = (T * d.v * .45 + d.ph) % 1;
    if (k < 24) { a = p.rain || 0; y = lerp(2.4 + ex * .62, S2.subTop + .05 + ex * .44, u); sc = .04; if (k >= 24 * a) a = 0; }
    else if (k < 48) { a = p.seep || 0; const kk = k - 24; if (kk >= 24 * a) a = 0; y = lerp(S2.subTop - .05 + ex * .44, .06 + S2.maxW * .35, u); x = d.x * .9; sc = .032; if (y < S2.plateY + .06 + ex * .22 && y > S2.plateY - .02 + ex * .22) { x = Math.round(x / .7) * .35 + (k % 2 ? .35 : 0); } z = .43; }
    else if (k < 72) { a = p.cap || 0; const kk = k - 48, si = kk % 4; if (kk >= 24 * a) a = 0; const st = U.strips[si]; x = st.userData.x + .0; z = .46; y = lerp(st.userData.y0 + .02, st.userData.y1 + ex * .44, ((T * .35 + kk * .09) % 1)); sc = .036; }
    else if (k < 84) { a = p.fill || 0; const kk = k - 72; if (kk >= 12 * a) a = 0; x = 1.35; z = .5; y = lerp(S2.subTop + .45 + ex * .44, .22, u); sc = .04; }
    else { a = p.over || 0; const kk = k - 84; if (kk >= 12 * a) a = 0; const uu = (T * .8 + kk * .13) % 1; x = -S2.Lx / 2 - .28 - uu * .08; z = -.1; y = (.06 + S2.maxW - .03) - uu * uu * (.06 + S2.maxW - .03) - 0; sc = .04; }
    _dm.position.set(x, y, z); _dm.scale.setScalar(a > 0 ? sc : .0001); _dm.updateMatrix(); U.drops.setMatrixAt(k, _dm.matrix);
  }
  U.drops.instanceMatrix.needsUpdate = true;
}
PF.buildSection = buildSection; PF.updateSection = updateSection; PF.SEC = SEC;

/* ---------- habitatbakken ---------- */
// type: 0 bloemen 1 kruiden & grassen 2 sedum 3 droog 4 vochtig 5 combinatie
const FL = [0x8a4fc0, 0x5a7fd6, 0xd96aa0, 0xf6f3e8, 0xf2b705];
function habitatModule(parent, type, inst, seed) {
  const H = CFG.habitat, r = rng(seed), g = new THREE.Group(), top = .36;
  const shell = mat(type === 3 ? 0xa9835a : 0xb48a5c, { roughness: .85 });
  box(H.L, top, H.D, shell, 0, top / 2, 0, g);
  const rimM = mat(0xcaa273, { roughness: .8 });
  box(H.L + .02, .05, .04, rimM, 0, top + .02, H.D / 2 - .02, g); box(H.L + .02, .05, .04, rimM, 0, top + .02, -H.D / 2 + .02, g);
  box(.04, .05, H.D - .02, rimM, H.L / 2 - .02, top + .02, 0, g); box(.04, .05, H.D - .02, rimM, -H.L / 2 + .02, top + .02, 0, g);
  const soilC = type === 3 ? 0xd8c391 : type === 4 ? 0x4a3a30 : COL.soil;
  const soil = box(H.L - .08, .02, H.D - .08, mat(soilC, { roughness: .95 }), 0, top + .005, 0, g); soil.castShadow = false;
  const tt = top + .016; // vlak van het substraat
  const put = (kind, x, y, z, sx, sy, sz, color, rot) => inst.add(kind, g, x, y, z, sx, sy, sz, color, rot);
  const greens = [0x4f8a5c, 0x6aa56a, 0x3c7450, 0x7fb06a, 0x8fb98a];
  if (type === 0) { for (let k = 0; k < 9; k++) { const x = -.4 + (k % 5) * .2 + (r() - .5) * .06, z = (Math.floor(k / 5) - .5) * .22 + (r() - .5) * .06, h = .16 + r() * .16;
      put('stem', x, tt + h / 2, z, 1, h, 1, 0x3c7450); put('flower', x, tt + h + .02, z, .05, .03, .05, FL[k % 5]); put('blob', x, tt + .05, z, .09, .05, .09, greens[k % 5]); } }
  else if (type === 1) { for (let k = 0; k < 16; k++) { const x = -.42 + r() * .84, z = (r() - .5) * .3, h = .16 + r() * .2; put('stem', x, tt + h / 2, z, 1.6, h, 1.6, greens[k % 5], [0, 0, (r() - .5) * .3]); }
    for (let k = 0; k < 6; k++) put('blob', -.4 + k * .16, tt + .035, (r() - .5) * .25, .08, .045, .08, k % 2 ? 0x8fa58a : 0x6aa56a); for (let k = 0; k < 4; k++) put('flower', -.3 + k * .2, tt + .13, (r() - .5) * .2, .028, .02, .028, 0xb98ad6); }
  else if (type === 2) { for (let k = 0; k < 12; k++) { const x = -.42 + (k % 6) * .168, z = (Math.floor(k / 6) - .5) * .22 + (r() - .5) * .04; put('blob', x, tt + .035, z, .07, .04, .07, k % 3 === 0 ? 0xc08a8a : greens[k % 5]); put('blob', x, tt + .062, z, .045, .025, .045, k % 3 === 0 ? 0xd7a3a3 : 0x9fc597); } }
  else if (type === 3) { const log = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .7, 10), mat(0x6d5238, { roughness: .95 })); log.rotation.z = Math.PI / 2; log.position.set(-.1, tt + .07, .06); log.castShadow = true; g.add(log);
    for (let k = 0; k < 7; k++) put('stem', .22 + k * .028, tt + .17, -.12 + (k % 2) * .06, 3.4, .34, 3.4, 0xc9b27a); }
  else if (type === 4) { for (let k = 0; k < 8; k++) { const x = -.4 + (k % 4) * .26, z = (Math.floor(k / 4) - .5) * .24; put('blob', x, tt + .14, z, .09, .13, .09, 0x4f9a63); put('blob', x + .04, tt + .26, z, .06, .07, .06, 0x6dba7a); }
    for (let k = 0; k < 3; k++) { put('stem', -.3 + k * .3, tt + .27, .1 - k * .08, 1.4, .54, 1.4, 0x5b8a56); put('flower', -.3 + k * .3, tt + .56, .1 - k * .08, .02, .1, .02, 0xb25ac8); }
    const sheen = new THREE.Mesh(new THREE.PlaneGeometry(H.L - .12, H.D - .12), new THREE.MeshBasicMaterial({ color: 0x5aa8d8, transparent: true, opacity: .28, depthWrite: false })); sheen.rotation.x = -Math.PI / 2; sheen.position.y = tt + .004; g.add(sheen); }
  else { for (let k = 0; k < 4; k++) { const x = -.4 + k * .1, z = (r() - .5) * .22, h = .15 + r() * .12; put('stem', x, tt + h / 2, z, 1, h, 1, 0x3c7450); put('flower', x, tt + h + .02, z, .045, .028, .045, FL[k % 5]); put('blob', x, tt + .045, z, .08, .045, .08, greens[k % 5]); }
    const nest = new THREE.Mesh(new THREE.BoxGeometry(.4, .22, .3), mat(0x9a7448, { roughness: .9 })); nest.position.set(.24, tt + .11, 0); nest.castShadow = true; g.add(nest);
    const holeG = new THREE.CircleGeometry(.018, 10), holeM = new THREE.MeshBasicMaterial({ color: 0x23180f });
    for (let a = 0; a < 3; a++) for (let b = 0; b < 4; b++) { const h = new THREE.Mesh(holeG, holeM); h.position.set(.1 + b * .09, tt + .05 + a * .06, .152); g.add(h); }
    for (let k = 0; k < 3; k++) put('stem', .02 + k * .03, tt + .13, -.1, 3, .26, 3, 0xc9b27a); }
  parent.add(g); return g;
}
function createHabitat(site, addCol) {
  const H = CFG.habitat, root = new THREE.Group(); site.add(root);
  const geo = { blob: shared().blob, flower: shared().flower, stem: shared().stem };
  const segs = [], mods = []; let seed = 5;
  CFG.habitatSegs.forEach((sg, si) => {
    const grp = new THREE.Group(); grp.position.set(sg[0], 0, sg[1]); root.add(grp); const modules = [];
    const lists = { blob: [], flower: [], stem: [] };
    const inst = { add(kind, g, x, y, z, sx, sy, sz, color, rot) { lists[kind].push({ g, x, y, z, sx, sy, sz, color, rot }); } };
    sg[2].forEach((type, k) => { const holder = new THREE.Group(); holder.position.set(0, 0, (1 - k) * H.L); holder.rotation.y = Math.PI / 2; grp.add(holder); const m = habitatModule(holder, type, inst, seed++); const glow = new THREE.Mesh(new THREE.BoxGeometry(H.L + .1, .86, H.D + .1), new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); glow.position.y = .3; glow.visible = false; glow.renderOrder = 3; holder.add(glow); modules.push({ type, holder, m, glow }); mods.push({ type, seg: si, k, x: sg[0], z: sg[1] + (k - 1) * H.L }); });
    // koppelplaatjes tussen de modules (ontwerpkeuze)
    [-.5, .5].forEach(o => box(H.D + .06, .05, .05, mat(0x5b6670, { metalness: .4, roughness: .5 }), 0, .2, o * H.L, grp));
    addCol(sg[0] - H.D / 2 - .1, sg[0] + H.D / 2 + .1, sg[1] - 1.55, sg[1] + 1.55, .45);
    grp.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(grp.matrixWorld).invert(), tmp = new THREE.Object3D(), col = new THREE.Color();
    Object.keys(lists).forEach(kind => { const L = lists[kind]; if (!L.length) return;
      const im = new THREE.InstancedMesh(geo[kind], shared().leafM, L.length); im.castShadow = true; im.frustumCulled = false;
      L.forEach((q, i) => { tmp.position.set(q.x, q.y, q.z); tmp.rotation.set(q.rot ? q.rot[0] : 0, 0, q.rot ? q.rot[2] : 0); tmp.scale.set(q.sx, q.sy, q.sz); tmp.updateMatrix();
        const m4 = new THREE.Matrix4().multiplyMatrices(inv, q.g.matrixWorld).multiply(tmp.matrix); im.setMatrixAt(i, m4); col.setHex(q.color); im.setColorAt(i, col); });
      grp.add(im); });
    segs.push({ grp, modules, x: sg[0], z: sg[1] });
  });
  return { root, segs, mods };
}
PF.createHabitat = createHabitat;
PF.habitatModule = habitatModule;
})(window);
/* ===== 05c · Gras, paden en insecten ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { COL, mat, box, canvasTex, rng, clamp, seg, smooth, easeOut, CFG, POFF, SITE } = PF;

/* Gras als ondergrond en paden van zand, grind of tegels volgen de plattegrond (globale ligging); breedtes en materiaal = ontwerpkeuze.
   Lagen krijgen vaste hoogtes + polygon-offset: geen z-fighting. */
function createGround(site) {
  const g = new THREE.Group(); site.add(g);
  const turfTex = canvasTex(512, 512, (c, w, h) => { const q = rng(12); c.fillStyle = '#6fae52'; c.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { const v = q(); c.fillStyle = v < .5 ? 'rgba(88,150,60,.55)' : 'rgba(130,190,92,.5)'; c.fillRect(q() * w, q() * h, 2 + q() * 3, 3 + q() * 5); } }, [SITE.L / 4, SITE.W / 4]);
  const turfMat = new THREE.MeshStandardMaterial({ map: turfTex, roughness: 1, transparent: true, opacity: 0, depthWrite: true }); POFF(turfMat, -2);
  const turfU = { uFront: { value: 1e3 }, uSoft: { value: 7 } }; // veegvoorkant (wereld-x) voor de inkom-animatie
  turfMat.onBeforeCompile = (sh) => { sh.uniforms.uFront = turfU.uFront; sh.uniforms.uSoft = turfU.uSoft;
    sh.vertexShader = 'varying float vWX;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vWX = (modelMatrix * vec4(transformed, 1.0)).x;');
    sh.fragmentShader = 'varying float vWX; uniform float uFront; uniform float uSoft;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', 'float gk = 1.0 - smoothstep(uFront - uSoft, uFront, vWX); float ge = gk * (1.0 - gk) * 4.0; gl_FragColor.rgb += ge * vec3(.10, .17, .03); gl_FragColor.a *= gk;\n#include <dithering_fragment>'); };
  const turf = new THREE.Mesh(new THREE.PlaneGeometry(SITE.L - .62, SITE.W - .62), turfMat); turf.rotation.x = -Math.PI / 2; turf.position.y = .012; turf.receiveShadow = true; turf.visible = false; g.add(turf);
  const pathTex = canvasTex(256, 256, (c, w, h) => { const q = rng(8); c.fillStyle = '#d9c9a3'; c.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { const v = 190 + q() * 45; c.fillStyle = `rgba(${v},${v - 14},${v - 40},.75)`; c.fillRect(q() * w, q() * h, 2 + q() * 3, 2 + q() * 3); } });
  const paths = [];
  const mk = (cx, cz, w, d, ax) => { // ax: 'x' = lang langs x
    const m = new THREE.MeshStandardMaterial({ map: pathTex.clone(), roughness: 1, transparent: true, opacity: 0 }); POFF(m, -3);
    m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping; m.map.repeat.set(w / 2.2, d / 2.2); m.map.needsUpdate = true;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); p.rotation.x = -Math.PI / 2; p.position.set(cx, .02, cz); p.receiveShadow = true; p.visible = false; p.userData = { ax, w, d }; g.add(p); paths.push(p); return p; };
  const M = CFG.mainPath, mw = M.z1 - M.z0;
  mk(0, (M.z0 + M.z1) / 2, M.x1 - M.x0, mw, 'x');
  const zc0 = M.z0, zc1 = -6.2; // dwarspaden: van het hoofdpad tot de overkant
  CFG.crossPaths.forEach(x => mk(x, (zc0 + zc1) / 2, CFG.path.w, zc0 - zc1, 'z'));
  CFG.stubs.forEach(x => mk(x, (M.z0 + 2.65) / 2 + .0, CFG.path.w + .4, M.z0 - 2.65, 'z'));
  const X0 = -SITE.L / 2, X1 = SITE.L / 2;
  return { group: g, turf, paths, reveal(uT, uP) {
    // gras: groeit als een zachte golf van het begin (links) naar het einde (rechts) van het terras
    const e = clamp(uT);
    turf.visible = uT > .001; turfMat.opacity = 1; turfMat.transparent = uT < .999; turfMat.depthWrite = true;
    turfU.uFront.value = uT >= .999 ? 1e3 : X0 - turfU.uSoft.value + e * (X1 - X0 + turfU.uSoft.value * 1.6);
    paths.forEach((p, i) => { const u = smooth(clamp((uP * 1.25 - (i === 0 ? 0 : .25 + i * .06)) / (i === 0 ? 1 : .6))); p.visible = u > .001; p.material.opacity = u; p.material.transparent = u < .999;
      if (p.userData.ax === 'x') { p.scale.set(Math.max(.001, u), 1, 1); p.position.x = -p.userData.w / 2 * (1 - Math.max(.001, u)); }
      else p.scale.set(1, Math.max(.001, u), 1); });
  } };
}
PF.createGround = createGround;

/* insecten (illustratief): bijen en vlinders rond de habitatbakken */
function createInsects(site, spots) {
  const root = new THREE.Group(); site.add(root); const r = rng(77), list = [];
  const beeG = new THREE.SphereGeometry(.03, 8, 6), beeM = new THREE.MeshBasicMaterial({ color: 0xf2b705 });
  const wingG = new THREE.PlaneGeometry(.1, .08); wingG.translate(.05, 0, 0);
  spots.forEach((s, si) => {
    for (let k = 0; k < 3; k++) {
      const butterfly = (k + si) % 2 === 0, o = new THREE.Group();
      if (butterfly) { const col = [0xffa34d, 0xf6f6f0, 0x9ab8ff][(k + si) % 3]; const wm = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
        const w1 = new THREE.Mesh(wingG, wm), w2 = new THREE.Mesh(wingG, wm); w2.scale.x = -1; o.add(w1, w2); o.userData.w = [w1, w2]; const b = new THREE.Mesh(new THREE.SphereGeometry(.014, 6, 4), new THREE.MeshBasicMaterial({ color: 0x33302c })); b.scale.set(.6, .6, 2.4); o.add(b); }
      else { o.add(new THREE.Mesh(beeG, beeM)); }
      o.userData.d = { cx: s[0] + (r() - .5) * .6, cy: .55 + r() * .5, cz: s[1] + (r() - .5) * 2.4, a: .25 + r() * .5, sp: .8 + r() * .8, ph: r() * 6.28, b: butterfly };
      o.visible = false; root.add(o); list.push(o);
    }
  });
  return { root, update(t, vis) { list.forEach((o, k) => { const d = o.userData.d; o.visible = vis > .01 && k < list.length * vis; if (!o.visible) return; const a = t * d.sp + d.ph;
    o.position.set(d.cx + Math.sin(a) * d.a * 1.4, d.cy + Math.sin(a * 2.1) * .12, d.cz + Math.sin(a * 2) * d.a * .9); if (d.b) { o.rotation.y = a + Math.PI / 2; const fl = Math.sin(t * 20 + k) * .9; o.userData.w[0].rotation.z = fl; o.userData.w[1].rotation.z = -fl; } }); } };
}
PF.createInsects = createInsects;
})(window);
/* ===== 06 · Stage-opbouw: wereld, pergola's, plantenbakken, habitatbakken, personages, tijdlijn, padberekening ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { BEATS, CFG, clamp, lerp, smooth, seg } = PF;

/* ---- tijdlijn: voorlopige timing uit tekstlengte (b.spk) tot het definitieve voice-over-bestand er is; dan geldt b.v ---- */
const LEAD = { 'S1.open': 3.2, 'S2.hitte': 1.2, 'S3.intro': 1.2, 'S4.intro': 1.2, 'S5.intro': 1.4, 'S6.totaal': 1.4, 'S7.leven': 1.2, 'S8.eerlijk': 1.2, 'S9.stappen': 1.2, 'S9.einde': .9 };
const TAIL = { 'S1.open': .5, 'S3.frame': .9, 'S3.bakken': .9, 'S3.zit': .8, 'S3.groot': 5.5, 'S4.plaats': 1.4, 'S4.w1': .9, 'S4.w2': .8, 'S4.w3': .8, 'S4.w4': 1.0, 'S5.intro': 1.0, 'S5.opbrengst': 1.6, 'S6.pergola': 3.2, 'S6.groen': 2.4, 'S6.plan': 1.0, 'S7.rood': 1.4, 'S9.totaal': 1.4, 'S9.einde': 3.6 };
function buildTimeline() {
  const start = [], dur = [], lead = [], spk = []; let t = 0;
  BEATS.forEach((b) => { const l = LEAD[b.key] != null ? LEAD[b.key] : .45; const sp = b.v ? Math.round((b.v[1] - b.v[0]) * 100) / 100 : b.spk; const tl = TAIL[b.key] != null ? TAIL[b.key] : .55;
    start.push(t); lead.push(l); spk.push(sp); dur.push(l + sp + tl); t += l + sp + tl; });
  return { start, dur, lead, spk, total: t };
}

/* ---- student-pad: knooppunten -> gladde pad-tabel (positie, snelheid, koers) ---- */
// nodes: [tijd, x, z, faceX?, faceZ?] oplopend in tijd
function buildTrack(nodes, total) {
  const HZ = 60, n = Math.ceil(total * HZ) + 2;
  // 1) booglengte s(t): constante snelheid per segment
  const segs = []; let S = 0; const s0 = [];
  for (let i = 0; i < nodes.length - 1; i++) { const a = nodes[i], b = nodes[i + 1]; const d = Math.hypot(b[1] - a[1], b[2] - a[2]); segs.push({ t0: a[0], t1: b[0], d, S0: S, a, b }); S += d; }
  const raw = new Float32Array(n); let si = 0;
  for (let k = 0; k < n; k++) { const t = k / HZ; while (si < segs.length - 1 && t > segs[si].t1) si++; const sg = segs[si]; if (!sg) { raw[k] = 0; continue; }
    if (t <= sg.t0) raw[k] = sg.S0; else if (t >= sg.t1) raw[k] = sg.S0 + sg.d; else raw[k] = sg.S0 + sg.d * (t - sg.t0) / (sg.t1 - sg.t0); }
  // 2) gladmaken (versnellen/vertragen): twee keer boxcar-filter van 0.7 s
  const W = Math.round(.7 * HZ); let cur = raw;
  for (let pass = 0; pass < 2; pass++) { const out = new Float32Array(n); for (let k = 0; k < n; k++) { let sum = 0, c = 0; for (let j = -W; j <= W; j++) { const q = Math.min(n - 1, Math.max(0, k + j)); sum += cur[q]; c++; } out[k] = sum / c; } cur = out; }
  const sArr = cur;
  // 3) polyline-positie bij s
  const cum = [0]; segs.forEach(sg => cum.push(cum[cum.length - 1] + sg.d));
  const posAt = s => { s = clamp(s, 0, cum[cum.length - 1]); let i = 0; while (i < segs.length - 1 && s > cum[i + 1]) i++; const sg = segs[i]; const u = sg.d > 1e-6 ? (s - cum[i]) / sg.d : 0; return [lerp(sg.a[1], sg.b[1], u), lerp(sg.a[2], sg.b[2], u), sg]; };
  // faceTarget bij stilstand: laatste knoop met face-waarde vóór t
  const faceAt = t => { let f = null; for (let i = 0; i < nodes.length; i++) { if (nodes[i][0] <= t + .001) { if (nodes[i][3] != null) f = [nodes[i][3], nodes[i][4]]; else if (nodes[i][3] === null) f = null; } else break; } return f; };
  const X = new Float32Array(n), Z = new Float32Array(n), SP = new Float32Array(n), HD = new Float32Array(n), SS = sArr;
  let hd = 0, inited = false;
  for (let k = 0; k < n; k++) {
    const p = posAt(sArr[k]); X[k] = p[0]; Z[k] = p[1];
    const sp = k > 0 ? (sArr[k] - sArr[k - 1]) * HZ : 0; SP[k] = k > 0 ? SP[k - 1] * .6 + sp * .4 : 0;
    let target = hd; const sg = p[2];
    if (SP[k] > .25 && sg && sg.d > .01) target = Math.atan2(sg.b[1] - sg.a[1], sg.b[2] - sg.a[2]);
    else { const f = faceAt(k / HZ); if (f) target = Math.atan2(f[0] - X[k], f[1] - Z[k]); else if (sg && sg.d > .01 && !inited) target = Math.atan2(sg.b[1] - sg.a[1], sg.b[2] - sg.a[2]); }
    if (!inited) { hd = target; inited = true; }
    const dA = PF.angDiff(hd, target); hd += dA * (1 - Math.exp(-(SP[k] > .25 ? 7 : 4.2) / HZ)); HD[k] = hd;
  }
  return { HZ, n, at(t) { const f = clamp(t * HZ, 0, n - 1.001), k = Math.floor(f), u = f - k; return { x: lerp(X[k], X[k + 1], u), z: lerp(Z[k], Z[k + 1], u), speed: lerp(SP[k], SP[k + 1], u), s: lerp(SS[k], SS[k + 1], u), h: PF.lerpAng(HD[k], HD[k + 1], u) }; } };
}


/* ---- exploded habitatmodule: bak + ondersteuning, drainage, lichtgewicht substraat, beplanting (HB dia 9: 'ontwerpmaat') ---- */
function buildHabExplode() {
  const g = new THREE.Group(), L = CFG.habitat.L, D = CFG.habitat.D; const lay = {};
  lay.bak = new THREE.Group(); lay.drain = new THREE.Group(); lay.sub = new THREE.Group(); lay.plant = new THREE.Group();
  PF.box(L, .1, D, PF.mat(0xb48a5c, { roughness: .85 }), 0, .05, 0, lay.bak);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(q => PF.box(.06, .22, .06, PF.mat(0x7f6a50), q[0] * (L / 2 - .08), -.11, q[1] * (D / 2 - .06), lay.bak));
  [[-1, 1], [1, 1]].forEach(q => PF.box(.05, .26, D, PF.mat(0xa9835a), q[0] * (L / 2 - .025), .13 + .05, 0, lay.bak));
  PF.box(L - .1, .07, D - .1, PF.mat(0x9aa2a7, { roughness: 1 }), 0, .035, 0, lay.drain);
  PF.box(L - .1, .12, D - .1, PF.mat(0x8a7766, { roughness: 1 }), 0, .06, 0, lay.sub);
  const r = PF.rng(4); [0x8a4fc0, 0x5a7fd6, 0xd96aa0, 0xf6f3e8, 0xf2b705].forEach((c, k) => { const x = -.36 + k * .18, h = .16 + r() * .1;
    const st = new THREE.Mesh(new THREE.CylinderGeometry(.006, .008, h, 5), PF.mat(0x3c7450)); st.position.set(x, h / 2, (r() - .5) * .18); lay.plant.add(st);
    const f = new THREE.Mesh(new THREE.IcosahedronGeometry(.04, 0), new THREE.MeshBasicMaterial({ color: c })); f.position.set(x, h + .02, st.position.z); lay.plant.add(f); });
  Object.values(lay).forEach(l => g.add(l)); g.userData = { lay }; g.visible = false; return g;
}
function updateHabExplode(g, vis, ex) {
  g.visible = vis > .001; if (!g.visible) return; g.scale.setScalar(Math.max(.001, PF.backOut(vis)) * 1.9);
  const e = smooth(ex), l = g.userData.lay; l.bak.position.y = 0; l.drain.position.y = .12 + e * .22; l.sub.position.y = .19 + e * .46; l.plant.position.y = .31 + e * .72;
}

/* ---- stage ---- */
function createStage(renderer, opt) {
  opt = opt || {};
  const world = PF.createWorld(), scene = world.scene, site = world.site;
  const cam = new THREE.PerspectiveCamera(40, 16 / 9, .1, 2000); scene.add(cam); PF.labelCam = cam;
  const sunSprite = PF.makeSun(); scene.add(sunSprite);

  // pergola's: plek volgt de plattegrond; aantal modules en afmetingen = ontwerpkeuze
  const bigAlt = (i, j) => (i === 0 || i === 3) ? { x: (i === 0 ? .5 : -.5), z: j ? -.3 : .3, r: Math.PI / 2 } : { x: 0, z: j ? .45 : -.45, r: 0 };
  const mkBig = (c, seed, split) => PF.createPergola(world, { nx: c.nx, nz: c.nz, cx: c.cx, cz: c.cz, seed, skipInterior: true, split, sensors: [[2, 0], [0, 1]], furn: (i, j) => [{ k: 'table', x: 0, z: 0, r: 0, alt: bigAlt(i, j) }] });
  const bigA = mkBig(CFG.big[0], 5, true), bigB = mkBig(CFG.big[1], 6, false);
  const mkSmall = (c, seed) => PF.createPergola(world, { nx: c.nx, nz: c.nz, cx: c.cx, cz: c.cz, seed, stagger: .12, sensors: [], furn: () => [] });
  const small1 = mkSmall(CFG.small[0], 11), small2 = mkSmall(CFG.small[1], 12);

  // zelfwatergevende plantenbakken met bankje
  const planters = CFG.planters.map((q, k) => { const g = PF.buildPlanter(q[2], 30 + k); g.position.set(q[0], 0, q[1]); g.scale.set(.001, .001, .001); g.visible = false; site.add(g);
    const P = CFG.planter, B = CFG.bench; const x0 = q[0] - (P.W / 2 + B.D), x1 = q[0] + (P.W / 2 + B.D); world.addCol(x0, x1, q[1] - P.L / 2, q[1] + P.L / 2, P.H); return { g, x: q[0], z: q[1], side: q[2] }; });
  const habitat = PF.createHabitat(site, world.addCol); habitat.segs.forEach(s => { s.grp.scale.set(1, .001, 1); s.grp.visible = false; });
  const ground = PF.createGround(site);
  const insects = PF.createInsects(site, CFG.habitatSegs.slice(0, 3).map(s => [s[0], s[1]]).concat([[CFG.habitatSegs[3][0], CFG.habitatSegs[3][1]], [CFG.habitatSegs[5][0], CFG.habitatSegs[5][1]]]));
  // doorsnede-model (waterkringloop) en exploded habitatmodule: staan als 'maquette' naast het pad
  // lichtschakelaar-paaltje (verkenmodus): schakelt tussen dag en nacht, zodat de rode lampjes zichtbaar worden
  const lightSw = (() => {
    const g = new THREE.Group(); g.position.set(-35.4, 0, 3.95); site.add(g);
    const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .6, metalness: .3 }, o || {}));
    const bx = (w, h, d, m, x, y, z, par) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; (par || g).add(o); return o; };
    bx(.34, .06, .34, M(0x9aa39d, { metalness: 0, roughness: .9 }), 0, .03, 0);
    bx(.09, 1.5, .09, M(0x5b6670), 0, .81, 0);
    bx(.3, .42, .1, M(0x2f3a42), 0, 1.22, .1);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(.042, 16, 12), new THREE.MeshBasicMaterial({ color: 0xf2b705 })); sun.position.set(0, 1.34, .155); g.add(sun);
    const moon = new THREE.Mesh(new THREE.SphereGeometry(.042, 16, 12), new THREE.MeshBasicMaterial({ color: 0x7d8bc0 })); moon.position.set(0, 1.1, .155); g.add(moon);
    const lever = new THREE.Group(); lever.position.set(0, 1.22, .16); g.add(lever);
    bx(.045, .15, .045, M(0xe9e3d3, { metalness: 0 }), 0, 0, 0, lever); const knob = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 10), new THREE.MeshStandardMaterial({ color: 0xe9503a, roughness: .5 })); knob.position.y = .085; lever.add(knob);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(.7, .9, .6), new THREE.MeshBasicMaterial({ visible: false })); hit.position.set(0, 1.2, .1); hit.userData.switchHit = true; g.add(hit);
    const label = PF.makeLabel({ text: 'Dag of nacht', sub: 'zet het licht aan of uit', h: .38, accent: '#f2b705' }); label.position.set(-35.4, 1.95, 3.95); site.add(label); label.visible = false;
    world.addCol(-35.6, -35.2, 3.75, 4.15, 1.6);
    return { g, lever, sun, moon, hit, label, pos: [-35.4, 1.22, 4.05] };
  })();
  const section = PF.buildSection(); section.position.set(1.4, .06, 1.9); site.add(section); world.addCol(-.2, 3.0, 1.4, 2.4, 1.5);
  const habX = buildHabExplode(); habX.position.set(-19.8, .06, 5.35); habX.rotation.y = 0; site.add(habX);
  // plattegrond-voetafdrukken (kleuren volgen de legenda van de plattegrond)
  const plan = new THREE.Group(); site.add(plan); plan.visible = false; const planMats = {};
  const fp = (cx, cz, w, d, color, key) => { const m = planMats[key] || (planMats[key] = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false })); POFFx(m); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); p.rotation.x = -Math.PI / 2; p.position.set(cx, .05, cz); p.renderOrder = 1; plan.add(p); return p; };
  function POFFx(m) { m.polygonOffset = true; m.polygonOffsetFactor = -6; m.polygonOffsetUnits = -6; }
  CFG.big.concat(CFG.small).forEach(c => fp(c.cx, c.cz, c.nx * CFG.module.W, c.nz * CFG.module.D, 0x35d0c0, 'pergola'));
  CFG.planters.forEach(q => fp(q[0], q[1], CFG.planter.W + 2 * CFG.bench.D, CFG.planter.L, 0x2f7a2f, 'planter'));
  CFG.habitatSegs.forEach(s => fp(s[0], s[1], CFG.habitat.D + .1, CFG.habitat.L * 3 + .1, 0x2a5aa0, 'habitat'));
  PF.planMats = planMats;

  // gids (de student) + extra's
  const guide = PF.createStudent({ hoodie: 0xe0a526, hair: 0x4b3426, seed: 1 }); guide.root.visible = false; site.add(guide.root);
  const extras = [];
  const mk = (o) => { const s = PF.createStudent(Object.assign({ lite: true }, o)); s.root.visible = false; site.add(s.root); return s; };
  const palette = [[0x3f7d6e, 0x2a2a2a], [0xc65d4a, 0x7a5a2f], [0x5b7fb5, 0x1f1a17], [0xe7e0d2, 0x5c3b25], [0x8a6fb0, 0x3a2a20], [0x6c8f4d, 0x8a6a3a], [0xd18a3b, 0x1f1a17], [0x51657a, 0x6b4a2a], [0xb55a7a, 0x2d2118], [0x40908f, 0x7c5b36]];
  // ambient (vanaf scène 7): zittend op de bankjes, pratend, wandelend over het hoofdpad
  const bp = (k) => { const q = CFG.planters[k]; return { x: q[0] + q[2] * (CFG.planter.W / 2 + CFG.bench.D / 2 + .02), z: q[1], h: q[2] > 0 ? Math.PI / 2 : -Math.PI / 2 }; };
  const amb = [
    Object.assign({ role: 'sit', pal: 0, pose: 'type', dz: .5 }, bp(0)), Object.assign({ role: 'sit', pal: 1, pose: 'sit', dz: -.5 }, bp(0)),
    Object.assign({ role: 'sit', pal: 5, pose: 'sit', dz: 0 }, bp(5)), Object.assign({ role: 'sit', pal: 6, pose: 'type', dz: .4 }, bp(6)),
    { role: 'talkA', x: -4.2, z: -.3, h: 1.3, pal: 2 }, { role: 'talkB', x: -3.0, z: .0, h: -1.8, pal: 3 },
    { role: 'walk', pal: 4 }
  ];
  amb.forEach(a => { if (a.dz != null) a.z += a.dz; const p = palette[a.pal]; const s = mk({ hoodie: p[0], hair: p[1], seed: a.pal * 3 + 1 }); a.s = s; extras.push(a); });
  // klas (scène 7): zitplaatsen aan de tafels van de grote pergola A
  const klas = []; const seats = [[0, 0, 1, -.5], [0, 0, 1, .5], [1, 0, -1, -.4], [1, 0, -1, .5], [1, 1, 1, 0], [2, 1, -1, -.5], [2, 1, -1, .4], [2, 0, 1, .2], [3, 0, -1, .4], [3, 1, 1, -.3]];
  seats.forEach((q, idx) => { const p = palette[(idx + 2) % palette.length]; const s = mk({ hoodie: p[0], hair: p[1], seed: idx + 7 }); klas.push({ s, i: q[0], j: q[1], side: q[2], ox: q[3], pose: idx % 3 === 1 ? 'type' : 'sit' }); });
  const teacher = mk({ hoodie: 0x2f4c5e, hair: 0x8a8a8a, jeans: 0x3d3a36, seed: 40, lite: false }); teacher.root.visible = false;

  const tl = buildTimeline();
  const IDX = PF.BEAT_IDX;
  return { THREE, world, scene, cam, renderer, sunSprite, bigA, bigB, small1, small2, planters, habitat, ground, insects, section, lightSw, habX, plan, guide, extras, klas, teacher, tl, track: null, opt, IDX,
    big: bigA, small: small1, cue: { asm1: 0, asm2: 0 },
    K: (key) => IDX[key],
    B: (i, f) => tl.start[i] + tl.dur[i] * (f == null ? 0 : f),
    S: (i, f) => tl.start[i] + tl.lead[i] + tl.spk[i] * (f == null ? 0 : f),
    beatAt(T) { let i = tl.start.length - 1; while (i > 0 && T < tl.start[i]) i--; return i; } };
}
PF.createStage = createStage; PF.buildTrack = buildTrack; PF.buildTimeline = buildTimeline; PF.updateHabExplode = updateHabExplode;
})(window);
/* ===== 07 · Regie: camera, student, labels en effecten per beat (negen scènes) ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { clamp, lerp, smooth, smoother, easeOut, easeInOut, backOut, seg, BEATS, CFG, HAB_NAMES } = PF;
const L3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const win = (f, f0, f1, r) => { r = r || .07; return smooth(seg(f, f0, f0 + r)) * (1 - smooth(seg(f, f1 - r, f1))); };
const orb = (cx, cz, r, a) => [cx + Math.sin(a) * r, cz + Math.cos(a) * r];
const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);

// vaste punten (alle posities volgen de plattegrond; zie CFG)
const A0 = [-39.6, -2.75];                 // eerste module (proef) van grote pergola A
const BA = [CFG.big[0].cx, CFG.big[0].cz], BB = [CFG.big[1].cx, CFG.big[1].cz];
const SECP = [1.4, .06, 1.9], HABP = [-19.8, .06, 5.35], SAMPLE = { x: -28.6, z: 5.0 };
const ROWZ = [3.38, 2.38, 1.38, -.22, -1.22, -2.22];          // middens van de zes modules in lint A (types 0..5)
const EXPLORE = { pos: [-40.6, 1.7, 5.6], look: [-8, 1.9, 0.8] };
const _gbb = new THREE.Box3();
const PZ = 6.1;                                               // looplijn van de student op het hoofdpad

/* ---- student-pad: per beat een lijst [f, x, z, faceX?, faceZ?]; ontbreekt een beat, dan blijft hij staan ---- */
const STU = {
  'S1.open': [[0, -44.4, PZ], [.55, -44.4, PZ], [.95, -39.8, PZ]],
  'S1.terras': [[.7, -36.8, PZ, -34, -1]],
  'S2.hitte': [[.5, -33.5, PZ, -33, 0]],
  'S2.dak': [[.4, -31.4, PZ, SAMPLE.x, SAMPLE.z]],
  'S2.systeem': [[.4, -31.4, PZ, null]],
  'S3.intro': [[.5, -37.4, 3.7, A0[0], A0[1]]],
  'S3.zit': [[.3, -39.9, -1.0, A0[0], A0[1]], [.7, -40.0, -1.6, A0[0], A0[1]]],
  'S3.groot': [[.1, -39.9, -1.0], [.3, -39.9, 3.7, A0[0], A0[1]]],
  'S4.intro': [[.15, -33, PZ, -14, 1.9], [.95, -16, PZ, -14.15, 1.9]],
  'S4.plaats': [[.35, -10.3, PZ - .4, -10.3, 1.5], [.8, -9.2, 4.2, -10.3, 1.0]],
  'S4.w1': [[.6, -3.0, PZ, SECP[0], SECP[2]]],
  'S5.intro': [[.15, -9.2, PZ + .1], [.65, -17.8, PZ + .1, HABP[0], HABP[2]], [.9, -17.8, 5.3, -19.8, 3.4]],
  'S5.bloemen': [[.15, -17.8, ROWZ[0] + .2, -19.8, ROWZ[0]]],
  'S5.kruiden': [[.2, -17.8, ROWZ[1] + .2, -19.8, ROWZ[1]]],
  'S5.sedum': [[.2, -17.8, ROWZ[2] + .2, -19.8, ROWZ[2]]],
  'S5.droog': [[.25, -17.8, ROWZ[3] + .2, -19.8, ROWZ[3]]],
  'S5.vochtig': [[.25, -17.8, ROWZ[4] + .2, -19.8, ROWZ[4]]],
  'S5.combi': [[.25, -17.8, ROWZ[5] + .2, -19.8, ROWZ[5]]],
  'S5.variatie': [[.5, -17.8, -3.6, null]],
  'S5.opbrengst': [[.4, -17.8, -3.6]],
  'S6.totaal': [[.7, -18.5, PZ, null]],
  'S6.relatie': [[.2, -16, PZ], [.9, -9.0, 5.6, -8, .5]],
  'S7.leven': [[.15, -9.0, 5.6], [.9, -4.8, 5.4, -5, 2]],
  'S7.les': [[.55, -24.6, 3.7, -30, -1]],
  'S7.habitat': [[.1, -24.6, 3.7], [.45, -22.4, .58], [.8, -17.8, .58, -19.8, .4]],
  'S7.welzijn': [[.3, -17.8, .9, null]],
  'S7.sensor': [[.6, -29.5, 3.7, -32, 0]],
  'S8.eerlijk': [[.1, -29.5, 3.7], [.95, -22, 5.2]],
  'S8.gewicht': [[.25, -3.0, PZ, SECP[0], SECP[2]]],
  'S8.plaats': [[.5, -9.2, PZ, null]],
  'S9.stappen': [[.1, -9.2, PZ], [.9, -26, PZ]],
  'S9.totaal': [[.8, -38, PZ]],
  'S9.einde': [[.3, -40.6, 5.6, null], [.5, -40.6, 5.6]]
};
function nodes(ST) {
  const out = []; let cur = [-44.4, PZ]; let faceSet = false;
  BEATS.forEach((b, i) => {
    const spec = STU[b.key] || [];
    const t0 = ST.B(i, 0);
    if (!spec.length || spec[0][0] > 0) out.push([t0, cur[0], cur[1]]);
    spec.forEach(q => { const n = [ST.B(i, q[0]), q[1], q[2]]; if (q.length > 3) { n.push(q[3], q[4]); } out.push(n); cur = [q[1], q[2]]; });
    if (!spec.length) out.push([ST.B(i, 1) - .001, cur[0], cur[1]]);
  });
  out.push([ST.tl.total + 700, cur[0], cur[1]]);
  // tijden strikt oplopend maken
  out.sort((a, b) => a[0] - b[0]); for (let k = 1; k < out.length; k++) if (out[k][0] <= out[k - 1][0]) out[k][0] = out[k - 1][0] + .002;
  return out;
}

/* ---- labels: één tegelijk (venster per beat; uitfaden vóór het einde van de beat) ----
   [beat, f0, f1, spec]. spec: text, sub, badge, pos, h, accent | big: {num,label,src,hl} */
const LAB = [];
const lab = (key, f0, f1, o) => LAB.push(Object.assign({ key, f0, f1 }, o));
lab('S1.terras', .4, .95, { text: 'Terras boven de fietsenstalling', sub: 'HAN Nijmegen · projectzone 14 × 90 m', pos: [-30, 2.4, 6.4], h: .7 });
lab('S1.opdracht', .12, .5, { text: 'Biodiversiteit', pos: [-33, 3.0, 4.2], h: .75, accent: '#6bbf6a' });
lab('S1.opdracht', .55, .95, { text: 'Sociale ruimte voor studenten', pos: [-33, 3.0, 4.2], h: .75, accent: '#f2b705' });
lab('S1.preview', .12, .38, { text: 'Pergola met zonnepanelen', pos: [BA[0], 3.6, BA[1]], h: .9, accent: '#35d0c0' });
lab('S1.preview', .42, .66, { text: 'Zelfwatergevende plantenbakken', pos: [-10.3, 3.0, 0], h: .9, accent: '#2f7a2f' });
lab('S1.preview', .7, .95, { text: 'Habitatbakken', pos: [-19.8, 2.4, -1.2], h: .9, accent: '#2a5aa0' });
lab('S2.hitte', .12, .5, { text: 'Veel bestrating', pos: [-31, 2.0, 2.0], h: .7, accent: '#e9503a' });
lab('S2.hitte', .55, .95, { text: 'Warmt op warme dagen sterk op', pos: [-31, 2.0, 2.0], h: .7, accent: '#e9503a' });
lab('S2.dak', .12, .38, { text: 'Draagkracht', sub: 'Wat kan het dak dragen?', pos: [SAMPLE.x - 1.2, 3.5, SAMPLE.z], h: .66, accent: '#e9503a' });
lab('S2.dak', .4, .66, { text: 'Waterdichting', sub: 'Het dak moet dicht blijven', pos: [SAMPLE.x, 1.7, SAMPLE.z], h: .66, accent: '#e9503a' });
lab('S2.dak', .68, .94, { text: 'Waterafvoer', sub: 'Regenwater moet weg', pos: [SAMPLE.x + 1.5, 1.0, SAMPLE.z], h: .66, accent: '#e9503a' });
lab('S2.licht', .08, .28, { text: 'Licht', pos: [SAMPLE.x, 2.6, 5.4], h: .6, accent: '#e9a400' });
lab('S2.licht', .3, .5, { text: 'Modulair', pos: [SAMPLE.x, 2.6, 5.4], h: .6, accent: '#e9a400' });
lab('S2.licht', .52, .97, { text: 'Niet verankerd in het dak', pos: [SAMPLE.x, 2.6, 5.4], h: .6, accent: '#e9a400' });
lab('S2.systeem', .08, .4, { text: 'Bijenhotel: één voorziening', pos: [-31.4, 3.2, 5.0], h: .7 });
lab('S2.systeem', .45, .97, { text: 'Wij zochten een systeem', sub: 'energie · groen · onderwijs', pos: [-31.4, 3.2, 5.0], h: .7, accent: '#6bbf6a' });
lab('S2.ambitie', .05, .97, { text: 'Schaduw · energie · biodiversiteit · ontmoeting', pos: [-33, 3.4, 3.6], h: .66 });
lab('S3.intro', .3, .92, { text: 'De zon-groene pergola', sub: 'open overkapping van losse modules', pos: [A0[0], 3.9, A0[1]], h: .7, accent: '#35d0c0' });
lab('S3.frame', .3, .95, { text: 'Frame met zonnepanelen als dak', pos: [A0[0], 4.4, A0[1]], h: .7 });
lab('S3.bakken', .2, .95, { text: 'Klimplanten in plantenbakken', sub: 'langs de zijkanten van de module', pos: [-41.8, 3.0, -4.6], h: .7 });
lab('S3.zit', .2, .95, { text: 'Zit- en leerplek', sub: 'laadpunt voor laptop en telefoon · kleine accu', pos: [A0[0], 2.2, A0[1]], h: .66 });
lab('S3.f1', .1, .95, { text: 'Stroom opwekken', badge: 1, pos: [A0[0], 4.2, A0[1]], h: .7 });
lab('S3.f2', .08, .45, { text: 'Schaduw en koeling', badge: 2, pos: [A0[0], 4.2, A0[1]], h: .7 });
lab('S3.f2', .5, .97, { big: { num: 'tot 8 °C', label: 'koeler onder de Leaf in Groningen', src: 'bestaand voorbeeld · hier nog te meten', hl: '#7fbf7a' }, pos: [A0[0], 3.5, A0[1]], h: 1.15 });
lab('S3.sydney', .1, .5, { big: { num: '+11,1%', label: 'stroom t.o.v. een gewoon dak', src: 'UTS Sydney · bestaand voorbeeld', hl: '#f2b705' }, pos: [A0[0], 3.5, A0[1]], h: 1.15 });
lab('S3.sydney', .54, .97, { big: { num: '1.300 m²', label: 'groen dak onder 319 panelen', src: 'veel groter dan hier · geen bewijs voor dit dak', hl: '#7fbf7a' }, pos: [A0[0], 3.5, A0[1]], h: 1.15 });
lab('S3.f3', .1, .55, { text: 'Groen en leefgebied', badge: 3, pos: [A0[0], 4.2, A0[1]], h: .7 });
lab('S3.f3', .58, .97, { text: 'Een pergola alleen is nog geen leefgebied', sub: 'combineren met bloemrijke beplanting en dood hout', pos: [A0[0], 4.2, A0[1]], h: .7, accent: '#6bbf6a' });
lab('S3.f4', .1, .95, { text: 'Leren en verblijven', badge: 4, pos: [A0[0], 4.2, A0[1]], h: .7 });
lab('S3.groot', .06, .46, { text: 'Modules aan elkaar rijgen', pos: [A0[0] + 1.5, 4.6, A0[1]], h: .8 });
lab('S3.groot', .52, .97, { text: 'Stap 1: proef met één module', sub: 'meten: schaduw, temperatuur en gebruik', pos: [A0[0], 4.6, A0[1]], h: .9, accent: '#e9a400' });
lab('S4.intro', .1, .6, { text: 'Zelfwatergevende plantenbak', sub: 'met eigen waterreservoir', pos: [-14.15, 1.8, 1.88], h: .66, accent: '#2f7a2f' });
lab('S4.intro', .66, .97, { text: 'Bankje aan beide kanten', sub: 'ontwerpkeuze in dit model · optioneel volgens presentatie', pos: [-13.4, 1.0, 1.88], h: .6 });
lab('S4.plaats', .45, .95, { text: 'Plaatsing: nog te onderzoeken', sub: 'het dak bepaalt wat kan', pos: [-2, 3.2, 1], h: .9, accent: '#e9a400' });
const SX = SECP[0];
lab('S4.w1', .06, .32, { text: 'Regen of bijvullen', badge: 1, pos: [SX, 2.15, SECP[2]], h: .55, accent: '#4aa0e0' });
lab('S4.w1', .37, .63, { text: 'Water zakt door het substraat', badge: 2, pos: [SX, 1.85, SECP[2]], h: .55, accent: '#4aa0e0' });
lab('S4.w1', .68, .95, { text: 'Het reservoir vult zich', badge: 3, pos: [SX, .95, SECP[2]], h: .55, accent: '#4aa0e0' });
lab('S4.w2', .1, .92, { text: 'Draagplaat boven het hoogste waterniveau', sub: 'zo blijft er ruimte voor lucht', badge: 4, pos: [SX, 1.35, SECP[2]], h: .62, accent: '#4aa0e0' });
lab('S4.w3', .1, .92, { text: 'Capillaire stroken', sub: 'water omhoog naar de wortelzone · zonder pomp', badge: 5, pos: [SX, 1.95, SECP[2]], h: .62, accent: '#4aa0e0' });
lab('S4.w4', .1, .92, { text: 'Vulbuis en overloop', sub: 'controleren en bijvullen · overtollig water gaat weg', badge: 6, pos: [SX, 1.95, SECP[2]], h: .62, accent: '#4aa0e0' });
lab('S4.bestaat', .1, .5, { text: 'Boxmeer · Raadhuisplein', sub: 'bestaand voorbeeld', pos: [SX, 2.6, SECP[2]], h: .62 });
lab('S4.bestaat', .55, .95, { text: 'The Waterbench', sub: 'bestaand voorbeeld', pos: [SX, 2.6, SECP[2]], h: .62 });
lab('S4.nuance', .08, .45, { text: 'Geen bewijs voor dit dak', sub: 'toepassing op het HAN-dak vraagt een aparte beoordeling', pos: [SX, 2.6, SECP[2]], h: .66, accent: '#e9503a' });
lab('S4.nuance', .5, .95, { text: 'Bijvullen bij droogte nodig', sub: 'hoe lang de voorraad meegaat: nog testen', pos: [SX, 2.6, SECP[2]], h: .66, accent: '#e9a400' });
lab('S5.intro', .1, .3, { text: 'Beplanting', pos: [HABP[0], 2.45, HABP[2]], h: .5, accent: '#2a5aa0' });
lab('S5.intro', .33, .53, { text: 'Lichtgewicht substraat', pos: [HABP[0], 1.75, HABP[2]], h: .5, accent: '#2a5aa0' });
lab('S5.intro', .56, .74, { text: 'Drainage', pos: [HABP[0], 1.05, HABP[2]], h: .5, accent: '#2a5aa0' });
lab('S5.intro', .77, .96, { text: 'Bak + ondersteuning', pos: [HABP[0], .55, HABP[2]], h: .5, accent: '#2a5aa0' });
const HSUB = ['knoopkruid · beemdkroon · grasklokje', 'wilde tijm · gewone rolklaver · wilde marjolein', 'droogtetolerante vetplanten', 'zand · dood hout · holle stengels', 'watermunt · kattenstaart', 'bloemen + nestholtes in een apart deel'];
['bloemen', 'kruiden', 'sedum', 'droog', 'vochtig', 'combi'].forEach((c, k) => lab('S5.' + c, .15, .95, { text: HAB_NAMES[k], sub: HSUB[k], pos: [-19.8, .95, ROWZ[k]], h: .5, accent: '#2a5aa0' }));
lab('S5.variatie', .08, .95, { text: 'Zes typen, bewust gevarieerd', sub: 'vroege, midden- en late bloeiers · stengels laten overwinteren · geen gif', pos: [-19.8, 2.0, -1.2], h: .7, accent: '#2a5aa0' });
lab('S5.opbrengst', .08, .3, { text: 'Voedsel', sub: 'nectar en pollen', pos: [-1.17, 1.4, -1], h: .8, accent: '#f2b705' });
lab('S5.opbrengst', .33, .53, { text: 'Beschutting', sub: 'schuilplekken', pos: [-1.17, 1.4, -1], h: .8, accent: '#6bbf6a' });
lab('S5.opbrengst', .56, .76, { text: 'Voortplanting', sub: 'nestgelegenheid', pos: [-1.17, 1.4, -1], h: .8, accent: '#d96aa0' });
lab('S5.opbrengst', .79, .97, { text: 'Wateropvang', sub: 'enige, naast een groenere campus', pos: [-1.17, 1.4, -1], h: .8, accent: '#4aa0e0' });
lab('S6.totaal', .25, .92, { text: 'Het hele terras', sub: '14 × 90 meter', pos: [0, 5, 0], h: 1.6 });
lab('S6.pergola', .4, .95, { text: 'Twee grote en twee kleine pergola’s', pos: [0, 6, 0], h: 1.5, accent: '#35d0c0' });
lab('S6.groen', .06, .3, { text: 'Plantenbakken met bankjes', pos: [-8, 3, -1], h: 1.1, accent: '#2f7a2f' });
lab('S6.groen', .33, .56, { text: 'Linten met habitatbakken', pos: [-1.17, 2.4, 0], h: 1.1, accent: '#2a5aa0' });
lab('S6.groen', .6, .96, { text: 'Gras en paden', sub: 'zand, grind of tegels', pos: [20, 2.4, 5.4], h: 1.1, accent: '#7fbf7a' });
lab('S6.plan', .08, .25, { text: 'Pergola', pos: [8.3, 2, -3.74], h: 2.0, accent: '#35d0c0' });
lab('S6.plan', .28, .45, { text: 'Zelfwatergevende plantenbak met bankjes', pos: [-10.3, 2, -1.2], h: 2.0, accent: '#2f7a2f' });
lab('S6.plan', .48, .64, { text: 'Habitatbakken', pos: [-19.8, 2, -1.2], h: 2.0, accent: '#2a5aa0' });
lab('S6.plan', .67, .82, { text: 'Paden', sub: 'zand, grind of tegels', pos: [20, 2, 5.4], h: 2.0, accent: '#c8553d' });
lab('S6.plan', .85, .98, { text: 'Gras als ondergrond', sub: 'op het dak nog niet getoetst', pos: [30, 2, -5.6], h: 2.0, accent: '#7fbf7a' });
lab('S6.relatie', .2, .92, { text: 'Pergola, groen en verblijf: één plek', sub: 'boven de fietsenstalling', pos: [-8, 3.0, .5], h: .8, accent: '#e9a400' });
lab('S7.leven', .15, .5, { text: 'Pauzeplek', sub: 'bankjes bij de plantenbakken', pos: [-6.5, 2.0, 1.9], h: .66 });
lab('S7.leven', .55, .95, { text: 'Studieplek', sub: 'in de schaduw van de pergola', pos: [-10.3, 3.6, 1.6], h: .66 });
lab('S7.les', .15, .95, { text: 'Buitenlokaal', sub: 'uitleg · groepswerk · zelfstandig studeren', pos: [BA[0], 4.2, BA[1]], h: .9, accent: '#35d0c0' });
lab('S7.habitat', .15, .95, { text: 'Buitenonderwijs en onderzoek', sub: 'insecten kijken · BioBlitz van de HAN', pos: [-19.8, 1.15, .4], h: .5, accent: '#2a5aa0' });
lab('S7.welzijn', .08, .45, { text: 'Een groene werkplek kan prettiger aanvoelen', pos: [-12, 3.2, 1], h: .7 });
lab('S7.welzijn', .5, .95, { text: 'Let op hinder', sub: 'insecten · pollen · warmte · looproutes vrij houden', pos: [-12, 3.2, 1], h: .7, accent: '#e9a400' });
lab('S7.rood', .1, .95, { text: 'Rood licht: nog te verifiëren', sub: 'minder verstorend voor vleermuizen dan wit · niet onschadelijk', pos: [BA[0], 4.3, BA[1]], h: .8, accent: '#e9503a' });
lab('S8.eerlijk', .1, .95, { big: { num: 'Concept', label: 'nog niet getoetst op draagkracht, kosten en beheer', hl: '#e9a400' }, pos: [-12, 3.2, 1], h: 2.0 });
lab('S8.gewicht', .05, .22, { text: 'Bak', pos: [SX, .5, SECP[2]], h: .55, accent: '#e9503a' });
lab('S8.gewicht', .24, .42, { text: 'Verzadigd substraat', pos: [SX, 1.0, SECP[2]], h: .55, accent: '#e9503a' });
lab('S8.gewicht', .44, .6, { text: 'Planten', pos: [SX, 1.8, SECP[2]], h: .55, accent: '#e9503a' });
lab('S8.gewicht', .62, .78, { text: 'Opgeslagen water', pos: [SX, .5, SECP[2]], h: .55, accent: '#e9503a' });
lab('S8.gewicht', .8, .97, { text: '+ bank en gebruikers', sub: 'dakgegevens ontbreken nog', pos: [SX, 2.6, SECP[2]], h: .6, accent: '#e9503a' });
lab('S8.plaats', .08, .45, { text: 'Constructeur en dakexpert', sub: 'beoordelen waar bakken veilig staan', pos: [-9, 3.4, 1], h: .85, accent: '#e9a400' });
lab('S8.plaats', .5, .95, { text: 'Wind en kantelrisico', sub: 'de constructie moet stabiel blijven bij storm · nog te toetsen', pos: [-9, 3.4, 1], h: .85, accent: '#e9a400' });
lab('S8.dak', .1, .5, { text: 'Dakbedekking en afvoeren', sub: 'beschermd en bereikbaar houden', pos: [-9, 3.4, 1], h: .85, accent: '#e9a400' });
lab('S8.dak', .54, .95, { text: 'Looproutes en toegankelijkheid', pos: [-9, 3.4, 1], h: .85, accent: '#e9a400' });
lab('S8.onderhoud', .06, .32, { text: 'Wekelijks vocht controleren', sub: 'in warme periodes', pos: [-1.2, 2.2, -1], h: .85, accent: '#6bbf6a' });
lab('S8.onderhoud', .35, .62, { text: 'Per seizoen', sub: 'bloei, afval, drainage, ongewenste groei', pos: [-1.2, 2.2, -1], h: .85, accent: '#6bbf6a' });
lab('S8.onderhoud', .65, .9, { text: 'Jaarlijks', sub: 'planten vervangen, bevestigingen nakijken', pos: [-1.2, 2.2, -1], h: .85, accent: '#6bbf6a' });
lab('S8.onbekend', .05, .27, { text: 'Elektra en brandveiligheid', sub: 'nog te toetsen', pos: [BA[0] + 6, 4.4, BA[1]], h: .9, bg: '#f4f2ea', accent: '#c9c4b8' });
lab('S8.onbekend', .3, .5, { text: 'Licht voor de planten', sub: 'nog te toetsen', pos: [BA[0] + 6, 4.4, BA[1]], h: .9, bg: '#f4f2ea', accent: '#c9c4b8' });
lab('S8.onbekend', .53, .73, { text: 'Vandalisme en diefstal', sub: 'nog te toetsen', pos: [BA[0] + 6, 4.4, BA[1]], h: .9, bg: '#f4f2ea', accent: '#c9c4b8' });
lab('S8.onbekend', .76, .96, { text: 'Kosten', sub: 'nog niet onderzocht', pos: [BA[0] + 6, 4.4, BA[1]], h: .9, bg: '#f4f2ea', accent: '#c9c4b8' });
lab('S8.bewijs', .1, .5, { text: 'De onderdelen bestaan al', sub: 'Sydney · Groningen · Boxmeer', pos: [10, 4, 0], h: 1.6 });
lab('S8.bewijs', .55, .95, { text: 'Geen bewijs voor dit dak', pos: [10, 4, 0], h: 1.6, accent: '#e9503a' });
lab('S9.stappen', .05, .3, { text: 'Dakgegevens opvragen', badge: 1, pos: [-18, 2.6, 3], h: .75, track: true });
lab('S9.stappen', .33, .53, { text: 'Constructeur en dakexpert bepalen', badge: 2, pos: [-18, 2.6, 3], h: .75, track: true });
lab('S9.stappen', .56, .76, { text: 'Proefmodel plantenbak', sub: 'wateropname en overloop', badge: 3, pos: [-18, 2.6, 3], h: .75, track: true });
lab('S9.stappen', .79, .97, { text: 'Beheer afspreken', badge: 4, pos: [-18, 2.6, 3], h: .75, track: true });
lab('S9.totaal', .08, .27, { text: 'Zon', pos: [BA[0], 5, BA[1]], h: 1.8, accent: '#f2b705' });
lab('S9.totaal', .3, .49, { text: 'Water', pos: [-10.3, 4, -1], h: 1.8, accent: '#4aa0e0' });
lab('S9.totaal', .52, .7, { text: 'Groen', pos: [-19.8, 3, -1], h: 1.8, accent: '#6bbf6a' });
lab('S9.totaal', .73, .95, { text: 'Ontmoeting', pos: [BB[0], 5, BB[1]], h: 1.8, accent: '#d96aa0' });
lab('S9.einde', .4, .98, { text: 'Ontdek het terrein', sub: 'loop zelf rond en open de informatiepunten', pos: [-34, 3.0, 4.0], h: .9, accent: '#f2b705' });

function createChoreo(ST) {
  const W = ST.world, scene = ST.scene, cam = ST.cam, guide = ST.guide, B = ST.B, tl = ST.tl, K = ST.K;
  const C = { cam: new THREE.Vector3(), look: new THREE.Vector3(), fov: 40, ready: false, explore: EXPLORE };
  let props = null; const tmp = new THREE.Vector3();
  const tt = (key, f) => B(K(key), f);                         // tijd van een beat-moment

  C.init = function () {
    ST.track = PF.buildTrack(nodes(ST), tl.total + 700);
    ST.cue.asm1 = tt('S3.groot', .2); ST.cue.asm2 = tt('S6.pergola', .1);
    const P = props = { labs: [], roof: null };
    LAB.forEach(L => { const s = L.big ? PF.makeBig(Object.assign({ h: L.h }, L.big)) : PF.makeLabel({ text: L.text, sub: L.sub, badge: L.badge, h: L.h, accent: L.accent, bg: L.bg }); s.position.set(...L.pos); scene.add(s); L.sp = s; L.i = K(L.key); P.labs.push(L); });
    P.roof = PF.makeRoofSample(); P.roof.position.set(SAMPLE.x, 0, SAMPLE.z); P.roof.rotation.y = 0; scene.add(P.roof);
    C.ready = true;
  };

  // ---- student: gebaren per beat ----
  const HEADY = 1.55;
  function stuState(T, i, f, c) {
    const key = BEATS[i].key;
    const st = { speed: c.speed, talk: c.talk, level: c.level, gesture: 'none', gestW: 0, pointAt: null, pointW: 0, lookAt: null, lookW: 0, pose: 'stand', smile: .6, brow: 0, leanIn: 0 };
    const look = (w, x, y, z) => { if (w > st.lookW) { st.lookAt = V([x, y, z]); st.lookW = w; } };
    const point = (w, x, y, z) => { st.pointAt = V([x, y, z]); st.pointW = w; look(Math.max(w, .8) * (w > .02 ? 1 : 0), x, y, z); };
    const open = (w) => { st.gesture = 'open'; st.gestW = w; };
    const camP = cam.position; const toCam = (w) => look(w, camP.x, camP.y, camP.z);
    const sx = c.x, sz = c.z;
    switch (key) {
      case 'S1.open': open(win(f, .55, .97)); toCam(win(f, .45, 1)); break;
      case 'S1.terras': point(win(f, .3, .9), -30, .3, 0); st.brow = 1; break;
      case 'S1.opdracht': open(win(f, .1, .9)); toCam(win(f, .05, .5)); look(win(f, .55, 1) * .9, -33, 1.2, 0); break;
      case 'S1.preview': open(win(f, .1, .9)); look(win(f, .1, 1), BA[0], 2, BA[1]); break;
      case 'S2.hitte': look(win(f, .1, .5), sx - 20, 20, sz + 30); look(win(f, .5, 1) * .8, sx + 2, 0, sz - 3); open(win(f, .5, .9)); break;
      case 'S2.dak': point(win(f, .2, .85), SAMPLE.x, .8, SAMPLE.z); break;
      case 'S2.licht': open(win(f, .1, .9)); toCam(win(f, .3, .8)); break;
      case 'S2.systeem': open(win(f, .35, .95)); toCam(win(f, .1, .9)); break;
      case 'S2.ambitie': open(win(f, .1, .9)); toCam(win(f, .1, .6)); break;
      case 'S3.intro': point(win(f, .45, .95), A0[0], .4, A0[1]); break;
      case 'S3.frame': case 'S3.bakken': look(win(f, .1, 1) * .8, A0[0], 1.8, A0[1]); open(win(f, .5, .9)); break;
      case 'S3.zit': look(win(f, .1, 1) * .8, A0[0], .9, A0[1]); if (f > .3) st.pose = f > .45 ? 'type' : 'sit'; break;
      case 'S3.f1': case 'S3.f2': case 'S3.sydney': case 'S3.f3': st.pose = 'sit'; if (key === 'S3.f1') st.pose = 'type'; look(win(f, .1, 1) * .8, A0[0], 1.4, A0[1]); open(key === 'S3.f1' ? 0 : win(f, .45, .9) * .8); break;
      case 'S3.f4': st.pose = 'sit'; open(win(f, .35, .9)); toCam(win(f, .3, .9)); break;
      case 'S3.groot': if (f < .12) st.pose = 'sit'; look(win(f, .4, 1) * .8, BA[0], 1.5, BA[1]); open(win(f, .4, .9)); break;
      case 'S4.intro': open(win(f, .4, .9)); look(win(f, .3, 1) * .9, -14.15, .9, 1.88); break;
      case 'S4.plaats': open(win(f, .5, .95)); look(win(f, .2, 1) * .9, -6.5, .6, 1.88); break;
      case 'S4.w1': case 'S4.w2': case 'S4.w3': case 'S4.w4': case 'S8.gewicht': point(win(f, .15, .85), SECP[0] + (key === 'S4.w4' ? 1.3 : key === 'S4.w3' ? .4 : 0), key === 'S4.w1' ? 1.6 : 1.0, SECP[2]); break;
      case 'S4.bestaat': case 'S4.nuance': open(win(f, .3, .9)); toCam(win(f, .2, .8)); break;
      case 'S5.intro': point(win(f, .2, .8), HABP[0], 1.0, HABP[2]); break;
      case 'S5.variatie': case 'S5.opbrengst': open(win(f, .25, .9)); toCam(win(f, .15, .6)); break;
      case 'S6.totaal': case 'S6.pergola': case 'S6.groen': case 'S6.plan': toCam(win(f, .6, 1) * .5); open(win(f, .5, .9) * .5); break;
      case 'S6.relatie': open(win(f, .3, .9)); look(win(f, .2, 1), -8, 1.6, .5); break;
      case 'S7.leven': case 'S7.welzijn': open(win(f, .4, .9)); look(win(f, .1, 1) * .8, sx + 4, 1.2, sz - 4); break;
      case 'S7.les': open(win(f, .3, .9)); look(win(f, .2, 1), -30, 1.4, -1); break;
      case 'S7.habitat': point(win(f, .3, .9), -19.8, .5, .4); break;
      case 'S7.sensor': point(win(f, .2, .9), (C.sensorPos || [-32, 1.7, 0])[0], 1.7, (C.sensorPos || [-32, 1.7, 0])[2]); break;
      case 'S7.rood': open(win(f, .3, .9)); look(win(f, .2, 1) * .8, BA[0], 2.4, BA[1]); break;
      case 'S8.eerlijk': case 'S8.plaats': case 'S8.dak': case 'S8.onderhoud': case 'S8.onbekend': case 'S8.bewijs': open(win(f, .3, .9)); toCam(win(f, .2, .8)); st.brow = win(f, .4, .8) * .5; break;
      case 'S9.stappen': open(win(f, .3, .9)); look(win(f, .1, 1) * .8, sx + 5, 1.4, sz - 3); break;
      case 'S9.totaal': open(win(f, .3, .9)); toCam(win(f, .3, .9)); break;
      case 'S9.einde': if (f < .5) toCam(win(f, 0, .5)); else look(1, EXPLORE.look[0], 1.6, EXPLORE.look[2]); if (f > .08 && f < .5) st.pose = 'raise'; else if (f > .5) open(win(f, .55, 1)); break;
      default: open(win(f, .3, .9)); toCam(win(f, .1, .5));
    }
    return st;
  }

  /* ---- camera: [pos, look, fov] ---- */
  const SH = {};
  const sh = (k, fn) => { SH[k] = fn; };
  const aerial = [-118, 58, 92];
  sh('S1.open', (u, c) => { const e = smoother(u); return [L3(aerial, [-40 + 3.6, 3.0, 14.5], e), L3([-8, -3, 0], [-40.5, 1.4, PZ], smooth(seg(u, .25, 1))), lerp(32, 42, e)]; });
  sh('S1.terras', (u, c) => { const e = smoother(u); return [L3([c.x + 5, 3.4, 13.5], [-18, 14, 32], e), L3([c.x + 2, 1.0, c.z - 1], [-12, 0, 0], smooth(seg(u, .2, 1))), lerp(42, 38, e)]; });
  sh('S1.opdracht', (u, c) => { const e = smoother(u); return [L3([-27, 4.5, 15], [-24, 4.0, 13], e), [-34, 1.3, 4.5], lerp(40, 38, e)]; });
  sh('S1.preview', (u, c) => { const e = smoother(u); return [L3([-36, 12, 26], [-3, 46, 34], e), L3([-33, 1, 0], [0, 0, 0], e), lerp(40, 40, e)]; });
  sh('S2.hitte', (u, c) => { const e = smoother(u); return [L3([-44, 2.4, 13.5], [-30, 2.8, 13], e), L3([-33, .4, 3.5], [-30, .4, 2.5], e), 44]; });
  sh('S2.dak', (u, c) => { const e = smoother(u); const o = orb(SAMPLE.x, SAMPLE.z, lerp(10.5, 8.0, e), lerp(-.55, .55, e)); return [[o[0], lerp(1.9, 2.6, e), o[1]], [SAMPLE.x, lerp(1.0, 1.7, e), SAMPLE.z], lerp(42, 40, e)]; });
  sh('S2.licht', (u, c) => { const e = smoother(u); const o = orb(SAMPLE.x, SAMPLE.z, lerp(8, 10.5, e), lerp(.55, 1.2, e)); return [[o[0], lerp(2.6, 2.8, e), o[1]], L3([SAMPLE.x, 1.7, SAMPLE.z], [c.x, 1.5, c.z], e), 40]; });
  sh('S2.systeem', (u, c) => { const e = smoother(u); return [L3([-26, 1.8, 13], [-29, 2.2, 11.5], e), [c.x, 1.7, c.z], lerp(46, 42, e)]; });
  sh('S2.ambitie', (u, c) => { const e = smoother(u); return [L3([-36, 6, 18], [-30, 10, 22], e), L3([c.x, 1.6, c.z], [-33, 1.4, 0], e), lerp(44, 42, e)]; });
  sh('S3.intro', (u, c) => { const e = smoother(u); return [L3([-31, 2.6, 10], [-34.5, 3.4, 6.8], e), L3([-36, 1.4, 1], [A0[0] + .5, 1.3, A0[1]], e), 42]; });
  sh('S3.frame', (u, c) => { const e = easeInOut(u); const o = orb(A0[0], A0[1], 7.6, lerp(-.05, -.8, e)); return [[o[0], 3.0 + e * 1.1, o[1]], [A0[0], 1.7, A0[1]], 38]; });
  sh('S3.bakken', (u, c) => { const e = easeInOut(u); const o = orb(A0[0], A0[1], 5.9, lerp(-.95, -.12, e)); return [[o[0], 1.5, o[1]], [A0[0], 1.5, A0[1] - .6], 40]; });
  sh('S3.zit', (u, c) => { const e = smoother(u); return [L3([-43.0, 1.8, 2.3], [-43.4, 1.6, .5], e), [A0[0], 1.0, A0[1]], lerp(46, 50, e)]; });
  sh('S3.f1', (u, c) => { const e = smoother(u); return [L3([-36.6, 1.2, 1.2], [-37.2, 1.8, -.4], e), [A0[0], 2.7, A0[1]], 54]; });
  sh('S3.f2', (u, c) => { const e = smoother(u); const o = orb(A0[0], A0[1], 8.5, lerp(.7, 1.3, e)); return [[o[0], 3.0, o[1]], [A0[0], 2.0, A0[1]], 44]; });
  sh('S3.sydney', (u, c) => { const e = smoother(u); const o = orb(A0[0], A0[1], 8.8, lerp(1.3, .3, e)); return [[o[0], 3.4, o[1]], [A0[0], 2.2, A0[1]], 42]; });
  sh('S3.f3', (u, c) => { const e = smoother(u); const o = orb(A0[0], A0[1], 5.8, lerp(-.2, -.9, e)); return [[o[0], 1.4, o[1]], [A0[0], 1.7, A0[1]], 46]; });
  sh('S3.f4', (u, c) => { const e = smoother(u); return [L3([-36.4, 1.6, .9], [-37.2, 1.6, 1.8], e), [A0[0], 1.1, A0[1]], 50]; });
  sh('S3.groot', (u, c) => { const e = smoother(seg(u, .05, .98)); return [L3([-35, 3.0, 6.5], [-30, 24, 30], e), L3([A0[0], 1.4, A0[1]], [BA[0], 0, BA[1]], e), lerp(46, 38, e)]; });
  sh('S4.intro', (u, c) => { const e = smoother(u); return [L3([-20, 2.4, 11], [-12, 3.0, 9.5], e), [-14.15, .8, 1.88], 42]; });
  sh('S4.plaats', (u, c) => { const e = smoother(u); return [L3([-8, 6.5, 15], [2, 9, 15.5], e), L3([-8, .4, -1], [-1, 0, -1], e), lerp(44, 48, e)]; });
  sh('S4.w1', (u, c) => { const e = smoother(u); return [L3([SX - .6, 1.5, SECP[2] + 5.65], [SX + .3, 1.6, SECP[2] + 5.05], e), [SX, 1.0, SECP[2]], 40]; });
  sh('S4.w2', (u, c) => { const e = smoother(u); const o = orb(SX, SECP[2], 5.2, lerp(-.25, .35, e)); return [[o[0], 1.7, o[1]], [SX, 1.4, SECP[2]], 42]; });
  sh('S4.w3', (u, c) => { const e = smoother(u); const o = orb(SX, SECP[2], 5.0, lerp(.35, -.3, e)); return [[o[0], 1.5, o[1]], [SX, 1.2, SECP[2]], 42]; });
  sh('S4.w4', (u, c) => { const e = smoother(u); const o = orb(SX, SECP[2], lerp(5.2, 4.4, e), lerp(-.3, .45, e)); return [[o[0], 1.9, o[1]], [SX + .5, 1.5, SECP[2]], 42]; });
  sh('S4.bestaat', (u, c) => { const e = smoother(u); return [L3([SX + 1, 2.3, SECP[2] + 7.15], [SX - 1, 2.6, SECP[2] + 8.15], e), [SX, 1.2, SECP[2]], 40]; });
  sh('S4.nuance', (u, c) => { const e = smoother(u); return [L3([SX + .8, 3.4, SECP[2] + 9.15], [SX + 4.5, 5, SECP[2] + 11.65], e), L3([SX, 1.4, SECP[2]], [SX, .8, SECP[2] - 3], e), 42]; });
  sh('S5.intro', (u, c) => { const e = smoother(u); return [L3([-26, 2.4, 11.5], [-23, 3.0, 9.6], e), L3([HABP[0], 1.0, HABP[2]], [HABP[0], .8, 2.5], smooth(seg(u, .55, 1))), 42]; });
  ['bloemen', 'kruiden', 'sedum', 'droog', 'vochtig', 'combi'].forEach((n, k) => sh('S5.' + n, (u, c) => { const e = smoother(u), z0 = ROWZ[k]; return [[-22.4, 1.5 + e * .1, z0 + 3.9 - e * .8], [-19.8, .55, z0 + .3], 44]; }));
  sh('S5.variatie', (u, c) => { const e = smoother(u); return [L3([-13.5, 2.4, 5.5], [-9.5, 3.4, 1.5], e), [-19.8, .6, -1.2], 44]; });
  sh('S5.opbrengst', (u, c) => { const e = smoother(u); return [L3([-12, 11, 20], [4, 20, 28], e), L3([-8, 0, -1], [2, 0, -1], e), lerp(44, 46, e)]; });
  sh('S6.totaal', (u, c) => { const e = smoother(u); return [L3([-62, 34, 44], [-6, 40, 50], e), [0, 0, -1], 40]; });
  sh('S6.pergola', (u, c) => { const e = smoother(u); const o = orb(0, 0, lerp(66, 58, e), lerp(.5, -.5, e)); return [[o[0], lerp(24, 30, e), o[1]], [0, 0, -1], 40]; });
  sh('S6.groen', (u, c) => { const e = smoother(u); return [L3([-26, 9, 16], [14, 8, 15], e), [0, 0, -1], 46]; });
  sh('S6.plan', (u, c) => { const e = smoother(seg(u, 0, .35)); return [L3([20, 30, 28], [0, 82, .5], e), L3([0, 0, -1], [0, 0, 0], e), lerp(40, 40, e)]; });
  sh('S6.relatie', (u, c) => { const e = smoother(u); return [L3([-17, 2.2, 10.5], [-3, 2.2, 10], e), L3([-12, 1.2, 0], [-6, 1.2, 0], e), 46]; });
  sh('S7.leven', (u, c) => { const e = smoother(u); return [[c.x - 3.4 + e * 1.6, 1.75, c.z + 4.2], [c.x + 3.5, 1.3, c.z - 3.2], 48]; });
  sh('S7.les', (u, c) => { const e = smoother(u); return [L3([-23, 2.1, 6.5], [-27, 2.5, 5.5], e), L3([-31, 1.0, -.6], [-33, 1.2, -1.2], e), 52]; });
  sh('S7.habitat', (u, c) => { const e = smoother(u); return [L3([-27.0, 1.6, 4.6], [-25.2, 1.5, 3.0], e), L3([-19.8, .6, 1.8], [-19.8, .5, -.8], e), 46]; });
  sh('S7.welzijn', (u, c) => { const e = smoother(u); const o = orb(-10.3, 1.6, 13, lerp(-.7, .35, e)); return [[o[0], lerp(3.0, 4.2, e), o[1]], [-10.3, 1.2, 1.6], 40]; });
  sh('S7.sensor', (u, c) => { const sp = C.sensorPos || [-33, 1.7, -2.5], e = smoother(u); return [L3([sp[0] - 2.4, 2.4, sp[2] + 9.6], [sp[0] - .8, 2.2, sp[2] + 8.4], e), [sp[0], 1.9, sp[2]], lerp(34, 32, e)]; });
  sh('S7.rood', (u, c) => { const e = smoother(u); return [L3([-40, 1.7, 6.8], [-26, 2.2, 6.4], e), [BA[0], 2.3, BA[1]], 54]; });
  sh('S8.eerlijk', (u, c) => { const e = smoother(u); return [L3([-24, 4.0, 14], [-12, 4.4, 15], e), L3([c.x, 1.4, c.z], [-10, 1.0, 1], e), 44]; });
  sh('S8.gewicht', (u, c) => { const e = smoother(u); return [L3([SX - .6, 2.0, SECP[2] + 7.25], [SX + .6, 2.2, SECP[2] + 6.65], e), [SX, 1.3, SECP[2]], 44]; });
  sh('S8.plaats', (u, c) => { const e = smoother(u); return [L3([-14, 3.6, 13.5], [-6, 4.2, 14], e), [-9, 1.0, 1.5], 44]; });
  sh('S8.dak', (u, c) => { const e = smoother(u); const o = orb(-8, 1, 15, lerp(-.5, .2, e)); return [[o[0], 3.8, o[1]], [-8, 1.0, 1], 42]; });
  sh('S8.onderhoud', (u, c) => { const e = smoother(u); return [L3([-6, 2.2, 8.5], [2, 2.8, 8.5], e), [-1.2, .6, -.6], 46]; });
  sh('S8.onbekend', (u, c) => { const e = smoother(u); const o = orb(BA[0] + 4, 0, 24, lerp(-.7, -.1, e)); return [[o[0], 6.5, o[1]], [BA[0] + 4, 2.2, BA[1]], 42]; });
  sh('S8.bewijs', (u, c) => { const e = smoother(u); return [L3([12, 10, 26], [26, 16, 30], e), [10, 1.5, 0], 44]; });
  sh('S9.stappen', (u, c) => { const e = smoother(u); return [[c.x - 2.6, 1.9, c.z + 4.8], [c.x + 3.4, 1.4, c.z - 2.4], 48]; });
  sh('S9.totaal', (u, c) => { const e = smoother(u); const o = orb(0, 0, lerp(70, 62, e), lerp(.4, -.4, e)); return [[o[0], lerp(30, 36, e), o[1]], [0, 0, -1], 40]; });
  sh('S9.einde', (u, c) => { const e1 = smoother(seg(u, 0, .5)), e2 = smoother(seg(u, .45, .8)), e3 = smoother(seg(u, .8, 1)); const dx = EXPLORE.look[0] - EXPLORE.pos[0], dz = EXPLORE.look[2] - EXPLORE.pos[2], dl = Math.hypot(dx, dz), bh = [EXPLORE.pos[0] - dx / dl * 2.1, 1.95, EXPLORE.pos[2] - dz / dl * 2.1]; const a = L3([-48, 34, 40], [-47, 5, 14], e1); return [L3(L3(a, bh, e2), [EXPLORE.pos[0], 1.68, EXPLORE.pos[2]], e3), L3(L3([-20, 0, 0], [c.x, 1.5, c.z], e1), EXPLORE.look, smoother(seg(u, .45, 1))), lerp(42, 62, smoother(seg(u, .45, 1)))]; });

  /* ---- hoofd-update ---- */
  C.apply = function (T, dt, ctx) {
    ctx = ctx || {};
    const i = ST.beatAt(T), key = BEATS[i].key, f = clamp((T - tl.start[i]) / tl.dur[i]); const c0 = ST.track.at(T);
    const speaking = ctx.speaking != null ? ctx.speaking : (T >= ST.S(i, 0) && T <= ST.S(i, 1) + .2);
    C.talk += ((speaking ? 1 : 0) - C.talk) * (1 - Math.exp(-dt * 12));
    C.lvl = ctx.level != null ? ctx.level : null;
    const tIn = T - tl.start[i];
    const P = props;
    C.nightV = (C.nightV || 0) + ((C.night ? 1 : 0) - (C.nightV || 0)) * (1 - Math.exp(-dt * 1.6)); if (!C.night && C.nightV < .002) C.nightV = 0;
    const dd = (k0, f0, k1, f1) => seg(T, tt(k0, f0), tt(k1, f1));   // voortgang tussen twee momenten
    const win2 = (k0, f0, k1, f1, r) => { const a = tt(k0, f0), b = tt(k1, f1); r = r || .8; return smooth(seg(T, a, a + r)) * (1 - smooth(seg(T, b - r, b))); };

    // --- student
    guide.root.visible = T >= B(0, .0);
    if (T >= tt('S9.einde', .8) && Math.hypot(cam.position.x - EXPLORE.pos[0], cam.position.z - EXPLORE.pos[2]) < .55) guide.root.visible = false;
    const c = { x: c0.x, z: c0.z, speed: c0.speed, talk: C.talk, level: C.lvl };
    let sit = (key === 'S3.zit' && f > .6) || /^S3\.(f1|f2|sydney|f3|f4)$/.test(key) || (key === 'S3.groot' && f < .1);
    const stP = stuState(T, i, f, c);
    guide.root.position.set(c0.x, 0, c0.z); guide.root.rotation.y = c0.h;
    guide.phase = c0.s / 1.45 * Math.PI * 2;
    const savedPhase = guide.phase; guide.update(T, dt, Object.assign(stP, { speed: sit ? 0 : c0.speed }));
    guide.phase = savedPhase;
    // zolen exact op y = 0 (ook zittend/overgangen): corrigeer met het laagste punt van de schoenen
    if (guide.root.visible) { guide.root.position.y = 0; guide.root.updateMatrixWorld(true); _gbb.setFromObject(guide.root); if (isFinite(_gbb.min.y) && Math.abs(_gbb.min.y) < .25) guide.root.position.y = -_gbb.min.y; }

    // --- warmte (S2.hitte)
    W.setHeat(win2('S2.hitte', .1, 'S2.dak', .1, 1.4));
    // --- dak-doorsnede (S2.dak, S2.licht)
    const rv = smooth(dd('S2.dak', .02, 'S2.dak', .2)) * (1 - smooth(dd('S2.licht', .72, 'S2.licht', .98)));
    const rx = smooth(dd('S2.dak', .2, 'S2.dak', .6)) * (1 - smooth(dd('S2.licht', .2, 'S2.licht', .5)));
    PF.updateRoofSample(P.roof, T, rx, rv);
    // --- voetafdrukken (plattegrond-kleuren): preview + plattegrondmoment
    const pm = PF.planMats; const pv = ST.plan;
    const fpA = win2('S1.preview', .1, 'S1.preview', .98, .5), prv = (a, b) => win(seg(T, tt('S1.preview', 0), tt('S1.preview', 1)), a, b, .06);
    const pl2 = win2('S6.plan', .02, 'S6.plan', .99, .8);
    pm.pergola.opacity = Math.max(prv(.1, .4), pl2 * .45); pm.planter.opacity = Math.max(prv(.4, .68), pl2 * .55); pm.habitat.opacity = Math.max(prv(.68, .97), pl2 * .55);
    pv.visible = Math.max(pm.pergola.opacity, pm.planter.opacity, pm.habitat.opacity) > .004;

    // --- pergola's
    const a1 = dd('S3.intro', .5, 'S3.zit', .95), a2 = dd('S3.groot', .22, 'S3.groot', .82);
    const A = ST.bigA; A.setProgress(smoother(a1), smoother(a2));
    // oude picknicktafels bij de start verdwijnen zodra de eerste pergola staat (te vol)
    { const uT = smooth(seg(smoother(a1), .5, .62)); ST.world.oldTables.forEach(t => { if (t.userData.x > 0) return; t.visible = uT < .995; t.scale.setScalar(Math.max(.001, 1 - uT)); if (t.userData.col) t.userData.col.top = uT > .5 ? -1 : .8; }); }
    const eB = dd('S6.pergola', .08, 'S6.pergola', .8), e1 = dd('S6.pergola', .22, 'S6.pergola', .86), e2 = dd('S6.pergola', .34, 'S6.pergola', .92);
    ST.bigB.setProgress(smoother(eB)); ST.small1.setProgress(smoother(e1)); ST.small2.setProgress(smoother(e2));
    const lay = 0; // meubilair blijft vast staan (geen verschuivingen)
    if (Math.abs(A.layout - lay) > 1e-4) A.setLayout(lay);
    const glintAt = (t0) => { const d = (T - t0) / 3.2; return d < 0 || d > 1.15 ? -1 : d; };
    A.setFx({ rays: win2('S3.f2', .05, 'S3.f3', .1, 1.2) * .9, cool: win2('S3.f2', .1, 'S3.f3', .2, 1.8), energy: win2('S3.f1', .05, 'S3.f2', .05, 1.0) * .9, life: win2('S3.f3', .05, 'S3.f4', .5, 1.4), sensor: win2('S7.sensor', .1, 'S7.rood', .05, 1.0),
      glint: glintAt(tt('S3.zit', .98)), red: Math.max(win2('S7.rood', .15, 'S7.rood', .99, 1.4), C.nightV || 0), xray: 0, rain: 0 });
    ST.bigB.setFx({ glint: glintAt(tt('S6.pergola', .86)), red: Math.max(win2('S7.rood', .15, 'S7.rood', .99, 1.4), C.nightV || 0) });
    ST.small1.setFx({ glint: glintAt(tt('S6.pergola', .9)) }); ST.small2.setFx({ glint: glintAt(tt('S6.pergola', .96)) });
    [A, ST.bigB, ST.small1, ST.small2].forEach(p => p.update(T, dt));
    W.update(T, dt, cam);

    // --- plantenbakken: verschijnen (S4.intro eerst één, S4.plaats de rest)
    ST.planters.forEach((q, k) => { const t0 = k === 0 ? tt('S4.intro', .08) : tt('S4.plaats', .06 + (k - 1) * .075); const u = seg(T, t0, t0 + .9); q.g.visible = u > .001; const s = Math.max(.001, backOut(u)); q.g.scale.set(s, s, s); });
    // --- doorsnede (waterkringloop): S4.w1..S4.nuance en S8.gewicht
    const vis1 = smooth(dd('S4.w1', .0, 'S4.w1', .1)) * (1 - smooth(dd('S4.nuance', .86, 'S4.nuance', .99)));
    const vis2 = win2('S8.gewicht', .0, 'S8.gewicht', 1.0, .6), vis3 = smooth(dd('S9.stappen', .0, 'S9.stappen', .35));
    const sp = (a, b) => dd(a[0], a[1], b[0], b[1]);
    const sec = { vis: Math.max(vis1, vis2, vis3),
      ex: Math.max(smooth(dd('S4.w2', .08, 'S4.w2', .4)) * (1 - smooth(dd('S4.w3', .0, 'S4.w3', .25))), vis2 * smooth(dd('S8.gewicht', .05, 'S8.gewicht', .4)) * (1 - smooth(dd('S8.gewicht', .6, 'S8.gewicht', .85)))),
      rain: win2('S4.w1', .04, 'S4.w1', .5, .5), seep: win2('S4.w1', .3, 'S4.w1', .85, .5) * (T < tt('S4.w2', .0) ? 1 : 0),
      level: Math.max(smooth(dd('S4.w1', .5, 'S4.w1', .96)) * (T < tt('S4.w3', .0) ? 1 : 1), (T > tt('S4.w2', .0) ? 1 : 0)) * (vis2 > 0 && T > tt('S8.gewicht', 0) ? 1 : 1),
      cap: win2('S4.w3', .05, 'S4.w3', .97, .5), up: win2('S4.w3', .4, 'S4.w4', .1, .6), fill: win2('S4.w4', .05, 'S4.w4', .5, .4), over: win2('S4.w4', .4, 'S4.w4', .97, .4) };
    if (T < tt('S4.w1', 0)) sec.level = 0;
    PF.updateSection(ST.section, T, sec);
    // --- habitatbakken
    // korte oplichting van de habitatbak waar het over gaat (bij langslopen)
    { const pulse = (t0, dur) => { const q = T - t0; return q < 0 || q > dur ? 0 : Math.sin(Math.PI * q / dur); };
      const gl = []; // [seg, k, waarde]
      ['bloemen', 'kruiden', 'sedum', 'droog', 'vochtig', 'combi'].forEach((n, i) => gl.push([i < 3 ? 0 : 1, i % 3, pulse(tt('S5.' + n, .12), 2.4)]));
      ST.habitat.segs.forEach((sg, si) => sg.modules.forEach((m, k) => { let v = 0; gl.forEach(g => { if (g[0] === si && g[1] === k) v = Math.max(v, g[2]); }); m.glow.visible = v > .01; m.glow.material.opacity = v * .38; })); }
    ST.habitat.segs.forEach((s, k) => { const t0 = k < 3 ? tt('S5.intro', .1 + k * .14) : tt('S5.opbrengst', .02 + (k - 3) * .1); const u = seg(T, t0, t0 + .9); s.grp.visible = u > .001; s.grp.scale.set(1, Math.max(.001, backOut(u)), 1); });
    PF.updateHabExplode(ST.habX, win2('S5.intro', .02, 'S5.intro', .995, .6), smooth(dd('S5.intro', .1, 'S5.intro', .45)) * (1 - smooth(dd('S5.intro', .78, 'S5.intro', .96))));
    ST.insects.update(T, smooth(dd('S5.bloemen', .0, 'S5.kruiden', .5)));
    // --- gras en paden
    ST.ground.reveal(dd('S6.groen', .06, 'S6.groen', .86), smooth(dd('S6.groen', .45, 'S6.groen', .95)));
    // --- schemering (S7.rood)
    const dusk = Math.max(win2('S7.rood', .08, 'S7.rood', .985, 1.6), smooth(C.nightV || 0)), dk = smooth(dusk);
    W.sun.intensity = lerp(1.75, .08, dk); W.hemi.intensity = lerp(.85, .55, dk); W.hemi.color.setHex(0xeaf1ff).lerp(new THREE.Color(0x7d8bc0), dk);
    W.scene.background.setHex(PF.COL.sky).lerp(new THREE.Color(0x2c3558), dk); W.scene.fog.color.copy(W.scene.background);
    W.land.mesh.material.color.setRGB(lerp(1, .22, dk), lerp(1, .26, dk), lerp(1, .42, dk)); ST.sunSprite.material.opacity = 1 - dk;
    // --- extra's
    updateExtras(T, dt, i, f);
    // sensor-positie
    const sw = A.mods.find(m => m.sensor); if (sw) { sw.sensor.getWorldPosition(tmp); C.sensorPos = [tmp.x, tmp.y, tmp.z]; }
    // --- labels (één tegelijk: vensters per beat liggen na elkaar)
    P.labs.forEach(L => { const t0 = B(L.i, L.f0), t1 = Math.min(B(L.i, L.f1), B(L.i, 1) - .05); const u = smooth(seg(T, t0, t0 + .55)) * (1 - smooth(seg(T, t1 - .5, t1))); PF.popLabel(L.sp, u);
      if (u > .001) { if (L.track) { L.sp.position.x = C.look.x; L.sp.position.z = C.look.z; } if (L.key === 'S7.sensor' || L.key === 'S7.les') { } L.sp.position.y = L.pos[1] + Math.sin(T * 1.4 + L.f0 * 7) * .05; } });
    // --- camera
    const shot = SH[key](f, c);
    let cs = shot; const blendT = 1.9;
    if (i > 0 && tIn < blendT) { const pv2 = SH[BEATS[i - 1].key](1, c); const w = smoother(tIn / blendT); cs = [L3(pv2[0], shot[0], w), L3(pv2[1], shot[1], w), lerp(pv2[2], shot[2], w)]; }
    const dr = Math.sin(T * .35) * .12, dr2 = Math.cos(T * .27) * .08;
    const target = new THREE.Vector3(cs[0][0] + dr, Math.max(.45, cs[0][1] + dr2 * .5), cs[0][2] + dr2), look = new THREE.Vector3(cs[1][0], cs[1][1], cs[1][2]);
    if (!C.ready2 || ctx.snap) { C.cam.copy(target); C.look.copy(look); C.fov = cs[2]; C.ready2 = true; }
    else { const k1 = 1 - Math.exp(-dt * 7), k2 = 1 - Math.exp(-dt * 9); C.cam.lerp(target, k1); C.look.lerp(look, k2); C.fov += (cs[2] - C.fov) * (1 - Math.exp(-dt * 4)); }
    cam.position.copy(C.cam).add(tmp.set(Math.sin(T * 1.1) * .012, Math.sin(T * 1.7) * .014, Math.cos(T * .9) * .01)); cam.lookAt(C.look);
    if (Math.abs(cam.fov - C.fov) > .01) { cam.fov = C.fov; cam.updateProjectionMatrix(); }
    ST.sunSprite.position.copy(cam.position).addScaledVector(PF.SUN_DIR, 560);
    return { beat: i, f, speaking };
  };
  C.talk = 0;

  /* ---- extra's ---- */
  function updateExtras(T, dt, bi, bf) {
    const showAmb = seg(T, tt('S6.relatie', .0), tt('S6.relatie', .4));
    ST.extras.forEach((a, k) => { const s = a.s; s.root.visible = showAmb > .01 && a.role !== 'walk' || (a.role === 'walk' && showAmb > .01); if (!s.root.visible) return; s.root.scale.setScalar(Math.max(.001, backOut(showAmb))); const st = { talk: 0, pose: 'stand', speed: 0, gesture: 'none' };
      if (a.role === 'sit') { s.root.position.set(a.x, 0, a.z); s.root.rotation.y = a.h; st.pose = a.pose; st.talk = Math.sin(T * .31 + k * 2) > .75 ? .5 : 0; }
      else if (a.role === 'talkA' || a.role === 'talkB') { const A = a.role === 'talkA'; s.root.position.set(a.x, 0, a.z); s.root.rotation.y = a.h; const turn = Math.sin(T * .45 + (A ? 0 : 3.1)) > 0; st.talk = turn ? .8 : 0; st.gesture = turn ? 'open' : 'none'; st.gestW = .8; }
      else if (a.role === 'walk') { const Lw = 28, ph = (T * 1.05) % (2 * Lw), fw = ph < Lw, x = -14 + (fw ? ph : 2 * Lw - ph); s.root.position.set(x, 0, 5.2); s.root.rotation.y = fw ? Math.PI / 2 : -Math.PI / 2; st.speed = 1.05; s.phase = ph / 1.45 * Math.PI * 2; const sp2 = s.phase; s.update(T, dt, st); s.phase = sp2; return; }
      s.update(T, dt, st); });
    // klas bij pergola A
    const A = ST.bigA, apT = tt('S7.les', .0), show = A.mods[A.mods.length - 1].q > .93;
    ST.klas.forEach((q, k) => { const s = q.s; const fr = A.furn && A.furn.find(x => x.mod.i === q.i && x.mod.j === q.j); const u = seg(T, apT + k * .22, apT + k * .22 + .9); s.root.visible = show && u > .001 && !!fr; if (!s.root.visible) return;
      const g = fr.g, m = fr.mod, r = g.rotation.y; const tx = A.group.position.x + m.g.position.x + g.position.x, tz = A.group.position.z + m.g.position.z + g.position.z;
      const ox = q.ox, oz = q.side * 1.0; const wx = tx + Math.cos(r) * ox + Math.sin(r) * oz, wz = tz - Math.sin(r) * ox + Math.cos(r) * oz;
      s.root.position.set(wx, 0, wz); s.root.rotation.y = Math.atan2(tx - wx, tz - wz); s.root.scale.setScalar(Math.max(.001, backOut(u))); const typing = q.pose === 'type';
      const talking = Math.sin(T * .33 + k * 1.9) > .55 && !typing;
      s.update(T, dt, { pose: typing ? 'type' : 'sit', talk: talking ? .6 : 0, gesture: talking ? 'open' : 'none', gestW: .5, speed: 0 }); });
    const th = ST.teacher; const tu = seg(T, apT + 1.0, apT + 1.8); th.root.visible = show && tu > 0;
    if (th.root.visible) { const bx = A.group.position.x + A.size.W / 2 + .6; th.root.position.set(-22.0, 0, -.9); th.root.rotation.y = -Math.PI / 2 + Math.sin(T * .4) * .25; th.root.scale.setScalar(Math.max(.001, backOut(tu))); const tk = T > tt('S7.les', .1) && T < tt('S7.les', .9);
      th.update(T, dt, { talk: tk ? .8 : (Math.sin(T * .3) > .5 ? .4 : 0), gesture: 'open', gestW: tk ? 1 : .5, lookAt: V([-30, 1.3, -1]), lookW: .8, speed: 0 }); }
  }
  C.SH = SH; C.stuState = stuState; C.LAB = LAB;
  return C;
}
PF.createChoreo = createChoreo; PF.LAB = LAB;
})(window);
/* ===== 08 · Geluidsontwerp (procedureel, WebAudio): muziek, omgeving, voetstappen, opbouw ===== */
(function (G) {
'use strict';
const PF = G.PF;
const clamp = PF.clamp;

function createAudio() {
  const A = { ctx: null, muted: false, ok: false, vol: 1, nextNote: 0, chordIdx: 0, nextChord: 0, nextBird: 3, lastStep: 0, lastAsm: -1, swellDone: {}, _rnd: PF.rng(99) };
  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    const AC = G.AudioContext || G.webkitAudioContext; if (!AC) return;
    try {
      const ctx = A.ctx = new AC();
      A.master = ctx.createGain(); A.master.gain.value = 0; A.master.connect(ctx.destination);
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.connect(A.master); A.bus = comp;
      A.music = ctx.createGain(); A.music.gain.value = .13; A.music.connect(comp);
      A.amb = ctx.createGain(); A.amb.gain.value = .5; A.amb.connect(comp);
      A.sfx = ctx.createGain(); A.sfx.gain.value = .55; A.sfx.connect(comp);
      A.voiceG = ctx.createGain(); A.voiceG.gain.value = 1.25; A.voiceG.connect(comp);
      // ruis-buffer
      const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; A.noise = buf;
      // wind (continue)
      const wn = ctx.createBufferSource(); wn.buffer = buf; wn.loop = true; const wf = ctx.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 420; wf.Q.value = .5; A.windG = ctx.createGain(); A.windG.gain.value = .05; wn.connect(wf); wf.connect(A.windG); A.windG.connect(A.amb); wn.start(); A.windF = wf;
      // regen (ruis hoog)
      const rn = ctx.createBufferSource(); rn.buffer = buf; rn.loop = true; const rf = ctx.createBiquadFilter(); rf.type = 'highpass'; rf.frequency.value = 3200; A.rainG = ctx.createGain(); A.rainG.gain.value = 0; rn.connect(rf); rf.connect(A.rainG); A.rainG.connect(A.amb); rn.start();
      A.music.gain.value = .55; // jazz-achtergrond (bestand is op ca. -24 LUFS genormaliseerd; wijkt tijdens spraak naar .30)
      if (A.musicUrls && A.musicUrls.length) { try { const el = new Audio(); el.loop = true; el.preload = 'auto'; const pick = A.musicUrls.find(u => el.canPlayType(/\.webm(\?|$)/.test(u) ? 'audio/webm; codecs="opus"' : 'audio/mp4; codecs="mp4a.40.2"')) || A.musicUrls[0]; el.src = pick; el.onerror = () => { A.musicError = pick; }; ctx.createMediaElementSource(el).connect(A.music); const pr = el.play(); if (pr && pr.catch) pr.catch(() => {}); A.musicEl = el; } catch (e) { A.musicError = String(e); } }
      A.master.gain.linearRampToValueAtTime(A.muted ? 0 : 1, ctx.currentTime + 1.5);
      A.ok = true; A.nextNote = ctx.currentTime + .3; A.nextChord = ctx.currentTime;
    } catch (e) { A.ok = false; }
  };
  A.setMuted = function (m) { A.muted = m; if (A.ctx) A.master.gain.setTargetAtTime(m ? 0 : 1, A.ctx.currentTime, .15); };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const CH = [[48, 55, 59, 64], [45, 52, 57, 60], [41, 48, 52, 57], [43, 50, 55, 59]]; // Cmaj7 · Am7 · Fmaj7 · G6-ish
  const PENTA = [72, 74, 76, 79, 81, 84];
  function tone(t, f, dur, type, gain, dest, att, lp) {
    const c = A.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + (att || .02)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    let n = o; if (lp) { const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); n = fl; } n.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + .05);
  }
  function burst(t, dur, freq, q, gain, dest, type) {
    const c = A.ctx, s = c.createBufferSource(); s.buffer = A.noise; const f = c.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1; const g = c.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random()); s.stop(t + dur + .02);
  }
  A.step = function () {}; // geluidseffecten staan uit (alleen natuurgeluid + jazz)
  A.thunk = function () {}; // geluidseffecten staan uit (alleen natuurgeluid + jazz)
  A.chime = function () {}; // geluidseffecten staan uit (alleen natuurgeluid + jazz)
  A.blip = function () {}; // geluidseffecten staan uit (alleen natuurgeluid + jazz)
  A.swell = function () {}; // geluidseffecten staan uit (alleen natuurgeluid + jazz)
  A.whoosh = function () {}; // geluidseffecten staan uit (alleen natuurgeluid + jazz)
  // elke frame: st = {mode, speaking, rain, dusk, walking(speed), stepEdge, asmProg, active}
  A.update = function (st) {
    if (!A.ok) return; const c = A.ctx, t = c.currentTime; if (c.state === 'suspended') return;
    A.music.gain.setTargetAtTime(st.speaking ? .30 : .55, t, .6); A.windG.gain.setTargetAtTime(.04 + .02 * Math.sin(t * .13), t, .5); A.rainG.gain.setTargetAtTime(.1 * (st.rain || 0), t, .3);
    // vogels (overdag)
    if (t > A.nextBird) { A.nextBird = t + 2.5 + Math.random() * 5; if ((st.dusk || 0) < .5) { const f0 = 2600 + Math.random() * 1400, n = 2 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) { const o = c.createOscillator(), g = c.createGain(), tt = t + i * .11; o.frequency.setValueAtTime(f0, tt); o.frequency.exponentialRampToValueAtTime(f0 * (1.2 + Math.random() * .3), tt + .07); g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(.018, tt + .01); g.gain.exponentialRampToValueAtTime(.0001, tt + .09); o.connect(g); g.connect(A.amb); o.start(tt); o.stop(tt + .1); } } }
    if (st.stepEdge) A.step(st.speed || 1);
  };
  return A;
}
PF.createAudio = createAudio;
})(window);
/* ===== 09 · Player: film-afspelen, spraaksynchronisatie, interactieve verkenning, API ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { clamp, lerp, smooth, seg } = PF;

PF.create = function (opts) {
  const canvas = opts.canvas, root = opts.root, onState = opts.onState || function () {};
  const isTouch = ('ontouchstart' in G) || (navigator.maxTouchPoints || 0) > 0;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .95;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  let pr = Math.min(G.devicePixelRatio || 1, isTouch ? 1.5 : 2); renderer.setPixelRatio(pr);

  const S = { phase: 'loading', paused: false, T: 0, chapter: 0, chapterName: '', subtitle: '', muted: false, cc: true, locked: false, menu: false, progress: 0, fps: 60, voice: 'timed', touch: isTouch, error: '', speaking: false, hint: '', focusId: null, infoId: null, audioState: 'idle', audioProg: 0, audioNote: '', seen: [], nPoints: (PF.POINTS || []).length };
  let ST, C, A = PF.createAudio(), tl, total = 0, Pts = null; A.musicUrls = [].concat(opts.musicUrl || []);
  const _fwv = new THREE.Vector3(); let wall = 0, T = 0, last = 0, raf = 0, disposed = false, frame = 0, lastEmit = 0, lastJson = '';
  let spoken = [], speechActive = false, speechBeat = -1, speechStarted = false, speechT0 = 0, utter = null, waitWall = 0;
  let voice = null, cps = 13, rate = 1, mode = 'loading', endWall = 0, lastBeat = -1;
  let asmLast = [0, 0], glintOn = [false, false], swellDone = {}, stepSign = 0;

  function emit(force) {
    const now = performance.now(); if (!force && now - lastEmit < 90) return;
    const j = JSON.stringify([S.phase, S.paused, Math.round(S.T * 4), S.chapter, S.subtitle, S.muted, S.cc, S.locked, S.menu, S.voice, Math.round(S.fps / 5), S.error, S.hint, S.focusId, S.infoId, S.audioState, Math.round(S.audioProg * 40), S.audioNote, S.seen.length]);
    if (!force && j === lastJson) return; lastJson = j; lastEmit = now; onState(Object.assign({}, S));
  }

  /* ---------- voice-over (opgenomen audio, per beat afgespeeld) ---------- */
  let vbytes = null, vbuf = null, vsrc = null, vstart = 0, vbeat = -1, venv = null, voiceFetch = null, starting = false;
  const ENV_HZ = 50;
  const vurls = [].concat(opts.voiceUrl || []);
  const fetchBytes = u => fetch(u).then(r => { if (!r.ok) throw new Error('voice ' + r.status); return r.arrayBuffer(); });
  function loadVoiceBytes() { if (!vurls.length) return Promise.resolve(); return fetchBytes(vurls[0]).then(b => { vbytes = b; }).catch(() => { vbytes = null; }); }
  const decode = b => new Promise((res, rej) => { const p = A.ctx.decodeAudioData(b.slice(0), res, rej); if (p && p.catch) p.catch(rej); });
  async function prepareVoice() {
    if (vbuf || !A.ok) return;
    try { if (voiceFetch) await voiceFetch; } catch (e) {}
    for (let k = 0; k < vurls.length && !vbuf; k++) { try { const b = k === 0 ? vbytes : await fetchBytes(vurls[k]); if (b) vbuf = await decode(b); } catch (e) { vbuf = null; } }
    if (!vbuf) { S.voice = 'timed'; return; }
    try {
      const d = vbuf.getChannelData(0), W = Math.max(1, Math.round(vbuf.sampleRate / ENV_HZ)), n = Math.floor(d.length / W), env = new Float32Array(n);
      for (let k = 0; k < n; k++) { let sum = 0; for (let j = k * W; j < (k + 1) * W; j++) sum += d[j] * d[j]; env[k] = Math.sqrt(sum / W); }
      const sorted = Float32Array.from(env).sort(), ref = Math.max(1e-4, sorted[Math.floor(n * .93)]);
      for (let k = 0; k < n; k++) env[k] = Math.min(1, Math.max(0, (env[k] / ref - .06) / .94));
      venv = env; S.voice = 'nl';
    } catch (e) { vbuf = null; S.voice = 'timed'; }
  }
  function stopVoice() { if (vsrc) { try { vsrc.onended = null; vsrc.stop(); } catch (e) {} try { vsrc.disconnect(); } catch (e) {} } vsrc = null; vbeat = -1; }
  function cancelSpeech() { stopVoice(); }
  function playBeat(i, offset) {
    stopVoice(); const b = PF.BEATS[i]; if (!vbuf || !b.v || !A.ok) return;
    const dur = (b.v[1] - b.v[0]) - offset; if (dur <= .05) return;
    const src = A.ctx.createBufferSource(); src.buffer = vbuf; src.connect(A.voiceG);
    const t0 = A.ctx.currentTime + .03; src.start(t0, b.v[0] + offset, dur); vsrc = src; vbeat = i; vstart = t0 - offset;
    src.onended = () => { if (vsrc === src) { vsrc = null; vbeat = -1; } };
  }
  const voiceEl = () => (vsrc && A.ok ? A.ctx.currentTime - vstart : -1); // seconden binnen het stemfragment van de huidige beat

  /* ---------- informatiepunten: paneel + gesproken uitleg (browserstem, per zin) ---------- */
  let api_audioPlay, api_audioPause, api_audioReplay;
  const curPoint = () => (S.infoId && Pts && Pts.byId[S.infoId] ? Pts.byId[S.infoId].p : null);
  /* opgenomen uitleg: één bestand per punt (pa/<id>.mp4 + .webm). Er is GEEN computerstem; bij een fout staat de bestandsnaam in de melding. */
  let aEl = null, aUrls = [], aIdx = 0, aReq = 0, gen0 = 0;
  const fname = u => { const s = String(u || ''); const m = s.match(/(?:^|\/)((?:pa|audio)\/[^/?#]+)$/); return m ? m[1] : s.split('/').pop(); };
  function fileSources(p) { const m = (opts.pointAudio || {})[p.id]; if (!m) return []; const types = ['audio/mp4; codecs="mp4a.40.2"', 'audio/webm; codecs="opus"']; let t; try { t = new Audio(); } catch (e) { return m.filter(Boolean); } return m.filter((u, i) => u && (!t.canPlayType || t.canPlayType(types[i] || types[0]) !== '')); }
  function fileStop() { if (aEl) { try { aEl.onended = aEl.onerror = aEl.onplaying = null; aEl.pause(); aEl.removeAttribute('src'); aEl.load(); } catch (e) {} } }
  function audioFail(p, urls) { S.audioState = 'error'; const names = (urls && urls.length ? urls : ((opts.pointAudio || {})[p.id] || [])).map(fname).filter(Boolean).join(' / ') || ('pa/' + p.id + '.mp4'); S.audioNote = 'Audiobestand niet gevonden of niet af te spelen: ' + names + '. Lees de tekst hierboven.'; emit(true); }
  function fileLoad(gen) {
    const p = curPoint(); if (!p) return;
    if (aIdx >= aUrls.length) { audioFail(p, aUrls); return; }
    fileStop(); if (!aEl) aEl = new Audio(); const el = aEl; el.preload = 'auto'; el.muted = !!S.muted; el.src = aUrls[aIdx]; aReq = performance.now();
    el.onended = () => { if (gen !== gen0) return; S.audioState = 'done'; S.audioProg = 1; emit(true); };
    el.onerror = () => { if (gen !== gen0) return; aIdx++; fileLoad(gen); };
    try { const pr = el.play(); if (pr && pr.catch) pr.catch(e => { if (gen !== gen0) return; if (e && e.name === 'AbortError') return; if (e && e.name === 'NotAllowedError') { try { el.pause(); } catch (x) {} S.audioState = 'paused'; S.audioNote = 'Je browser wacht op een klik: druk op afspelen om de uitleg te horen.'; emit(true); return; } aIdx++; fileLoad(gen); }); } catch (e) { aIdx++; fileLoad(gen); }
  }
  function stopAudio() { gen0++; fileStop(); S.audioState = 'idle'; S.audioProg = 0; S.audioNote = ''; }
  function startAudio(from) {
    const p = curPoint(); if (!p) return;
    if (from && aEl && aEl.src) { const gen = ++gen0; S.audioState = 'playing'; S.audioNote = S.muted ? 'Het geluid staat uit.' : ''; aEl.muted = !!S.muted; aEl.onended = () => { if (gen !== gen0) return; S.audioState = 'done'; S.audioProg = 1; emit(true); }; aEl.onerror = () => { if (gen !== gen0) return; aIdx++; fileLoad(gen); }; try { const pr = aEl.play(); if (pr && pr.catch) pr.catch(() => {}); } catch (e) {} emit(true); return; }
    const urls = fileSources(p);
    if (!urls.length) { audioFail(p, null); return; }
    aUrls = urls; aIdx = 0; const gen = ++gen0; S.audioState = 'playing'; S.audioNote = S.muted ? 'Het geluid staat uit.' : ''; S.audioProg = 0; fileLoad(gen); emit(true);
  }
  api_audioPlay = function () { if (!S.infoId) return; if (S.audioState === 'paused') startAudio(true); else if (S.audioState !== 'playing') startAudio(false); };
  api_audioPause = function () { if (S.audioState !== 'playing') return; if (aEl) { try { aEl.pause(); } catch (e) {} } S.audioState = 'paused'; emit(true); };
  api_audioReplay = function () { if (!S.infoId) return; startAudio(false); };
  function openPoint(id) {
    if (!Pts || !Pts.byId[id] || mode !== 'explore') return;
    stopAudio(); S.infoId = id; if (S.seen.indexOf(id) < 0) S.seen = S.seen.concat(id); Pts.markSeen(id); A.blip && A.blip(); S.menu = false;
    if (!isTouch) unlock(); emit(true);
    startAudio(false); // uitleg gestart door E, klik of tik: voice-over start meteen
  }
  function closePoint() { if (!S.infoId) return; stopAudio(); S.infoId = null; emit(true); root.focus && root.focus(); if (!isTouch) lock(); }

  /* ---------- init ---------- */
  const api = {};
  api.init = async function () {
    voiceFetch = loadVoiceBytes();
    try {
      try { await Promise.race([Promise.all([document.fonts.load('700 40px "Bricolage Grotesque"'), document.fonts.load('500 24px "DM Sans"')]), new Promise(r => setTimeout(r, 1800))]); } catch (e) {}
      ST = PF.createStage(renderer); C = PF.createChoreo(ST); C.init(); Pts = PF.createPoints(ST.world.site); tl = ST.tl; total = tl.total; S.total = total;
      if (isTouch) { ST.world.sun.shadow.mapSize.set(2048, 2048); }
      api.resize(); mode = 'intro'; S.phase = 'intro'; last = performance.now(); raf = requestAnimationFrame(loop); emit(true);
    } catch (e) { S.error = String(e && e.stack || e); S.phase = 'error'; emit(true); throw e; }
  };

  /* ---------- besturing van de film ---------- */
  api.start = async function () { if (starting) return; starting = true; A.init(); if (A.ok) A.setMuted(S.muted); root.focus && root.focus(); try { await prepareVoice(); } catch (e) {} starting = false; api.restart(); };
  api.restart = function () { cancelSpeech(); if (C) { C.night = false; C.nightV = 0; } S.night = false; S.switchFocus = false; if (S.infoId || S.audioState !== 'idle') { stopAudio(); S.infoId = null; } if (Pts) Pts.setVisible(false); try { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); } catch (e) {} spoken = []; T = 0; S.T = 0; S.paused = false; mode = 'film'; S.phase = 'film'; S.menu = false; swellDone = {}; asmLast = [0, 0]; glintOn = [false, false]; lastBeat = -1; C.ready2 = false; unlock(); emit(true); };
  api.pause = function () { if (mode !== 'film') return; S.paused = true; try { A.ctx && A.ctx.suspend(); } catch (e) {} emit(true); };
  api.resume = function () { if (mode !== 'film') return; S.paused = false; try { A.ctx && A.ctx.resume(); } catch (e) {} emit(true); };
  api.togglePause = function () { S.paused ? api.resume() : api.pause(); };
  api.setMuted = function (m) { S.muted = !!m; A.setMuted(S.muted); if (aEl) aEl.muted = S.muted; emit(true); };
  api.toggleCaptions = function () { S.cc = !S.cc; emit(true); };
  api.seek = function (t) { cancelSpeech(); T = clamp(t, 0, total - .01); spoken = []; for (let i = 0; i < ST.beatAt(T); i++) spoken[i] = true; mode = 'film'; S.phase = 'film'; C.ready2 = false; };
  api.skipToEnd = function () { cancelSpeech(); T = total + .01; finishFilm(); };

  function finishFilm() { cancelSpeech(); mode = 'ended'; S.phase = 'ended'; S.subtitle = ''; S.paused = false; endWall = 0; emit(true); }
  api.explore = function () { A.init(); cancelSpeech(); try { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); } catch (e) {} initPlayer(); mode = 'explore'; S.phase = 'explore'; S.subtitle = ''; S.menu = false; S.hint = ''; stopAudio(); S.infoId = null; if (Pts) Pts.setVisible(true); emit(true); root.focus && root.focus(); lock(); };
  api.backToFilm = function () { unlock(); stopAudio(); S.infoId = null; if (Pts) Pts.setVisible(false); api.restart(); };
  api.openPoint = id => openPoint(id); api.closePoint = () => closePoint(); api.audioPlay = () => api_audioPlay(); api.audioPause = () => api_audioPause(); api.audioReplay = () => api_audioReplay();
  function toggleNight() { if (mode !== 'explore' || !C) return; C.night = !C.night; S.night = C.night; A.blip && A.blip(); emit(true); }
  api.toggleNight = toggleNight;
  api.openFocus = () => { if (S.focusId) openPoint(S.focusId); else if (S.switchFocus) toggleNight(); };
  api.tapAt = (cx, cy) => { if (mode !== 'explore' || !Pts || S.menu) return false; const r = canvas.getBoundingClientRect(); const id = Pts.pick(ST.cam, ((cx - r.left) / r.width) * 2 - 1, -(((cy - r.top) / r.height) * 2 - 1)); if (id) { openPoint(id); return true; } if (ST.lightSw) { const rc = new THREE.Raycaster(); rc.setFromCamera({ x: ((cx - r.left) / r.width) * 2 - 1, y: -(((cy - r.top) / r.height) * 2 - 1) }, ST.cam); if (rc.intersectObject(ST.lightSw.hit).length) { toggleNight(); return true; } } return false; };
  api.resumeExplore = function () { S.menu = false; emit(true); root.focus && root.focus(); lock(); };

  /* ---------- verkennen: eerste-persoons besturing ---------- */
  const P = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, yaw: 0, pitch: 0, ground: true, walk: 0, bob: 0 };
  const keys = {}; let touchMove = [0, 0], touchSprint = false, wantJump = false, dragLook = false, lockOK = false;
  function initPlayer() { const e = C.explore; P.x = e.pos[0]; P.z = e.pos[2]; P.y = 0; P.vx = P.vz = P.vy = 0; P.yaw = Math.atan2(-(e.look[0] - e.pos[0]), -(e.look[2] - e.pos[2])); P.pitch = Math.atan2(e.look[1] - e.pos[1], Math.hypot(e.look[0] - e.pos[0], e.look[2] - e.pos[2])); P.ground = true; }
  function lock() { if (isTouch) return; try { const r = canvas.requestPointerLock && canvas.requestPointerLock(); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
  function unlock() { try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {} }
  api.lock = lock;
  document.addEventListener('pointerlockchange', () => { const l = document.pointerLockElement === canvas; lockOK = lockOK || l; S.locked = l; if (!l && mode === 'explore' && !isTouch && lockOK && !S.infoId) { S.menu = true; } emit(true); });
  document.addEventListener('pointerlockerror', () => { lockOK = false; S.locked = false; emit(true); });
  const look = (dx, dy) => { P.yaw -= dx * .0022; P.pitch = clamp(P.pitch - dy * .0022, -1.45, 1.45); };
  canvas.addEventListener('mousemove', e => { if (mode !== 'explore' || S.menu) return; if (S.locked) look(e.movementX || 0, e.movementY || 0); else if (dragLook && e.buttons) look(e.movementX || 0, e.movementY || 0); });
  let downXY = null;
  canvas.addEventListener('mousedown', e => { if (mode !== 'explore') return; root.focus && root.focus(); if (S.menu) return; if (S.locked && S.focusId) { openPoint(S.focusId); return; } if (S.locked && S.switchFocus) { toggleNight(); return; } downXY = [e.clientX, e.clientY]; if (!S.locked && !isTouch) { dragLook = true; lock(); } });
  canvas.addEventListener('mouseup', e => { dragLook = false; if (downXY && !S.locked && mode === 'explore' && Math.hypot(e.clientX - downXY[0], e.clientY - downXY[1]) < 5) api.tapAt(e.clientX, e.clientY); downXY = null; });
  api.addLook = (dx, dy) => { if (mode === 'explore') look(dx * 1.4, dy * 1.4); };
  api.setMove = (x, y) => { touchMove = [x, y]; }; api.setSprint = b => { touchSprint = !!b; }; api.jump = () => { wantJump = true; };
  root.addEventListener('keydown', e => {
    const onBtn = e.target && e.target.tagName === 'BUTTON' && (e.code === 'Space' || e.code === 'Enter');
    if (mode === 'film' && (e.code === 'Space') && !onBtn) { e.preventDefault(); api.togglePause(); return; }
    if (mode !== 'explore') return;
    if (onBtn) return;
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'ShiftRight', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if (e.code === 'Escape' && S.infoId) { e.preventDefault(); closePoint(); return; }
    if (e.code === 'KeyE' && !S.menu) { e.preventDefault(); if (!e.repeat) { if (S.infoId) closePoint(); else if (S.focusId) openPoint(S.focusId); else if (S.switchFocus) toggleNight(); } return; }
    keys[e.code] = true; if (e.code === 'Space') wantJump = true;
    if (e.code === 'Escape') { if (!S.locked) { S.menu = !S.menu; if (!S.menu) lock(); emit(true); } }
  });
  root.addEventListener('keyup', e => { keys[e.code] = false; });
  root.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

  const RAD = .34, STEP = .22;
  function resolve(px, pz, py) { // botsing met objecten (XZ-cirkel tegen AABB) + vloerhoogte
    let ground = 0; const cols = ST.world.colliders;
    for (let k = 0; k < cols.length; k++) { const c = cols[k]; const cx = clamp(px, c.x0, c.x1), cz = clamp(pz, c.z0, c.z1), dx = px - cx, dz = pz - cz, d2 = dx * dx + dz * dz;
      const inside = px > c.x0 - .05 && px < c.x1 + .05 && pz > c.z0 - .05 && pz < c.z1 + .05;
      if (c.top < 90 && inside && py >= c.top - STEP) ground = Math.max(ground, c.top);
      if (py >= c.top - .02 && c.top < 90) continue; // staat erboven
      if (d2 < RAD * RAD) { if (d2 > 1e-6) { const d = Math.sqrt(d2), push = (RAD - d); px += dx / d * push; pz += dz / d * push; } else { // midden in de box: kies kortste uitweg
          const l = px - c.x0, r = c.x1 - px, t = pz - c.z0, b = c.z1 - pz, m = Math.min(l, r, t, b); if (m === l) px = c.x0 - RAD; else if (m === r) px = c.x1 + RAD; else if (m === t) pz = c.z0 - RAD; else pz = c.z1 + RAD; } } }
    const bx = ST.world.bounds.x - RAD * .5 + .4, bz = ST.world.bounds.z - RAD * .5 + .4; px = clamp(px, -bx, bx); pz = clamp(pz, -bz, bz);
    return [px, pz, ground];
  }
  function stepPlayer(dt) {
    let fx = 0, fz = 0;
    if (keys.KeyW || keys.ArrowUp) fz += 1; if (keys.KeyS || keys.ArrowDown) fz -= 1; if (keys.KeyD || keys.ArrowRight) fx += 1; if (keys.KeyA || keys.ArrowLeft) fx -= 1;
    fx += touchMove[0]; fz += -touchMove[1]; const mag = Math.hypot(fx, fz); if (mag > 1) { fx /= mag; fz /= mag; }
    const sprint = keys.ShiftLeft || keys.ShiftRight || touchSprint, spd = (sprint ? 7.2 : 4.2) * (S.menu ? 0 : 1);
    const sy = Math.sin(P.yaw), cy = Math.cos(P.yaw);
    const tx = (fx * cy - fz * sy) * spd, tz = (-fx * sy - fz * cy) * spd; // vooruit = (-sin, -cos)
    const k = 1 - Math.exp(-dt * (P.ground ? 11 : 2.5)); P.vx += (tx - P.vx) * k; P.vz += (tz - P.vz) * k;
    if (wantJump && P.ground && !S.menu) { P.vy = 7.3; P.ground = false; } wantJump = false;
    P.vy -= 22 * dt;
    const n = 3; for (let s = 0; s < n; s++) { const h = dt / n; let nx = P.x + P.vx * h, nz = P.z + P.vz * h, ny = P.y + P.vy * h; const r = resolve(nx, nz, P.y); nx = r[0]; nz = r[1];
      if (ny <= r[2]) { ny = r[2]; if (P.vy < 0) P.vy = 0; P.ground = true; } else if (P.y > r[2] + .001 || P.vy > 0) P.ground = false; P.x = nx; P.z = nz; P.y = ny; }
    const sp = Math.hypot(P.vx, P.vz); P.walk += sp * dt * (sprint ? .62 : .75); if (P.ground) P.bob = lerp(P.bob, Math.sin(P.walk * 6.4) * .028 * clamp(sp / 4), .3); else P.bob *= .9;
    if (P.y < -.5) { P.y = 0; P.vy = 0; } // vangnet: nooit door de vloer vallen
    return sp;
  }

  /* ---------- hoofdlus ---------- */
  let fpsAcc = 0, fpsN = 0, slow = 0, qStage = 0;
  function loop(now) {
    if (disposed) return; raf = requestAnimationFrame(loop);
    let dt = (now - last) / 1000; last = now; if (dt > .1) dt = .1; if (dt <= 0) return; wall += dt; frame++;
    fpsAcc += dt; fpsN++; if (fpsAcc > .5) { S.fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; if (S.fps < 26) { slow++; } else slow = Math.max(0, slow - 1); if (slow > 3 && qStage < 4) { qStage++; slow = 0; pr = Math.max(.55, pr * .82); renderer.setPixelRatio(pr); api.resize(); if (qStage === 2) { const sh = ST.world.sun.shadow; sh.mapSize.set(2048, 2048); if (sh.map) { sh.map.dispose(); sh.map = null; } } } }
    let ctxA = { speaking: false, rain: 0, dusk: 0, stepEdge: false, speed: 0 };
    if (mode === 'film') {
      if (!S.paused) {
        T += dt; let bi = ST.beatAt(T); const bt = PF.BEATS[bi];
        if (bt.v && !spoken[bi] && T >= ST.S(bi, 0)) { spoken[bi] = true; playBeat(bi, Math.max(0, T - ST.S(bi, 0))); }
        const el = voiceEl();
        if (vsrc && vbeat === bi && el > .04) { // de audioklok bepaalt het ritme zolang de stem spreekt
          const target = ST.S(bi, 0) + el, err = target - T; if (Math.abs(err) > .3) T = target; else T += err * Math.min(1, dt * 6);
        }
        if (T >= total) { T = total; finishFilm(); }
      }
      S.T = T; const i2 = ST.beatAt(T); S.chapter = PF.BEATS[i2].ch; S.chapterName = PF.CHAPTERS[S.chapter]; S.progress = T / total;
      const bt2 = PF.BEATS[i2], el2 = T - ST.S(i2, 0); let spk = false, sub = '', lvl = null;
      if (bt2.s && bt2.s.length) { const ss = bt2.s; let k = -1; for (let j = 0; j < ss.length; j++) if (el2 >= ss[j][1] - .12) k = j;
        if (k >= 0 && el2 <= ss[ss.length - 1][2] + .9) sub = ss[k][0];
        for (let j = 0; j < ss.length; j++) if (el2 >= ss[j][1] - .05 && el2 <= ss[j][2] + .12) spk = true;
        if (bt2.v && venv && spk) { const idx = Math.floor((bt2.v[0] + Math.max(0, el2)) * ENV_HZ); lvl = venv[Math.min(venv.length - 1, Math.max(0, idx))]; } else if (spk) lvl = null; }
      S.subtitle = S.cc ? sub : '';
      if (i2 !== lastBeat) { lastBeat = i2; if (i2 === 11 || i2 === 18) {} }
      if (S.paused) lvl = 0; ctxA.speaking = spk; ctxA.level = lvl; S.speaking = spk;
    } else { endWall += dt; }
    if (ST.lightSw) { const ex = mode === 'explore'; ST.lightSw.g.visible = ex; if (!ex) ST.lightSw.label.visible = false; ST.lightSw.lever.rotation.x = (C.nightV || 0) * 1.2 - .6; }
    const Tw = mode === 'film' ? T : total + wall;
    const out = C.apply(Tw, dt, { speaking: mode === 'film' ? ctxA.speaking : false, level: mode === 'film' ? ctxA.level : null, snap: !C.ready2 });
    // --- modi die de camera overnemen
    const cam = ST.cam;
    if (mode === 'intro') { const a = -.55 + wall * .035; cam.position.set(8 + Math.sin(a) * 92, 31 + Math.sin(wall * .2) * 2, Math.cos(a) * 92); cam.lookAt(8, 3, 0); cam.fov = 32; }
    else if (mode === 'explore') {
      const sp = stepPlayer(dt); S.hint = ''; if (ST.guide && ST.guide.root.visible) ST.guide.root.visible = false;
      cam.position.set(P.x, P.y + 1.68 + P.bob, P.z); cam.rotation.order = 'YXZ'; cam.rotation.set(P.pitch, P.yaw, 0); cam.fov = 62; ctxA.stepEdge = false;
      if (Pts) { const fid = Pts.update(dt, cam, wall, S.infoId); if (fid !== S.focusId) { S.focusId = fid; } }
      { const sw = ST.lightSw; if (sw) { const px = sw.pos[0] - cam.position.x, py = sw.pos[1] - cam.position.y, pz = sw.pos[2] - cam.position.z, d3 = Math.hypot(px, py, pz); cam.getWorldDirection(_fwv); const cosA = (px * _fwv.x + py * _fwv.y + pz * _fwv.z) / Math.max(d3, 1e-4);
        const sf = d3 < 3.6 && cosA > .85 && !S.focusId && !S.infoId; if (sf !== S.switchFocus) S.switchFocus = sf; sw.label.visible = d3 < 18 && cosA > .35; if (sw.label.visible) PF.popLabel(sw.label, 1); } }
      if (S.audioState === 'playing' && aEl) { if (aEl.duration > 0) S.audioProg = Math.min(.995, aEl.currentTime / aEl.duration); if (aEl.currentTime === 0 && performance.now() - aReq > 9000) { const g = ++gen0; aIdx++; aReq = performance.now(); fileLoad(g); } }
      ctxA.speaking = S.audioState === 'playing';
      if (P.ground && sp > 1) { const sg = Math.sign(Math.sin(P.walk * 6.4)); if (sg !== stepSign && sg !== 0) { stepSign = sg; ctxA.stepEdge = true; ctxA.speed = sp; } }
    }
    // portret: houd horizontale beeldhoek
    const asp = cam.aspect; if (asp < 1.45) { const base = cam.fov; cam.fov = 2 * Math.atan(Math.tan(base * Math.PI / 360) * Math.min(2.2, 1.45 / asp)) * 180 / Math.PI; }
    cam.updateProjectionMatrix(); if (asp < 1.45) { /* fov wordt elke frame opnieuw uit de regie gezet */ }
    // --- geluid
    if (mode === 'film' && !S.paused) {
      const fr = ST.small.progress, fb = ST.big.progress; const kS = Math.floor(fr * 46), kB = Math.floor(fb * 60);
      if (fr > .06 && fr < .97 && kS !== asmLast[0]) { A.thunk(kS); } if (fb > .04 && fb < .97 && kB !== asmLast[1]) { A.thunk(kB); } asmLast = [kS, kB];
      if (T > ST.cue.asm1 && !swellDone.a) { swellDone.a = 1; A.swell(9); } if (T > ST.cue.asm2 && !swellDone.b) { swellDone.b = 1; A.swell(12); }
      if (fr >= .96 && !glintOn[0]) { glintOn[0] = true; A.chime(); } if (fb >= .96 && !glintOn[1]) { glintOn[1] = true; A.chime(); }
      const g = ST.guide, sgn = Math.sign(Math.sin(g.phase)); if (ST.track.at(T).speed > .35 && sgn !== stepSign && sgn !== 0) { stepSign = sgn; ctxA.stepEdge = true; ctxA.speed = ST.track.at(T).speed; }
      ctxA.rain = ST.small.fx.rain || 0; ctxA.dusk = ST.big.fx.red || 0;
    }
    A.update(ctxA);
    renderer.render(ST.scene, ST.cam);
    emit(false);
  }

  api.resize = function () { const w = Math.max(2, root.clientWidth || canvas.clientWidth || 800), h = Math.max(2, root.clientHeight || canvas.clientHeight || 450); renderer.setSize(w, h, false); if (ST) { ST.cam.aspect = w / h; ST.cam.updateProjectionMatrix(); } };
  api.dispose = function () { disposed = true; cancelAnimationFrame(raf); cancelSpeech(); try { renderer.dispose(); } catch (e) {} };
  api.debug = { get A() { return A; }, get S() { return S; }, get ST() { return ST; }, get C() { return C; }, get T() { return T; }, set T(v) { T = v; }, get mode() { return mode; }, total: () => total, P, renderer, seek: (t) => api.seek(t), setMode: m => { mode = m; }, step: (dt) => { return; } };
  PF.lastApi = api;
  api.state = () => Object.assign({}, S);
  return api;
};
})(window);
/* ===== 10 · Informatiepunten (verkenmodus): centrale data + bolletjes in de 3D-scène ===== */
(function (G) {
'use strict';
const PF = G.PF, THREE = G.THREE;
const { clamp, lerp, smooth } = PF;

/* Bronnen: 'Zon-groen pergola – concept' (PDF), 'HAN groenmodules met praktijkvoorbeelden' (pptx), 'Presentatie habitatbakken' (pptx), plattegrond.
   Per punt: id, cat, title, status (Feit / Bestaand voorbeeld / Ontwerpkeuze / Nog te toetsen), pos (bolletje), anchor (onderdeel waar de lijn naartoe wijst),
   text (schermtekst), note (opmerking over het model), say (volledige gesproken tekst = inhoud van pa/<id>.mp4), src (bronnen).
   Een punt verplaatsen of verwijderen = alleen dit object aanpassen. Alleen onderdelen die echt in het model staan hebben een punt. */
const POINTS = [
 {
  "id": "terrein",
  "cat": "De plek",
  "title": "Het terrein",
  "status": "Feit",
  "pos": [
   -38,
   1.9,
   4.9
  ],
  "anchor": [
   -38,
   0.1,
   4.9
  ],
  "text": "Het terras bestaat nu grotendeels uit bestrating met enkele picknicktafels en warmt op warme dagen sterk op. Doel: biodiversiteit en sociale ruimte voor studenten.",
  "note": "De projectzone is 14 × 90 meter. Alles in dit model is op die maat gebouwd.",
  "say": "Dit is het terras boven de fietsenstalling: veertien bij negentig meter. Het bestaat nu grotendeels uit bestrating met enkele picknicktafels, en het warmt op warme dagen sterk op. Het doel van het project is biodiversiteit en sociale ruimte voor studenten.",
  "src": [
   "Zon-groen pergola – concept, p. 1 en p. 3",
   "Projectzone 14 × 90 m (projectinformatie)"
  ]
 },
 {
  "id": "pergola",
  "cat": "De zon-groene pergola",
  "title": "De grote pergola",
  "status": "Feit",
  "pos": [
   -32.4,
   3.7,
   3.4
  ],
  "anchor": [
   -32.4,
   2.75,
   2.65
  ],
  "text": "Een open overkapping, opgebouwd uit losse modules: frame met zonnepanelen, klimplanten in plantenbakken langs de zijkanten en meubilair eronder.",
  "note": "Het aantal modules, de plaats van de twee grote en twee kleine pergola’s en de afmetingen zijn een ontwerpkeuze in dit 3D-model.",
  "say": "Dit is de zon-groene pergola: een open overkapping, opgebouwd uit losse modules. Elke module heeft een frame met zonnepanelen bovenop, klimplanten in plantenbakken langs de zijkanten en meubilair eronder. Studenten gebruiken het als pauzeplek, studieplek en buitenlokaal.",
  "src": [
   "Zon-groen pergola – concept, p. 1",
   "Plattegrond (globale positionering)"
  ]
 },
 {
  "id": "module",
  "cat": "De zon-groene pergola",
  "title": "Eén module",
  "status": "Ontwerpkeuze",
  "pos": [
   -39.6,
   3.7,
   -2.75
  ],
  "anchor": [
   -39.6,
   3.05,
   -2.75
  ],
  "text": "Stap 1 van het plan: één module op het terras zetten en meten wat die doet met schaduw, temperatuur en gebruik.",
  "note": "Moduleafmeting (4,8 × 3,6 m, 2,9 m hoog): ontwerpkeuze voor de visualisatie.",
  "say": "Dit is één module, de kleine pergola. Zo’n proefmodule komt als eerste op het terras, om schaduw, temperatuur en gebruik te meten. De afmetingen in dit model zijn een ontwerpkeuze, ze staan niet in het document.",
  "src": [
   "Zon-groen pergola – concept, p. 6 (stap 1: proef)"
  ]
 },
 {
  "id": "zonnedak",
  "cat": "Energie",
  "title": "Het zonnedak",
  "status": "Feit",
  "pos": [
   33.5,
   3.8,
   -2.7
  ],
  "anchor": [
   33.5,
   3.05,
   -2.7
  ],
  "text": "Met ruimte tussen de panelen of lichtdoorlatende panelen valt er genoeg licht naar beneden voor de planten.",
  "note": "Rekenvoorbeeld, geen offerte: acht panelen van ongeveer 400 Wp zijn samen 3,2 kWp, grofweg 2.700 tot 2.900 kWh per jaar.",
  "say": "Het zonnedak bestaat uit zonnepanelen. Met ruimte ertussen, of lichtdoorlatende panelen, valt er genoeg licht naar beneden voor de planten. Ons eigen cijfer is alleen een rekenvoorbeeld: acht panelen van ongeveer 400 wattpiek leveren in Nederland grofweg 2.700 tot 2.900 kilowattuur per jaar.",
  "src": [
   "Zon-groen pergola – concept, p. 2 en p. 5 (indicatie)"
  ]
 },
 {
  "id": "klim",
  "cat": "Groen en leefgebied",
  "title": "Klimplanten",
  "status": "Feit",
  "pos": [
   23.9,
   2.4,
   -5.4
  ],
  "anchor": [
   23.9,
   1.3,
   -4.55
  ],
  "text": "Klimplanten geven schaduw, verdamping en nectar of schuilplek voor insecten en vogels. Een pergola alleen is nog geen volwaardig leefgebied.",
  "note": "Klimmers in bakken hebben een flinke bak en regelmatig water nodig.",
  "say": "Klimplanten groeien langs het frame en onder de balk. Ze geven schaduw, verdamping en nectar of schuilplek voor insecten en vogels. Volgens een lijst van de gemeente Vorst zijn klimop, wilde kamperfoelie en bosrank inheemse klimmers die nectar of onderdak bieden.",
  "src": [
   "Zon-groen pergola – concept, p. 2, p. 3 en p. 5 (lijst gemeente Vorst)"
  ]
 },
 {
  "id": "bak",
  "cat": "Zelfwatergevende plantenbak",
  "title": "De plantenbak met bankje",
  "status": "Bestaand voorbeeld",
  "pos": [
   -14.15,
   1.5,
   -3.7
  ],
  "anchor": [
   -14.15,
   0.8,
   -3.7
  ],
  "text": "Een plantenbak met een waterreservoir. Een losse zitbank is optioneel. Het principe bestaat al, maar toepassing op het HAN-dak vraagt een aparte beoordeling.",
  "note": "Afmeting van bak en bankje (bak 2,4 × 0,9 m, bank 2,4 m lang): ontwerpkeuze in dit model. In de plattegrond zit het bankje eraan vast; in de presentatie is een losse zitbank optioneel. In het model staat aan beide kanten van de bak een bankje (ontwerpkeuze).",
  "say": "Dit is een zelfwatergevende plantenbak met een bankje. Het principe bestaat al, bijvoorbeeld op het Raadhuisplein in Boxmeer en bij de Waterbench. Dat bewijst nog niet dat het op het HAN-dak kan: gewicht en plaatsing vragen een aparte beoordeling.",
  "src": [
   "HAN groenmodules met praktijkvoorbeelden, dia 1 en 3",
   "Plattegrond (legenda)"
  ]
 },
 {
  "id": "reservoir",
  "cat": "Zelfwatergevende plantenbak",
  "title": "Waterreservoir en draagplaat",
  "status": "Feit",
  "pos": [
   1.40,
   0.95,
   2.85
  ],
  "anchor": [
   1.40,
   0.3,
   2.25
  ],
  "text": "Regenwater zakt door het substraat naar een reservoir onderin. Een draagplaat houdt het substraat boven het maximale waterniveau.",
  "note": "Dit doorsnedemodel is een schematische ontwerpkeuze, niet op schaal.",
  "say": "Onderin zit het waterreservoir. Regenwater zakt door het substraat naar beneden. Een draagplaat houdt het substraat boven het maximale waterniveau, zodat er ook ruimte voor lucht blijft.",
  "src": [
   "HAN groenmodules met praktijkvoorbeelden, dia 2 (schema en notitie)"
  ]
 },
 {
  "id": "capillair",
  "cat": "Zelfwatergevende plantenbak",
  "title": "Capillaire stroken",
  "status": "Nog te toetsen",
  "pos": [
   1.05,
   1.9,
   2.65
  ],
  "anchor": [
   1.05,
   1.1,
   2.05
  ],
  "text": "Capillaire stroken voeren water omhoog naar de wortelzone. Het systeem werkt zonder elektrische pomp.",
  "note": "De combinatie van stroken, substraat en planten moet nog worden getest met een proefmodel.",
  "say": "Dit zijn de capillaire stroken. Ze zuigen het water uit het reservoir omhoog naar de wortelzone, zonder elektrische pomp. Of de combinatie van stroken, substraat en planten goed werkt, moeten we nog testen.",
  "src": [
   "HAN groenmodules met praktijkvoorbeelden, dia 2 en 6"
  ]
 },
 {
  "id": "vulbuis",
  "cat": "Zelfwatergevende plantenbak",
  "title": "Vulbuis en overloop",
  "status": "Feit",
  "pos": [
   2.75,
   2.25,
   2.40
  ],
  "anchor": [
   2.75,
   1.6,
   2.40
  ],
  "text": "De vulbuis dient voor controle en bijvullen, de overloop voert te veel water af.",
  "note": "Hoe lang de voorraad meegaat met de gekozen beplanting moet nog worden getest.",
  "say": "Via de vulbuis kan beheer het reservoir controleren en bijvullen. Is er te veel water, dan voert de overloop het af. Bij droogte blijft bijvullen nodig.",
  "src": [
   "HAN groenmodules met praktijkvoorbeelden, dia 2 en 4"
  ]
 },
 {
  "id": "habitat",
  "cat": "Habitatbakken",
  "title": "Een lint van habitatbakken",
  "status": "Ontwerpkeuze",
  "pos": [
   21.0,
   1.05,
   2.38
  ],
  "anchor": [
   21.0,
   0.45,
   2.38
  ],
  "text": "Voorstel voor één kleine module: buitenmaat 100 × 40–50 cm, bakhoogte ca. 30–50 cm, in aluminium, hergebruikt kunststof of duurzaam hout, met lichtgewicht substraat en drainage.",
  "note": "Het aantal modules per lint (drie) en de plaats op het terras zijn een ontwerpkeuze in dit model.",
  "say": "Dit is een lint van habitatbakken: modules die je aan elkaar kunt koppelen. Een voorstel voor een kleine module is 100 bij 40 tot 50 centimeter en ongeveer 30 tot 50 centimeter hoog. Dat is een ontwerpmaat, geen getoetste specificatie.",
  "src": [
   "Presentatie habitatbakken, dia 9 (‘ontwerpmaat, geen getoetste specificatie’)",
   "Plattegrond"
  ]
 },
 {
  "id": "bloemen",
  "cat": "Habitatbakken",
  "title": "De bloemenbak",
  "status": "Feit",
  "pos": [
   -19.8,
   1.05,
   3.38
  ],
  "anchor": [
   -19.8,
   0.45,
   3.38
  ],
  "text": "Bloeiende inheemse soorten voor bijen, vlinders en zweefvliegen, bijvoorbeeld knoopkruid, beemdkroon en grasklokje.",
  "note": "",
  "say": "De bloemenbak heeft bloeiende inheemse soorten voor bijen, vlinders en zweefvliegen. Denk aan knoopkruid, beemdkroon en grasklokje. Combineer vroege, midden- en late bloeiers.",
  "src": [
   "Presentatie habitatbakken, dia 4 en 8"
  ]
 },
 {
  "id": "kruiden",
  "cat": "Habitatbakken",
  "title": "Kruiden en grassen",
  "status": "Feit",
  "pos": [
   -19.8,
   1.05,
   2.38
  ],
  "anchor": [
   -19.8,
   0.45,
   2.38
  ],
  "text": "Variatie in hoogte, bloei en beschutting; fijn voor insecten. Voor zonnig en droog: wilde tijm, gewone rolklaver, wilde marjolein.",
  "note": "",
  "say": "In de bak met kruiden en grassen zorgen verschillen in hoogte, bloei en beschutting voor variatie. Wilde tijm, gewone rolklaver en wilde marjolein houden van een zonnige, droge plek.",
  "src": [
   "Presentatie habitatbakken, dia 4 en 8"
  ]
 },
 {
  "id": "sedum",
  "cat": "Habitatbakken",
  "title": "De sedumbak",
  "status": "Feit",
  "pos": [
   -19.8,
   1.05,
   1.38
  ],
  "anchor": [
   -19.8,
   0.42,
   1.38
  ],
  "text": "Droogtetolerante vetplanten; relatief beperkte waterbehoefte.",
  "note": "",
  "say": "De sedumbak heeft droogtetolerante vetplanten, met een relatief beperkte waterbehoefte.",
  "src": [
   "Presentatie habitatbakken, dia 4"
  ]
 },
 {
  "id": "droog",
  "cat": "Habitatbakken",
  "title": "De droge habitat",
  "status": "Feit",
  "pos": [
   -19.8,
   1.05,
   -0.22
  ],
  "anchor": [
   -19.8,
   0.42,
   -0.22
  ],
  "text": "Zand, dood hout en holle stengels voor specifieke insecten.",
  "note": "",
  "say": "In de droge habitat liggen zand, dood hout en holle stengels. Dat is bedoeld voor specifieke insecten.",
  "src": [
   "Presentatie habitatbakken, dia 5"
  ]
 },
 {
  "id": "vochtig",
  "cat": "Habitatbakken",
  "title": "De vochtige habitat",
  "status": "Feit",
  "pos": [
   -19.8,
   1.05,
   -1.22
  ],
  "anchor": [
   -19.8,
   0.45,
   -1.22
  ],
  "text": "Vochtminnende planten; extra aandacht voor gewicht en waterbeheer.",
  "note": "",
  "say": "De vochtige habitat heeft vochtminnende planten, zoals watermunt en kattenstaart, als er voldoende ruimte is. Let op: extra aandacht voor gewicht en waterbeheer.",
  "src": [
   "Presentatie habitatbakken, dia 5 en 8"
  ]
 },
 {
  "id": "combi",
  "cat": "Habitatbakken",
  "title": "De combinatiebak",
  "status": "Feit",
  "pos": [
   -19.8,
   1.05,
   -2.22
  ],
  "anchor": [
   -19.8,
   0.45,
   -2.22
  ],
  "text": "Bloemen bovenin, geschikte nestholtes in een afzonderlijk deel.",
  "note": "",
  "say": "De combinatiebak heeft bloemen bovenin en geschikte nestholtes in een afzonderlijk deel.",
  "src": [
   "Presentatie habitatbakken, dia 5"
  ]
 },
 {
  "id": "onderhoud",
  "cat": "Aandachtspunten",
  "title": "Onderhoud van de habitatbakken",
  "status": "Feit",
  "pos": [
   -1.17,
   1.1,
   1.85
  ],
  "anchor": [
   -1.17,
   0.45,
   1.85
  ],
  "text": "Wekelijks in warme perioden: vocht. Per seizoen: bloei, zwerfafval, drainage, ongewenste groei. Jaarlijks: planten vervangen, bevestigingen inspecteren. Voor insecten: stengels laten overwinteren, geen gif.",
  "note": "Wie het onderhoud doet, is nog af te spreken.",
  "say": "Habitatbakken zijn klein, maar niet onderhoudsvrij. In warme perioden controleer je wekelijks het vocht, want bakken drogen sneller uit dan volle grond. Per seizoen kijk je naar bloei, afval, drainage en ongewenste groei, en jaarlijks vervang je uitgevallen planten en inspecteer je de bevestigingen.",
  "src": [
   "Presentatie habitatbakken, dia 11",
   "Zon-groen pergola – concept, p. 6 (beheer)"
  ]
 },
 {
  "id": "draagkracht",
  "cat": "Aandachtspunten",
  "title": "Gewicht en draagkracht",
  "status": "Nog te toetsen",
  "pos": [
   4.48,
   1.45,
   1.88
  ],
  "anchor": [
   4.48,
   0.8,
   1.88
  ],
  "text": "Er zijn nog geen ingemeten dakgegevens of constructieberekeningen. Een constructeur en een dakexpert moeten de plaatsing beoordelen.",
  "note": "Bank en gebruikers komen bovenop het gewicht van bak, verzadigd substraat, planten en water.",
  "say": "Dit is het grootste vraagteken: het dak. We weten nog niet hoeveel extra belasting het aankan. Het gewicht bestaat uit de bak, verzadigd substraat, planten en opgeslagen water. Een constructeur moet beoordelen waar bakken veilig kunnen staan.",
  "src": [
   "HAN groenmodules met praktijkvoorbeelden, dia 5",
   "Zon-groen pergola – concept, p. 13"
  ]
 },
 {
  "id": "sensor",
  "cat": "Onderzoek",
  "title": "De sensor",
  "status": "Feit",
  "pos": [
   -32.3,
   2.4,
   -5.2
  ],
  "anchor": [
   -32.31,
   1.7,
   -4.43
  ],
  "text": "Een sensor voor temperatuur en bodemvocht kan zichtbaar maken wat de pergola doet.",
  "note": "Plaats en aantal sensoren zijn een ontwerpkeuze in dit model.",
  "say": "Een sensor voor temperatuur en bodemvocht kan zichtbaar maken wat het ontwerp doet. Zo past de plek bij een levend laboratorium en bij de BioBlitz-activiteiten van de HAN.",
  "src": [
   "Zon-groen pergola – concept, p. 5 (leren en verblijven)"
  ]
 },
 {
  "id": "rood",
  "cat": "Verlichting",
  "title": "Rood licht in de avond",
  "status": "Nog te toetsen",
  "pos": [
   40.7,
   1.9,
   -2.2
  ],
  "anchor": [
   40.7,
   2.25,
   -2.75
  ],
  "text": "Onderzoek van NIOO-KNAW en Wageningen University: rood licht verminderde de activiteit van lichtschuwe vleermuizen niet, wit en groen wel. Rood is minder verstorend, niet onschadelijk.",
  "note": "Of dit iets toevoegt, hangt af van de bestaande terreinverlichting. Dat vragen we aan de opdrachtgever.",
  "say": "Dit rode lampje hoort bij een idee dat nog geverifieerd moet worden. Laag, gedimd rood licht op zonnestroom is minder verstorend voor vleermuizen dan wit licht, maar niet onschadelijk. Of het nodig is, hangt af van de bestaande terreinverlichting.",
  "src": [
   "Zon-groen pergola – concept, p. 2, p. 6 en p. 14"
  ]
 },
 {
  "id": "lokaal",
  "cat": "Gebruik",
  "title": "Het buitenlokaal",
  "status": "Feit",
  "pos": [
   -34.8,
   1.7,
   -2.75
  ],
  "anchor": [
   -34.8,
   0.8,
   -2.75
  ],
  "text": "Een beschutte plek om te studeren, te lunchen en elkaar te ontmoeten.",
  "note": "",
  "say": "Hier zie je het buitenlokaal. Banken en tafels staan klaar voor een klas of projectgroep, in de schaduw. De sociale waarde is alleen sterk als studenten echt invloed hebben op het ontwerp en het gebruik.",
  "src": [
   "Zon-groen pergola – concept, p. 1, p. 3 en p. 4"
  ]
 },
 {
  "id": "pad",
  "cat": "Ruimtelijke opzet",
  "title": "Paden en looproutes",
  "status": "Ontwerpkeuze",
  "pos": [
   -10.3,
   1.0,
   4.4
  ],
  "anchor": [
   -10.3,
   0.03,
   4.4
  ],
  "text": "Het pad langs de zijkant en twee dwarspaden verbinden pergola’s, plantenbakken en habitatbakken. Looproutes blijven vrij.",
  "note": "Breedte en materiaal van de paden zijn een ontwerpkeuze; de plattegrond geeft alleen de globale ligging. Opbouw en gewicht van een grasondergrond zijn nog niet getoetst.",
  "say": "De paden van zand, grind of tegels verbinden de onderdelen. Op de plattegrond is de ondergrond gras, maar hoe dat op het dak moet, is nog niet onderzocht. Looproutes houden we vrij.",
  "src": [
   "Plattegrond (legenda)",
   "Presentatie habitatbakken, dia 7 en 10"
  ]
 }
];

const SAY_CHARS = POINTS.reduce((a, p) => a + p.say.length, 0);
PF.POINTS = POINTS; PF.POINT_SAY_CHARS = SAY_CHARS; PF.POINT_LIMIT = 6671;

/* ---------- bolletjes in de 3D-scène ---------- */
PF.createPoints = function (parent) {
  const root = new THREE.Group(); root.name = 'infopunten'; root.visible = false; parent.add(root);
  const tex = {
    halo: PF.canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,214,110,.75)'); g.addColorStop(.3, 'rgba(255,200,90,.2)'); g.addColorStop(1, 'rgba(255,200,90,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }),
    ring: PF.canvasTex(256, 256, (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 5; c.beginPath(); c.arc(128, 128, 112, 0, Math.PI * 2); c.stroke(); }),
    icon: PF.canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#1d2a24'; c.font = 'bold 40px "Bricolage Grotesque", Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('i', 32, 36); })
  };
  const coreGeo = new THREE.SphereGeometry(.125, 20, 14), dotGeo = new THREE.SphereGeometry(.035, 8, 6), hitGeo = new THREE.SphereGeometry(.5, 8, 6);
  const CY = new THREE.Color(0xe9b23a), CG = new THREE.Color(0x7fb685);
  const items = POINTS.map((p, k) => {
    const g = new THREE.Group(); g.position.set(p.pos[0], p.pos[1], p.pos[2]); root.add(g);
    const coreMat = new THREE.MeshStandardMaterial({ color: CY, emissive: 0xc98d12, emissiveIntensity: .55, roughness: .45, flatShading: true });
    const core = new THREE.Mesh(coreGeo, coreMat); g.add(core);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex.halo, transparent: true, depthWrite: false, opacity: .8 })); halo.scale.setScalar(.9); g.add(halo);
    const ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex.ring, transparent: true, depthWrite: false, opacity: 0, color: 0xffe9a8 })); g.add(ring);
    const icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex.icon, transparent: true, depthWrite: false })); icon.scale.setScalar(.22); g.add(icon);
    const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false })); hit.userData.pointId = p.id; g.add(hit);
    // dunne verbindingslijn naar het onderdeel
    const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p.pos[0], p.pos[1], p.pos[2]), new THREE.Vector3(p.anchor[0], p.anchor[1], p.anchor[2])]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xf6e6b4, transparent: true, opacity: .7 });
    const line = new THREE.Line(lg, lineMat); root.add(line);
    const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xf6e6b4 })); dot.position.set(p.anchor[0], p.anchor[1], p.anchor[2]); root.add(dot);
    return { p, k, g, core, coreMat, halo, ring, icon, hit, line, lineMat, dot, s: 1, seen: false, pop: 0, glow: 0, d: 99 };
  });
  const byId = {}; items.forEach(it => byId[it.p.id] = it);
  const v = new THREE.Vector3(), fwd = new THREE.Vector3(), tmp = new THREE.Vector3();
  const ray = new THREE.Raycaster(); const hitMeshes = items.map(it => it.hit);
  let focusId = null;
  const api = { root, items, byId,
    setVisible(b) { root.visible = !!b; },
    markSeen(id) { const it = byId[id]; if (it) { it.seen = true; it.pop = 1; } },
    pulse(id) { const it = byId[id]; if (it) it.pop = 1; },
    reset() { items.forEach(it => { it.seen = false; }); focusId = null; },
    /* elke frame: cam = camera; open = id van het geopende punt (of null) */
    update(dt, cam, t, openId) {
      if (!root.visible) return null;
      cam.getWorldDirection(fwd); let best = null, bestScore = 1e9;
      items.forEach(it => {
        v.copy(it.g.position).sub(cam.position); const d = v.length(); it.d = d; v.divideScalar(Math.max(d, 1e-4)); const cosA = clamp(v.dot(fwd), -1, 1), ang = Math.acos(cosA);
        // schaal: veraf iets groter zodat ze zichtbaar blijven, dichtbij rustig
        const far = clamp((d - 4) / 22, 0, 1), near = 1 - clamp((d - 2) / 6, 0, 1);
        const target = lerp(1, 2.0, far) * (1 + .22 * near);
        it.s += (target - it.s) * (1 - Math.exp(-dt * 6));
        const inView = cosA > .5;
        const aimed = d < 8 && ang < .24; // ~14°
        const close = d < 3 && ang < .95;
        let score = 1e9; if (inView && (aimed || close)) score = ang + d * .012 - (aimed ? .3 : 0);
        if (score < bestScore) { bestScore = score; best = it; }
        it.pop = Math.max(0, it.pop - dt * 2.2);
      });
      focusId = best ? best.p.id : null;
      items.forEach(it => {
        const f = it === best ? 1 : 0; it.glow += (f - it.glow) * (1 - Math.exp(-dt * 8));
        const open = it.p.id === openId;
        const pulse = 1 + .07 * Math.sin(t * 2.3 + it.k * 1.7), bob = Math.sin(t * 1.3 + it.k * 2.1) * .06;
        const sc = it.s * (pulse + it.glow * .22 + it.pop * .35 + (open ? .15 : 0));
        it.core.scale.setScalar(sc); it.core.position.y = bob;
        it.coreMat.color.copy(it.seen ? CG : CY); it.coreMat.emissive.setHex(it.seen ? 0x3f7d4a : 0xc98d12); it.coreMat.emissiveIntensity = .5 + it.glow * .5 + it.pop * .6;
        const far = clamp((it.d - 6) / 24, 0, 1);
        it.halo.scale.setScalar(sc * (2.3 + it.glow * .7)); it.halo.position.y = bob; const nf = clamp((it.d - 1.8) / 3.2, 0, 1), nfs = nf * nf * (3 - 2 * nf); it.halo.material.opacity = ((.22 + it.glow * .3) * (1 - far * .35) + it.pop * .2) * nfs;
        const rp = ((t * (.45 + it.glow * .35) + it.k * .31) % 1); it.ring.position.y = bob; it.ring.scale.setScalar(sc * (1.1 + rp * 1.4)); it.ring.material.opacity = (1 - rp) * (.22 + it.glow * .45) * (it.seen ? .5 : 1) * nfs;
        // 'i' altijd vóór de bol, naar de camera gericht
        tmp.copy(cam.position).sub(it.g.position).normalize().multiplyScalar(.15 * sc); it.icon.position.copy(tmp); it.icon.position.y += bob; it.icon.scale.setScalar(.15 * sc);
        it.icon.material.opacity = it.seen ? .0 : 1;
        it.hit.scale.setScalar(Math.max(.5, it.s * .75));
        it.lineMat.opacity = (.28 + it.glow * .55 + (open ? .25 : 0)) * (1 - far * .4);
      });
      return focusId;
    },
    /* ndc ∈ [-1,1]: geeft id van het geraakte bolletje */
    pick(cam, nx, ny) { ray.setFromCamera({ x: nx, y: ny }, cam); ray.far = 40; const h = ray.intersectObjects(hitMeshes, false); return h.length ? h[0].object.userData.pointId : null; },
    get focus() { return focusId; }
  };
  return api;
};
})(window);

