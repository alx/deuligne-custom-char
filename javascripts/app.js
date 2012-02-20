$(document).ready(function () {

	/* Use this js doc for all application specific JS */

	/* TABS --------------------------------- */
	/* Remove if you don't need :) */

	function activateTab($tab) {
		var $activeTab = $tab.closest('dl').find('a.active'),
				contentLocation = $tab.attr("href") + 'Tab';

		//Make Tab Active
		$activeTab.removeClass('active');
		$tab.addClass('active');

    	//Show Tab Content
		$(contentLocation).closest('.tabs-content').children('li').hide();
		$(contentLocation).show();
	}

	$('dl.tabs').each(function () {
		//Get all tabs
		var tabs = $(this).children('dd').children('a');
		tabs.click(function (e) {
			activateTab($(this));
		});
	});

	if (window.location.hash) {
		activateTab($('a[href="' + window.location.hash + '"]'));
	}

	/* ALERT BOXES ------------ */
	$(".alert-box").delegate("a.close", "click", function(event) {
    event.preventDefault();
	  $(this).closest(".alert-box").fadeOut(function(event){
	    $(this).remove();
	  });
	});


	/* PLACEHOLDER FOR FORMS ------------- */
	/* Remove this and jquery.placeholder.min.js if you don't need :) */

	$('input, textarea').placeholder();



	/* UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE6/7/8 SUPPORT AND ARE USING .block-grids */
//	$('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'left'});
//	$('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'left'});
//	$('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'left'});
//	$('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'left'});



	/* DROPDOWN NAV ------------- */

	var lockNavBar = false;
	$('.nav-bar a.flyout-toggle').live('click', function(e) {
		e.preventDefault();
		var flyout = $(this).siblings('.flyout');
		if (lockNavBar === false) {
			$('.nav-bar .flyout').not(flyout).slideUp(500);
			flyout.slideToggle(500, function(){
				lockNavBar = false;
			});
		}
		lockNavBar = true;
	});
  if (Modernizr.touch) {
    $('.nav-bar>li.has-flyout>a.main').css({
      'padding-right' : '75px',
    });
    $('.nav-bar>li.has-flyout>a.flyout-toggle').css({
      'border-left' : '1px dashed #eee'
    });
  } else {
    $('.nav-bar>li.has-flyout').hover(function() {
      $(this).children('.flyout').show();
    }, function() {
      $(this).children('.flyout').hide();
    })
  }


	/* DISABLED BUTTONS ------------- */
	/* Gives elements with a class of 'disabled' a return: false; */
  var Grid = Backbone.Model.extend({
    
    change: function(){
      this.refreshGrid();
      this.refreshCode();
    },

    refreshGrid: function(){
      code = this.get("char");
      $.each($("li"), function(index){
        if(code.charAt(index) == 0){
          $(this).css("background-color", "#339");
        } else {
          $(this).css("background-color", "#aaa");
        }
      });
    },

    refreshCode: function(){
      code = "";
      $("li").each(function(){
        if($(this).css("background-color") == "rgb(51, 51, 153)"){
         code += "0";
        } else {
         code += "1";
        }
      });
      this.set("char", code);
      this.displayCode();
    },

    displayCode: function(){
      code = "#include <Wire.h>\n#include <Deuligne.h>\n\nDeuligne lcd;\n\n";
      code += "byte newChar[8]={\n";
      for (var i = 0; i < this.get("char").length; i+=5) {
        code += "  B" + this.get("char").slice(i, i + 5) + ",\n"
      };
      code = code.replace(/,\n$/, "\n};\n\n");
      code += "void setup(){\n  Wire.begin();\n  lcd.init();\n  lcd.createChar(0,newChar);\n  lcd.setCursor(0,0);\n";
      code += "// need to re-position after createChar\n  lcd.write(0);\n}\n\n";
      code += "void loop(){}\n";
      $("textarea").val(code);
    }
  });

  var grid = new Grid({
    char: "0000000000000000000000000000000000000000"
  });
  grid.displayCode();

  $("li").click(function(){
    if($(this).css("background-color") == "rgb(51, 51, 153)"){
      $(this).css("background-color", "#aaa");
    } else {
      $(this).css("background-color", "#339");
    }
    grid.refreshCode();
  });

  $("li").css("background-color", "#339");

  $("a.example").click(function(){
    grid.set("char", this.getAttribute("data-grid"));
  });

});
