using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Mobile.Helpers
{
    public class HttpHelpers
    {
        HttpClient client;

        private string BaseUrl { get; set; }

        public HttpHelpers()
        {
            client = new HttpClient();

            // Local
            BaseUrl = "http://localhost:8081";

            // server
            //BaseUrl = "";


            client.BaseAddress = new Uri(BaseUrl);
        }

        public async Task<HttpResponseMessage> LogIn(string userName, string password)
        {
            string testing = string.Format("{0} userName: {1}, password: {2} {3}", "{", "\"" + userName + "\"", "\"" + password + "\"", "}");
            StringContent payload = new StringContent(testing, Encoding.UTF8, "application/json");

            HttpResponseMessage hold = await client.PostAsync("/login", payload);

            return hold;
        }
    }
}
