// スムーススクロール
      $(function(){
      var width =  $(window).width();
      $('a[href*="#"]').click(function() {
      var speed = 400;
      var href= $(this).attr("href");
      var target = $(href == "#" || href == "" ? 'html' : href);
      var position = target.offset().top;
      $('body,html').animate({scrollTop:position}, speed, 'swing');
      return false;
      });
      });

//スクロールしたらメニューボタンの表示
      $(function(){
        $(window).on('load scroll', function(){
          if ($(window).scrollTop() > 500) {
            $('.toTop').fadeIn(400);
           } else {
            $('.toTop').fadeOut(400);
           }
         });
      });
