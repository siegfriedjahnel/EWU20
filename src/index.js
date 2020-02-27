const content = document.getElementById("content");

const contentTitel = document.getElementById("contentTitel");
const fab = document.getElementById("fab");
const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
const loaderGif = `<img class="loadergGif" src="images/loading.gif">`;
fab.addEventListener('click',backNavigation())
var turnierListeHtml = "";
var zeitplan = [];
var startListe = [];
var ergebnisListe = [];
var turnierName = "";
var pruefungsName = "";
const apiProxy = "https://sj-sam.de/apps/ewu-app/proxy2.php";
const navigation=[
    {"title":"Alle Turnier", "view":"turnierListeHtml","fab":"hidden"},
    {"title":"Turnier", "view":"pruefungsListeHtml", "fab":"visible"},
    {"title":"Pruefung", "view":"turnurlisteHtml","fab":"visible"},


];



getTurnierListe('Turniere/Aktuell')
.then();

//------------------------------------------------------------------------
async function getTurnierListe(what){
    content.innerHTML = `<img class="loadingGif" src="images/loading.gif">`;
    // let response = await fetch(`${apiProxy}?a=${what}`);
    let response = await fetch("Aktuell.json");
    let myJson = await response.json();
    let turnierListe = myJson.turnierLightList;
    turnierListe.sort(function(a,b){return b.anfang.localeCompare(a.anfang)});
    turnierListeHtml = turnierListe.map(drawTurniere).join('\n');
    content.innerHTML = turnierListeHtml;
    contentTitel.innerHTML = "Alle Turniere";
}//-------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------
async function getZeitplan(turnierNr){
    fab.style.visibility="visible";
    contentTitel.innerHTML = "";
    content.innerHTML = loaderGif;
    // let response = await fetch(`${apiProxy}?a=Turniere/Zeitplan/${turnierNr}`);
    let response = await fetch("Zeitplan.json");
    
    let myJson = await response.json();
    contentTitel.innerHTML = myJson.tunierbezeichnung;
    let zeitplan = myJson.zeitplan;
    pruefungsListeHtml = zeitplan.map(drawPruefungen).join('\n');
    content.innerHTML = pruefungsListeHtml;
   
}//------------------------------------------------------------------------------------------------------


async function getStartListe(pruefungsId){

    return startListe;
}

async function getErgebnisListe(pruefungsId){

    return ergebnisListe;
}

//-------------------------------------------------------------------------------------------
function drawTurniere(element){
    let anfang =new Date(element.anfang).toLocaleDateString('de-DE', options);
    let nennschluss = new Date(element.nennschluss).toLocaleDateString('de-DE', options);

    return `<div class="card" id="${element.turnierNr}">
    <b>${element.name}</b><br>
    <b>${anfang}</b><br>
    
    ${element.ort}<br>
    <i>Nennschluss: ${nennschluss}</i><br>
    <button class="linkButton" onclick="getZeitplan(${element.turnierNr})">Zeitplan</button>
    <button class="linkButton">News</button>
    <button class="linkButton">Info</button>
    </div>`;
}//------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
function drawPruefungen(element){
    var pruefungsNr = element.id;
                var eintrag = element.eintrag;
                var reitplatz = element.reitplatz;
                var tagDatum = new Date(element.tagDatum);
                var startZeit = element.startZeit.substring(0, 5);
                tagDatum = tagDatum.toLocaleDateString('de-DE', options);
                var wochenTag = tagDatum.substring(0, 2);
                var anzahlNennungen = element.anzahlNennungen;
    return `<div class="card" id="${element.id}">
    <b>${wochenTag}, ${startZeit} ${eintrag}</b><br>
        <b>${reitplatz}</b>,  Nennungen: ${anzahlNennungen}<br>
        <button class="linkButton" onclick="startliste(${pruefungsNr})">Startliste</button>
        <button class="linkButton" onclick="pattern(${pruefungsNr})">Pattern</button>
        <button class="linkButton" onclick="ergebnis(${pruefungsNr})">Ergebnis</button>
    </div>`;
}//-----------------------------------------------------------------------------------------------------


function backToAktuell(turnierNr){
    backArrow.innerHTML="";
    contentTitel.innerHTML="Alle Turniere";
    content.innerHTML = turnierListeHtml;
    document.getElementById(turnierNr).scrollIntoView();

}

function backNavigation(){
    console.log("back");
}