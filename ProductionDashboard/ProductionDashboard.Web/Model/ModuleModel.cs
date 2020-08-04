using Newtonsoft.Json;

namespace ProductionDashboard.Web.Model
{
    public class ModuleModel
    {
        /// <summary>
        /// Module unique Id
        /// </summary>
        [JsonProperty("ModuleID")]
        public int ModuleID { get; set; }

        /// <summary>
        /// Module/Submodule name
        /// </summary>
        [JsonProperty("ModuleName")]
        public string ModuleName { get; set; }

        /// <summary>
        /// Module type, can be used to define a smart module or sub-module
        /// </summary>
        [JsonProperty("ModuleType")]
        public int ModuleType { get; set; }

        /// <summary>
        /// Current tray data
        /// </summary>
        [JsonProperty("CurrentTray")]
        public int CurrentTray { get; set; }

        /// <summary>
        /// Upcoming tray data
        /// </summary>
        [JsonProperty("UpcomingTray")]
        public int UpcomingTray { get; set; }

        /// <summary>
        /// Supply lot informations
        /// </summary>
        [JsonProperty("SupplyLot")]
        public int SupplyLot { get; set; }

        /// <summary>
        /// Farmer informations
        /// </summary>
        [JsonProperty("Farmer")]
        public string Farmer { get; set; }

        /// <summary>
        /// Licence plate informations
        /// </summary>
        [JsonProperty("LicensePlate")]
        public string LicensePlate { get; set; }

        /// <summary>
        /// Production state module
        /// </summary>
        [JsonProperty("State")]
        public string State { get; set; }

        /// <summary>
        /// Alarm flag
        /// </summary>
        [JsonProperty("Alarm")]
        public bool Alarm { get; set; }

        /// <summary>
        /// Default costructor
        /// </summary>
        /// <param name="id">Module unique Id</param>
        /// <param name="name">Module Name</param>
        public ModuleModel(int id, string name)
        {
            ModuleID = id;
            ModuleName = name;

            ModuleType = 1;
            CurrentTray = 0;
            UpcomingTray = 0;
            SupplyLot = 1;
            Farmer = "Vincenzo";
            LicensePlate = "59-70AA";
            State = "Connected";
            Alarm = false;
        }
    }
}
