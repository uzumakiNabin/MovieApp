using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;
using Mailjet.Client.TransactionalEmails.Response;
using Microsoft.Extensions.Configuration;
using MoviesAPI.DTOs;
using System;
using System.Threading.Tasks;

namespace MoviesAPI.Helpers
{
    public class EmailServices
    {
        private readonly IConfiguration _config;

        public EmailServices(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendEmailAsync(EmailDTO email)
        {
            MailjetClient client = new(_config["MailJet:ApiKey"], _config["MailJet:SecretKey"]);

            TransactionalEmail tEmail = new TransactionalEmailBuilder()
                .WithFrom(new SendContact(_config["Email:From"]))
                .WithSubject(email.Subject)
                .WithHtmlPart(email.Body)
                .WithTo(new SendContact(email.To))
                .Build();

            TransactionalEmailResponse response = await client.SendTransactionalEmailAsync(tEmail);
            if (response.Messages != null)
            {
                if (response.Messages[0].Status == "success")
                {
                    return true;
                }
            }
            return false;
        }
    }
}
