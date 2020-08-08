/*
    Created by WarOfDevil - 20/06/2020
*/

/************************************** 
*   SignalR connection and events    * 
**************************************/

/* Array holding modules on load */
var moduleDefaults; 

/* Connect to simulation Hub */
var connection = new signalR.HubConnectionBuilder().withUrl("/simHub").build();
connection.logging = true;

/* SignalR event triggered when module list is received from the server */
connection.on("ReceiveModuleList", function (moduleList) {

    console.log("Received Module List from Server - Count: " + moduleList.length);

    for (var i = 0; i < moduleList.length; i++) {
        console.log("Name: " + moduleList[i].moduleName + " ID: " + moduleList[i].moduleID);
        
        $("#sideModuleList").append(
            `<div class="newWidget grid-stack-item module-list-${moduleList[i].moduleID}" data-module="${moduleList[i].moduleID}" data-gs-width="2" data-gs-height="3">
                <div class=" grid-stack-item-content">
                     <i class="fas fa-truck-loading"></i> ${moduleList[i].moduleName}
                </div>
            </div>`);
    }

    $('.newWidget').draggable({
        revert: 'invalid',
        scroll: false,
        appendTo: 'body',
        helper: 'clone',
        drag: function() {
            //console.log($(this));
        }
    });

    moduleDefaults = moduleList;
});

/* SignalR event triggered when module push data so client */
connection.on("ReceivedModuleDataUpdate", function (module) {
    console.log("Received data update from module: " + module.moduleName);

    notification = '';
    var moduleExtras = '';

    if (module.alarm) {
        notification = '<i class="fa fa-exclamation-triangle fa-fw" aria-hidden="true"></i>';

        moduleExtras = ' onclick="showModal(' + module.moduleID + ');" data-target="#mModal" ';
    }

    var html = `  <div class="grid-stack-item-content"> 
                        <div class="module module-${module.state.toLowerCase()}">
                            <div class="module-title"  ${moduleExtras}>
                                <div class="notification">${notification}</div>
                                <h3>${module.moduleName}</h3> 
                            </div>

                            <div class="module-content"> 
                                    <h3>Tray information</h3>
                                    <label>Current tray: <span>${module.currentTray}</span></label> <br/>
                                    <label>Upcoming tray: <span>${module.upcomingTray}</span></label><br/>

                                    <h3>Supply lot information</h3>
                                    
                                    <label>Supply lot: <span>${module.supplyLot}</span></label><br/>
                                    <label>Farmer: <span>${module.farmer}</span></label><br/>
                                    <label>Licence plate: <span>${module.licensePlate}</span></label><br/>
                                    <h3><label style="margin:0">State <span>${module.state}</span></label></h3> 

                            </div>
                        </div>
                        </div> 
                    </div>`;
    $(".grid-stack .module-list-" + module.moduleID).html(html);
});

/* SignalR event triggered on page ready to request module list from server */
$(document).ready(function () {   
    connection.start().then(() => connection.invoke("RequestModuleList"));
});

/**************************************
*   Gridstack events                  *
**************************************/

/* Initialize Gridstack */
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

/* Gridstack widget events */
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

/* Update the widget layout when it is dragged from the menu to the dashboard */
function updateWidgetLayout(moduleNo)  {
    var mData  = getModuleData(moduleNo);
    console.log("mdata", mData);
    if (!mData) return false;

    mData = mData[0];
    notification = '';
    var moduleExtras = '';
    
    if (mData.alarm) {
        notification = '<i class="fa fa-exclamation-triangle fa-fw" aria-hidden="true"></i>';      
        moduleExtras = ' onclick="showModal('+moduleNo+');" data-target="#mModal" ';
    }

    var html = `  <div class="grid-stack-item-content"> 
                        <div class="module module-${mData.state.toLowerCase()}">
                            <div class="module-title"  ${moduleExtras}>
                                <div class="notification">${notification}</div>
                                <h3>${mData.moduleName}</h3> 
                            </div>

                            <div class="module-content"> 
                                    <h3>Tray information</h3>
                                    <label>Current tray: <span>${mData.currentTray}</span></label> <br/>
                                    <label>Upcoming tray: <span>${mData.upcomingTray}</span></label><br/>

                                    <h3>Supply lot information</h3>
                                    
                                    <label>Supply lot: <span>${mData.supplyLot}</span></label><br/>
                                    <label>Farmer: <span>${mData.farmer}</span></label><br/>
                                    <label>Licence plate: <span>${mData.licensePlate}</span></label><br/>
                                    <h3><label style="margin:0">State <span>${mData.state}</span></label></h3> 

                            </div>
                        </div>
                        </div> 
                    </div>`;

    $(".grid-stack .module-list-" + moduleNo).html(html);
}

/* Get data for a module Id */
function getModuleData(moduleNo) {
   
    var result = moduleDefaults.filter(obj => {
        return obj.moduleID === moduleNo
    })

    return result;
}

/* Modal show when user click on module with active notification */
function showModal(moduleNo){
     if (editMode) return false;

    $("#mModal .modal-title").html("Module  " + moduleNo + " Info");
    $("#mModal .modal-body").html("Notification alert message here");

    $("#mModal").modal("show");
   
    //Feature to acknowledge an alarm and change header color
    //$(".grid-stack .module-list-"+moduleNo + " .module" )
    //.removeClass("module-fatal")
    //.removeClass("module-warning")
    //.addClass('module-connected');
}

/* Save the content of the dashboard in a file */
function saveDashboard() {

    serializedData = [];
    grid.engine.nodes.forEach(function (node) {
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

    if (data) {
        var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dashboard.json.txt");
        toastr.success('Dashboard layout succesfully saved!', 'Save Dashboard');
    }
}

/* Load the dashboard from a json text file */
function loadDashboard() {

    window.$("#mModal").modal("show");
    window.$("#mModal .modal-title").html("Load dashboard");
    window.$("#mModal .modal-body").html(`<form>
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="file">
                                            <label class="custom-file-label" for="customFile">Choose file</label>
                                        </div>
                                   </form>`);

    $(".custom-file-input").on("change", function (e) {
        var fileName = $(this).val().split("\\").pop();
        console.log($(this).val());
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        $("#mModal .btn.btn-primary").html("Load").on('click', function () {
            if ($(document.body).hasClass("view-mode")) {
                $(".s-switch").click();
            }

            // obtain input element through DOM
            var file = document.getElementById('file').files[0];
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");

                // Handle progress, success, and errors
                //reader.onprogress = updateProgress;
                reader.onerror = errorHandler;
                reader.onload = loaded;                
            }

            $("#mModal").modal("hide");
        });
    });
}

/* Load => Error handler */
function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        toastr.error('Error, unreadable dashboard layout file', 'Load Dashboard');
    }
}

/* Load => File loaded handler */
function loaded(evt) {
    
    var fileString = evt.target.result;
    
    var fileModules = JSON.parse(fileString);

    editMode = true;
    grid.removeAll();
    grid.batchUpdate();

    fileModules.forEach(function (node) {
        console.log(node);
        grid.addWidget(`<div class="newWidget grid-stack-item-content module-list-${node.ModuleID}" data-module="${node.ModuleID}" data-gs-width="2" data-gs-height="3""></div>`, node);
    });

    grid.commit();
    toastr.success('Dashboard layout succesfully loaded!', 'Load Dashboard');
}

/* Clear dashboard */
function clearDashboard() {
    grid.removeAll();
}