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
  wrap: true,
  hScrollBarAlwaysVisible: true,
  vScrollBarAlwaysVisible: true,
  mode: 'ace/mode/html'
});

document.querySelector(".resizer").addEventListener("click",function() {
  editor.resize();
  editor.renderer.updateFull();
})

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

/* Tooltip
========================================================== */
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

/* Theme Helper
========================================================== */
function setStyleSource(linkID, sourceLoc) {
  var theLink = document.querySelector(linkID);
  theLink.href = sourceLoc;
}

/* User Warning
========================================================== */
window.onbeforeunload = function(e) {
  return '';
};