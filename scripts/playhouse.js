/* Ace Editor Options
========================================================== */
const editorTime = (aceSelector) => {
  const aceEditor = aceSelector;
  aceEditor.$blockScrolling = Infinity;
  aceEditor.setOptions({
    selectionStyle: "line",
    highlightActiveLine: true,
    highlightSelectedWord: true,
    behavioursEnabled: true,
    displayIndentGuides: true,
    fontSize: 12,
    theme: "ace/theme/tomorrow_night",
    useWorker: false,
    useSoftTabs: true,
    indentedSoftWrap: false,
    tabSize: 2,
    wrap: true,
    mode: "ace/mode/html",
  });
};

/* Resizing options
========================================================== */
const resizerOptions = (editorSelect, htmlSelect, width, height, editor) => {
  $(editorSelect).resizable({
    handleSelector: htmlSelect,
    resizeWidth: width,
    resizeHeight: height,
  });
  $(".resizers").on("click", function () {
    if (editor !== undefined) {
      editor.resize();
      editor.renderer.updateFull();
    }
  });
};

/* Theme Helper
========================================================== */
const setStyleSource = (linkID, sourceLoc) => {
  let theLink = document.querySelector(linkID);
  theLink.href = sourceLoc;
};

/* Editor Theme Helper
========================================================== */
const editorTheme = (theme, editor) => {
  if (theme == "light") {
    editor.setTheme("ace/theme/chrome");
  } else {
    editor.setTheme("ace/theme/tomorrow_night");
  }
};

const playhouseTemplateCreator = () => {
  /* Editor Stuff
  ========================================================== */

  // Main editor in creator
  const creatorEditor = ace.edit("html");
  editorTime(creatorEditor);

  // Copy/Paste editor in creator
  const creatorCopyEditor = ace.edit("writtenhtml");
  creatorCopyEditor.setReadOnly(true);
  editorTime(creatorCopyEditor);

  /* Resizing Windows
  ========================================================== */
  resizerOptions("#codeEditor", ".resizer", true, false, creatorEditor);
  resizerOptions(
    ".main-editor",
    ".resizer-horizontal",
    false,
    true,
    creatorCopyEditor
  );
  resizerOptions(".written-html", ".resizer-horizontal-2", false, true);

  /* Autosave Time Intervals
  ========================================================== */
  const autoSaveTime = (time) => {
    switch (time) {
      case "5":
        return 50000;
      case "15":
        return 150000;
      case "30":
        return 300000;
      case "60":
        return 600000;
      case "off":
        return "off";
    }
  };

  /* Template Creator
  ========================================================== */
  const creator = () => {
    // Grabs user input from the forms
    const inputGetter = () => {
      let inputArray = $(".user-input").serializeArray();
      return inputArray;
    };

    // Grabs the template and makes it look nice and neat
    const templateGetter = () => {
      try {
        // Grabbing all dah HTML
        let regex = new RegExp(
          /{{(bootstrap|text|textarea|color|number|dropdown|list|section|subsection)([\s\S]+?)}}/gim
        );
        let itemListRaw = creatorEditor.getValue().match(regex);

        // Get all unique items
        let itemListUnique = [...new Set(itemListRaw)];

        // Arrays to use for later
        let cleanList = new Array();
        let variableObject = new Array();

        // Fix up array
        for (let i = 0; i < itemListUnique.length; i++) {
          // Removes {{}}
          cleanList.push(itemListUnique[i].replace("{{", "").replace("}}", ""));

          // Makes a pretty array of info
          variableObject.push({
            itemTitle: cleanList[i].split(/::(.+)/)[1].split("||")[0],
            itemID: cleanList[i]
              .replace(/\s/g, "-")
              .split(/::(.+)/)[1]
              .split("||")[0]
              .toLowerCase(),
            itemInput: cleanList[i].split(/::(.+)/)[0],
            itemUnique: cleanList[i].split("||")[0],
            itemList: cleanList[i],
            itemValue:
              cleanList[i].split(/::(.+)/)[1].split("||")[1] == undefined &&
              cleanList[i].split(/::(.+)/)[0] != "color"
                ? "[info]"
                : cleanList[i].split(/::(.+)/)[1].split("||")[1],
          });
        }

        // Filter out variables that aren't key variables
        variableObject = variableObject.filter(
          (val, ind, arr) =>
            arr.findIndex((val2) => val2.itemUnique === val.itemUnique) === ind
        );

        // Returns key variables
        return variableObject;
      } catch (err) {
        $("#code").html(
          `<div class="alert alert-warning mb-4">Error: Looks like you're missing a :: somewhere - check over your template code just in case!</div>`
        );
      }
    };

    // Adding Inputs
    const insertInput = () => {
      // Grab template variable array
      let templateVariableArray = templateGetter();

      // Grab input array
      let inputArray = inputGetter();

      // Get the original template
      let keyVariableUpdate = creatorEditor.getValue();
      let variableUpdate = creatorEditor.getValue();

      // Loop through big array to store user input then change html using template accordingly
      for (let i = 0; i < templateVariableArray.length; i++) {
        for (let j = 0; j < inputArray.length; j++) {
          if (inputArray[j].name == templateVariableArray[i].itemID) {
            if (templateVariableArray[i].itemInput == "textarea") {
              templateVariableArray[i].userInput = inputArray[j].value.includes(
                "\n\n"
              )
                ? "<p>" +
                  inputArray[j].value.replaceAll("\n\n", `</p>\n<p>`) +
                  "</p>"
                : "<p>" +
                  inputArray[j].value.replaceAll("\n", `</p>\n<p>`) +
                  "</p>";
            } else if (templateVariableArray[i].itemInput == "list") {
              templateVariableArray[i].userInput = inputArray[j].value.includes(
                "\n\n"
              )
                ? "<li>" +
                  inputArray[j].value.replaceAll("\n\n", `</li>\n<li>`) +
                  "</li>"
                : "<li>" +
                  inputArray[j].value.replaceAll("\n", `</li>\n<li>`) +
                  "</li>";
            } else {
              templateVariableArray[i].userInput = inputArray[j].value;
            }

            let inputValue = "";
            if (
              templateVariableArray[i].itemInput == "textarea" ||
              templateVariableArray[i].itemInput == "list"
            ) {
              inputValue = inputArray[j].value.includes("\n\n")
                ? inputArray[j].value.replaceAll("\n\n", "&&")
                : inputArray[j].value.replaceAll("\n", "&&");
            } else if (templateVariableArray[i].itemInput == "dropdown") {
              inputValue =
                inputArray[j].value +
                "," +
                templateVariableArray[i].itemValue.replace(
                  `${inputArray[j].value},`,
                  ""
                );
            } else {
              inputValue = inputArray[j].value;
            }

            keyVariableUpdate = keyVariableUpdate.replaceAll(
              `{{${templateVariableArray[i].itemList.replaceAll("-", " ")}}}`,
              `{{${templateVariableArray[i].itemInput}::${templateVariableArray[i].itemTitle}||${inputValue}}}`
            );

            variableUpdate = variableUpdate
              .replaceAll(
                `{{${templateVariableArray[i].itemList}}}`,
                `${templateVariableArray[i].userInput}`
              )
              .replace(/{{section(?::.+)}}/gm, "")
              .replace(/{{subsection(?::.+)}}/gm, "")
              .replaceAll(
                `{{${templateVariableArray[i].itemInput}::${templateVariableArray[i].itemTitle}}}`,
                `${templateVariableArray[i].userInput}`
              );
          }
        }
      }

      return [keyVariableUpdate, variableUpdate];
    };

    const save = (saveInput) => {
      // Save just the key variable edit
      localStorage.setItem("creatorEditor", saveInput[0]);

      // Update the html
      $("#code").html(saveInput[1]);

      // Set Editor Values
      creatorEditor.setValue(saveInput[0]);
      creatorCopyEditor.setValue(saveInput[1]);
    };

    // Builds the forms for user input
    function formBuilder() {
      // Get the template again and clear out the form HTML
      let templateVariableArray = templateGetter();
      $("#options").html("");

      // Creates the forms
      for (let i = 0; i < templateVariableArray.length; i++) {
        // Insert Input Items
        switch (templateVariableArray[i].itemInput) {
          case "text":
            $("#options").append(`
            <div class="row no-gutters mx-n1">
              <div class="col-5 my-auto p-1">
                <label class="m-0" for="${templateVariableArray[i].itemID}">${templateVariableArray[i].itemTitle}</label>
              </div>
              <div class="col-7 my-auto p-1">
                <input class="form-control user-input" type="text" value="${templateVariableArray[i].itemValue}" input-type="${templateVariableArray[i].itemInput}" name="${templateVariableArray[i].itemID}"></input>
              </div>
            </div>`);
            break;
          case "textarea":
            $("#options").append(`
            <div class="mb-3">
              <label class="mb-2" for="${templateVariableArray[i].itemID}">${
              templateVariableArray[i].itemTitle
            }<br><small class="text-muted">Press enter to create a new paragraph.</small></label>
              <textarea rows="6" class="form-control user-input" type="color" input-type="${
                templateVariableArray[i].itemInput
              }" name="${
              templateVariableArray[i].itemID
            }">${templateVariableArray[i].itemValue.replaceAll(
              "&&",
              "\n"
            )}</textarea>
            </div>`);
            break;
          case "color":
            $("#options").append(`
            <div class="row no-gutters mx-n1">
              <div class="col-5 my-auto p-1">
                <label class="m-0" for="${templateVariableArray[i].itemID}">${templateVariableArray[i].itemTitle}</label>
              </div>
              <div class="col-7 my-auto p-1">
                <input class="form-control user-input" value="${templateVariableArray[i].itemValue}" type="color" input-type="${templateVariableArray[i].itemInput}" name="${templateVariableArray[i].itemID}"></input>
              </div>
            </div>`);
            break;
          case "number":
            $("#options").append(`
            <div class="row no-gutters mx-n1">
              <div class="col-5 my-auto p-1">
                <label class="m-0" for="${templateVariableArray[i].itemID}">${templateVariableArray[i].itemTitle}</label>
              </div>
              <div class="col-7 my-auto p-1">
                <input class="form-control user-input" value="${templateVariableArray[i].itemValue}" type="number" input-type="${templateVariableArray[i].itemInput}" name="${templateVariableArray[i].itemID}"></input>
              </div>
            </div>`);
            break;
          case "dropdown":
            $("#options").append(`
            <div class="row no-gutters mx-n1">
              <div class="col-5 my-auto p-1">
                <label class="m-0" for="${templateVariableArray[i].itemID}">${
              templateVariableArray[i].itemTitle
            }</label>
              </div>
              <div class="col-7 my-auto p-1">
                <select class="form-control user-input" input-type="${
                  templateVariableArray[i].itemInput
                }" name="${templateVariableArray[i].itemID}">
                  <option> ${templateVariableArray[i].itemValue.replaceAll(
                    ",",
                    `</option> <option>`
                  )} </option>
                </select> 
              </div>
            </div>`);
            break;
          case "list":
            $("#options").append(`
            <div class="mb-3">
              <label class="mb-1" for="${templateVariableArray[i].itemID}">${
              templateVariableArray[i].itemTitle
            }<br><small class="text-muted">Press enter to create a new line.</label>
              <textarea rows="4" class="form-control user-input" type="color" input-type="${
                templateVariableArray[i].itemInput
              }" name="${templateVariableArray[i].itemID}">
                ${templateVariableArray[i].itemValue.replaceAll("&&", "\n")}
              </textarea>
            </div>`);
            break;
          case "section":
            $("#options").append(`
            <hr class="mx-n4 my-4">
            <h1 class="text-primary text-center text-capitalize display-4 mb-4">${templateVariableArray[i].itemTitle}</h1>`);
            break;
          case "subsection":
            $("#options").append(`
            <hr>
            <h1 class="text-capitalize text-muted display-4 mb-0" style="font-size:1.25rem;">${templateVariableArray[i].itemTitle}</h1>
            <hr>`);
            break;
        }

        // Auto Populate Bootstrap
        if (templateVariableArray[i].itemInput == "bootstrap") {
          let bsPrimary = "";
          let bsSuccess = "";
          let bsWarning = "";
          let bsInfo = "";
          let bsDanger = "";

          switch (templateVariableArray[i].itemValue) {
            case "primary":
              bsPrimary = "selected";
              break;
            case "success":
              bsSuccess = "selected";
              break;
            case "warning":
              bsWarning = "selected";
              break;
            case "info":
              bsInfo = "selected";
              break;
            case "danger":
              bsDanger = "selected";
              break;
          }

          let inputBootstrap = `
            <div class="row no-gutters mx-n1">
              <div class="col-5 my-auto p-1">
                <label class="m-0" for="${templateVariableArray[i].itemID}">${templateVariableArray[i].itemTitle}</label>
              </div>
              <div class="col-7 my-auto p-1">
                <select class="form-control user-input" input-type="${templateVariableArray[i].itemInput}" name="${templateVariableArray[i].itemID}">
                  <option value="primary" ${bsPrimary}>Primary</option>
                  <option value="success" ${bsSuccess}>Success</option>
                  <option value="warning" ${bsWarning}>Warning</option>
                  <option value="info" ${bsInfo}>Info</option>
                  <option value="danger" ${bsDanger}>Danger</option>
                </select> 
              </div>
            </div>
          `;

          $("#options").append(inputBootstrap);
        }
      }

      // Slap that input in there
      save(insertInput());
    }

    // Slap that input in there
    save(insertInput());

    // Make it work
    formBuilder();
  };

  /* User Options
  ========================================================== */
  let userPreferences = new Object();
  let autosaveInt;

  // Style document when loaded
  $(document).ready(() => {
    if (window.localStorage.getItem("userPreferences")) {
      // Grab saved preferences
      userPreferences = JSON.parse(
        window.localStorage.getItem("userPreferences")
      );

      // Select new property
      for (const property in userPreferences) {
        $(`[name='${property}'] option`).attr("selected", false);
        $(
          `[name='${property}'] option[value='${userPreferences[property]}']`
        ).attr("selected", true);
      }

      // Setting CSS Style
      setStyleSource(
        "#thThemes",
        `../styles/toyhouse_themes/${userPreferences.siteTheme}.css`
      );

      // Set editor theme
      editorTheme(userPreferences.editorTheme, creatorEditor);
      editorTheme(userPreferences.editorTheme, creatorCopyEditor);

      // Set Autosave
      if (autoSaveTime(userPreferences.autosave) != "off") {
        autosaveInt = setInterval(() => {
          creator();
        }, autoSaveTime(userPreferences.autosave));
      }
    }

    if (localStorage.getItem("creatorEditor")) {
      creatorEditor.setValue(localStorage.getItem("creatorEditor"));
    }

    // Render on load
    creator();
  });

  // Save from form
  $("form").submit(function (event) {
    // Prevent Click
    event.preventDefault();

    // Save preferences to object
    let savedPreferences = $(this).serializeArray();

    // Create object from array
    for (let i = 0; i < savedPreferences.length; i++) {
      userPreferences[savedPreferences[i].name] = savedPreferences[i].value;
    }

    // Select new property
    for (const property in userPreferences) {
      $(`[name='${property}'] option`).attr("selected", false);
      $(
        `[name='${property}'] option[value='${userPreferences[property]}']`
      ).attr("selected", true);
    }

    // Set new JSON to the local storage
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

    // Setting CSS Style
    setStyleSource(
      "#thThemes",
      `../styles/toyhouse_themes/${userPreferences.siteTheme}.css`
    );

    // Set editor theme
    editorTheme(userPreferences.editorTheme, creatorEditor);
    editorTheme(userPreferences.editorTheme, creatorCopyEditor);

    // Set Autosave
    clearInterval(autosaveInt);
    if (autoSaveTime(userPreferences.autosave) != "off") {
      autosaveInt = setInterval(() => {
        creator();
      }, autoSaveTime(userPreferences.autosave));
    }
  });

  /* Render Template
  ========================================================== */
  $("#render-form").on("click", (e) => {
    e.preventDefault();
    creator();
  });

  /* Save Code
  ========================================================== */
  const saveCodeAs = () => {
    const templateName =
      creatorEditor.getValue().match(/{{template(.+?)}}/gm) != null
        ? creatorEditor
            .getValue()
            .match(/{{template(.+?)}}/gm)[0]
            .split(/::(.+)/)[1]
            .replace("}}", "")
            .toLowerCase()
            .replace(/\s/g, "-") + ".zip"
        : "playhouse-template.zip";

    let zip = new JSZip();
    let templateCode = creatorEditor.getValue();
    let renderedCode = creatorCopyEditor.getValue();

    zip
      .file("Template HTML.txt", templateCode)
      .file("Template HTML.html", templateCode)
      .file("Rendered HTML.txt", renderedCode)
      .file("Rendered HTML.html", renderedCode);

    zip.generateAsync({ type: "blob" }).then(function (zip) {
      saveAs(zip, templateName);
    });
  };

  // Save code on click
  $("#saveTemplate").on("click", (e) => {
    e.preventDefault();
    saveCodeAs();
  });

  // Save code on ctrl + s
  $(document).on("keydown", (e) => {
    if (e.ctrlKey && "s" === e.key) {
      e.preventDefault();
      saveCodeAs();
    }
  });
};

const playhouseEditor = () => {
  /* Editor Options
  ========================================================== */
  let liveEditor = ace.edit("html");
  editorTime(liveEditor);
  resizerOptions("#codeEditor", ".resizer", true, false, liveEditor);

  /* Compiler
  ========================================================== */
  let compile = () => {
    return liveEditor.getValue();
  };

  window.onload = () => {
    if (localStorage.getItem("htmlTHEditor")) {
      liveEditor.setValue(localStorage.getItem("htmlTHEditor"));
      $("#code").html(localStorage.getItem("htmlTHEditor"));
    }
  };

  liveEditor.on("change", () => {
    localStorage.setItem("htmlTHEditor", compile());
    $("#code").html(compile());
  });

  /* Toyhouse User/Character Toggle 
  ========================================================== */
  let profileToggle = true;

  $("#profileToggle").on("click", (e) => {
    e.preventDefault();

    let currentTime = new Date().toLocaleDateString();
    profileToggle = !profileToggle;

    if (profileToggle) {
      $("#fa-user").addClass("fa-user-astronaut").removeClass("fa-user");
      $("#content").innerHTML = `
            <div class="row">
              <div class="col-lg-12">
                <div class="profile-section profile-content-section user-content fr-view" id="code">
                ${compile()}
                </div>
              </div>
            </div>`;
    } else {
      $("#fa-user").addClass("fa-user").removeClass("fa-user-astronaut");
      $("#content").innerHTML = `
            <div class="character-profile">
              <div class="row profile-header">

                <div class="col-lg-6 col-12 profile-section profile-name-section">
                  <div class="img-thumbnail">
                    <img src="../favicon.png" class="profile-name-icon" style="max-width:100px;">
                  </div>
                  <div class="profile-name-info">
                    <h1 class="display-4">Character</h1>
                    <h2><span class="display-user"><a href="javascript: void(0)"><i class="fa fa-user mr-1" style="font-size:14px;"></i>user</a></span></h2>
                  </div>
                </div>

                <div class="col-lg-6 col-12 profile-section profile-info-section">
                  <div class="card">
                    <div class="card-block bg-faded">
                      <div class="profile-info-title hidden-lg-up">
                        <h2>Info</h2>
                        <hr>
                      </div>
                      <div class="profile-info-content row">
                        <div class="profile-stats-content  col-12">
                          <dl class="fields">
                            <div class="row fields-field">
                              <dt class="field-title col-sm-4">
                                Created
                              </dt>
                              <dd class="field-value col-sm-8">
                                <abbr class="tooltipster datetime small">
                                  ${currentTime}
                                </abbr>
                              </dd>
                            </div>
                            <div class="row fields-field">
                              <dt class="field-title col-sm-4">
                                Creator
                              </dt>
                              <dd class="field-value col-sm-8">
                                <span class="display-user"><a href="javascript: void(0)"><i class="fa fa-user mr-1" style="font-size:10px;"></i>user</a></span>
                              </dd>
                            </div>
                            <div class="row fields-field">
                              <dt class="field-title col-sm-4">
                                Favorites
                              </dt>
                              <dd class="field-value col-sm-8"><a href="" th-modal-trigger="">127</a></dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="profile-section profile-content-section ">
                <div class="profile-content-title">
                  <h2>Profile</h2>
                  <hr>
                </div>
                <div class="profile-content-content user-content fr-view">
                  <div class="user-profile" id="code">
                    ${compile()}
                  </div>
                </div>
              </div>

              <div class="profile-section profile-gallery-section">
                <div class="profile-gallery-title">
                  <h2>Recent Images
                    <hr>
                  </h2>
                </div>
                <div class="profile-gallery-content">
                  <p class="image-gallery-none">No images.</p>
                </div>
              </div>
            </div>`;
    }
  });

  /* Toyhouse Sidebar Toggle 
  ========================================================== */
  $("#sidebarToggle").on("click", (e) => {
    e.preventDefault();
    $("#sidebar").toggleClass("d-none");
    $("#content").toggleClass("col-lg-12");
  });

  /* Editor Theme Toggle 
  ========================================================== */
  let editorTheme = localStorage.getItem("playhouseEditorTheme") || true;

  const toggleTheme = () => {
    if (editorTheme == true || editorTheme == "true") {
      $("#fa-editor-toggle").addClass("fa-sun").removeClass("fa-moon");
      liveEditor.setTheme("ace/theme/tomorrow_night");
    } else {
      $("#fa-editor-toggle").addClass("fa-moon").removeClass("fa-sun");
      liveEditor.setTheme("ace/theme/chrome");
    }
    localStorage.setItem("playhouseEditorTheme", editorTheme);
  };

  toggleTheme();

  $("#editorTheme").on("click", (e) => {
    e.preventDefault();
    editorTheme = !editorTheme;
    toggleTheme();
  });

  /* Change CSS Theme
  ========================================================== */
  const newThemeUser = () => {
    let savedTheme = localStorage.getItem("themeUser");
    if ($(`[value='${savedTheme}']`) && savedTheme) {
      $(`[value='${savedTheme}']`).attr("selected", "true");
      setStyleSource(
        "#thThemes",
        "../styles/toyhouse_themes/" + savedTheme + ".css"
      );
    }
  };

  newThemeUser();

  $("#thCSSThemes").on("change", function () {
    let selected = this.options[this.selectedIndex].value;
    setStyleSource(
      "#thThemes",
      "../styles/toyhouse_themes/" + selected + ".css"
    );
    localStorage.setItem("themeUser", selected);
  });

  /* Save Code
  ========================================================== */
  const saveCodeAs = () => {
    let zip = new JSZip();
    let templateCode = liveEditor.getValue();

    zip
      .file("playhouse_code.txt", templateCode)
      .file("playhouse_code.html", templateCode);

    zip.generateAsync({ type: "blob" }).then(function (zip) {
      saveAs(zip, "playhouse_code.zip");
    });
  };

  // Save code on click
  $("#saveCode").on("click", (e) => {
    e.preventDefault();
    saveCodeAs();
  });

  // Save code on ctrl + s
  $(document).on("keydown", (e) => {
    if (e.ctrlKey && "s" === e.key) {
      e.preventDefault();
      saveCodeAs();
    }
  });
};

/* Misc
========================================================== */

// User Warning Before Exit
window.onbeforeunload = (e) => {
  return "";
};

// Enable Bootstrap Tooltips
$('[data-toggle="tooltip"]').tooltip();
