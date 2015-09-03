(function(){
	$ = function($e){return document.getElementById($e)};
	clear = function() { $("history").innerHTML = "";};
	parser = math.parser();
	append = function(e) {
		if(e == "clear") {clear(); return false;}
		t = $("history").innerHTML;
		q = "<div class='question'>" + e + "</div>";
		try {
			s = "<div class='solution'>" + math.format(parser.eval(e), {precision: 6}) + "</div>";
		} catch(err) {
			s = "<div class='error'>" + err + "</div>";;
		}
		$("history").innerHTML = t + q + s;
		$("history").scrollTop = $("history").scrollHeight;
	}
	$("calc").onsubmit = function(evt) {
		evt.preventDefault();
		append($("expression").value);
		$("expression").value = "";
		return false;
	}
	$("expression").focus();
	$("expression").onblur = function() {$("expression").focus();};
}());

