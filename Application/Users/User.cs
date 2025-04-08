using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Users
{
    public class User
    {
        public string?  FullName { get; set; }
        public string? StaffId { get; set; }
        public  string ? Token { get; set; }
        public string ? Username { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public bool IsActive{ get; set; } 
    }
}