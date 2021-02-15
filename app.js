
function compile() {
  var html = document.getElementsById("html");
  var code = document.getElementById("code").contentWindow.document;
  document.body.onkeyup = function() {
    code.open();
    code.writeln(html.value);
    code.close();
  };
};

compile();