function Map() {

}
Map.WIDTH = 12;
Map.HEIGHT = 12;
Map.OBJECT_CONFIG = {
	'1': 'space',
	'2': 'wall',
	'3' : 'user user-down',
	'4' : 'banh-chung',
	'5' : 'goal',
	'6' : 'tree',
	'7' : 'rock',
	'8' : 'ground',
	'9' : 'decorator decorator-1',
	'10' : 'decorator decorator-2',
	'11' : 'decorator decorator-3',
	'12' : 'decorator decorator-4',
	'13' : 'decorator decorator-5',
	'14' : 'decorator decorator-6',
	'15' : 'decorator decorator-7',
	'16' : 'decorator decorator-8'
};

Map.OBJECT_CONFIG_ROLLBACK = {
	'space':'-2',
	'wall':'-1',
	'user user-down':'0',
	'banh-chung':'1',
	'goal':'2',
	'tree':'3',
	'rock':'4',
	'ground':'5',
	'decorator decorator-1':'6',
	'decorator decorator-2':'7',
	'decorator decorator-3':'8',
	'decorator decorator-4':'9',
	'decorator decorator-5':'10',
	'decorator decorator-6':'11',
	'decorator decorator-7':'12',
	'decorator decorator-8':'13'
};

(function($/*,doc*/) {
	var htmlMapGenerator = function(widthGrid, heightGrid) {
		var htmlMap = '';
		if ( widthGrid !== undefined && heightGrid !== undefined ) {
			for (var i = 0; i < heightGrid; i++) {
				htmlMap += '<div class="row-grid row-grid-' + i + '">';
				for (var j = 0; j < widthGrid; j++) {
					htmlMap += '<div class="square square-' + i + '-' + j + '"></div>';
				}
				htmlMap += '</div>';
			}
		}
		return htmlMap;
	};
	var $sidebar = $('.sidebar');
	var htmlSidebar = '';
	var $map = $('.map-grid');
	var classDrag = null;
	for (var key in Map.OBJECT_CONFIG) {
		classDrag = Map.OBJECT_CONFIG[key];
		htmlSidebar += '<div class="square ' + classDrag + '"></div>';
		console.log(key,classDrag);
	}

	$sidebar.html(htmlSidebar);
	$map.html(htmlMapGenerator(Map.WIDTH, Map.HEIGHT));
	$sidebar.find('.square').draggable({
		revert: true
	});
	$map.find('.square').droppable({
		hoverClass: 'drop-hover',
		drop: function( event, ui ) {
			var newClass = ui.draggable.attr('class');
			newClass = newClass.replace('ui-draggable ui-draggable-handle ui-draggable-dragging','');
			newClass = newClass.replace('square','');
			console.log(newClass);
			//Add the new data to your container
			$(this).attr('data-class-added',newClass);
			$(this).addClass(newClass);
		}
	});
	$map.find('.square').on('click', function() {
		$(this).removeClass($(this).data('class-added'));
		$(this).removeAttr('data-class-added');
		$(this).removeData('class-added');
	});
	$('.generate-button').on('click', function() {
		var generatedMapText = '[';
		$map.find('.row-grid').each(function(index/*, elem*/) {
			generatedMapText += '[';
			var lengthSquareARow = $(this).find('.square').length;
			$(this).find('.square').each(function(index/*, elem*/) {
				var classAdded = $(this).data('class-added');
				if (classAdded) {
					if (index !== ( lengthSquareARow - 1 ) ) {
						generatedMapText += ( Map.OBJECT_CONFIG_ROLLBACK[classAdded.trim()] + ',' );
					} else {
						generatedMapText += Map.OBJECT_CONFIG_ROLLBACK[classAdded.trim()];
					}
				} else {
					if (index !== ( lengthSquareARow - 1 ) ) {
						generatedMapText += '-2,';
					} else {
						generatedMapText += '-2';
					}
				}
			});
			if ( index !== ( Map.HEIGHT - 1 ) ) {
				generatedMapText += '],\n';
			} else {
				generatedMapText += ']';
			}
		});
		generatedMapText += ']';
		$('.map-text').text(generatedMapText);

	});
})(jQuery,document);