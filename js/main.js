
function Slider(options) {

	let slider = document.querySelectorAll(options.elem);

	for (let i = 0; i < slider.length; i++) {
		let slideContainer = slider[i].querySelector('.slide-container');
		let track = slider[i].querySelector('.track');
		let slideItem = slider[i].querySelectorAll('.slide-item');

		let dots;

		let countDot = 0;

		let count = slideItem.length;

		let slidesToShow = options.slidesToShow;
		let slidesToScroll = options.slidesToScroll;
		let responsive = options.responsive;

		let next = slider[i].querySelector('.next').addEventListener('click', function() {
			slideMove(this, 1);
		});

		let prev = slider[i].querySelector('.prev').addEventListener('click', function() {
			slideMove(this, -1);
		});

		/*  ADD-DOT 
		------------------------------------------------- */
		function addDots() {
        	let slideDots = document.createElement('div');

            for (let i = 0; i < slideItem.length / slidesToScroll; i++) {
                slideContainer.appendChild(slideDots);
                slideDots.classList.add('slide-dots');
                let span = document.createElement('span');
                slideDots.appendChild(span);
            }

            dots = slider[i].querySelectorAll('.slide-dots span');
            dotActive(0);

			dotsClick();
        }

		/*  DOTS CLICK 
		------------------------------------------------- */
		function dotsClick() {
			for (let i = 0; i < dots.length; i++) {
				dots[i].onclick = function() {

					slideSpeed(options.speed);

					countDot = i;

					count = slideItem.length + i * slidesToScroll;

					dotActive(i);

					setTransform();

					clearInterval(intervalID);

					intervalID = setInterval(autoplaySlide, options.autoplaySpeed);
				}
			}
		}

		function dotActive(index) {
			if (options.dots) {
				for (let i = 0; i < dots.length; i++) {
					dots[i].classList.remove('active');
				}
				dots[index].classList.add('active');
			}
        }

		/*  SLIDE-CLONE
		------------------------------------------------- */
		function slideClone() {
			for (let i = 0; i < slideItem.length; i++) {
				let cloneStart = slideItem[slideItem.length - slideItem.length + i].cloneNode(true);
				cloneStart.classList.add('cloned');
				track.insertBefore(cloneStart, slideItem[0]);
			}

			for (let i = 0; i < slideItem.length; i++) {
				let cloneEnd = slideItem[i].cloneNode(true);
				cloneEnd.classList.add('cloned');
				track.appendChild(cloneEnd);
			}
		}
		slideClone();

		let slideItems = slider[i].querySelectorAll('.slide-item');

		for (let i = 0; i < slideItems.length; i++) {
			slideItems[i].onmousedown = function(e) {
				e.preventDefault();
			}
		}

		function setTransform() {
			if (responsive) {
				const allResponsive = responsive.map(item => item.breakpoint);
				const maxResponse = Math.max(...allResponsive);
				const widthWindow = window.innerWidth;

				if (widthWindow < maxResponse) {
					for (let i = 0; i < allResponsive.length; i++) {
						if (widthWindow < allResponsive[i] ) {
							slidesToShow = responsive[i].slidesToShow;
						}
					}
				}else if (widthWindow > maxResponse) {
					slidesToShow = options.slidesToShow;
				}
			}

			for (let i = 0; i < slideItems.length; i++) {
				slideItems[i].style.minWidth = 100 / slidesToShow + '%';
			}
		     
		    track.style.transform = 'translate3d(-' + count * 100 / slidesToShow + '%,0,0)';

		    console.log(slidesToShow);
		}
		setTransform();
		
		/*  SWIPE DESCTOP
		------------------------------------------------- */
		function swiperDesctop(e) {
			track.addEventListener("mousedown", swipeStart);

		  	let shiftX = 0;

		  	function swipeStart(e) {
		  		track.removeEventListener("mousedown", swipeStart);

		  		shiftX = e.pageX;

				track.addEventListener("mouseup", swipeEnd);

		  		track.addEventListener("mousemove", swipeMove);

				track.addEventListener("mouseleave", swipeEnd);

		  		setTimeout(function() {
					track.addEventListener("mousedown", swipeStart);
				}, options.speed);
		  	}

		  	function swipeMove(e) {
		  		slideSpeed(0);

		    	track.style.transform = 'translate3d(' +(count * 100 / -slidesToShow + (e.pageX - shiftX) / (this.clientWidth / 100)) + '%,0,0)';
		  	}

		  	function swipeEnd(e) {
		    	slideSpeed(options.speed);

		    	track.style.transform = 'translate3d(' + count * 100 / -slidesToShow + '%,0,0)';

		  	 	if (e.pageX - shiftX < -slideItems[0].clientWidth / 100 * 8) {
		    		slideMove(false, 1)
		    	}else if (e.pageX - shiftX > slideItems[0].clientWidth / 100 * 8) {
		    		slideMove(false, -1)
		    	}

		   		track.removeEventListener("mousemove", swipeMove);
		   		track.removeEventListener("mouseleave", swipeEnd);
		   		track.removeEventListener("mouseup", swipeEnd);
		 	 };
		}
		swiperDesctop();

		/*  SWIPE MOBILE
		------------------------------------------------- */
		function swipeMobile() {
			track.addEventListener("touchstart", swipeStart);
			
		  	let touchX = 0;

			function swipeStart(e) {
				track.removeEventListener("touchstart", swipeStart);

				touchX = e.changedTouches[0].screenX;

				track.addEventListener("touchend", swipeEnd);

				track.addEventListener("touchmove", swipeMove);

				track.addEventListener("touchleave", swipeEnd);

				setTimeout(function() {
					track.addEventListener("touchstart", swipeStart);
				}, options.speed);
			}

			function swipeMove(e) {
				slideSpeed(0);

		    	track.style.transform = 'translate3d(' +(count * 100 / -slidesToShow + (e.changedTouches[0].screenX - touchX) / (this.clientWidth / 100)) + '%,0,0)';
			}

			function swipeEnd(e) {
				slideSpeed(options.speed);

		    	track.style.transform = 'translate3d(' + count * 100 / -slidesToShow + '%,0,0)';

		    	if (e.changedTouches[0].screenX - touchX < -slideItems[0].clientWidth / 100 * 8) {
		    		slideMove(false, 1)
		    	}else if (e.changedTouches[0].screenX - touchX > slideItems[0].clientWidth / 100 * 8) {
		    		slideMove(false, -1)
		    	}

			    track.removeEventListener("touchmove", swipeMove);
			    track.removeEventListener("touchleave", swipeEnd);
			    track.removeEventListener("touchend", swipeEnd);
			}
		}
		swipeMobile();
		
		/*  SPEED-SLIDE 
		------------------------------------------------- */
		function slideSpeed(seconds) {
			track.style.cssText = "transition: transform "+ seconds +"ms ease";
		}

		/*  CONTROL-POSITION 
		------------------------------------------------- */
		function controlPosition() {
			setTimeout(function() {
				slideSpeed(0);

				setTransform();
			}, options.speed);
		}

		/*  BTN-DISABLED 
		------------------------------------------------- */
		function btnDisabled(btn) {
			btn.disabled = true;

			setTimeout(function() {
				btn.disabled = false;
			}, options.speed, btn);
		}
		
		function autoplaySlide() {
            slideMove(false, 1)
        	intervalID = setInterval(autoplaySlide, options.autoplaySpeed);
        }


		function slideMove(btn, counter) {

		  	slideSpeed(options.speed);

		  	btnDisabled(btn);

			countDot = countDot + counter;

			count = count + counter;

			setTransform();

			if (count >= slideItem.length + slideItem.length) {
		  		countDot = 0;

		  		count = slideItem.length;

		  		controlPosition();
		  	}

		  	if (count < slideItem.length ) {
		  		countDot = slideItem.length / slidesToScroll -1;

		  		count = slideItem.length + slideItem.length - slidesToScroll;

		  		controlPosition();
		  	}

			dotActive(countDot);
		}

		function init() {
			if (options.dots) {
	       		addDots();
			}
			
			window.addEventListener('resize', setTransform);
		}

		init();
	}
}

let slid2 = new Slider({
	elem: '.slider-fade',
	slidesToShow: 1,
	slidesToScroll: 1,
	dots: true,
	speed: 500,
	autoplay: true,
	autoplaySpeed: 3000,
});




