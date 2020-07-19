const request = require('request');
const fs = require('fs');

exports.search = (req, res) => {
  const start = Date.now();

  let cache = "";
  try {
    cache = fs.readFileSync("./cache/" + req.body + ".json", 'utf8');
  } catch (err) {

  }

  if(cache != ""){
    console.log("On recupère le cache");
    res.end(cache);
    console.log("Total : " + (Date.now() - start) +"ms");
  }
  else{
    infoFromJDM(req.body).then((text) => {
      if(text !== "Error" && text !== "") {
        let resu = parserReponse(text); // Si on a recup les infos, on va parser le tout et construire un JSON + cache si besoin.
        resu.then((r) => {
          res.end(r);
          fs.writeFile("./cache/" +req.body+".json", r, function(err) {
            // If an error occurred, show it and return
            if(err) return console.log(err);
            // Successfully wrote binary contents to the file!
          });
        });
      }
      else{
        res.end('404');
      }
      console.log("Total : " + (Date.now() - start) +"ms");
    });
  }


}

function infoFromJDM(word){
  const start = Date.now();
  return new Promise((resolve) => {
    let text = "Error";

    // Envoie une requête GET pour récuperer les infos du mot.
    request({url: 'http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel='+word, encoding: "latin1"}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const indexOfStart = body.indexOf("<CODE>") + 6;
        const indexOfEnd = body.indexOf("</CODE>");
        const html = body.substr(indexOfStart, indexOfEnd - indexOfStart);
        text = html.replace(new RegExp("<br ?/?>", 'g'), '\n');
      }
      else{
        console.log("Error "+response.statusCode);
      }
      console.log("Tps réponse serveur JDM pour '" + word + "'  : " + (Date.now() - start) +"ms");
      resolve(text.trim()); // ne pas deplacer
    });
  });
}

// Retourne le mot correspondant au code (ex : wordCode = 150 return 'chat')
// Fonction optimisé (rapide) : OUI
function findWordsById(wordCode, entries) {
  let regex = new RegExp("e;"+ wordCode + ";", "g");
  let word = "Erreur Serveur";

  const tailleEntries = entries.length;

  for(let i = 0; i<tailleEntries; i++) {
    if (entries[i].match(regex)) {
      let elementSplit = entries[i].split(";");

      if (elementSplit.length == 6) {
        return elementSplit[5].slice(1, -1);
      } else {
        return elementSplit[2].slice(1, -1);
      }
    }
  }

  return word;
}

// Retourne la définition d'un mot avec ces raffinements (si il y en a)
// Fonction optimisé (rapide) : OUI
async function getDefinition(text, wordCode, relations, keyValueWordCode) {
  // On récupère la définition du mot
  const indexOfStart = text.indexOf("<def>") + 5;
  const indexOfEnd = text.indexOf("</def>");
  let definition = text.substr(indexOfStart, indexOfEnd - indexOfStart);

  let defs = [];
  let raffinementsMots = [];

  let regexRaffinement = new RegExp("r;[0-9]*;" + wordCode + ";[0-9]*;1;[0-9]*", "g");
  //const start = Date.now();
  let raffinements = text.match(regexRaffinement);
  //console.log(Date.now() - start);

  let defRaf = [];

  if(raffinements != null) {
    const taille = raffinements.length;
    for (let i = 0; i < taille; i++) {
      let element = raffinements[i].split(";");
      raffinementsMots.push([keyValueWordCode[element[3]], element[5]]);
    }

    const tailleR = raffinementsMots.length;
    for (let i = 0; i < tailleR; i++) {
      let resRaf = await infoFromJDM(raffinementsMots[i][0]);
      if (resRaf !== "Error") {
        await getDefinition(resRaf, getWordCode(resRaf), getRelations(resRaf), getWordForCode(getEntries(resRaf))).then((result) => {
          defRaf.push([raffinementsMots[i][0], ...result, raffinementsMots[i][1]]);
        });
      }
    }
  }

  defs = [definition.trim(), defRaf];

  return defs;
}

function getNodeTypes(text){
  let regexNT = /nt;[0-9].*/g;
  return text.match(regexNT);
}

function getEntries(text){
  let regexEntries = /e;[0-9].*/g;
  return text.match(regexEntries);;
}

function getRelationsTypes(text){
  let regexRT =  /rt;[0-9].*/g;
  return text.match(regexRT);
}

function getRelations(text){
  let regexRelations =  /r;[0-9].*/g;
  return text.match(regexRelations);
}

function getWordCode(text){
  let regexCode = /\(eid=([^)]+)\)/g;
  return regexCode.exec(text)[1];
}

function isInutile(rel){
  if(rel == "12" || rel == "18" || rel == "19" ||
      rel == "29" || rel == "33" || rel == "36" ||
      rel == "45" || rel == "46" || rel == "47" ||
      rel == "48" || rel == "66" || rel == "118" ||
      rel == "128" || rel == "200" || rel == "444" ||
      rel == "555" || rel == "1000" || rel == "1001" ||
      rel == "1002" || rel == "2000" || rel == "2001"
  ){
    return true;
  }else {
    return false;
  }
}

function getWordForCode(entries){
  const tailleEntries = entries.length;

  let keyValue = [];

  for(let i = 0; i<tailleEntries; i++) {
    let elementSplit = entries[i].split(";");
    if (elementSplit.length === 6) {
      keyValue[elementSplit[1]] = elementSplit[5].slice(1, -1);
    } else {
      keyValue[elementSplit[1]] = elementSplit[2].slice(1, -1);
    }
  }

  return keyValue;
}

// Retourne la liste des relations d'un mot
// Fonction optimisé (rapide) : OUI
function relationsTrie(relations, relationsTypes, wordCode, keyValueWordCode){

  let tableauRelations = []; // tableauRelations[i] = [idRelation, nomRelation, [mots en relations entrantes], [mots en relations sortantes]]

  const tailleRT = relationsTypes.length;
  for(let i = 0; i<tailleRT; i++){
    let relationType = relationsTypes[i].split(";");
    if(!isInutile(relationType[1])){
      tableauRelations.push([relationType[1],relationType[3].slice(1, -1), [],[]] );
    }
  }

  const tailleRel = relations.length;
  for(let i = 0; i<tailleRel; i++){
    let element = relations[i];
    let relation = relations[i].split(";");

    let node1 = relation[2];
    let node2 = relation[3];
    let typeRelation =  relation[4];
    let poids = relation[5];

    // C'est une relation sortante
    if(node1 === wordCode){
      let motEnRelation = keyValueWordCode[node2];
      tableauRelations.forEach((element) => {
        if(element[0] === typeRelation){
          element[3].push([motEnRelation, poids])
        }
      });
    }
    // C'est une relation entrante
    else{
      let motEnRelation = keyValueWordCode[node1]
      tableauRelations.forEach((element) => {
        if(element[0] === typeRelation){
          element[2].push([motEnRelation, poids])
        }
      });
    }
  }

  return tableauRelations;
}

async function parserReponse(body) {

  // let nodesTypes = getNodeTypes(body);
  let entries = getEntries(body);
  let relationsTypes = getRelationsTypes(body);
  let relations = getRelations(body);
  let wordCode = getWordCode(body); // Code (ou id) du mot (Ex: pour chat, wordCode = 150)
  let keyValueWordCode = getWordForCode(entries);

  /*
    // les types de noeuds (Nodes Types) : nt;ntid;'ntname'
    // les noeuds/termes (Entries) : e;eid;'name';type;w;'formated name'
    // les types de relations (Relation Types) : rt;rtid;'trname';'trgpname';'rthelp'
    // les relations sortantes : r;rid;node1;node2;type;w
    // les relations entrantes : r;rid;node1;node2;type;w

    On a :
    - def le tableau des definitions du mots (avec raffinement semantique si besoin)
    - nodeTypes le tableau des nodeTypes              (nodeTypes[0] = "nt;1;'n_term'")
    - entries le tableau des entries                  (entries[0] = "e;175314;'Chat';1;50")
    - relationsTypes le tableau des relationsTypes    (relationsTypes[0] = "rt;0;'r_associated';'idée associée';Il est demandé d'énumérer les termes les plus étroitement associés au mot cible... Ce mot vous fait penser à quoi ?")
    - relations le tableau des relations              (relations[0] = "r;1574839;175314;150;0;35")
   */

  let def = await getDefinition(body, wordCode, relations, keyValueWordCode).then();

  // Tri raffinement par poids pour la def
  def[1].sort((a, b) => {
    return parseInt(b[b.length-1]) - parseInt(a[a.length-1]);
  });

  def = ["", ...def, -1];

  return JSON.stringify(
      {
        "def" : def,
        "relations" : relationsTrie(relations, relationsTypes, wordCode, keyValueWordCode)
      }
  );
}
