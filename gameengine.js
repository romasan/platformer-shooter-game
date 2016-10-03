var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMEWIDTH, GAMEHEIGHT;
var LEFT  = -1,
	RIGHT = 1;
var POINTS = 0;
BUTTONSIZE = 100;
var debug = {
	stoprepeater : false
}
var levels = [];
var key = {
	size : 50,
	door : {
		w : 50,
		h : 60
	}
}
function contact(a, b) {
	//alert('boobs');
	//console.log(a, b);
	a.r = a.l + a.w;
	a.t = a.b + a.h;
	b.r = b.l + b.w;
	b.t = b.b + b.h;
	return (
		(a.l <= b.r && a.l >= b.l && a.b <= b.t && a.b >= b.b) ||
		(a.r <= b.r && a.r >= b.l && a.b <= b.t && a.b >= b.b) ||
		(a.r <= b.r && a.r >= b.l && a.t <= b.t && a.t >= b.b) ||
		(a.l <= b.r && a.l >= b.l && a.t <= b.t && a.t >= b.b)
	);
}
function scaling(i) {
	//if(typeof SCALINGFACTOR == 'undefined') {
	var _w = document.body.clientWidth,
		_h = document.body.clientHeight,
		SCALINGFACTOR = _w / ((_w > _h)?480:320); 
	//}
	return i * SCALINGFACTOR;
}
//------------------------------------------------------------------------------------------
bullet.w = 20;
bullet.h = 10;
bullet.step = 3;
bullet.force = 3;
bullet.typetime = [];
//bullet.lifedistance = 100;//document.body.clientWidth;
function bullet(x, y, type, direction) {//direction = left/right, type = hero/opponent
	this.removed = false;
	this.step = scaling(bullet.step);
	if(this instanceof bullet == false) {
		console.log('error');
		return;
	};
	if(typeof type == 'undefined') {
		console.log('type undefined');
		return;
	}
	this.type = type;
	if(typeof direction == 'undefined') {
		if(type == 'hero') {
			if(Game.direction == RIGHT) {
				this.direction = 'right'
			} else {
				this.direction = 'left'
			}
		} else if(type == 'opponent') {
			return;
		} else {
			console.log('error: type of bullet not defined');
			return;
		}
	} else {
		this.direction = direction;
	}
	if(typeof bullet.typetime[this.type] != 'undefined') {
		if(new Date().getTime() - bullet.typetime[this.type] < 300) {
			/*
			alert(
				bullet.typetime[this.type]
			)
			alert(
				new Date().getTime()
			)
			alert(
				new Date().getTime() - bullet.typetime[this.type]
			);
			*/
			return;
		} else {
			//alert('O_o');
		}
	} else {
		//alert('first')
	}
	bullet.typetime[this.type] = new Date().getTime();
	//var w = 20;
	//var h = 10;
	//this.step = 1;
	this.l = x;
	this.b = y;
	this.w = bullet.w;
	this.h = bullet.h;
	this.lifedistance = document.body.clientWidth;
	//this.w = 10;//this.w;
	//this.h = 10;//this.h;
	_w = scaling(bullet.w);
	_h = scaling(bullet.h);
	_l = this.l;
	_b = this.b;
	this.el = $('<div>')
		.addClass('el bullet')
		.css({
			width     : _w + 'px',
			height    : _h + 'px',
			bottom    : _b + 'px',
			left      : _l + 'px',
			transform : 'scaleX(' + ((this.direction == 'right')?1:-1) + ')'
		});
	$(Game.elcontainer).append(this.el);
	this.go();
}
bullet.prototype.testj = function() {
	$(this.el).css({
		border : '7px dashed #f00'
	});
}
bullet.prototype.move = function() {
	this.l += this.step * ((this.direction == 'right')?1:-1);
	this.lifedistance -= this.step;
	if(this.lifedistance <= 0) {
		this.removed = true;
		console.log('bullet removed');
	}
	var _l = this.l;
	$(this.el).css({
		left : _l + 'px'
	})
}
bullet.prototype.go = function() {
	if(this.removed == false) {
		var _this = this;
		this.move();
		this.checkhit();
		_f = function() {
			_this.go();
		}
		//if(this.l <= Game.width) {
			setTimeout(_f, 10);
		//}
	} else {
		$(this.el).remove();
	}
}
bullet.prototype.getc = function() {
	return {
		l : this.l,
		b : this.b,
		w : this.w,
		h : this.h
	}
}
bullet.prototype.checkhit = function() {
	var _c = this.getc();
	if(this.type == 'hero') {
		var op = Game.N.opponents;
		for(i in op) {
			//if(typeof op[i] != 'undefined') {
			//alert(op[i] + '|' + i);
			if(op[i].removed == false) {
				if(contact(_c, {
					l : op[i].l,
					b : op[i].b,
					w : scaling(opponent.w),
					h : scaling(opponent.h)
				})) {
					op[i].hp -= bullet.force;
					/*
					alert('OP ' + i + ' ' + 
						'l' + ':' + this.getc().l | 0 + '|' + 
						'b' + ':' + this.getc().b | 0 + '|' + 
						'w' + ':' + this.getc().w | 0 + '|' + 
						'h' + ':' + this.getc().h | 0 + '\nB ' + 
						'l' + ':' + op[i].l + '|' + 
						'b' + ':' + op[i].b + '|' + 
						'w' + ':' + scaling(opponent.w) + '|' + 
						'h' + ':' + scaling(opponent.h)
					);
					*/
					this.removed = true;
					if(op[i].hp <= 0) {
						$(op[i].el).remove();
						op[i].removed = true;
						POINTS += 15;
						$('#points').html(POINTS);
					}
				}
			}
		}
		var 
		
		boxes = Game.N.box;
		for(i in boxes) {
			if(boxes[i].removed == false) {
				var _t = boxes[i].boxtype;
				/*alert(
					'l : ' + this.getc().l + '|' + 
					'b : ' + this.getc().b + '|' + 
					'w : ' + this.getc().w + '|' + 
					'h : ' + this.getc().h + '\nB ' + 
					'l : ' + boxes[i].left          + '|' +
					'b : ' + boxes[i].bottom        + '|' +
					'w : ' + Game.S.box.index[_t].w + '|' +
					'h : ' + Game.S.box.index[_t].h
				)*/
				//TODO
				if(
					contact(_c, {
						l : boxes[i].left,
						b : boxes[i].bottom,
						w : Game.S.box.index[_t].w,
						h : Game.S.box.index[_t].h
					})
				) {
					//alert('box ' + i);
					this.removed = true;
					if(Game.S.box.index[_t].type == 'dynamit') {
						//Game.progon4();
					}
					var _el = '#box' + (parseInt(i) + 1);
					_ff = function() {
						$(_el).remove();
					}
					boxes[i].removed = true;
					Game.progon4(_el, scaling(100), 0, _ff, scaling(-30), scaling(-20));
				}
			}
		}
	}
	if(this.type == 'opponent') {
		if(
			contact(_c, {
				l : Game.S.hero.l,
				b : Game.S.hero.b,
				w : Game.S.hero.w,
				h : Game.S.hero.h
			})
		) {
			this.removed = true;
			Game.dechp(bullet.force);
			//delete this;
			//Game.gameover();
		}
	}
}
//------------------------------------------------------------------------------------------
opponent.w = 50;
opponent.h = 50;
opponent.hp = 7;
opponent.force = 3;
function opponent(shelfindex, direction) {
	this.removed = false;
	this.antiforce = false;
	//this.direction = 'left';
	if(this instanceof opponent == false) {
		console.log('error');
		return;
	}
	if(typeof Game.N.shelf[shelfindex] == 'undefined') {
		return;
	}
	var shelf = Game.N.shelf[shelfindex], _l, _b, _w, _h;
	this.hp = opponent.hp;
	this.w = _w = scaling(opponent.w);
	this.h = _h = scaling(opponent.h);
	this.l = _l = shelf.left;
	this.b = _b = shelf.bottom + Game.S.shelf.h;
	if(typeof direction == 'undefined') {
		this.direction = (Math.random() > .5)?'right':'left';
	} else {
		this.direction = direction
	}
	this.el = $('<div>')
		.addClass('el opponent')
		.css({
			left              : _l + 'px',
			bottom            : _b + 'px',
			width             : _w + 'px',
			height            : _h + 'px'
			//'background-size' : (_w * 2) + 'px ' + (_h * 2) + 'px'
		})
	$(Game.elcontainer).append(this.el);
	var _this = this;
	setTimeout(function(){
		_this.repeater();
	}, ((1 + Math.random() * 3)|0) * 2000)
}
opponent.prototype.repeater = function() {
	if(this.removed == false) {
		var _this = this;
		this.direction = (this.l > Game.S.hero.l)?'left':'right';
		$(this.el).css({
			transform : 'scaleX(' + ((this.direction == 'left')?1:-1) + ')'
		});
		var _d = (this.l - Game.S.hero.l);_d = (_d < 0)?-_d:_d;
		if(_d < GAMEWIDTH) {
			this.fire();
		}
		_f = function() {
			_this.repeater();
		}
		setTimeout(_f, ((1 + Math.random() * 3)|0) * 2000);
	}
}
opponent.prototype.fire = function() {
	new bullet(this.l + scaling(opponent.w) / 2, this.b + scaling(opponent.h) / 2, 'opponent', this.direction);
}
opponent.prototype.getc = bullet.prototype.getc;
//------------------------------------------------------------------------------------------
var Game = {
	S : {
		shelf : {
			w : 150,//for 320x480 display
			h : 40
		},
		hero : {
			orientation : 'g',
			key : false,
			size : 50,
			w : 45,
			h : 60,
			jump : 120,
			_jump : 120,
			jumpstart : false,
			jumpstartX : 0,
			jumpstartY : 0,
			step : 3,
			stepx : 1.2,
			t : function() {
				return this.b + this.h;
			},
			b : 0,
			l : 0,
			r : function() {
				return this.l + this.w;
			},
			hp : 100,
			_hp : 100,
			footage : 4,
			runto : 2,
			jumpstep : 3,
			_jumpstep : 3,
			jumpa : 5,
			isjump : false,
			jumpfinish : 8,
			astep : 0,
			stepnum : 0,
			jumpstepnum : 1,
			stepfrequency : 7
		},
		point : {
			size : 20,
			//frequency : 60,
			//anisteps : 2,
			costen : 15
		},
		box : {
			size : 40,
			index : [
				{//box
					force : 0,
					size : 40,
					w : 50,
					h : 50,
					type : 'box'
				},
				{//stakes
					force : 3,
					size : 40,
					w : 80,
					h : 40,
					type : 'dynamit'
				}
			]
		}//,
		//bonus : {
		//	size : 20
		//}
	},
	elcontainer : '#map',
	hp : {
		_count : 7,
		count : 7,
		size : 20
	},
	N : {
		shelf : [],
		point : [],
		box : [],
		opponents : []
	},
	gamename : "platformershooter",
	width : 5000,//px
	scroll : 0,
	direction : RIGHT,
	animation : false,
	checkhit : function(l, b, w, h) {
		
	},
	init : function() {
		if(
			typeof localStorage[this.gamename + 'level'] == 'undefined' &&
			typeof localStorage[this.gamename + 'points'] == 'undefined' 
		) {
			localStorage[this.gamename + 'level'] = 0;
			localStorage[this.gamename + 'points'] = 0;
		}
		var SCALINGW = GAMEWIDTH / 480;
		var SCALINGH = GAMEHEIGHT / 320;
		Game.S.shelf.w         *= SCALINGW;
		Game.S.shelf.h         *= SCALINGH;
		Game.S.box.size		   *= SCALINGH;
		for(i in Game.S.box.index) {
			Game.S.box.index[i].size *= SCALINGH;
		}
		Game.S.point.size	   *= SCALINGH;
		Game.S.hero.size       *= SCALINGH;
		Game.S.hero.w		   *= SCALINGW;
		Game.S.hero.h		   *= SCALINGH;
		Game.S.hero._jump      *= SCALINGH;
		key.size			   *= SCALINGW;
		key.door.w			   *= SCALINGW;
		key.door.h			   *= SCALINGH;
		Game.S.hero.jump        = Game.S.hero.jump;
		//console.log('****************', Game.S.hero._jump);
		Game.S.hero.step       *= SCALINGH;
		Game.S.hero.stepx      *= SCALINGW;
		/*
		if(GAMEWIDTH > 700) {
			Game.S.hero.step       /= SCALINGFACTOR;
			Game.S.hero.stepx      /= SCALINGFACTOR;
		}
		*/
		Game.hp.size		   *= SCALINGH;
	},
	win : function() {
		//alert('boobs');
		debug.stoprepeater = true;
		clearTimeout(Game.repeatmotionf);
		//localStorage[this.gamename + 'level']
		localStorage[Game.gamename + 'level'] = parseInt(localStorage[Game.gamename + 'level']) + 1;
		localStorage[Game.gamename + 'points'] = POINTS;
		this.splash(GAMEWIDTH / 2, GAMEHEIGHT / 2, lang.youwin
		
		, function() {
			document.location.reload();
		}, 1000);
	},
	gameover : function() {
		debug.stoprepeater = true;
		clearTimeout(Game.repeatmotionf);
		
		$('#hero').addClass('herod').css({
			'background-size' : '100% 100%'
		}).animate({
			bottom : '+=15px',
		}).animate({
			bottom : '0px',
		});
		this.splash(GAMEWIDTH / 2, GAMEHEIGHT / 2, "GAMEOVER", function() {
			document.location.reload();
		}, 1000);
	},
	splash : function(x, y, s, f, t) {
		t = (typeof t == 'undefined') ? 1000 : t;
		//if(x == 'center') {x = G.w / 2;}
		//if(y == 'center') {x = G.h / 2;}
		$('body').append(
			$('<div>')
				.css({
					position : 'absolute',
					top : y - 50 + 'px',
					left : x - 150 + 'px',
					'text-align' : 'center',
					width : '300px',
					height : '100px',
					'line-height' : '100px',
					'font-size' : '1pt',
					'text-shadow' : '0px 1px #fff'
				})
				.html(s)
				.attr({id : 'splash'})
				.animate({
					'font-size' : '27pt'
				}, function() {
					setTimeout(function() {
						$('#splash')
							.animate({
								'font-size' : '1pt'
							}, function() {
								$('#splash').remove();
								if(typeof f == 'function') {f();}
							})
					}, t);
				})
		);
	},
	inchp : function(i) {
		this.hp.count += 100;
		setTimeout(function() {
			Game.inchp()
		}, 1000);
	},
	dechp : function(i) {
		this.hp.count -= i;
		if(this.hp.count <= 0) {
			this.gameover();
		}
		this.drawhp(this.hp.count);
	},
	drawhp : function(hp) {
		//redraw hp
		$('#hp').html('');
		for(i = 1; i < this.hp._count + 1; i++) {
			$('#hp').append(
				$('<div>')
					.addClass('hp')
					.addClass((hp >= i)?'hpfull':'hpempty')
					.attr({id : 'hp' + i})
					.css({
						width : Game.hp.size + 'px',
						height : Game.hp.size + 'px',
					})
			)
		}
	},
	draw : function() {
		this.drawhp(this.hp._count);
		$('#map').html('');
		// height
		var hero = $('<div>')
			.attr('id', 'hero')
			.addClass('el hero')
			.css({
				width : Game.S.hero.w,
				height : Game.S.hero.h,
				'background-size' : (Game.S.hero.w * Game.S.hero.footage) + 'px ' + Game.S.hero.h + 'px',
				'background-position' : '0px 0px'
			});
		var shelf = $('<div>')
			.addClass('el shelf')
			.css({
				width : Game.S.shelf.w,
				height : Game.S.shelf.h
			});
		var point = $('<div>')
			.addClass('el point')
			.css({
				width : Game.S.point.size,
				height : Game.S.point.size,
//				'background-size' : ( Game.S.point.size + 'px ' + ( Game.S.point.size * Game.S.point.anisteps ) + 'px' )
			});
		var box = $('<div>')
			.addClass('el box');
//			.css({
//				width : Game.S.box.size,
//				height : Game.S.box.size,
//			});
		var b = BUTTONSIZE;//Game.S.shelf.h;
		var l = 0;//( Math.random() * (GAMEWIDTH - Game.S.shelf.w) )|0;
		Game.N.shelf.push({
			left : l,
			bottom : b
		});
		/*
		$('#map').append(
			$('<div>')
			.addClass('el wall')
			.css({
				bottom : '0px',
				left : (l + 5) + 'px',
				width : (Game.S.shelf.w - 10) + 'px',
				height : (b + Game.S.shelf.h / 3) + 'px'
			})
		);
		*/
		$('#map').append(
			$(shelf).clone().css({
				left : l,
				bottom : b
			})
			.addClass('shelf1')
		);
		b += Game.S.shelf.h;
		Game.S.hero.b = b;
		l = 0;//l + ( Game.S.shelf.w - Game.S.hero.size ) / 2;
		Game.S.hero.l = l;
		$('#map').append(
			$(hero).css({
				left : l,
				bottom : b
			})
		);
		
		var _b = b;
		
		var justnow = true;
		var shelfis = true;
		key.shelfs = (Game.width / Game.S.shelf.w);
		console.log('shelf count', key.shelfs);
		key.shelf = (Math.random() * (key.shelfs / 3 * 2))|0;
		key.index = 0;
		var _bb = 0,
			_ll = 0,
			_index = 0;
		for(;l < Game.width;) {
			l = l + Game.S.shelf.w;// + 20 + (( Math.random() * 30/*( Game.S.hero.jump - Game.S.shelf.w)*/ )|0);//-shelf.h
			//var lastb = Game.N.shelf[Game.N.shelf.left - 1];
			if(l + Game.S.shelf.w > Game.width) {
				// draw door
				//var _l = l + (Math.random() * (Game.S.shelf.w - key.size))|0;
				var _i = Game.N.shelf.length - 1;
				key.door.b = Game.N.shelf[_i].bottom + Game.S.shelf.h;//_bb + Game.S.shelf.h / 2;
				key.door.l = _ll + Game.S.shelf.w / 2 - key.door.w / 2;
				$('#map').append(
					$('<div>')
						.addClass('el door')
						//.attr({id : 'point' + Game.N.point.length})
						.css({
							left  : key.door.l + 'px',
							bottom : key.door.b + 'px',
							width  : key.door.w + 'px',
							height : key.door.h + 'px'
						})
				);
				return;
			}
			if(justnow)  {
				justnow = false;
				shelfis = true;
			} else {
				if(Math.random() > .5) {
					justnow = true;
					shelfis = false;
				}
			}
			if(shelfis) {
				key.index++;
				_index++;
				//if(justnow) {
					var _upper = b;
					b = (Math.random() * b + Game.S.hero._jump * 0.7 - Game.S.shelf.h)|0;
					_bb = b;
					_ll = l;
					_upper = (b > _upper);
				//} else {
				//	b = (Math.random() * b)|0;
				//}
				
				var gb = ( GAMEHEIGHT / 2 - Game.S.hero.h - Game.S.shelf.h );
				b = ( b > gb ) ? gb : b;
				
				Game.N.shelf.push({
					left : l,
					bottom : b
				});
				
				/*
				$('#map').append(
					$('<div>')
					.addClass('el wall')
					.css({
						bottom : '0px',
						left : (l + 5) + 'px',
						width : (Game.S.shelf.w - 10) + 'px',
						height : (b + Game.S.shelf.h / 3) + 'px'
					})
				);
				*/
				$('#map').append(
					$(shelf).clone().css({
						left : l,
						bottom : b
					})
					.addClass('shelf1'/* + (1 + (Math.random() * 4)|0)*/)
				);
				
				/*
				if(key.shelf == key.index) {
					// draw key
					var _l = l + (Math.random() * (Game.S.shelf.w - key.size))|0;
					_bt = b + Game.S.shelf.h + (Math.random() * Game.S.hero._jump)|0;
					_bt = (GAMEHEIGHT < (_bt + key.size))?(GAMEHEIGHT - key.size):_bt;
					key.l = _l;
					key.b = _bt;
					$('#map').append(
						$('<div>')
							.addClass('el key')
							.attr({	
								id : 'key'
							})
							.css({
								left : _l + 'px',
								bottom : _bt + 'px',
								width : key.size + 'px',
								height : key.size + 'px'
							})
					);
				} else {
				*/

					// box/bonus/opponent or not
					if( Math.random() > .5 ) {
						//opponent or box or bonus
						var _b = b + Game.S.shelf.h;
						var _r = (Math.random() * 3)|0;
//						if( Math.random() > .5 ) {
						//switch(_r) {
						//	case 0:
								/*var boxtype = 1;//(Math.random() * 2)|0;
								var _l = l + (Math.random() * (Game.S.shelf.w - Game.S.box.index[boxtype].w))|0;
								Game.N.box.push({
									left : _l,
									bottom : _b,
									//top : ( GAMEHEIGHT - b ),
									removed : false,
									'boxtype' : boxtype
								});
								$('#map').append(
									$(box)
										.clone()
										.attr({id : 'box' + Game.N.box.length})
										.addClass('box' + boxtype)
										.css({
											left : _l + 'px',
											bottom : _b + 'px',
											width : Game.S.box.index[boxtype].w + 'px',
											height : Game.S.box.index[boxtype].h + 'px'
										})
								);
								*/
						//		break;
						//	case 1:
								/*
								var _l = l + (Math.random() * (Game.S.shelf.w - Game.S.point.size))|0;
								_bt = _b + (Math.random() * Game.S.hero._jump)|0;
								Game.N.point.push({
									left : _l,
									bottom : _bt,// + Game.S.shelf.h,
									//top : ( GAMEHEIGHT - b ),
									removed : false
								});
								$('#map').append(
									$(point)
										.clone()
										.attr({id : 'point' + Game.N.point.length})
										.addClass('point1')
										.css({
											left : _l + 'px',
											bottom : _bt + 'px'
										})
								);
								*/
						//		break;
						//	case 2:
								//var _l = l + Game.S.shelf.w / 2 - scaling(opponent.w) / 2,
								//_b = b;
								_i = Game.N.shelf.length - 1;
								Game.N.opponents.push(new opponent(_i));
						//		break;
						//}

					}
				//}
			} else {
				l = l - Game.S.shelf.w / 2;
			}
		}
//		this.repeatanimation('.point', Game.S.point.size, 0, 2);
	},
	repeatanimation : function(el, h, s, sa) {
		//console.log(el, h, s, sa);
		$(el).css({
			'background-position' : '0px ' + h * s + 'px'
		});
		s = (s < sa - 1)?(s + 1):0;
		var f = function() {
			Game.repeatanimation(el, h, s, sa);
		}
		Game.animation = setTimeout(f, 100);
	},
	progon : function(el, w, step, startstep, finishstep, f) {//animation with running function in end
		//console.log('progon', step, startstep, endstep, typeof f);
		//console.log(el, h, s, sa);
		$(el).css({
			'background-position' : -(w * step) + 'px 0px'
		});
		if(step >= finishstep) {
			f();
			console.log('end progon');
		} else {
			step++;
			var ff = function() {
				Game.progon(el, w, step, startstep, finishstep, f);
			}
			Game.animation = setTimeout(ff, 0);
		}
	},
	progon4 : function(el, size, step, f, l, b) {
		if(step == 0) {
			console.log('step = 0');
			$(el).css({
				width				  : size + 'px',
				height				  : size + 'px',
				left				  : '+=' + l + 'px',
				bottom				  : '+=' + b + 'px',
				'background-size'	  : (size * 4) + 'px ' + (size * 4) + 'px',
				'background-image'	  : 'url(explosion.png)',
				'background-position' : '0px 0px',
				//border : '1px dashed #f00'
			});
		}
		var _x = step % 4,
			_y = (step / 4)|0;
		$(el).css({
			'background-position' : (-size * _x) + 'px ' + (-size * _y) + 'px'
		});
		if(step >= 16) {
			f();
			console.log('end progon');
			return;
		} else {
			step++;
			var ff = function() {
				Game.progon4(el, size, step, f, l, b);
			}
			Game.animation = setTimeout(ff, 10);
		}
	},
	/*
	iscontactq : function(ca, sa, cb, sb) {
		if( 
			( ca.x + sa > cb.x 		&& ca.x < cb.x 		&& ca.y + sa > cb.y 		&& ca.y < cb.y   ) || 
			( ca.x + sa > cb.x 		&& ca.x < cb.x 		&& ca.y + sa > cb.y + sb && ca.y < cb.y + sb ) || 
			( ca.x + sa > cb.x + sb && ca.x < cb.x + sb && ca.y + sa > cb.y 		&& ca.y < cb.y   ) || 
			( ca.x + sa > cb.x + sb && ca.x < cb.x + sb	&& ca.y + sa > cb.y + sb && ca.y < cb.y + sb ) 
		) { return true; }
		return false;
	},
	*/
	speed : {
//		start : 0,
		end : 0,
		step : 0
	},
	speedcontrolf : false,
	speedcontrol : function() {
		//console.log('distance:', (Game.S.hero.l - this.speed.end), 'in', this.speed.step, 'steps');
		//Game.S.hero.stepx = 
		this.speed.step = 0;
		$('#bar').html|(Game.S.hero.l - this.speed.end);
		this.speed.end = Game.S.hero.l;
		this.speedcontrolf = setTimeout(function() {Game.speedcontrol();}, 1000);
	},
	repeatmotionf : false,
	repeatmotionpause : false,
	repeatmotion : function() {
		window.scrollTo(0, 1);
		if(debug.stoprepeater) {return;}
		this.speed.step++;
		var middleline = GAMEWIDTH / 2 - Game.S.hero.w;
		var map = $('#map');
		var hero = $('#hero');
		if(!this.repeatmotionpause) {
			if(Game.x) {
				//if( Game.S.hero.l > Game.scroll + middleline ) {
				if(Game.S.hero.l > middleline && Game.S.hero.l < Game.width - middleline - Game.S.hero.w * 2) {
					Game.scroll = Game.S.hero.l - middleline;// - Game.scroll - middleline;
					$('#map').css({
						left : -Game.scroll + 'px',
						'background-position' : (-Game.scroll * 0.5) + 'px 0px'
					});
				}
				
				Game.S.hero.l += Game.x * Game.S.hero.stepx;
				$(hero).css({
					left : Game.S.hero.l + 'px'
				});
				if( Game.S.hero.l >= Game.width - Game.S.hero.w ) {
					Game.x = 0;
					console.log('finish:)');
					//Game.win();
					Game.x = 0;
					Game.S.hero.l = Game.width - Game.S.hero.w;
				}
				if(Game.S.hero.l <= 0) {
					Game.x = 0;
					Game.S.hero.l = 0;
				}
				
			}

			var f = false,
			box_f = false;
			if( Game.y > 0 ) {
				/*
				if(Game.S.hero.jumpstart == false) {
					//console.log('jumpstart y > 0');
					Game.S.hero.jumpstar
					Game.S.hero.jumpstart = true;
					Game.S.hero.jumpstartX = Game.S.hero.l;
					Game.S.hero.jumpstartY = Game.S.hero.b;
					//Game.S.hero.jump = 0;
				}
				*/
				if(Game.S.hero.jumpstart == true) {
					/*
					var _x = (Game.S.hero.l - Game.S.hero.jumpstartX) * 2,
						_y = Game.S.hero.b - Game.S.hero.jumpstartY,
						_n = Game.S.hero._jump - _x,
						_m = Math.sqrt(Game.S.hero._jump * Game.S.hero._jump - _n * _n);
					
					if(_n <= 0) {
						//console.log('-jump-top-');
						Game.S.hero.jumpstart = false;
						Game.y = -10;
						console.log('-------------------------------------------');
					}
					Game.S.hero.b = Game.S.hero.jumpstartY + _m;
					*/
					if(Game.S.hero.jump <= 0) {
						Game.S.hero.jumpstart = false;
						Game.y = -1;
					} else {
						Game.S.hero.jump -= Game.y * Game.S.hero.step;
						Game.S.hero.b +=  Game.y * Game.S.hero.step;
					}
				} else {
					
				}
				//Game.S.hero.jump -= Game.S.hero.step;
				//console.log( 'Game.S.hero.jump', Game.S.hero.jump );
				
				/*
				if(Game.S.hero.jump <= 0) {
					Game.y = 0;
					setTimeout(function() {Game.y = -1;}, 300);
				}
				*/
			}
			if(Game.y <= 0) {
			
				for(i in Game.N.shelf) {
					var l   = Game.N.shelf[i].left;//$(this).offset().left;
					var r   = l + Game.S.shelf.w;
					var _tb = Game.N.shelf[i].bottom;//( Game.height - $(this).position().top );// + Game.scroll;
					var tb  = _tb + Game.S.shelf.h;// + Game.scroll;
					//console.log('***', Game.S.hero.b, tb, i);	
					if(
						(
							( Game.S.hero.l + Game.S.hero.w <= r && Game.S.hero.l + Game.S.hero.w >= l ) || 
							( Game.S.hero.l 				<= r && Game.S.hero.l 				  >= l ) 
						) && 
						//(
						//	(Game.S.hero.t() > tb && Game.S.hero.b < _tb) ||
						//	(Game.S.hero.b	 < tb && Game.S.hero.b > _tb) 
						//) &&
						//Game.S.hero.b != tb
						
						Game.S.hero.b <= tb && 
						Game.S.hero.b >= _tb 
					) {
						if(
							/*
							Game.y == 0 && 
							&& Game.S.hero.b < tb - Game.S.shelf / 2
							*/
							tb != Game.S.hero.b && 
							Game.y 			== 0 && 
							//tb				!= Game.S.hero.b && 
							Game.S.hero.t() >  tb// &&
							//Game.S.hero.b	>= _tb
						) {
							console.log('climb animation, pause running');
							/*
							this.repeatmotionpause = true;
							setTimeout(function() {
								Game.repeatmotionpause = false;
							}, 1000);
							*/
						}
						f = true;
						
						Game.S.hero.b = tb;
						$(hero).css({
							bottom : Game.S.hero.b + 'px',
							//'background-position' : '0px ' + Game.S.hero.h + 'px' )
						});
						Game.y = 0;
						//if(Game.x == 0) {Game.x = 1;}
						Game.S.hero.jumpstart = false;
					}
				}
				
				for(i in Game.N.box) {
					var _i	= Game.N.box[i].boxtype;
					var l   = Game.N.box[i].left + ((_i)?(10 * SCALINGFACTOR):0);//$(this).offset().left;
					var r   = l + Game.S.box.index[_i].w - ((_i)?(20 * SCALINGFACTOR):0);
					var _tb = Game.N.box[i].bottom;//( Game.height - $(this).position().top );// + Game.scroll;
					var tb  = _tb + Game.S.box.index[_i].h - ((_i)?(10 * SCALINGFACTOR):0);// + Game.scroll;
					var hl  = Game.S.hero.l + 30;
					var hr  = Game.S.hero.l + Game.S.hero.w - 30;
					if(
						(
							(hr <= r && hr >= l) || 
							(hl <= r && hl >= l)
						) && 
						Game.S.hero.b <= tb && Game.S.hero.b >= _tb
					) {
						if(Game.N.box[i].removed == false) {
							if(_i == 0) {
								Game.S.hero.b = tb;
								$(hero).css({
									bottom : Game.S.hero.b + 'px',
								});
								if(Game.y < 0) {Game.y = 0;}
								//if(Game.x == 0) {Game.x = 1;}
								Game.S.hero.jumpstart = false;
								f = true;
							}
							if(_i == 1) {
								var _el = '#box' + (parseInt(i) + 1);
								_ff = function() {
									$(_el).remove();
								}
								//Game.N.box[i].removed = true;
								this.progon4(_el, 100 * SCALINGFACTOR, 0, _ff, -30 * SCALINGFACTOR, -20 * SCALINGFACTOR);
							} else {
								$(_el).remove();
							}
						}
						
						if(Game.N.box[i].removed == false) {
							//var tb2 = tb;
							console.log('you', i, Game.N.box.length);
							Game.N.box[i].removed = true;
							if(_i > 0) {
								this.dechp(Game.S.box.index[_i].force);
							}
						}
					} else {
						//Game.N.box[i].removed = false;
					}
				}
				var op = Game.N.opponents;
				for(i in op) {
					if(op[i].removed == false) {
						if(
							contact({
								l : Game.S.hero.l,
								b : Game.S.hero.b,
								w : Game.S.hero.w,
								h : Game.S.hero.h
							},
							op[i].getc())
						) {
							if(op[i].antiforce == false) {
								op[i].antiforce = true;
								Game.dechp(opponent.force);
							}//Game.gameover();
						} else {
							op[i].antiforce = false;
						}
					}
				}
			}
			
			for(i in Game.N.point) {
				var l     = Game.N.point[i].left;//$(this).offset().left;
				var r     = l + Game.S.point.size;
				var _tb   = Game.N.point[i].bottom;//( Game.height - $(this).position().top );// + Game.scroll;
				var tb    = _tb + Game.S.point.size;// + Game.scroll;
				if(
					(l <= Game.S.hero.r() && l >= Game.S.hero.l && _tb <= Game.S.hero.t() && _tb >= Game.S.hero.b) ||
					(r <= Game.S.hero.r() && r >= Game.S.hero.l && _tb <= Game.S.hero.t() && _tb >= Game.S.hero.b) ||
					(r <= Game.S.hero.r() && r >= Game.S.hero.l && tb <= Game.S.hero.t() && tb >= Game.S.hero.b) ||
					(l <= Game.S.hero.r() && l >= Game.S.hero.l && tb <= Game.S.hero.t() && tb >= Game.S.hero.b)
				) {
					
					if(Game.N.point[i].removed == false) {
						Game.N.point[i].removed = true;
						$('#point' + (parseInt(i) + 1)).hide();
						POINTS += Game.S.point.costen;
						$('#points').html(POINTS);
					}
				}
			}
			/*
			var l     = key.l;//$(this).offset().left;
			var r     = l + key.size;
			var _tb   = key.b;//( Game.height - $(this).position().top );// + Game.scroll;
			var tb    = _tb + key.size;// + Game.scroll;
			if(
				(l <= Game.S.hero.r() && l >= Game.S.hero.l && _tb <= Game.S.hero.t() && _tb >= Game.S.hero.b) ||
				(r <= Game.S.hero.r() && r >= Game.S.hero.l && _tb <= Game.S.hero.t() && _tb >= Game.S.hero.b) ||
				(r <= Game.S.hero.r() && r >= Game.S.hero.l && tb <= Game.S.hero.t() && tb >= Game.S.hero.b) ||
				(l <= Game.S.hero.r() && l >= Game.S.hero.l && tb <= Game.S.hero.t() && tb >= Game.S.hero.b)
			) {
				Game.S.hero.key = true;
				$('#key').remove();
			}
			*/
			var l     = key.door.l;//$(this).offset().left;
			var r     = l + key.door.l;
			var _tb   = key.door.b;//( Game.height - $(this).position().top );// + Game.scroll;
			var tb    = _tb + key.door.h;// + Game.scroll;
			if(
				(l <= Game.S.hero.r() && l >= Game.S.hero.l && _tb <= Game.S.hero.t() && _tb >= Game.S.hero.b) ||
				(r <= Game.S.hero.r() && r >= Game.S.hero.l && _tb <= Game.S.hero.t() && _tb >= Game.S.hero.b) ||
				(r <= Game.S.hero.r() && r >= Game.S.hero.l && tb <= Game.S.hero.t() && tb >= Game.S.hero.b) ||
				(l <= Game.S.hero.r() && l >= Game.S.hero.l && tb <= Game.S.hero.t() && tb >= Game.S.hero.b)
			) {
				//if(Game.S.hero.key) {
				//	console.log('door open');
					Game.win();
				//} else {
				//	console.log('find the key');
				//}
			}
			if(Game.y < 0) {
				Game.S.hero.b += Game.y * Game.S.hero.step;
			}
			Game.S.hero.stepnum++;
			//Game.S.hero.jumpstepnum++;
			Game.S.hero.jumpstep = Game.S.hero.jumpfinish;
			if(Game.y == 0) {
				Game.S.hero.isjump = false;
			}
			if(Game.S.hero.stepnum % Game.S.hero.stepfrequency == 0) {
				Game.S.hero.astep = (Game.S.hero.astep >= Game.S.hero.runto) ? 0 : Game.S.hero.astep + 1;
			}
			$(hero).css({
				'bottom' : Game.S.hero.b + 'px',
				//'background-position' : (-Game.S.hero.w * /*((Game.y == 0) ? Game.S.hero.astep : Game.S.hero.jumpstep)*/(Game.S.hero.isjump)?Game.S.hero.astep:Game.S.hero.jumpstep) + 'px 0px'
				'background-position' : 
				(
						-Game.S.hero.w * (
							(Game.y == 0)
								?(Game.x == 0)
									?1
									:Game.S.hero.astep
								:Game.S.hero._jumpstep
						)
					) + 'px 0px'
			});
			if(Game.y == 0 && !f) {
				//console.log('---', Game.y, f);
				Game.y = -1;
				Game.S.hero.jumpstart = false;
			}
		
		}//repeatmotionpause
		
		if(Game.S.hero.b <= 0) {
			//console.log('----------------');
			Game.gameover();
			Game.x = 0;
			Game.y = 0;
			//return
		} else {
			Game.repeatmotionf = setTimeout(function(){
				Game.repeatmotion();
			}, 0);
		}
			
	},
	startgame : function() {
		
		//clearTimeout(Game.animation);
		clearTimeout(Game.repeatmotionf);
		$('#map').css({bottom : '0px'});
		
		POINTS = parseInt( localStorage[Game.gamename + 'points'] );
		Game.N.shelf = [];
		Game.N.point = [];
		Game.scroll = 0;
		//Game.S.hero._jump = Game.S.hero.jump;
		$('#points').html(POINTS);
		$('#level').html(localStorage[Game.gamename + 'level']);
		$('#hp').html(Game.S.hero.hp);
		/*
		$('#map')
			//.click(function() {
			.swipe({
				swipeStatus : function(event, phase, direction, distance, duration, fingers) {
					if( phase == 'start' ) {
						//console.log('click', Game.y);
						//console.log('********************************************************', Game.y);
			
			//			if( Game.y == 0 ) {
							//if(Game.S.hero.jumpstart) {return;}
							//console.log('click', Game.y);
							if(Game.y != 0) {return;}
							console.log('jumpstart', Game.S.hero.jumpstart);
							Game.S.hero.jump = Game.S.hero._jump;
							Game.S.hero.jumpstart = false;
							Game.y = 1;
			//			}
			
					}
				}
			});
		*/
		$('#left')
			.css({
				left : '0px',
				bottom : '0px',
				width : BUTTONSIZE + 'px',//( GAMEHEIGHT / 2 ) + 'px',
				height : BUTTONSIZE + 'px',// GAMEHEIGHT + 'px',0
				//border : '1px dashed #00f'
			})
			.addClass('but')
		$('#right')
			.css({
				left : BUTTONSIZE + 'px',
				bottom : '0px',
				width : BUTTONSIZE + 'px',//( GAMEHEIGHT / 2 ) + 'px',
				height : BUTTONSIZE + 'px',// GAMEHEIGHT + 'px',
				//border : '1px dashed #f00'
			})
			.addClass('but')
		$('#fire')
			.css({
				right : '0px',
				bottom : '0px',
				width : BUTTONSIZE + 'px',//( GAMEHEIGHT / 2 ) + 'px',
				height : BUTTONSIZE + 'px'// GAMEHEIGHT + 'px',
				//border : '1px dashed #f00'
			})
			.addClass('but')
		//http://riagora.com/mobile/hammer/
		$('#screen').css({
			position : 'absolute',
			top		 : '0px',
			left	 : '0px',
			width	 : '100%',
			height	 : '100%'
		}).swipe({
			swipeStatus : function(event, phase, direction, distance, duration, fingers) {
				var ff = function() {
					if(Game.y != 0) {return;}
					Game.S.hero.jump = Game.S.hero._jump;
					Game.S.hero.jumpstart = true;
					Game.y = 1;
				}
				if(phase == 'start') {
					//var s = '';
					//for(i in event) {s += i + ' ';}
					//alert('Message : ' + s);
					var _id = $(event.target).attr('id');
					if(_id == 'left') {
						Game.x = LEFT;
						Game.direction = LEFT;
						$('#hero').css({
							transform : 'scaleX(-1)'
						})
					} else if(_id == 'right') {
						Game.x = RIGHT;
						Game.direction = RIGHT;
						$('#hero').css({
							transform : 'scaleX(1)'
						})
					} else if(_id == 'fire') {
						new bullet(Game.S.hero.l + Game.S.hero.w / 2, Game.S.hero.b + Game.S.hero.h / 2, 'hero');
					} else {//jump
						//console.log('jumpstart', Game.x, Game.y, Game.S.hero.jumpstart);
						//if(Game.y != 0) {return;}
						//if(Game.S.hero.jumpstart) {return;}
						//Game.S.hero.jumpstart = true;
						//Game.S.hero.jump = Game.S.hero._jump;
						//Game.y = 1;
						
						//if(Game.y != 0) {return;}
						ff();
						//Game.x = 1;
					}
					
				}
				if(phase == 'end') {
					//alert('END ' + Game.S.hero.jumpstart);
					if(Game.S.hero.jumpstart == false) {
						Game.x = 0;
					}
				}
				if(fingers > 1) {
					ff();
					//alert(fingers);
				}
			}
		});
		$(document).keydown(function(e){
			if(e.keyCode == 32) {
				if(Game.y != 0) {return;}
				Game.S.hero.jump = Game.S.hero._jump;
				Game.S.hero.jumpstart = true;
				Game.y = 1;
			}
		});
		
		this.draw();
		this.repeatmotion();
		this.speedcontrol();
		setTimeout(function(){
			Game.x = 0;
			Game.y = -1;
		}, 500);
		
	}
}
//Function.prototype.toString = function() {return this.call();}
/*
Object.defineProperty(Game.S.hero, "r", {
    get: function() {
        return this.l + this.w;//alert("hello world");
    },
    set: undefined
});
*/
$(document).ready(function() {
	
	DWIDTH = document.body.clientWidth;
	DHEIGHT	= document.body.clientHeight;
	SCALINGFACTOR = DWIDTH / 320;
	BANNERHEIGHT = SCALINGFACTOR * 50;
	GAMEWIDTH = DWIDTH;
	GAMEHEIGHT = DHEIGHT;
	//GAMEHEIGHT = DHEIGHT - BANNERHEIGHT;
	
	Game.init();
	
	$('#map').css({
		width : Game.width + 'px',
		height : DHEIGHT + 'px',
		top : '0px'
	});
	
	$('#message').css({
		width : (DWIDTH - 55 + 'px'),
		margin : ((DHEIGHT / 2) + 'px 15px 0px 15px')
	});
	
	$('#playbutton')
		.css({
			width : (100 * SCALINGFACTOR) + 'px',
			height : (30 * SCALINGFACTOR) + 'px',
			left : (DWIDTH / 2 - 50 * SCALINGFACTOR) + 'px',
			bottom : 30 * SCALINGFACTOR
		})
		.click(function(){
			$('#screen').show();
			$('#startscreen').hide();
			Game.startgame();
		});
		
	//Game.startgame();
	
});