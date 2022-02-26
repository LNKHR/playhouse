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
  var userInput = document.querySelectorAll('.user-input');
  var inputArray = [];  
    for (var i = 0; i < userInput.length; i++) {
      inputArray[i] = {
        id: userInput[i].id,
        value: userInput[i].value
      };
    } 
  return inputArray;
}

// Grabs the template and makes it look nice and neat
function templateGetter() {

  // Grabbing all dah HTML
  var itemListRaw = editor.getValue().match(/{{(?:.+)}}/gm); //.filter((x, i, a) => a.indexOf(x) == i)
  let cleanList = [];
  let bigArray = [];

  // removes all duplicates from list
  var itemListSet = new Set(itemListRaw);
  var itemList = Array.from(itemListSet);

  for (let i = 0; i < itemList.length; i++) {

    // So we don't have to keep scrubbing the {{}}
    cleanList.push(itemList[i].split('{{')[1].split('}}')[0]);

    // Removes undefined from value
    let itemValues = (cleanList[i].split(/:(.+)/)[1].split('|')[1] == undefined) ? "[info]" : cleanList[i].split(/:(.+)/)[1].split('|')[1];

    //console.log(itemValues);

    // Makes a pretty array of info
    bigArray[i] = {
      itemList: cleanList[i],
      itemInput: cleanList[i].split(':')[0],
      itemTitle: cleanList[i].split(':')[1].split('|')[0],
      itemID: cleanList[i].replace(/\s/g, '-').split(':')[1].split('|')[0],
      itemValue: itemValues
    };
    
  };

  return bigArray;

}


function insertInput() {
  //get the original template
  var inputChange = editor.getValue();  
  var inputChangeTest = editor.getValue();  
  var bigArray = templateGetter();
  var inputArray = inputGetter();

  console.log(bigArray);
  console.log(inputArray);

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

        var inputValue = "";
        if (bigArray[i].itemInput == 'textarea' || bigArray[i].itemInput == 'list') {
          inputValue = inputArray[j].value.replaceAll('\n','//');
        } else if (bigArray[i].itemInput == 'dropdown') {
          inputValue = inputArray[j].value + ',' + bigArray[i].itemValue.replace(`${inputArray[j].value},`,'');
        } else {
          inputValue = inputArray[j].value;
        }

        var inputChangeTest = inputChangeTest.replaceAll(`{{${bigArray[i].itemList.replaceAll('-', ' ')}}}`, `{{${bigArray[i].itemInput}:${bigArray[i].itemTitle}|${inputValue}}}`);
       
        var inputChange = inputChange.replaceAll(`{{${bigArray[i].itemList}}}`, `${bigArray[i].userInput}`).replace(/{{section(?:.+)}}/gm,"").replace(/{{subsection(?:.+)}}/gm,"");
        

        code.innerHTML = inputChange;
        localStorage.setItem("htmluser", editor.getValue());
        localStorage.setItem("htmlRendered", inputChange);
        writtenEdit.setValue(inputChange);
        editor.setValue(inputChangeTest);

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
    <div class="row no-gutters mx-n1">
      <div class="col-4 my-auto p-1">
        <label class="m-0" for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      </div>
      <div class="col-8 my-auto p-1">
        <input class="form-control user-input" type="text" value="${bigArray[i].itemValue}" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}"></input>
      </div>
    </div>
    `;

    let inputTextArea = `
      <div class="mb-3">
        <label class="mb-2" for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
        <textarea class="form-control user-input" type="color" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}">${bigArray[i].itemValue.replaceAll('//','\n')}</textarea>
      </div>
    `;

    let inputColor = `
    <div class="row no-gutters mx-n1">
      <div class="col-4 my-auto p-1">
        <label class="m-0" for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      </div>
      <div class="col-8 my-auto p-1">
        <input class="form-control user-input" value="${bigArray[i].itemValue}" type="color" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}"></input>
      </div>
    </div>
    `;

    let inputNumber = `
    <div class="row no-gutters mx-n1">
      <div class="col-4 my-auto p-1">
        <label class="m-0" for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      </div>
      <div class="col-8 my-auto p-1">
        <input class="form-control user-input" value="${bigArray[i].itemValue}" type="number" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}"></input>
      </div>
    </div>
    `;
    
    

    let inputDropdown = `
    <div class="row no-gutters mx-n1">
      <div class="col-4 my-auto p-1">
        <label class="m-0" for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      </div>
      <div class="col-8 my-auto p-1">
        <select class="form-control user-input" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}">
          <option>` + bigArray[i].itemValue.replaceAll(',',`</option>
          <option>`) + `</option>
        </select> 
      </div>
    </div>
    `;

    let inputList = `
    <div class="mb-3">
      <label class="mb-1" for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
      <textarea class="form-control user-input" type="color" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}">${bigArray[i].itemValue.replaceAll('//','\n')}</textarea>
    </div>
    `;

    let sectionTitle = `
      <hr class="mx-n4 my-4">
      <h1 class="text-primary text-center text-capitalize display-4 mb-4">${bigArray[i].itemTitle}</h1>
    `;

    let subsectionTitle = `
      <hr>
        <h1 class="text-capitalize text-muted display-4 mb-0" style="font-size:1.25rem;">${bigArray[i].itemTitle}</h1>
      <hr>
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
      var bsPrimary = '';
      var bsWarning = '';
      var bsInfo = '';
      var bsDanger = '';

      switch(bigArray[i].itemValue) {
        case 'primary': 
          bsPrimary = 'selected';
          break;
        case 'warning': 
          bsWarning = 'selected';
          break;
        case 'info': 
          bsInfo = 'selected';
          break;
        case 'danger': 
          bsDanger = 'selected';
          break;
      }

      let inputBootstrap = `
      <div class="row no-gutters mx-n1">
        <div class="col-4 my-auto p-1">
          <label class="m-0" for="${bigArray[i].itemID}">${bigArray[i].itemTitle}</label>
        </div>
        <div class="col-8 my-auto p-1">
          <select class="form-control user-input" input-type="${bigArray[i].itemInput}" name="${bigArray[i].itemID}" id="${bigArray[i].itemID}">
            <option value="primary" ${bsPrimary}>Primary</option>
            <option value="warning" ${bsWarning}>Warning</option>
            <option value="info" ${bsInfo}>Info</option>
            <option value="danger" ${bsDanger}>Danger</option>
          </select> 
        </div>
      </div>
      `;
      document.getElementById('options').innerHTML += inputBootstrap;
    } if (bigArray[i].itemInput == "section") {
      document.getElementById('options').innerHTML += sectionTitle;
    } if (bigArray[i].itemInput == "subsection") {
      document.getElementById('options').innerHTML += subsectionTitle;
    }

  }

  insertInput();

};

document.getElementById('render-form').addEventListener('click', function () {
  formBuilder();
});

document.querySelector("#options").addEventListener("change", function () {
  insertInput();
});


document.querySelector("#download").addEventListener("click",function () {
  var zip = new JSZip();
  let templateCode = localStorage.getItem("htmluser");
  let renderedCode = localStorage.getItem("htmlRendered");
  zip.file("Template HTML.txt",templateCode).file("Rendered HTML.txt",renderedCode);
  zip.generateAsync({type:"blob"})
    .then(function(zip) {
    saveAs(zip, "Playhouse Templates.zip");
  });
});