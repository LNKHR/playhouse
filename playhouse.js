/* Editor Stuff
========================================================== */
var editor = ace.edit("html");
editor.$blockScrolling = Infinity;
editor.setOptions({
  selectionStyle: 'line',
  highlightActiveLine: true,
  highlightSelectedWord: true,
  behavioursEnabled: true,
  displayIndentGuides: true,
  fontSize: 16,
  theme: 'ace/theme/tomorrow_night',
  useWorker: false,
  useSoftTabs: true,
  tabSize: 2,
  mode: 'ace/mode/html'
});


/* Expand Content on Scroll
========================================================== */
$(window).scroll(function() {    
  var scroll = $(window).scrollTop();
  if (scroll >= 50) {
    $("#codeEditor").addClass("extend");
  } else {
    $("#codeEditor").removeClass("extend");
  }
});


/* Change Theme
========================================================== */
function setStyleSource(linkID, sourceLoc) {
  var theLink = document.querySelector(linkID);
  theLink.href = sourceLoc;
}

document.getElementById("thCSSThemes").addEventListener("change", function () {
  var selected = this.options[this.selectedIndex].value;
  setStyleSource("#thThemes", selected);
  edit(selected);
});	

document.getElementById("editorThemes").addEventListener("change", function () {
  var selected = this.options[this.selectedIndex].value;
  editor.setTheme(selected);
});	


/* Complie HTML 
========================================================== */
let compile = () => {
  editor.addEventListener('change', function () {
    let code = document.getElementById("code");
    var text = editor.getValue();
    localStorage.setItem("html", text);
    code.innerHTML = text;
  });
  window.onload = () => {
    var savedText = localStorage.getItem("html") || "";
    code.innerHTML = savedText;
    editor.session.setValue(savedText);
  };
}

compile();


/* Copy to Clipboard
========================================================== */
function copyToClipboard() {
  const str = editor.getValue();
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}


/* Resizer
========================================================== */
$("#codeEditor").resizable({
  handleSelector: ".resizer", 
  resizeHeight: false 
});


/* Sidebar Junk
========================================================== */
function offCanvas() {
  var element = document.getElementById("codeEditor");
  element.classList.toggle("active");
}


/* Sidebar Junk
========================================================== */
function sidebarToggle() {
  var element = document.getElementById("sidebar");
  element.classList.toggle("d-none");
  var element2 = document.getElementById("content");
  element2.classList.toggle("col-lg-12");
}
