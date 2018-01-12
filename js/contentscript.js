/**
 * reddit Match Threader
 * by /u/magicwings
 *
 **/

var presets = {
	home_color : "red",
	away_color : "white"
};

(function(){
	//On page load - add any indicators here?
})();

//On receiving data
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	//Update current post - received "data"
	if(request.data){
		//Get access
		var $editBtn = $("#siteTable a.edit-usertext");
		if($editBtn.length<1) {
			error("Invalid editing permissions for this post");
			return false;
		}
		$("#siteTable a.edit-usertext")[0].click();

		//Start data handling
		var d = request.data;
		var u = request.commentary;
		var $textarea = $(".md-container .md textarea:eq(0)");
		var c = $textarea.val();

		//Meta
		c = replaceMeta(c, [
				"META_HOMETEAM",
				"META_AWAYTEAM",
				"META_VENUE",
				"META_KICKOFF",
				"META_REFEREE",
				"META_TOURNAMENT",
				"SPRITE_TOURNAMENT"
			], [
				"meta-home",
				"meta-away",
				"meta-venue",
				"meta-kickoff",
				"meta-referee",
				"meta-tournament",
				"sprite-tournament"
			], d);

		//Teams
		c = replaceTeams(c, d);

		//Stats
		c = replaceStats(c, d);

		//Commentary
		c = replaceCommentary(c, u);

		$textarea.val(c);

		$("#siteTable div.usertext-buttons button.save")[0].click();

		/*setTimeout(function(){
			$("#siteTable div.usertext-buttons button.save")[0].click();
		},100);*/
	}
});

//Error logging
function error(m){
	console.log("rMT: "+m);
}


/* Functions ------------------------------------------------------------------*/
function findVal(a,s){
    //a is array, s is key for value
    var ret = "";
    a.forEach(function(i,v){
        if(i[0]==s) ret = i[1];
    });
	return ret;
}

function findSprites(a,s){
	var ret = "";
	var val = findVal(a,s);
	var arr = val.split(",");
	
	arr.forEach(function(v,i){
		if(v.length>0) ret += "[](#"+v+")";
	});

	return ret;
}

function replaceMeta(startVal, metaName, spriteName, requestData){
	var ret = startVal;
	metaName.forEach(function(v,i){
		var val = findVal(requestData,spriteName[i]);
		var withMeta = ret.replace(new RegExp(sanitise("{{"+v+"}}"),"g"), "[](#rmt-start-"+spriteName[i]+")[](#rmt-end-"+spriteName[i]+")");
		ret = withMeta.replace(new RegExp(sanitise("[](#rmt-start-"+spriteName[i]+")")+".*"+sanitise("[](#rmt-end-"+spriteName[i]+")"),"g"), "[](#rmt-start-"+spriteName[i]+")"+val+"[](#rmt-end-"+spriteName[i]+")");
	});
	return ret;
}

function replaceCommentary(startVal, requestData){
	//console.log(1);
	var r = startVal.replace("{{FULL_COMMENTARY}}", "[](#rmt-start-full-commentary)[](#rmt-end-full-commentary)");
	console.log(sanitise("[](#rmt-start-full-commentary)")+".*"+sanitise("[](#rmt-end-full-commentary)"));
	r = r.replace(/\[\]\(\#rmt\-start\-full\-commentary\)[\s\S]*\[\]\(\#rmt\-end\-full\-commentary\)/g, "[](#rmt-start-full-commentary)"+requestData+"[](#rmt-end-full-commentary)");
	return r;
}

function replaceTeams(startVal, requestData){
	var lineups_full = 
	" "+findSprites(requestData,"home-xi-0-sprites")+"|"+findVal(requestData,"home-xi-0")+"|"+findVal(requestData,"away-xi-0")+"|"+findSprites(requestData,"away-xi-0-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-1-sprites")+"|"+findVal(requestData,"home-xi-1")+"|"+findVal(requestData,"away-xi-1")+"|"+findSprites(requestData,"away-xi-1-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-2-sprites")+"|"+findVal(requestData,"home-xi-2")+"|"+findVal(requestData,"away-xi-2")+"|"+findSprites(requestData,"away-xi-2-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-3-sprites")+"|"+findVal(requestData,"home-xi-3")+"|"+findVal(requestData,"away-xi-3")+"|"+findSprites(requestData,"away-xi-3-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-4-sprites")+"|"+findVal(requestData,"home-xi-4")+"|"+findVal(requestData,"away-xi-4")+"|"+findSprites(requestData,"away-xi-4-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-5-sprites")+"|"+findVal(requestData,"home-xi-5")+"|"+findVal(requestData,"away-xi-5")+"|"+findSprites(requestData,"away-xi-5-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-6-sprites")+"|"+findVal(requestData,"home-xi-6")+"|"+findVal(requestData,"away-xi-6")+"|"+findSprites(requestData,"away-xi-6-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-7-sprites")+"|"+findVal(requestData,"home-xi-7")+"|"+findVal(requestData,"away-xi-7")+"|"+findSprites(requestData,"away-xi-7-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-8-sprites")+"|"+findVal(requestData,"home-xi-8")+"|"+findVal(requestData,"away-xi-8")+"|"+findSprites(requestData,"away-xi-8-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-9-sprites")+"|"+findVal(requestData,"home-xi-9")+"|"+findVal(requestData,"away-xi-9")+"|"+findSprites(requestData,"away-xi-9-sprites")+"  \n" +
	" "+findSprites(requestData,"home-xi-10-sprites")+"|"+findVal(requestData,"home-xi-10")+"|"+findVal(requestData,"away-xi-10")+"|"+findSprites(requestData,"away-xi-10-sprites")+"  \n" +
	" |*Subs*|*Subs*|  \n" +
	" "+findSprites(requestData,"home-bench-0-sprites")+"|"+findVal(requestData,"home-bench-0")+"|"+findVal(requestData,"away-bench-0")+"|"+findSprites(requestData,"away-bench-0-sprites")+"  \n" +
	" "+findSprites(requestData,"home-bench-1-sprites")+"|"+findVal(requestData,"home-bench-1")+"|"+findVal(requestData,"away-bench-1")+"|"+findSprites(requestData,"away-bench-1-sprites")+"  \n" +
	" "+findSprites(requestData,"home-bench-2-sprites")+"|"+findVal(requestData,"home-bench-2")+"|"+findVal(requestData,"away-bench-2")+"|"+findSprites(requestData,"away-bench-2-sprites")+"  \n" +
	" "+findSprites(requestData,"home-bench-3-sprites")+"|"+findVal(requestData,"home-bench-3")+"|"+findVal(requestData,"away-bench-3")+"|"+findSprites(requestData,"away-bench-3-sprites")+"  \n" +
	" "+findSprites(requestData,"home-bench-4-sprites")+"|"+findVal(requestData,"home-bench-4")+"|"+findVal(requestData,"away-bench-4")+"|"+findSprites(requestData,"away-bench-4-sprites")+"  \n" +
	" "+findSprites(requestData,"home-bench-5-sprites")+"|"+findVal(requestData,"home-bench-5")+"|"+findVal(requestData,"away-bench-5")+"|"+findSprites(requestData,"away-bench-5-sprites")+"  \n" +
	" "+findSprites(requestData,"home-bench-6-sprites")+"|"+findVal(requestData,"home-bench-6")+"|"+findVal(requestData,"away-bench-6")+"|"+findSprites(requestData,"away-bench-6-sprites")+"  \n";


	var ret = startVal.replace(/\{\{LINEUPS_FULL\}\}/g, "[](#rmt-start-lineups-full)"+lineups_full+"[](#rmt-end-lineups-full)");
	ret = ret.replace(/\[\]\(\#rmt\-start\-lineups\-full\)[\s\S]*\[\]\(\#rmt\-end\-lineups\-full\)/g, "[](#rmt-start-lineups-full)"+lineups_full+"[](#rmt-end-lineups-full)");

	return ret;
}

function replaceStats(startVal, requestData){
	var h = "";
	var a = "";
	var hl = "";
	var al = "";

	var hc = presets.home_color;
	var ac = presets.away_color;

	var stats_full = "";
			h = parseInt(findVal(requestData, "stat-home-shotson"));
			a = parseInt(findVal(requestData, "stat-away-shotson"));
			hl = isNaN(h) ? 0 : (h>16||a>16 ? Math.round(h/(h+a)*10)*2 : h);
			al = isNaN(a) ? 0 : (h>16||a>16 ? 16-hl : a);
		stats_full += " "+"["+h+"](#bar-"+hl+"-"+hc+")|Shots (on target)|["+a+"](#bar-"+al+"-"+ac+")  \n";
			h = parseInt(findVal(requestData, "stat-home-shotsoff"));
			a = parseInt(findVal(requestData, "stat-away-shotsoff"));
			hl = isNaN(h) ? 0 : (h>16||a>16 ? Math.round(h/(h+a)*10)*2 : h);
			al = isNaN(a) ? 0 : (h>16||a>16 ? 16-hl : a);
		stats_full += " "+"["+h+"](#bar-"+hl+"-"+hc+")| Shots (off target) |["+a+"](#bar-"+al+"-"+ac+")  \n";
			h = parseInt(findVal(requestData, "stat-home-possession"));
			a = parseInt(findVal(requestData, "stat-away-possession"));
			hl = isNaN(h) ? 0 : (h>16||a>16 ? Math.round(h/(h+a)*10)*2 : h);
			al = isNaN(a) ? 0 : (h>16||a>16 ? 16-hl : a);
		stats_full += " "+"["+h+"%](#bar-"+hl+"-"+hc+")| Possession |["+a+"%](#bar-"+al+"-"+ac+")  \n";
			h = parseInt(findVal(requestData, "stat-home-corners"));
			a = parseInt(findVal(requestData, "stat-away-corners"));
			hl = isNaN(h) ? 0 : (h>16||a>16 ? Math.round(h/(h+a)*10)*2 : h);
			al = isNaN(a) ? 0 : (h>16||a>16 ? 16-hl : a);
		stats_full += " "+"["+h+"](#bar-"+hl+"-"+hc+")| Corners |["+a+"](#bar-"+al+"-"+ac+")  \n";
			h = parseInt(findVal(requestData, "stat-home-fouls"));
			a = parseInt(findVal(requestData, "stat-away-fouls"));
			hl = isNaN(h) ? 0 : (h>16||a>16 ? Math.round(h/(h+a)*10)*2 : h);
			al = isNaN(a) ? 0 : (h>16||a>16 ? 16-hl : a);
		stats_full += " "+"["+h+"](#bar-"+hl+"-"+hc+")| Fouls |["+a+"](#bar-"+al+"-"+ac+")  \n";
			h = parseInt(findVal(requestData, "stat-home-offsides"));
			a = parseInt(findVal(requestData, "stat-away-offsides"));
			hl = isNaN(h) ? 0 : (h>16||a>16 ? Math.round(h/(h+a)*10)*2 : h);
			al = isNaN(a) ? 0 : (h>16||a>16 ? 16-hl : a);
		stats_full += " "+"["+h+"](#bar-"+hl+"-"+hc+")| Offsides |["+a+"](#bar-"+al+"-"+ac+")  \n";
			h = parseInt(findVal(requestData, "stat-home-yellows"));
			a = parseInt(findVal(requestData, "stat-away-yellows"));
			hl = isNaN(h) ? 0 : (h>16||a>16 ? Math.round(h/(h+a)*10)*2 : h);
			al = isNaN(a) ? 0 : (h>16||a>16 ? 16-hl : a);
		stats_full += " "+"["+h+"](#bar-"+hl+"-"+hc+")| Bookings |["+a+"](#bar-"+al+"-"+ac+")  \n";
			h = parseInt(findVal(requestData, "stat-home-reds"));
			a = parseInt(findVal(requestData, "stat-away-reds"));
			hl = isNaN(h) ? 0 : (h>16||a>16 ? Math.round(h/(h+a)*10)*2 : h);
			al = isNaN(a) ? 0 : (h>16||a>16 ? 16-hl : a);
		stats_full += " "+"["+h+"](#bar-"+hl+"-"+hc+")| Sending Offs |["+a+"](#bar-"+al+"-"+ac+")  \n";

	var stats_full_reverse = "";
			h = parseInt(findVal(requestData, "stat-home-shotson"));
			a = parseInt(findVal(requestData, "stat-away-shotson"));
			hl = isNaN(h) ? 0 : Math.round(h/(h+a)*16);
			al = isNaN(a) ? 0 : 16-hl;
			if(a==0&&h==0) { a=10; h=10; }
		stats_full_reverse += " Shots (on target)|"+(hl>0?"["+h+"](#bar-"+hl+"-"+hc+")":"")+(al>0?"["+a+"](#bar-"+al+"-"+ac+")":"")+"  \n";
			h = parseInt(findVal(requestData, "stat-home-shotsoff"));
			a = parseInt(findVal(requestData, "stat-away-shotsoff"));
			hl = isNaN(h) ? 0 : Math.round(h/(h+a)*16);
			al = isNaN(a) ? 0 : 16-hl;
			if(a==0&&h==0) { a=10; h=10; }
		stats_full_reverse += " Shots (off target) |"+(hl>0?"["+h+"](#bar-"+hl+"-"+hc+")":"")+(al>0?"["+a+"](#bar-"+al+"-"+ac+")":"")+"  \n";
			h = parseInt(findVal(requestData, "stat-home-possession"));
			a = parseInt(findVal(requestData, "stat-away-possession"));
			hl = isNaN(h) ? 0 : Math.round(h/(h+a)*16);
			al = isNaN(a) ? 0 : 16-hl;
			if(a==0&&h==0) { a=10; h=10; }
		stats_full_reverse += " Possession |"+(hl>0?"["+h+"%](#bar-"+hl+"-"+hc+")":"")+(al>0?"["+a+"%](#bar-"+al+"-"+ac+")":"")+"  \n";
			h = parseInt(findVal(requestData, "stat-home-corners"));
			a = parseInt(findVal(requestData, "stat-away-corners"));
			hl = isNaN(h) ? 0 : Math.round(h/(h+a)*16);
			al = isNaN(a) ? 0 : 16-hl;
			if(a==0&&h==0) { a=10; h=10; }
		stats_full_reverse += " Corners |"+(hl>0?"["+h+"](#bar-"+hl+"-"+hc+")":"")+(al>0?"["+a+"](#bar-"+al+"-"+ac+")":"")+"  \n";
			h = parseInt(findVal(requestData, "stat-home-fouls"));
			a = parseInt(findVal(requestData, "stat-away-fouls"));
			hl = isNaN(h) ? 0 : Math.round(h/(h+a)*16);
			al = isNaN(a) ? 0 : 16-hl;
			if(a==0&&h==0) { a=10; h=10; }
		stats_full_reverse += " Fouls |"+(hl>0?"["+h+"](#bar-"+hl+"-"+hc+")":"")+(al>0?"["+a+"](#bar-"+al+"-"+ac+")":"")+"  \n";
			h = parseInt(findVal(requestData, "stat-home-offsides"));
			a = parseInt(findVal(requestData, "stat-away-offsides"));
			hl = isNaN(h) ? 0 : Math.round(h/(h+a)*16);
			al = isNaN(a) ? 0 : 16-hl;
			if(a==0&&h==0) { a=10; h=10; }
		stats_full_reverse += " Offsides |"+(hl>0?"["+h+"](#bar-"+hl+"-"+hc+")":"")+(al>0?"["+a+"](#bar-"+al+"-"+ac+")":"")+"  \n";
			h = parseInt(findVal(requestData, "stat-home-yellows"));
			a = parseInt(findVal(requestData, "stat-away-yellows"));
			hl = isNaN(h) ? 0 : Math.round(h/(h+a)*16);
			al = isNaN(a) ? 0 : 16-hl;
			if(a==0&&h==0) { a=10; h=10; }
		stats_full_reverse += " Bookings |"+(hl>0?"["+h+"](#bar-"+hl+"-"+hc+")":"")+(al>0?"["+a+"](#bar-"+al+"-"+ac+")":"")+"  \n";
			h = parseInt(findVal(requestData, "stat-home-reds"));
			a = parseInt(findVal(requestData, "stat-away-reds"));
			hl = isNaN(h) ? 0 : Math.round(h/(h+a)*16);
			al = isNaN(a) ? 0 : 16-hl;
			if(a==0&&h==0) { a=10; h=10; }
		stats_full_reverse += " Sending Offs |"+(hl>0?"["+h+"](#bar-"+hl+"-"+hc+")":"")+(al>0?"["+a+"](#bar-"+al+"-"+ac+")":"")+"  \n";

	var ret = startVal.replace(/\{\{STATS_FULL\}\}/g, "[](#rmt-start-stats-full)"+stats_full+"[](#rmt-end-stats-full)");
	ret = ret.replace(/\{\{STATS_FULL_REVERSE\}\}/g, "[](#rmt-start-stats-full-reverse)"+stats_full_reverse+"[](#rmt-end-stats-full-reverse)");
	ret = ret.replace(/\[\]\(\#rmt\-start\-stats\-full\)[\s\S]*\[\]\(\#rmt\-end\-stats\-full\)/g, "[](#rmt-start-stats-full)"+stats_full+"[](#rmt-end-stats-full)");
	ret = ret.replace(/\[\]\(\#rmt\-start\-stats\-full\-reverse\)[\s\S]*\[\]\(\#rmt\-end\-stats\-full\-reverse\)/g, "[](#rmt-start-stats-full-reverse)"+stats_full_reverse+"[](#rmt-end-stats-full-reverse)");

	return ret;
}

function sanitise(i){
	return i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
