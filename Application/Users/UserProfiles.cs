using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Users
{
    public class UserProfiles
    {
        public string? FullName { get; set; }
        public string? StaffId { get; set;}
        public string? PhoneNumber { get; set; }
        public string? Username { get; set; }
        public string? Bio { get; set; }
        public string? Email { get; set; }
    }
}