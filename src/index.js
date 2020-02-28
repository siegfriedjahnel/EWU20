const content = document.getElementById("content");

const contentTitel = document.getElementById("contentTitel");
const fab = document.getElementById("fab");
const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
const loaderGif = `<img class="loadergGif" src="images/loading.gif">`;
fab.addEventListener('click',backNavigation);
var turnierListeHtml = "";
var pruefungsListeHtml = "";
var startListeHtml = "";
var ergebnisListeHtml = "";
var divId;
var turnierName = "";
var pruefungsName = "";
const apiProxy = "https://sj-sam.de/apps/ewu-app/proxy2.php";
const navigation=[
    {"title":"Alle Turnier", "view":"turnierListeHtml","fab":"hidden"},
    {"title":"Turnier", "view":"pruefungsListeHtml", "fab":"visible"},
    {"title":"Pruefung", "view":"turnurlisteHtml","fab":"visible"},
];

var navigationLevel = 0;

getTurnierListe('Turniere/Aktuell')
.then();

//------------------------------------------------------------------------
async function getTurnierListe(what){
    navigationLevel = 0;
    fab.style.visibility=navigation[navigationLevel].fab;
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
    navigationLevel = 1;
    divId=turnierNr;
    fab.style.visibility=navigation[navigationLevel].fab;
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
    navigationLevel=2;
    divId=pruefungsId;
    fab.style.visibility=navigation[navigationLevel].fab;
    contentTitel.innerHTML = "";
    content.innerHTML = loaderGif;
    let response = await fetch("Startliste.json");
    let myJson = await response.json();
    let startListe = myJson.reiterList;
    contentTitel.innerHTML = myJson.pruefungKurz;
    startListeHtml = startListe.map(drawStartliste).join('\n');
    content.innerHTML = startListeHtml;

    
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
        <button class="linkButton" onclick="getStartListe(${pruefungsNr})">Startliste</button>
        <button class="linkButton" onclick="pattern(${pruefungsNr})">Pattern</button>
        <button class="linkButton" onclick="ergebnis(${pruefungsNr})">Ergebnis</button>
    </div>`;
}//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
function drawStartliste(element){
    return `<div class="card">
    <b>${element.position} | ${element.reiter} (${element.startNr}) - ${element.pferd}</b>
    </div>`;
}
//--------------------------------------------------------------------------------------------------------


function backToAktuell(turnierNr){
    backArrow.innerHTML="";
    contentTitel.innerHTML="Alle Turniere";
    content.innerHTML = turnierListeHtml;
    document.getElementById(turnierNr).scrollIntoView();

}

function backNavigation(){
    
    switch(navigationLevel){
        case 1:
            content.innerHTML=turnierListeHtml;
            document.getElementById(divId).scrollIntoView();
        break;

        case 2:
            content.innerHTML=startListeHtml;
            document.getElementById(divId).scrollIntoView();
        break;
        case 3:
            content.innerHTML=pruefungsListeHtml;
            document.getElementById(divId).scrollIntoView();
        break;
    }
}