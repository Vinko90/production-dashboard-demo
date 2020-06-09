using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Net.Sockets;

namespace ProductionDashboard.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //CreateHostBuilder(args).Build().Run();
            PrintInstructions();
            BuildWebHost(args).Run();
        }

        private static void PrintInstructions()
        {
            Console.WriteLine("Please try the following urls below in your browser to access the site:");
            PrintLocalIpAddress();
            Console.WriteLine("");
        }

        private static void PrintLocalIpAddress()
        {
            foreach (NetworkInterfaceType networkInterfaceType in Enum.GetValues(typeof(NetworkInterfaceType)))
            {
                PrintLocalIPAddressBasedOnType(networkInterfaceType);
            }
        }

        private static void PrintLocalIPAddressBasedOnType(NetworkInterfaceType networkInterfaceType)
        {
            foreach (var ipAddress in GetAllLocalIPv4(networkInterfaceType))
            {
                Console.WriteLine(ipAddress);
            }
        }

        private static string[] GetAllLocalIPv4(NetworkInterfaceType _type)
        {
            List<string> ipAddrList = new List<string>();
            foreach (NetworkInterface item in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (item.NetworkInterfaceType == _type && item.OperationalStatus == OperationalStatus.Up)
                {
                    foreach (UnicastIPAddressInformation ip in item.GetIPProperties().UnicastAddresses)
                    {
                        if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                        {
                            ipAddrList.Add(ip.Address.ToString());
                        }
                    }
                }
            }
            return ipAddrList.ToArray();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls("http://*:80")
                .Build();



        //public static IHostBuilder CreateHostBuilder(string[] args) =>
        //    Host.CreateDefaultBuilder(args)
        //        .ConfigureWebHostDefaults(webBuilder =>
        //        {
        //            webBuilder.UseStartup<Startup>();
        //        });
    }
}
