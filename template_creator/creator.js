/* Editor Stuff
========================================================== */
const editor = ace.edit("html");
editor.$blockScrolling = Infinity;
editor.setOptions({
  selectionStyle: 'line',
  highlightActiveLine: true,
  highlightSelectedWord: true,
  behavioursEnabled: true,
  displayIndentGuides: true,
  fontSize: 12,
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
const writtenEdit = ace.edit("writtenhtml");
writtenEdit.$blockScrolling = Infinity;
writtenEdit.setOptions({
  selectionStyle: 'line',
  highlightActiveLine: true,
  highlightSelectedWord: true,
  displayIndentGuides: true,
  fontSize: 12,
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

let resizers = document.querySelectorAll(".resizers");

for (var i = 0; i < resizers.length; i++) {
  resizers[i].addEventListener("click", function () {
    editor.resize();
    editor.renderer.updateFull();
    writtenEdit.resize();
    writtenEdit.renderer.updateFull();
  });
}


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

/* Theme Helper
========================================================== */
function setStyleSource(linkID, sourceLoc) {
  var theLink = document.querySelector(linkID);
  theLink.href = sourceLoc;
}

/* Editor Theme Toggle 
========================================================== */

let editorTheme = true;

const toggleTheme = () => {
  if (editorTheme == true || editorTheme == "true") {
    editorTheme = true;
    editor.setTheme("ace/theme/tomorrow_night");
    writtenEdit.setTheme("ace/theme/tomorrow_night");
    $("#fa-editor-toggle").addClass("fa-sun").removeClass("fa-moon");
  } else {
    editorTheme = false;
    $("#fa-editor-toggle").addClass("fa-moon").removeClass("fa-sun");
    editor.setTheme("ace/theme/chrome");
    writtenEdit.setTheme("ace/theme/chrome");
  }
};

(function savedEditorTheme() {
  let savedEditor = localStorage.getItem("userEditor");
  editorTheme = savedEditor ? savedEditor : editorTheme;
  toggleTheme();
})();

const editorThemeToggle = () => {
  editorTheme = !editorTheme;
  toggleTheme();
  localStorage.setItem("userEditor", editorTheme);
};

/* Change CSS Theme
========================================================== */
(function newThemeUser() {
  var savedTheme = localStorage.getItem("themeUser");
  if (document.querySelector(`[value='${savedTheme}']`)) {
    document.querySelector(`[value='${savedTheme}']`).setAttribute("selected", "true");
    setStyleSource("#thThemes", "../styles/toyhouse_themes/" + savedTheme + ".css");
  }
})();

document.getElementById("thCSSThemes").addEventListener("change", function () {
  var selected = "../styles/toyhouse_themes/" + this.options[this.selectedIndex].value + ".css";
  let vanillaSelected = this.options[this.selectedIndex].value;
  setStyleSource("#thThemes", selected);
  localStorage.setItem("themeUser", vanillaSelected);
});


/* Show Documentation
========================================================== */
const documentationToggle = () => {
  $("#code").toggleClass("d-none");
  $("#documentation").toggleClass("d-none");
};


/* User Warning
========================================================== */
/*window.onbeforeunload = function(e) {
  return '';
};*/

/* Tooltip
========================================================== */
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

/* Lol
========================================================== */
// Loads user's previous html into the editor
window.onload = () => {
  const savedTemplateHTML = localStorage.getItem("htmluser") || "";
  editor.session.setValue(savedTemplateHTML);

  let renderedCode = localStorage.getItem("htmlRendered");
  code.innerHTML = renderedCode;
  writtenEdit.setValue(renderedCode);
};


// Grabs user input from the forms
function inputGetter() {
  var inputs = document.querySelectorAll('.user-input');
  var inputArray = [];
  for (var i = 0; i < inputs.length; i++) {
    inputArray[i] = {
      id: inputs[i].id,
      value: inputs[i].value
    };
  }
  console.log(inputs);
  return inputArray;
}

// Grabs the template and makes it look nice and neat
function templateGetter() {

  // Grabbing all dah HTML
  var savedInput = inputGetter();
  var itemList = editor.getValue().match(/{{(?:.+)}}/gm); //.filter((x, i, a) => a.indexOf(x) == i)
  let cleanList = [];
  let bigArray = [];

  for (let i = 0; i < itemList.length; i++) {

    // So we don't have to keep scrubbing the {{}}
    cleanList.push(itemList[i].split('{{')[1].split('}}')[0]);

    // Removes undefined from value
    let itemValues = (cleanList[i].split(/:(.+)/)[1].split('|')[1] == undefined) ? "[info]" : cleanList[i].split(/:(.+)/)[1].split('|')[1];

    // Makes a pretty array of info
    bigArray[i] = {
      itemList: cleanList[i],
      itemInput: cleanList[i].split(':')[0],
      itemTitle: cleanList[i].split(':')[1].split('|')[0],
      itemID: cleanList[i].replace(/\s/g, '-').split(':')[1].split('|')[0],
      itemValue: itemValues
    };

    // Saved user input
    if (savedInput.length > 0) {
      for (let j = 0; j < savedInput.length; j++) {
        if (savedInput[j].id == bigArray[i].itemID) {
          bigArray[i].itemValue = savedInput[j].value;
        }
      }
    }

  };

  return bigArray;

}


function insertInput() {
  //get the original template
  var inputChange = editor.getValue();
  var inputArray = inputGetter();
  var bigArray = templateGetter();

  //loop through big array to store user input then change html using template accordingly
  for (var i = 0; i < bigArray.length; i++) {
    for (var j = 0; j < inputArray.length; j++) {
      if (inputArray[j].id == bigArray[i].itemID) {


        if (bigArray[i].itemInput == 'textarea') {
          bigArray[i].userInput = "<p>" + inputArray[j].value.replaceAll("\n", `</p>
          <p>`) + "</p>";
        } else if (bigArray[i].itemInput == 'list') {
          bigArray[i].userInput = "<li>" + inputArray[j].value.replaceAll("\n", `</li>
          <li>`) + "</li>";
        } else {
          bigArray[i].userInput = inputArray[j].value;
        }

        // only replaces the first instance of the item
        var inputChange = inputChange.replace(`{{${bigArray[i].itemList}}}`, `${bigArray[i].userInput}`).replace(/{{section(?:.+)}}/gm,"");

        code.innerHTML = inputChange;
        localStorage.setItem("htmluser", editor.getValue());
        localStorage.setItem("htmlRendered", inputChange);
        writtenEdit.setValue(inputChange);

      }
    }
  }
};


let bigArray = [];


function formBuilder() {

  var bigArray = templateGetter();
  document.getElementById('options').innerHTML = "";

  // Creates the forms
  for (let i = 0; i < bigArray.length; i++) {

    let inputText = `
      <label for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      <input class="form-control user-input mb-3" type="text" value="${bigArray[i].itemValue}" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}"></input>
    `;

    let inputTextArea = `
      <label for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      <textarea class="form-control user-input mb-3" type="color" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}">${bigArray[i].itemValue}</textarea>
    `;

    let inputColor = `
      <label for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      <input class="form-control user-input mb-3" value="${bigArray[i].itemValue}" type="color" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}"></input>
    `;

    let inputNumber = `
      <label for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      <input class="form-control user-input mb-3" value="${bigArray[i].itemValue}" type="number" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}"></input>
    `;
    
    let inputBootstrap = `
      <label for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      <select class="form-control user-input mb-3" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}">
        <option value="primary">Primary</option>
        <option value="warning">Warning</option>
        <option value="info">Info</option>
        <option value="danger">Danger</option>
      </select> 
    `;

    let inputDropdown = `
      <label for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      <select class="form-control user-input mb-3" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}">
        <option>` + bigArray[i].itemValue.replaceAll(',',`</option>
        <option>`) + `</option>
      </select> 
    `;

    let inputList = `
      <label for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      <textarea class="form-control user-input mb-3" type="color" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}"></textarea>
    `;

    let sectionTitle = `
      <hr class="mx-n4 my-4">
      <h1 class="text-primary text-center text-capitalize display-4 mb-4">${bigArray[i].itemTitle}</h1>
    `;



    if (bigArray[i].itemInput == "text") {
      document.getElementById('options').innerHTML += inputText;
    } if (bigArray[i].itemInput == "textarea") {
      document.getElementById('options').innerHTML += inputTextArea;
    } if (bigArray[i].itemInput == "color") {
      document.getElementById('options').innerHTML += inputColor;
    } if (bigArray[i].itemInput == "number") {
      document.getElementById('options').innerHTML += inputNumber;
    } if (bigArray[i].itemInput == "dropdown") {
      document.getElementById('options').innerHTML += inputDropdown;
    } if (bigArray[i].itemInput == "list") {
      document.getElementById('options').innerHTML += inputList;
    } if (bigArray[i].itemInput == "bootstrap") {
      document.getElementById('options').innerHTML += inputBootstrap;
    } if (bigArray[i].itemInput == "section") {
      document.getElementById('options').innerHTML += sectionTitle;
    }

  }

  insertInput();

};

document.getElementById('render-form').addEventListener('click', function () {
  formBuilder()
});

document.querySelector("#options").addEventListener("change", function () {
  insertInput();
});