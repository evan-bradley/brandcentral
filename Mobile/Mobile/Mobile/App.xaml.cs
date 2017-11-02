using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Mobile.Helpers;
using Xamarin.Forms;

namespace Mobile
{
    public partial class App : Application
    {
        public HttpHelpers httpHelpers;

        public App()
        {
            InitializeComponent();

            httpHelpers = new HttpHelpers();

            MainPage = new Mobile.MainPage();
        }

        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}
