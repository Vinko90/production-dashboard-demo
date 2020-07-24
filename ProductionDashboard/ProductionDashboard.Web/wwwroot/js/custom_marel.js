/*
    Created by WarOfDevil - 20/06/2020
*/

/* Set the width of the side navigation to 250px */
function openModList() {
    document.getElementById("sideModuleList").style.width = "150px";
    $("#menuToggle").removeClass("colapsed").addClass("open");
}

/* Set the width of the side navigation to 0 */
function closeModList() {
    document.getElementById("sideModuleList").style.width = "0";
    $("#menuToggle").removeClass("open").addClass("colapsed");
}

/* Set the width of the side navigation to 250px */
function openDataMenu() {
    document.getElementById("sideDataMenu").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeDataMenu() {
    document.getElementById("sideDataMenu").style.width = "0";
}

var editMode = false;
$(".checkbox").Sswitch({
    onSwitchChange: function() {
        console.log(editMode);
        if (editMode) {
            openDataMenu();
            closeModList();
            grid.disable();
            $("#menuToggle").removeClass("colapsed").removeClass("open");
            $("body").removeClass("edit-mode").addClass("view-mode");
            editMode = false;
        } else {
            openModList();
            closeDataMenu();
            grid.enable();
            $("body").removeClass("view-mode").addClass("edit-mode");
            editMode = true;
        }    
    }
  });

  function toggleNav() {
      if ($("#menuToggle").hasClass("open")) {
        
        closeModList();
      } else {
       
        openModList();  
      }
  } 

$(document).ready(function() {
    var ctx = $("#chart-line");
    var myLineChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Line Speed", "Congestion"],
            datasets: [{
                data: [80, 20],
                backgroundColor: [ "rgba(136, 173, 202, 1)","rgba(254, 176, 18, 1)"]
            }]
        },
        options: {
            //title: {
            //    display: true,
            //    text: 'Losses',
            //    fontSize: 30
            //},
            legend: {
                
                display: true,
                position: "bottom",
                align: "center",
                labels: {
                    fontSize: 14
                }
            }
        }
    });
});