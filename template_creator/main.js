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
  fontSize: 14,
  theme: 'ace/theme/tomorrow_night',
  useWorker: false,
  useSoftTabs: true,
  indentedSoftWrap: false,
  tabSize: 2,
  wrap: true,
  mode: 'ace/mode/html'
});

/* Editor Stuff
========================================================== */
var writtenEdit = ace.edit("writtenhtml");
writtenEdit.$blockScrolling = Infinity;
writtenEdit.setOptions({
  selectionStyle: 'line',
  highlightActiveLine: true,
  highlightSelectedWord: true,
  displayIndentGuides: true,
  fontSize: 14,
  theme: 'ace/theme/tomorrow_night',
  useWorker: false,
  indentedSoftWrap: false,
  tabSize: 2,
  wrap: true,
  mode: 'ace/mode/html'
});

writtenEdit.setReadOnly(true);


/* Resizing Renderer
========================================================== */

document.querySelector(".resizer").addEventListener("click",function() {
  editor.resize();
  editor.renderer.updateFull();
  writtenEdit.resize();
  writtenEdit.renderer.updateFull();
})

document.querySelector(".resizer-horizontal").addEventListener("click",function() {
  editor.resize();
  editor.renderer.updateFull();
  writtenEdit.resize();
  writtenEdit.renderer.updateFull();
})

document.querySelector(".resizer-horizontal-2").addEventListener("click",function() {
  editor.resize();
  editor.renderer.updateFull();
  writtenEdit.resize();
  writtenEdit.renderer.updateFull();
})


/* Resizer
========================================================== */
$("#codeEditor").resizable({
  handleSelector: ".resizer",
  resizeWidth: true,
  resizeHeight: false
});

$(".main-editor").resizable({
  handleSelector: ".resizer-horizontal",
  resizeWidth: false,
  resizeHeight: true
});

$(".written-html").resizable({
  handleSelector: ".resizer-horizontal-2",
  resizeWidth: false,
  resizeHeight: true
});


/* Sidebar Junk
========================================================== */
function offCanvas() {
  var element = document.getElementById("codeEditor");
  element.classList.toggle("active");
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
/*window.onbeforeunload = function(e) {
  return '';
};*/

/* Change Theme
========================================================== */

(function newThemeUser() {
  var savedTheme = localStorage.getItem("themeUser");
  if (document.querySelector(`[value='${savedTheme}']`)) {
    document.querySelector(`[value='${savedTheme}']`).setAttribute("selected", "true");
    setStyleSource("#thThemes", savedTheme);
  }
})();

document.getElementById("thCSSThemes").addEventListener("change", function () {
  var selected = this.options[this.selectedIndex].value;
  setStyleSource("#thThemes", selected);
  localStorage.setItem("themeUser", selected);
});

(function setUserEditor() {
  var savedEditor = localStorage.getItem("userEditor");
  if (document.querySelector(`[value='${savedEditor}']`)) {
    document.querySelector(`[value='${savedEditor}']`).setAttribute("selected", "true");
    editor.setTheme(savedEditor);
    writtenEdit.setTheme(savedEditor);
  }
})();

document.getElementById("editorThemes").addEventListener("change", function () {
  var selected = this.options[this.selectedIndex].value;
  editor.setTheme(selected);
  writtenEdit.setTheme(selected);
  localStorage.setItem("userEditor", selected);
});