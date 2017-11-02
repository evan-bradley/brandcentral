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
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
        }

        public void OnSaveActivated(object sender, EventArgs e)
        {
            HttpHelpers httpHelpers = new HttpHelpers();

            HttpResponseMessage testing = httpHelpers.LogIn("username", "password");
            


        }
    }
}
