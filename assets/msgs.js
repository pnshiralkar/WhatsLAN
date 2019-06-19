$.ajax({
  url: "getmsgs/",
  type: "GET",
  success: function(res){
    var obj = JSON.parse(res);
    //console.log(obj);
    for(var i in obj){
      $("#msgs").html($("#msgs").html() + "<li><b>" + obj[i].from + ": </b> " + obj[i].msg + "</li>");
    }
  }
});

$(document).ready(function() {
  $("#sendmsgfrm").submit(function(e){
    e.preventDefault();
    $.ajax({
      url: "msg/",
      type: "POST",
      data: {toip: $("#sendto").val(), msg: $("#sendmsg").val()},
      success: function(res){
        $("#sendto").val("");
        $("#sendmsg").val("");
        }
    });
  });
});

function checkmsgs()
{
  $.ajax({
    url: "newmsg/",
    type: "GET",
    error: function(err){checkmsgs();},
    success: function(res){
      var obj = JSON.parse(res);
      //console.log(obj);
      $("#msgs").html("");
      for(var i in obj){
        $("#msgs").html($("#msgs").html() + "<li><b>" + obj[i].from + ": </b> " + obj[i].msg + "</li>");
      }
      checkmsgs();
    }
  });
}

checkmsgs();
