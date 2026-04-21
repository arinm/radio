/**
 * Seed station descriptions. Writes a unique SEO description for each active station.
 * Run with: npx tsx prisma/seed-descriptions.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DESCRIPTIONS: Record<string, string> = {
  'kiss-fm':
    'Kiss FM este postul de radio preferat de tinerii din Romania, cu hituri pop si dance internationale non-stop. Emite live din Bucuresti pe 96.1 FM si online, cu emisiuni de dimineata energice si mixuri de DJ. Asculta Kiss FM live gratuit pentru cele mai noi piese din topuri.',
  'europa-fm':
    'Europa FM este unul dintre cele mai ascultate posturi de radio din Romania, cu muzica pop si rock internationala, stiri si emisiuni matinale de referinta. Emite din 2000 pe 106.7 FM in Bucuresti si online. Asculta Europa FM live gratuit pentru informatie de calitate si hiturile momentului.',
  'radio-zu':
    'Radio ZU este postul cu personalitate al Romaniei, celebru pentru Morning ZU cu Daniel Buzdugan si Mihai Morar. Emite pop si dance pentru generatia tanara pe 89.0 FM din Bucuresti. Asculta Radio ZU online gratuit pentru emisiuni amuzante si hituri contemporane.',
  'pro-fm':
    'Pro FM este un post de radio emblematic din Romania, cu muzica pop si dance si prezentatori recunoscuti. Emite live din Bucuresti pe 102.8 FM in format HQ si online la 128 kbps. Asculta Pro FM live pentru cele mai bune hituri romanesti si internationale.',
  'digi-fm':
    'Digi FM este postul de radio al grupului Digi care combina stirile la fiecare sfert de ora cu muzica pop light. Emite din Bucuresti pe 97.1 FM si online la 128 kbps. Asculta Digi FM live pentru informare rapida si muzica placuta pe tot parcursul zilei.',
  'magic-fm':
    'Magic FM este postul de radio pentru iubitorii de muzica pop si retro, cu piese clasice din anii 80, 90 si 2000. Emite din Bucuresti cu o atmosfera relaxanta, perfecta pentru birou sau serile linistite. Asculta Magic FM live online gratuit, 24 din 24.',
  'virgin-radio-romania':
    'Virgin Radio Romania transmite hituri pop si dance internationale actuale, cu accent pe productiile britanice si americane. Face parte din reteaua internationala Virgin Radio. Asculta Virgin Radio Romania live online gratuit pentru energie si piese de calitate.',
  'rock-fm':
    'Rock FM este postul dedicat pasionatilor de muzica rock din Romania, cu piese din Metallica, AC/DC, Queen, Nirvana, Bon Jovi si rock romanesc clasic. Emite din Bucuresti live. Asculta Rock FM online gratuit pentru chitara, energie si atitudine rock autentica.',
  'radio-romania-actualitati':
    'Radio Romania Actualitati este postul public de radio national, cu stiri la fiecare ora, analize politice, dezbateri economice si emisiuni culturale. Face parte din SRR (Societatea Romana de Radiodifuziune). Asculta Radio Romania Actualitati live pentru informatie oficiala, credibila si completa.',
  'digi24-fm':
    'Digi24 FM este postul de radio de stiri al grupului Digi, cu transmisiuni in direct, analize si dezbateri pe teme de actualitate. Asculta Digi24 FM live online gratuit pentru informatie rapida, obiectiva si bine documentata pe tot parcursul zilei.',
  'realitatea-fm':
    'Realitatea FM este un post de radio axat pe stiri, informatii politice si dezbateri de actualitate din Romania si din lume. Asculta Realitatea FM live online pentru acoperirea evenimentelor in timp real si analize pertinente din partea jurnalistilor experimentati.',
  'rfi-romania':
    'RFI Romania este emisia in limba romana a Radio France Internationale, cu stiri internationale, emisiuni culturale si corespondenti in intreaga lume. Asculta RFI Romania live online pentru o perspectiva europeana si francofona asupra actualitatii.',
  'dance-fm':
    'Dance FM este postul de radio care transmite non-stop muzica dance, house, EDM si electro. Perfect pentru antrenament, party sau conducere. Asculta Dance FM live online gratuit pentru cele mai bune beat-uri dance din Romania si din lume, 24 din 24.',
  'deep-house-radio':
    'Deep House Radio este dedicat fanilor de muzica deep house, tech house si melodic techno. Perfect pentru ambient de lounge sau sesiuni de focus. Asculta Deep House Radio online gratuit pentru cele mai bune seturi house din Romania, non-stop.',
  'dj-radio-romania':
    'DJ Radio Romania transmite mixuri exclusive de la cei mai buni DJi din Romania, cu accent pe house, techno si electronic. Asculta DJ Radio Romania live online gratuit pentru seturi live si party mixuri actualizate zilnic.',
  'club-radio':
    'Club Radio este radioul pentru iubitorii de muzica de club — house, techno, EDM si remix-uri ale hiturilor momentului. Asculta Club Radio live online gratuit si adu atmosfera de club oriunde ai fi, 24 din 24.',
  'one-fm':
    'One FM este postul de radio cu muzica dance si electronica, ideal pentru energie si distractie. Emite non-stop pop dance si hituri de club. Asculta One FM live online gratuit pentru cele mai bune piese dance romanesti si internationale.',
  'radio-guerrilla':
    'Radio Guerrilla este postul de radio alternativ al Romaniei, cu rock independent, muzica alternativa, emisiuni culturale si dezbateri cu accent pe spiritul critic. Asculta Radio Guerrilla live online gratuit pentru o voce libera si o selectie muzicala inteligenta.',
  'rock-fm-hard-rock':
    'Rock FM Hard Rock este canalul dedicat hard rock-ului si metalului — Iron Maiden, Metallica, Judas Priest, AC/DC si rock romanesc clasic. Asculta Rock FM Hard Rock live online gratuit pentru o doza zilnica de chitara grea si atitudine metalheadica.',
  'rock-fm-blues':
    'Rock FM Blues transmite non-stop muzica blues si jazz de calitate — B.B. King, Muddy Waters, Eric Clapton si artisti contemporani. Asculta Rock FM Blues live online gratuit pentru o selectie relaxata, perfecta pentru seri de lounge sau dimineti linistite.',
  'national-fm':
    'National FM este cel mai popular post de radio cu manele si muzica populara din Romania. Transmite non-stop cele mai ascultate piese romanesti din topuri. Asculta National FM live online gratuit pentru atmosfera de petrecere romaneasca, 24 din 24.',
  'fm-radio-manele':
    'FM Radio Manele este un post dedicat 100% genului manele, cu piesele celor mai iubiti artisti — Florin Salam, Tzanca Uraganul, Jador si multi altii. Asculta FM Radio Manele live online gratuit pentru cele mai noi aparitii din gen.',
  'radio-manele-premium':
    'Radio Manele Premium selecteaza cele mai bune manele de calitate premium — productii noi, colaborari si piese de top. Asculta Radio Manele Premium live online gratuit pentru selectia definitiva a genului manele romanesti.',
  'radio-1-manele':
    'Radio 1 Manele transmite non-stop manele vechi si noi, cu accent pe hiturile de petrecere. Asculta Radio 1 Manele live online gratuit si adu atmosfera de sarba romaneasca oriunde ai fi.',
  'radio-flo-manele':
    'Radio Flo Manele este un post cu manele de calitate, piese de petrecere si productii noi. Asculta Radio Flo Manele live online gratuit pentru cele mai populare manele romanesti, 24 din 24.',
  'radio-tequila-manele':
    'Radio Tequila Manele face parte din reteaua Radio Tequila si transmite non-stop manele noi si vechi. Asculta Radio Tequila Manele live online gratuit pentru selectia variata de manele si atmosfera de petrecere.',
  'radio-lautaru':
    'Radio Lautaru este postul dedicat muzicii populare romanesti si lautaresti. Transmite piese din toate regiunile tarii — Banat, Muntenia, Moldova, Oltenia. Asculta Radio Lautaru live online gratuit pentru autenticitate romaneasca.',
  'radio-petrecaretzu':
    'Radio Petrecaretzu transmite muzica populara si manele pentru petreceri, nunti si evenimente. Asculta Radio Petrecaretzu live online gratuit pentru atmosfera autentica romaneasca, cu toate piesele care ridica petrecerea.',
  'gold-fm':
    'Gold FM este postul care transmite cele mai mari hituri pop din ultimii 40 de ani — aur curat pentru urechile tale. Emite non-stop piese clasice din anii 80, 90 si 2000. Asculta Gold FM live online gratuit pentru nostalgie si calitate.',
  'romantic-fm':
    'Romantic FM este postul de radio pentru cei care iubesc baladele pop si piesele romantice. Transmite non-stop muzica de dragoste, clasici romantici si hituri pop light. Asculta Romantic FM live online gratuit, perfect pentru seri intime.',
  'magic-gold-hits':
    'Magic Gold Hits transmite cele mai mari hituri retro ale Magic FM — piesele care au definit o generatie. Asculta Magic Gold Hits live online gratuit pentru un travel in timp prin hiturile anilor 80, 90 si 2000.',
  'radio-oldies-romania':
    'Radio Oldies Romania este dedicat pasionatilor de muzica veche — rock and roll, disco, pop clasic din anii 60-80. Asculta Radio Oldies Romania live online gratuit pentru melodii care nu se invechesc niciodata.',
  'radio-tequila-oldies':
    'Radio Tequila Oldies transmite hituri retro si dance clasic. Face parte din reteaua Radio Tequila. Asculta Radio Tequila Oldies live online gratuit pentru o selectie de piese vintage si dance care ridica dispozitia.',
  'play-90s':
    'Play 90s este postul pentru nostalgici — doar hituri din anii 90, de la Eurodance la rock alternativ si pop clasic. Asculta Play 90s live online gratuit si retraieste atmosfera de discoteca din anii 90.',
  'chill-fm':
    'Chill FM transmite muzica de relaxare, ambient, lounge si piese chill-out. Perfect pentru studiu, munca de acasa sau ambient in background. Asculta Chill FM live online gratuit pentru o atmosfera relaxata, non-stop.',
  'magic-sunset':
    'Magic Sunset este canalul Magic FM dedicat momentelor de relaxare — piese smooth si lounge, perfect pentru apus si serile linistite. Asculta Magic Sunset live online gratuit pentru o selectie sofisticata de chill-out.',
  'play-radio-cafe':
    'Play Radio Cafe transmite muzica de cafenea — acustic, pop light si lounge pentru o atmosfera calda si primitoare. Asculta Play Radio Cafe live online gratuit, perfect pentru cafeaua de dimineata sau pauzele de lucru.',
  'radio-cafe-romania':
    'Radio Cafe Romania combina pop-ul relaxat cu chill-out-ul, creand un fond muzical perfect pentru cafenele, birouri si intalniri. Asculta Radio Cafe Romania live online gratuit pentru o atmosfera placuta pe tot parcursul zilei.',
  'cozy-fm':
    'Cozy FM transmite muzica pop relaxanta si acustica, ideal pentru serile linistite acasa. Asculta Cozy FM live online gratuit pentru o experienta audio confortabila, cu piese soft pop si balade internationale.',
  'radio-romania-cultural':
    'Radio Romania Cultural este postul public dedicat culturii — muzica clasica, jazz, teatru radiofonic, literatura, filosofie si arte vizuale. Parte din SRR. Asculta Radio Romania Cultural live online gratuit pentru programe de calitate si continut educativ.',
  'radio-romania-muzical':
    'Radio Romania Muzical este postul public dedicat muzicii clasice, cu concerte live, inregistrari din arhiva Filarmonicii si emisiuni despre compozitori. Asculta Radio Romania Muzical live online gratuit pentru cea mai bogata programare clasica din Romania.',
  'e-teatru':
    'e-Teatru este un post unic in peisajul romanesc — transmite non-stop piese de teatru radiofonic, adaptari literare si scene clasice din arhiva teatrala. Asculta e-Teatru live online gratuit pentru o experienta culturala unica.',
  'radio-trinitas':
    'Radio Trinitas este postul oficial al Patriarhiei Romane, cu slujbe religioase, emisiuni duhovnicesti si muzica bizantina. Asculta Radio Trinitas live online gratuit pentru informatie religioasa si mesaje spirituale.',
  'radio-agape':
    'Radio Agape este un post de radio crestin protestant cu emisiuni despre credinta, muzica de lauda si predici. Asculta Radio Agape live online gratuit pentru mesaje evanghelice si muzica crestina contemporana.',
  'aripi-spre-cer':
    'Aripi Spre Cer este un post de radio crestin care transmite muzica de inchinare, predici si emisiuni spirituale. Asculta Aripi Spre Cer live online gratuit pentru intarire sufleteasca si mesaje de speranta.',
  'radio-cluj':
    'Radio Cluj este postul public regional din Transilvania, cu stiri locale din Cluj-Napoca si judete limitrofe, muzica populara transilvaneana si emisiuni culturale. Parte din SRR. Asculta Radio Cluj live online gratuit pentru informatie locala si muzica ardeleneasca.',
  'radio-timisoara':
    'Radio Timisoara este postul public regional din Banat, cu stiri locale, emisiuni culturale si muzica populara banateana. Parte din SRR. Asculta Radio Timisoara live online gratuit pentru informatii din vestul Romaniei si traditie banateana.',
  'napoca-fm':
    'Napoca FM este postul de radio din Cluj-Napoca cu muzica pop si dance, concentrat pe tinerii din Transilvania. Asculta Napoca FM live online gratuit pentru hituri contemporane si spirit clujean.',
  'radio-antena-satelor':
    'Radio Antena Satelor este postul public dedicat zonelor rurale din Romania, cu muzica populara, informatii pentru agricultori si emisiuni despre viata la tara. Parte din SRR. Asculta Radio Antena Satelor live online pentru autenticitate romaneasca.',
  'gherla-fm':
    'Gherla FM este un post local din Cluj care transmite retro si dance pentru comunitatea locala. Asculta Gherla FM live online gratuit pentru o selectie eclectica cu accent pe hituri dance si piese vintage.',
  'radio-impuls':
    'Radio Impuls este un post de radio cu muzica pop romaneasca si internationala, cu un format dinamic si modern. Asculta Radio Impuls live online gratuit pentru energie pop, 24 din 24.',
  'smart-radio':
    'Smart Radio transmite muzica retro si oldies cu un format inteligent si piese soigur selectate. Asculta Smart Radio live online gratuit pentru hituri clasice din mai multe decenii, perfect pentru fundal relaxant.',
  'kiss-millennium-hits':
    'Kiss Millennium Hits este canalul special al Kiss FM dedicat hiturilor din anii 2000 — emblematice piese de millennium pop si dance. Asculta Kiss Millennium Hits live online gratuit pentru nostalgie Y2K pura.',
  'magic-party-mix':
    'Magic Party Mix este canalul Magic FM dedicat petrecerilor — mixuri de dance si retro care te fac sa dansezi. Asculta Magic Party Mix live online gratuit pentru atmosfera de petrecere oriunde ai fi.',
  'radio-hot-style':
    'Radio Hot Style transmite cele mai hot piese pop si dance ale momentului, cu accent pe hiturile din topuri. Asculta Radio Hot Style live online gratuit pentru energie si stil, non-stop.',
  'radio-boom-house':
    'Radio Boom House Music este dedicat 100% house-ului — classic house, tech house, progressive si electro house. Asculta Radio Boom House Music live online gratuit pentru cele mai bune beat-uri house, 24 din 24.',
  'prob-radio':
    'ProB Radio este un post underground cu muzica dance si electronic, cu accent pe productii noi si remixuri. Asculta ProB Radio live online gratuit pentru o selectie proaspata de piese dance si electronic.',
  'radio-doina':
    'Radio Doina transmite non-stop muzica populara romaneasca autentica, din toate regiunile tarii. Asculta Radio Doina live online gratuit pentru doinele, sarbele si horele care definesc folclorul romanesc.',
  'radio-terra':
    'Radio Terra combina muzica pop cu hituri retro pentru o experienta variata si placuta. Asculta Radio Terra live online gratuit pentru un mix inteligent de piese vechi si noi.',
  'ebs-radio':
    'EBS Radio este un post de radio din Cluj-Napoca cu muzica pop si format modern pentru ascultatori din Transilvania. Asculta EBS Radio live online gratuit pentru piese pop actuale si spirit clujean.',
  'cfm-radio':
    'CFM Radio transmite muzica pop romaneasca si internationala cu un format dinamic. Asculta CFM Radio live online gratuit pentru hituri actuale si o selectie variata de piese pop.',
};

async function main() {
  const stations = await prisma.station.findMany({
    where: { isActive: true },
    select: { slug: true, name: true },
  });

  console.log(`Found ${stations.length} active stations`);

  let updated = 0;
  let missing: string[] = [];

  for (const station of stations) {
    const description = DESCRIPTIONS[station.slug];
    if (!description) {
      missing.push(station.slug);
      continue;
    }
    await prisma.station.update({
      where: { slug: station.slug },
      data: { description },
    });
    updated++;
  }

  console.log(`✓ Updated ${updated} station descriptions`);
  if (missing.length > 0) {
    console.log(`⚠ Missing descriptions for ${missing.length} slugs:`, missing);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
