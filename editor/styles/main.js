/* Editor Options
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

// Resizes editor
document.querySelector(".resizer").addEventListener("click",function() {
  editor.resize();
  editor.renderer.updateFull();
})

/* Resizer
========================================================== */
$("#codeEditor").resizable({
  handleSelector: ".resizer",
  resizeHeight: false
});

/* Sidebar Toggle
========================================================== */
function offCanvas() {
  var element = document.getElementById("codeEditor");
  element.classList.toggle("active");
}

/* Toyhouse Sidebar Toggle 
========================================================== */
function sidebarToggle() {
  document.getElementById("sidebar").classList.toggle("d-none");
  document.getElementById("content").classList.toggle("col-lg-12");
}

/* Compiler
========================================================== */
let compile = () => {
  editor.addEventListener('change', function () {
    let code = document.getElementById("code");
    var text = editor.getValue();
    localStorage.setItem("htmluser", text);
    code.innerHTML = text;
  });
  document.getElementById("profile-toggler").addEventListener('click', function () {
    let code = document.getElementById("code");
    var text = editor.getValue();
    localStorage.setItem("htmluser", text);
    code.innerHTML = text;
  });
  window.onload = () => {
    var savedText = localStorage.getItem("htmluser") || "";
    code.innerHTML = savedText;
    editor.session.setValue(savedText);
  };
}

/* Toyhouse User/Character Toggle 
========================================================== */
let profileToggle = true;
const profileToggler = () => {

  var currentTime = new Date().toLocaleDateString();
  profileToggle = !profileToggle;

  if (profileToggle == false) {
    document.getElementById("profile-toggle").innerHTML = `<!-- Main Content -->
    <div id="main" class="clearfix container-fluid">
      <div class="row" style="min-height: calc(100vh - 55px)">

        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 sidebar" id="sidebar">
          <ul class="side-nav list-unstyled" id="character-links">
            <li class="header"><i class="fa fa-heart mr-2"></i> Character</li>
            <li class="user-name">
              <span class="display-user">
                <a href=""><img src="favicon.png" class="display-user-avatar">
                  <span class="display-user-username">user</span>
                </a>
              </span>
            </li>
            <li class="character-folder subheader">
              <a href=""><i class="mr-1 fa fa-folder"></i>All Characters</a>
            </li>
            <li class="character-name">
              <span class="display-character"><a href="">
                <img src="favicon.png" class="mr-2">Character</a>
              </span>
            </li>
            <li class="divider sidebar-divider-collections"></li>
            <li class=" sidebar-li-gallery"><a href=""><i class="far fa-image fa-fw sidebar-icon"></i>Gallery</a></li>
            <li class=" sidebar-li-library"><a href=""><i class="fa fa-book fa-fw sidebar-icon"></i>Library</a></li>
            <li class=" sidebar-li-worlds"><a href=""><i class="fa fa-globe fa-fw sidebar-icon"></i>Worlds</a></li>
            <li class=" sidebar-li-links"><a href=""><i class="fa fa-link fa-fw sidebar-icon"></i>Links</a></li>
            <li class="divider sidebar-divider-interactions"></li>
            <li class="sidebar-li-favorites hide" data-id="" data-url="" th-favorite="0" data-trigger="focus" tabindex="-1">
              <a href="#" class="favorited"><i class="fa fa-star fa-fw sidebar-icon"></i>Unfavorite
                <span class="pull-right sidebar-stat sidebar-stat-favorites th-favorite-count" data-id=""></span>
              </a>
            </li>
            <li class="sidebar-li-favorites " data-id="" data-url="" th-favorite="1">
              <a href="#"><i class="far fa-star fa-fw sidebar-icon"></i>Favorite 
                <span class="pull-right sidebar-stat sidebar-stat-favorites th-favorite-count" data-id=""></span>
              </a>
            </li>
            <li class="divider sidebar-divider-ownership"></li>
            <li class=" sidebar-li-ownership"><a href=""><i class="far fa-check-square fa-fw sidebar-icon"></i>Ownership</a></li>
            <li class="divider sidebar-divider-mod"></li>
            <li class="sidebar-li-report"><a href=""><i class="fa fa-exclamation-triangle fa-fw sidebar-icon"></i>Report</a></li>
            <li class="sidebar-li-block"><a href="" th-modal-trigger=""><i class="fa fa-ban fa-fw sidebar-icon"></i>Block</a></li>
          </ul>
        </div>

        <!-- Main Content -->
        <div class="col-sm-12 col-md-9 col-lg-10 content-main" id="content">
          <div class="row profile-header">

            <div class="col-lg-6 col-12 profile-section profile-name-section">
              <div class="img-thumbnail">
                <img src="favicon.png"
                  class="profile-name-icon">
              </div>
              <div class="profile-name-info">
                <h1 class="display-4">Character</h1>
                <h2><span class="display-user"><a href=""><i class="fa fa-user mr-1" style="font-size:14px;"></i>user</a></span></h2>
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
                            <span class="display-user"><a href=""><i class="fa fa-user mr-1" style="font-size:10px;"></i>user</a></span>
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
              <div class="user-profile" id="code"></div>
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

        </div>
      </div>
    </div>`;
  } else {
    document.getElementById("profile-toggle").innerHTML = `<!-- Main Content -->
    <div id="main" class="clearfix container-fluid">
      <div class="row" style="min-height: calc(100vh - 55px)">

        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 sidebar" id="sidebar">
          <ul class="side-nav list-unstyled" id="user-links">
            <li class="header"><i class="fas fa-user header-icon"></i>User</li>
            <li>
              <span class="display-user">
                <a href="">
                  <img
                    src="favicon.png"
                    class="display-user-avatar">
                  <span class="display-user-username">user</span>
                </a>
              </span>
            </li>
            <li class="divider sidebar-divider-username"></li>
            <li class=" sidebar-li-bulletins"><a href=""><i
                  class="far fa-newspaper fa-fw sidebar-icon"></i>Bulletins</a></li>
            <li class=" sidebar-li-characters"><a href=""><i
                  class="fa fa-users fa-fw sidebar-icon"></i>Characters</a></li>
            <li class=" sidebar-li-links"><a href=""><i class="fa fa-link fa-fw sidebar-icon"></i>Links</a></li>
            <li class=" sidebar-li-worlds"><a href=""><i class="fa fa-globe fa-fw sidebar-icon"></i>Worlds</a></li>
            <li class=" sidebar-li-favorites"><a href=""><i class="fa fa-star fa-fw sidebar-icon"></i>Favorites</a>
            </li>
            <li class="divider sidebar-divider-collections"></li>
            <li class=" sidebar-li-created"><a href=""><i class="fa fa-palette fa-fw sidebar-icon"></i>Designs</a>
            </li>
            <li class=" sidebar-li-art"><a href=""><i class="fa fa-paint-brush fa-fw sidebar-icon"></i>Art</a></li>
            <li class=" sidebar-li-literatures"><a href=""><i class="fa fa-book fa-fw sidebar-icon"></i>Library</a>
            </li>
            <li class="divider sidebar-divider-stats"></li>
            <li class=" sidebar-li-stats"><a href=""><i class="fa fa-chart-bar fa-fw sidebar-icon"></i>Stats</a>
            </li>
          </ul>
        </div>

        <!-- Main Content -->
        <div class="col-sm-12 col-md-9 col-lg-10 content-main" id="content">
          <div class="row">
            <div class="col-lg-12">
              <div class="profile-section profile-content-section user-content fr-view" id="code">
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>`;
  }
}

/* Theme Helper
========================================================== */
function setStyleSource(linkID, sourceLoc) {
  var theLink = document.querySelector(linkID);
  theLink.href = sourceLoc;
}

/* Toyhouse User/Character Toggle 
========================================================== */
let savedEditor = localStorage.getItem("userEditor");
(savedEditor) ? editor.setTheme("ace/theme/tomorrow_night") : editor.setTheme("ace/theme/chrome");

let editorTheme = true;

const editorThemeToggle= () => {
  editorTheme = !editorTheme;
  (editorTheme) ? editor.setTheme("ace/theme/tomorrow_night") : editor.setTheme("ace/theme/chrome");
  localStorage.setItem("userEditor", editorTheme);
}


/* Change CSS Theme
========================================================== */
(function newThemeUser() {
  var savedTheme = localStorage.getItem("themeUser");
  if(document.querySelector(`[value='${savedTheme}']`)) {
    document.querySelector(`[value='${savedTheme}']`).setAttribute("selected", "true");
    setStyleSource("#thThemes","../styles/toyhouse_themes/" + savedTheme + ".css");
  }
})();

document.getElementById("thCSSThemes").addEventListener("change", function () {
  var selected = "../styles/toyhouse_themes/" + this.options[this.selectedIndex].value + ".css";
  let vanillaSelected = this.options[this.selectedIndex].value;
  setStyleSource("#thThemes", selected);
  localStorage.setItem("themeUser", vanillaSelected);
});


/* Tooltip
========================================================== */
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

/* User Warning
========================================================== */
window.onbeforeunload = function(e) {
  return '';
};