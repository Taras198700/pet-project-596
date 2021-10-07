function init() {
	let canvas = document.getElementById("tag");
	    canvas.width  = 320;
	    canvas.height = 320;
	let cellSize = canvas.width / 4;
	let context = canvas.getContext("2d");
	let field = new tag(); // создаём объект пятнашек
	    field.mix(350); // тщательно перемешиваем содердимое коробки
	    field.setCellView(function(x, y) { // задаём внешний вид пятнашек
	    	context.fillStyle = "#FFB93B";
	    	context.fillRect(x+1, y+1, cellSize-2, cellSize-2);
	    });
	    field.setNumView(function() { // параметры шрифта для цифр
	    	context.font = "bold "+(cellSize/2)+"px Sans";
	    	context.textAlign = "center";
	    	context.textBaseline = "middle";
	    	context.fillStyle = "#222";
	    });
	context.fillStyle = "#222";
	context.fillRect(0, 0, canvas.width, canvas.height);
	field.draw(context, cellSize);
	function event(x, y) { // функция производит необходимые действие при клике(касанию)
		field.move(x, y);
		context.fillStyle = "#222";
		context.fillRect(0, 0, canvas.width, canvas.height);
		field.draw(context, cellSize);
		if (field.victory()) { // если головоломка сложена, то пятнашки заново перемешиваются
			alert("Собрано за "+field.getClicks()+" касание!"); // вывод сообщения о выигрыше!!
			field.mix(300);
			context.fillStyle = "#222";
			context.fillRect(0, 0, canvas.width, canvas.height);
			field.draw(context, cellSize);
		}
	}
	canvas.onclick = function(e) { // обрабатываем клики мышью
		let x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
		let y = (e.pageY - canvas.offsetTop)  / cellSize | 0;
		event(x, y); // выхов функции действия
	};
	canvas.ontouchend = function(e) { // обрабатываем касания пальцем
		let x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0;
		let y = (e.touches[0].pageY - canvas.offsetTop)  / cellSize | 0;
		event(x, y);
	};
}


function tag() {
	let cellView = null;
	let numView = null;
	let arr = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
	let clicks = 0;
	function getNull() { // функция возвращает координату пустой клетки
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (arr[j][i] === 0) {
					return{"x":i,"y":j};
				}
			}
		}
	};
	// функция возвращает произвольное логическое значение
	function getRandomBool() {
		if (Math.floor(Math.random() * 2) === 0) {
			return true;
		}
	}
	// метод возвращает число касаний
	this.getClicks = function() {
		return clicks;
	};
	// метод перемещает "пятнашку" в пустую клутку 
	this.move = function(x, y) {
		let nullX = getNull().x;
		let nullY = getNull().y;
		if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
			arr[nullY][nullX] = arr[y][x];
			arr[y][x] = 0;
			clicks++;
		}
	};
	// проверка условия победы
	this.victory = function() {
		let e = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
		let res = true;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (e[i][j] != arr[i][j]) {
					res = false;
				}
			}
		}
		return res;
	};
	// метод "перемешивает" пятнашки
	this.mix = function(stepCount) {
		var x,y;
		for (let i = 0; i < stepCount; i++) {
			let nullX = getNull().x;
			let nullY = getNull().y;
			let hMove = getRandomBool();
			let upLeft = getRandomBool();
			if (!hMove && !upLeft) { y = nullY; x = nullX - 1;}
			if (hMove && !upLeft)  { x = nullX; y = nullY + 1;}
			if (!hMove && upLeft)  { y = nullY; x = nullX + 1;}
			if (hMove && upLeft)   { x = nullX; y = nullY - 1;}
			if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
				this.move(x, y);
			}
		}
		clicks = 0;
	};
	// внешний вид пятнашки
	this.setCellView = function(func) {
		cellView = func;
	};
	// параметры шрифта цифр
	this.setNumView = function(func) {
		numView = func;
	};
	// Метод рисующий наши пятнашки на холсте
	this.draw = function(context, size) {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (arr[i][j] > 0) {
					if (cellView !== null) {
						cellView(j * size, i * size);
					}
					if (numView !== null) {
						numView();
						context.fillText(arr[i][j], j * size + size / 2, i * size + size / 2);
					}
				}
			}
		}
	};
}

