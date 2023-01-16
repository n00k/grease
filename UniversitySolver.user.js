// ==UserScript==
// @name University Solver
// @namespace http://greasemonkey.antok/hobowars
// @description Show buttons to press to solve university puzzle
// @match https://www.hobowars.com/game/game.php?*cmd=uni*
// @version 1.4
// @grant none
// ==/UserScript==

function countSpots(tabl) {
	var dots=tabl.getElementsByClassName("smallb");
	var dspots=Array();
	var rspots=Array();
	var ispots=Array();
	var aspots=Array();
  var bspots=Array();
	var j = 0;
	for(var k=0;k < dots.length;k++) {
		if (dots[k].innerHTML.charCodeAt(0)==8226) dspots[j++] = dots[k];
	}
	var i = 0;
	var h = 0;
	var radios=tabl.getElementsByTagName("img");
	for (k=0;k < radios.length; k++) {
		if (radios[k].src.match(/circle.png/)) rspots[i++] = radios[k];
		if (radios[k].alt && radios[k].alt.charCodeAt(0)==8226) ispots[h++] = radios[k];
	}
	var g = 0;
	var adots=tabl.getElementsByTagName("a");
	for(k=0;k < adots.length; k++) {
		if (adots[k].href.match(/game.php\?.*(col=|row=)/)) aspots[g++] = adots[k];
	}

  bspots = tabl.getElementsByClassName("smallb");
  var b = bspots.length;

	var r = null;
	if ( h == 8 ) r = ispots;
	if ( i == 8 ) r = rspots;
	if ( j == 8 ) r = dspots;
	if ( g == 8 ) r = aspots;
  if ( b == 8 ) r = bspots;
	return r;
}

var dots;
//locate the first table with 8 cells containing the bullet
function locatePuzzle(el) {
	var found=false;
	var foundel = null;
	var tabls = el.getElementsByTagName("table");
	if (tabls.length > 0) {
		for (var i=0;i<tabls.length;i++) {
			if (found == false) {
				var spots = countSpots(tabls[i])
				if (spots) {
					foundel = locatePuzzle(tabls[i]);
					if (foundel == null){
					  foundel = el;
					  dots = spots;
					 }
					found = true;
				}
			}
		}
	} else {
	  spots = countSpots(el);
		if ((el.tagName == 'TABLE') && (spots)) {
			foundel = el;
			dots = spots;
		}
	}
	return foundel;
}

var ptbl=locatePuzzle(document);
var puzzle=Array();
var rows=ptbl.getElementsByTagName("tr");

for (var i=1;i<rows.length;i++) {
	var prow=Array();
	var cols = rows[i].getElementsByTagName("td");
	for (var j=1;j<cols.length;j++) {
		var img = cols[j].getElementsByClassName("circle");
		switch (img[0].className)
		{
			case "circle green":
				prow[j-1] = 2;
      break;
			case "circle yellow":
				prow[j-1] = 1;
			break;
			case "circle red":
				prow[j-1] = 0;
			break;
		}
	}
	puzzle[i-1] = prow;
}

var hisc = 0;
var lomov = 99;
var sc = 0;
var mov = 0;
var goodmoves = Array();
rows=Array(0,0,0,0);
cols=Array(0,0,0,0);
for (rows[0]=0;rows[0]<3;rows[0]++){
	for (rows[1]=0;rows[1]<3;rows[1]++){
		for (rows[2]=0;rows[2]<3;rows[2]++){
			for (rows[3]=0;rows[3]<3;rows[3]++){
				for (cols[0]=0;cols[0]<3;cols[0]++){
					for (cols[1]=0;cols[1]<3;cols[1]++){
						for (cols[2]=0;cols[2]<3;cols[2]++){
							for (cols[3]=0;cols[3]<3;cols[3]++){
								sc = 0;
								mov = 0;
								for (i=0;i<4;i++) {
									mov += rows[i] + cols[i];
									for (j=0;j<4;j++) {
										sc += (puzzle[i][j] + rows[i] + cols[j]) % 3;
									}
								}
								if ((sc > hisc) || ((sc == hisc) && (mov < lomov))) {
									goodmoves = cols.slice(0);
									goodmoves = goodmoves.concat(rows);
									hisc = sc;
									lomov = mov;
								}
							}
						}
					}
				}
			}
		}
	}
}

  for (i=dots.length-1;i>=0;i--){
      dots[i].innerHTML=goodmoves[i];
      dots[i].className = "circle";
  }
ptbl.getElementsByTagName("td")[0].innerHTML="(" + (hisc - 16) + ")";
