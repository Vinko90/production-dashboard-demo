using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductionDashboard.Web.Hubs
{
    public class SimHub : Hub
    {
        public SimHub()
        {
            Console.WriteLine("Init SimHub Controller!");
        }

        public bool RequestModuleList()
        {
            //List<string> test = new List<string>
            //{
            //    "one",
            //    "two"
            //};

            return true;
        }

        //Method called by the client
        //public async Task SendMessage(string user, string message)
        //{   
        //    //Invoke JS method at the client
        //    await Clients.All.SendAsync("ReceiveMessage", user, message);
        //}
    }
}
