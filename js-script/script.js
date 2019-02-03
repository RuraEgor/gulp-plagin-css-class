'use strict';

//----- VARRIAL GLOBAL ----


//-------------------------

$(function () {


	$(".obj-svg-path-style").on("click", function () {

		var $self = $(this);

		if ($self.hasClass("active")) {

			$(".sect-charact__bg").removeClass("active");
			$(".sect-charact .char path").removeClass("active");

		} else {

			$(".sect-charact__bg").addClass("active");
			$self.addClass("active");
		}

	});


	$(".sect-charact__bg").on("click", function () {

		var $self = $(this);

		if ($self.hasClass("active")) {

			$(".sect-charact__bg").removeClass("active");
			$(".sect-charact .char path").removeClass("active");
		}

		closeModalCharact();
	});

	//----------------

	$(".js-close-modal-char").on("click", function () {

		$(".sect-charact__bg").removeClass("active");
		$(".sect-charact .char path").removeClass("active");

		closeModalCharact();
	});


	//==== MODAL-WINDOW-CHARACTER
	//=======================================================================================================

	$(".js-characters-modal").on("click", function(){

		if( $(".characters-modal-descr").hasClass("active") ) {

			$(".characters-modal-descr").fadeOut(600, function(){

				$(this).removeClass("active");
			});

		} else {

			var chPosit = $(this).closest('div').position();

			var chWidthEl = $(this).closest('div').outerWidth();


			$(".characters-modal-descr").css({
				"top": chPosit.top - 330,
				"left": chWidthEl/2 + chPosit.left,
			});


			$(".characters-modal-descr").delay(800).fadeIn(600, function(){

				$(this).addClass("active");
			});
		}

		return false;

	});

	
});


//===========
$('.characters-modal-descr__charact-descr').slimscroll({
  height: '220px',
  alwaysVisible: true,
  color: 'yellow',
  size: '3px',
  opacity: 0.8
});


// FUNCTIONS
// ===========================================



function closeModalCharact() {

	$(".characters-modal-descr").fadeOut(600, function(){
		$(this).removeClass("active");
	});
}

