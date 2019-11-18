$(function(){
  setTimeout(
    function(){
      $('#loading').fadeOut(15000);
    }, 5000);
});

$('#nav1').click(function(){
  $('.card').toggleClass('inactive');
});
