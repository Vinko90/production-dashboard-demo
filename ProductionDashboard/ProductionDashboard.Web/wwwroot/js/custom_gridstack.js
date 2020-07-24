/*
    Created by WarOfDevil - 20/06/2020
*/

var grid = GridStack.init({
    resizable: {
        handles: 'e, se, s, sw, w'
    },
    animate: true,
    removeTimeout: 100,
    acceptWidgets: '.newWidget',
    minRow: 3,
    minWidth: '100%',
    float: true
});

grid.on('added removed change', function (e, items) {
    var str = '';
    var moduleNo = '';
   
    items.forEach(function (item) {
        moduleNo = $(item.el).data('module');
       
    if (moduleNo && e.type == 'added') {
        
        //Update widget layout        
        updateWidgetLayout(moduleNo);
        
        //Hide module from menu
        $("#sideModuleList .module-list-"+moduleNo).hide();

        //Add widget remove handler 
        $( ".grid-stack .module-list-"+moduleNo ).contextmenu(function(ev) {
            console.log(editMode,moduleNo);
            if ($(document.body).hasClass("edit-mode")) {
                ev.preventDefault();    
                grid.removeWidget(item.el);
                return false;
            }
        });
    }
    if (moduleNo && e.type == 'removed') {
        if (item.el) {
            $("#sideModuleList .module-list-"+moduleNo).show();
        }
    }
    str += ' (x,y)=' + item.x + ',' + item.y; 
});

console.log(e.type + ' ' + items.length + ' items:' + str);

});

function updateWidgetLayout(moduleNo)  {
    var mData  = getModuleData(moduleNo);

    console.log("mdata", mData);
    if (!mData) return false;

  mData = mData[0];
  notification = '';
  var moduleExtras = '';
    
    if (mData.Alarm) {
        notification = '<i class="fa fa-exclamation-triangle fa-fw" aria-hidden="true"></i>';
        
        moduleExtras = ' onclick="showModal('+moduleNo+');" data-target="#mModal" ';
    }

    var html = `  <div class="grid-stack-item-content"> 
                        <div class="module module-${mData.State.toLowerCase()}">
                            <div class="module-title"  ${moduleExtras}>
                                <div class="notification">${notification}</div>
                                <h3>${mData.ModuleName}</h3> 
                            </div>

                            <div class="module-content"> 
                                    <h3>Tray information</h3>
                                    <label>Current tray: <span>${mData.CurrentTray}</span></label> <br/>
                                    <label>Upcoming tray: <span>${mData.UpcomingTray}</span></label><br/>

                                    <h3>Supply lot information</h3>
                                    
                                    <label>Supply lot: <span>${mData.SupplyLot}</span></label><br/>
                                    <label>Farmer: <span>${mData.Farmer}</span></label><br/>
                                    <label>Licence plate: <span>${mData.LicensePlate}</span></label><br/>
                                    <h3><label style="margin:0">State <span>${mData.State}</span></label></h3> 

                            </div>
                        </div>
                        </div> 
                    </div>`;
$(".grid-stack .module-list-"+moduleNo).html(html);
   

}

function getModuleData(moduleNo) {
     return moduleDefaults.modules.filter( function( el) { return el.ModuleID === ""+moduleNo} ) ;
}

function showModal( moduleNo ){
     if (editMode) return false;
     $("#mModal .modal-title").html("Module  "+moduleNo + " info");

        $("#mModal").modal("show");
          $(".grid-stack .module-list-"+moduleNo + " .module" )
        .removeClass("module-fatal")
        .removeClass("module-warning")
        .addClass('module-connected');

        $("#mModal .modal-body").html("Notification alert message here");
}

saveGrid = function() {
    serializedData = [];
    grid.engine.nodes.forEach(function(node) {
        var moduleID = $(node.el).data("module");
      serializedData.push({
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        ModuleID: moduleID,
        moduleObject: getModuleData(moduleID)
      });
    });
    var data = JSON.stringify(serializedData, null, '  ');

    if (data) 
    saveStaticDataToFile (data, "dashboard.json.txt");
};

loadGrid = function(fileModules) {
    editMode = true;
    grid.removeAll();
    var items = fileModules;
     grid.batchUpdate();

     console.log(items);
     items.forEach(function (node) {
         console.log(node);
         grid.addWidget(`<div class="newWidget grid-stack-item-content module-list-${node.ModuleID}" data-module="${node.ModuleID}" data-gs-width="2" data-gs-height="3""></div>`, node);
     });
     grid.commit();
    
  
  };


function saveStaticDataToFile(data,filename) {
    var blob = new Blob([data],
        { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
}




var fileModules = {};
function loadModal() {
    $("#mModal").modal("show");
    $("#mModal .modal-title").html("Load dashboard");
    $("#mModal .modal-body").html(`<form>
    <div class="custom-file">
      <input type="file" class="custom-file-input" id="file">
      <label class="custom-file-label" for="customFile">Choose file</label>
    </div>
  </form>`);

  $(".custom-file-input").on("change", function(e) {
    var fileName = $(this).val().split("\\").pop();
    console.log($(this).val());
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    $("#mModal .btn.btn-primary").html("Load").on('click',function () {
        if ($(document.body).hasClass("view-mode")) {
            $(".s-switch").click();
        }

        startRead();
        $("#mModal").modal("hide");
        
    });

  });

}



function startRead() {
    // obtain input element through DOM
  
    var file = document.getElementById('file').files[0];
    if(file){
      getAsText(file);
    }
  }
  
  function getAsText(readFile) {
  
    var reader = new FileReader();
  
    // Read file into memory as UTF-16
    reader.readAsText(readFile, "UTF-8");
  
    // Handle progress, success, and errors
    reader.onprogress = updateProgress;
    reader.onload = loaded;
    reader.onerror = errorHandler;
  }
  
  function updateProgress(evt) {
    if (evt.lengthComputable) {
      // evt.loaded and evt.total are ProgressEvent properties
      var loaded = (evt.loaded / evt.total);
      if (loaded < 1) {
        // Increase the prog bar length
        // style.width = (loaded * 200) + "px";
      }
    }
  }
  
  function loaded(evt) {
    // Obtain the read file data
    var fileString = evt.target.result;
    // Handle UTF-16 file dump
    
    fileModules = JSON.parse(fileString);

    loadGrid(fileModules);
   
    console.log( fileString, fileModules);
    // xhr.send(fileString)
  }
  
  function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
      // The file could not be read
    }
  }

  function clearDashboard() {
    grid.removeAll();
    $("#sideModuleList div").remove();
    buildMenu();
  }


// Load modules from JSON
// TODO: Load from URL
function getModules() {
    // $.getJSON("modules.json", function (data) {
    //     console.log(data);
    // });

     var data =  { 
         "modules": [
            { "ModuleID": "1",
              "ModuleName": "Module Name 1",
              "ModuleType": "1",
              "CurrentTray" : "38000",
              "UpcomingTray" : "38466",
              "SupplyLot" : 2,
              "Farmer" : "Smith Paultry",
              "LicensePlate" : "59-750A",
              "State" : "Connected",
              "Alarm" : false
            },
             { "ModuleID": "2",
              "ModuleName": "Module Name 2",
              "ModuleType": "1",
              "CurrentTray" : "38000",
              "UpcomingTray" : "38466",
              "SupplyLot" : "2",
              "Farmer" : "Smith Paultry",
              "LicensePlate" : "59-750A",
              "State" : "Offline",
              "Alarm" : true
            },
             { "ModuleID": "3",
              "ModuleName": "Module Name 3",
              "ModuleType": "1",
              "CurrentTray" : "38000",
              "UpcomingTray" : "38466",
              "SupplyLot" : "2",
              "Farmer" : "Smith Paultry",
              "LicensePlate" : "59-750A",
              "State" : "Offline",
              "Alarm" : false
            },
             { "ModuleID": "4",
              "ModuleName": "Module Name 4",
              "ModuleType": "3",
              "CurrentTray" : "38000",
              "UpcomingTray" : "38466",
              "SupplyLot" : "2",
              "Farmer" : "Smith Paultry",
              "LicensePlate" : "59-750A",
              "State" : "Warning",
              "Alarm" : true
            },
             { "ModuleID": "5",
              "ModuleName": "Module Name 5",
              "ModuleType": "4",
              "CurrentTray" : "38000",
              "UpcomingTray" : "38466",
              "SupplyLot" : "2",
              "Farmer" : "Smith Paultry",
              "LicensePlate" : "59-750A",
              "State" : "Connected",
              "Alarm" : false
            },
             { "ModuleID": "6",
              "ModuleName": "Module Name 6",
              "ModuleType": "3",
              "CurrentTray" : "38000",
              "UpcomingTray" : "38466",
              "SupplyLot" : "2",
              "Farmer" : "Williams Agry",
              "LicensePlate" : "11-921A",
              "State" : "Warning",
              "Alarm" : true
            }
            ,
             { "ModuleID": "7",
              "ModuleName": "Module Name 7",
              "ModuleType": "3",
              "CurrentTray" : "38000",
              "UpcomingTray" : "38466",
              "SupplyLot" : "1",
              "Farmer" : "Robert Agry",
              "LicensePlate" : "77-921A",
              "State" : "Fatal",
              "Alarm" : true
            }
          ]  
      };

       return data;
}

function buildMenu() {
   
    moduleDefaults.modules.forEach(function (item) {
        $("#sideModuleList").append(
         `<div class="newWidget grid-stack-item module-list-${item.ModuleID}" data-module="${item.ModuleID}" data-gs-width="2" data-gs-height="3">
            <div class=" grid-stack-item-content">
                     <i class="fas fa-truck-loading"></i> ${item.ModuleName}
                </div>
            </div>`);
    });
      // TODO: switch jquery-ui out
      $('.newWidget').draggable({
        revert: 'invalid',
        scroll: false,
        appendTo: 'body',
        helper: 'clone',
        drag: function() {
            //console.log($(this));
        }
    });
}
//This is data root
var  moduleDefaults;
$(document).ready(function () {
    moduleDefaults = getModules();
   // moduleDefaults = JSON.parse(moduleDefaults);
    console.log(moduleDefaults);

    buildMenu();
});