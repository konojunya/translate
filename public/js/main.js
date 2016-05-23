(function($){
	function escapeHTML(val) {
		return $('<div>').text(val).html();
	};
	var milkcocoa = new MilkCocoa('your milkcocoa app ID');
	var ds = milkcocoa.dataStore('word');
	$(".words").on("touchend",".search",function(){
		var target = $(this).attr("name");
		var url = "http://www.google.co.jp/search?q=";
		window.open(url+target);
	});
	$(".words").on("touchend",".delete",function(){
		var target = $(this).attr("name");
		ds.remove(target);
		render();
	});
	$("#btn").on("touchend",function(){
		$(".translated").show();
		$(".translated").html("<i class='fa fa-spinner fa-spin fa-2x' aria-hidden='true'></i>")
		var text = $("#text").val();
		if(text.match(/[A-Za-z]/)){
			$(".translated").html("<span style='color: red;'>文字に英字が含まれています！</span>");
			return;
		}
		$.ajax({
			url: "/translate",
			method: "GET",
			data: {
				text: text
			},
			success: function(data){
				$(".translated").text(data);
				ds.push({
					input: text,
					output: data
				});
			},
			error: function(err){
				console.log(err);
			}
		});
	});
	function render(){
		$(".item").remove();
		ds.stream().next(function(err, data){
			data.forEach(function(item){
				el = '<li class="item"><span class="input">'+item.value.input+'</span><span style="margin: 0 10px;">-</span><span class="output">'+item.value.output+'</span><i class="fa fa-search search" name="'+item.value.output+'" aria-hidden="true"></i><i class="fa fa-trash delete" name="'+item.id+'" aria-hidden="true"></i></li>';
				$(".words").append(el);
      });
		});
	}
	render();
	ds.on('push', function() {
    render();
  });
})(jQuery);