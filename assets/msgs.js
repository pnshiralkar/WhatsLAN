var chats = [];
var ip = "";
var curr;
var newmsgs = {};
var newmsgi=0;

$.ajax({
  url: "getip/",
  type : "POST",
  success: function (res) {
    ip=res;
  }
});

class Msgdisp{
  constructor(){
    this.cont = "";
  }
  sentmsg(msg)
  {
    this.cont += "<div class=\"row msgrow\"><div class=\"col-5\"></div><div class=\"col-7 justify-content-end d-flex\" style=\"width: 70%; margin: 2px 0\"><div style=' background: #fcfdad; border-radius: 5px 0 10px 5px; width: fit-content; padding: 2px 10px;'>" + msg + "</div></div></div>";
  }
  recmsg(msg)
  {
    this.cont += "<div class=\"row msgrow\"><div class=\"col-7\" style=\"width: 70%; margin: 2px 0\"><div style=' background: #F2F2F2; border-radius: 0 5px 5px 10px; width: fit-content; padding: 2px 10px;'>" + msg + "</div></div><div class=\"col-5\"></div></div>";
  }

  load()
  {
    $("#msgs").html(this.cont);
  }
}

function getmsg() {
  $.ajax({
    url: "getmsgs/",
    type: "GET",
    success: function (res) {
      var msgs = new Msgdisp();
      var obj = JSON.parse(res);
      console.log(obj);
      for (var i in obj) {
        if ($.inArray(obj[i].from, chats) === -1 && obj[i].from !== ip) {
          chats.push(obj[i].from);
          $("#chats").append("<li class=\"list-group-item\"><a class='chatlist' onclick='setcurr(this)'>" + obj[i].from + "</a></li>");
          newmsgs[obj[i].from] = newmsgi;
          newmsgi++;
        }
        if ($.inArray(obj[i].to, chats) === -1 && obj[i].from === ip) {
          chats.push(obj[i].to);
          $("#chats").append("<li class=\"list-group-item\"><a class='chatlist' onclick='setcurr(this)'>" + obj[i].to + "</a></li>");
          newmsgs[obj[i].to] = newmsgi;
          newmsgi++;
        }
        if (obj[i].from === curr || obj[i].to === curr) {
          if (obj[i].from !== ip)
            msgs.recmsg(obj[i].msg);
          else
            msgs.sentmsg(obj[i].msg);
        }
      }
      msgs.load();
      $('#msgs').scrollTop($('#msgs')[0].scrollHeight);
      checkmsgs();
    }

  });
}

getmsg();

$(document).ready(function() {
  $("#sendmsgfrm").submit(function(e){
    e.preventDefault();
    if(typeof curr !== "undefined") {
      $.ajax({
        url: "msg/",
        type: "POST",
        data: {toip: curr, msg: $("#sendmsg").val()},
        success: function (res) {
          $("#sendto").val("");
          $("#btnmsg").attr("disabled", false);
        }
      });
      $("#sendmsg").val("");
      $("#btnmsg").attr("disabled", true);
    }
  });
  $("#sendmsgnew").submit(function(e){
    e.preventDefault();
    $.ajax({
      url: "msg/",
      type: "POST",
      data: {toip: $("#sendto").val(), msg: $("#sendnewmsg").val()},
      success: function(res){
        $("#myModal").modal('toggle');
        $("#sendto").val("");
        $("#sendnewmsg").val("");
      }
    });
    $("#newmsgbtn").val("Sending...").prop("disabled", true);
  });
});

function checkmsgs()
{
  $.ajax({
    url: "newmsg/",
    type: "GET",
    error: function(err){checkmsgs();},
    success: function (res) {
      var msgs = new Msgdisp();
      var obj = JSON.parse(res);
      console.log(obj);
      for (var i in obj) {
        if ($.inArray(obj[i].from, chats) === -1 && obj[i].from !== ip) {
          chats.push(obj[i].from);
          $("#chats").append("<li class=\"list-group-item\"><a class='chatlist' onclick='setcurr(this)'>" + obj[i].from + "</a></li>");
          newmsgs[obj[i].from] = newmsgi;
          newmsgi++;
        }
        if ($.inArray(obj[i].to, chats) === -1 && obj[i].from === ip) {
          chats.push(obj[i].to);
          $("#chats").append("<li class=\"list-group-item\"><a class='chatlist' onclick='setcurr(this)'>" + obj[i].to + "</a></li>");
          newmsgs[obj[i].to] = newmsgi;
          newmsgi++;
        }
        if (obj[i].from === curr || obj[i].to === curr) {
          if (obj[i].from !== ip)
            msgs.recmsg(obj[i].msg);
          else
            msgs.sentmsg(obj[i].msg);
        }
        //else
          //$("#chats")[newmsgs[obj[i].from]].text(obj[i].from + "<span class=\"badge\">&nbsp;</span>");


      }
      msgs.load();
      $('#msgs').scrollTop($('#msgs')[0].scrollHeight);
      checkmsgs();
    }
  });
}

function logout()
{
  if(confirm("Remove Nickname?\nThis will also delete all chats. Are you sure?"))
    $.ajax({url: "/remnn", type: "GET", success: function (res) {
        if(res)
          location.reload();
      }})
}

function setcurr(x)
{
  curr = x.innerText;
  getmsg();
  console.log(x);
}
