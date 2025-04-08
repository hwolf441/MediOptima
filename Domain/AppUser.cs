using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser: IdentityUser
    { 
        
        public string? FullName { get; set; }
        public string? SuspensionReason { get; set;}
        public string? StaffId { get; set;}
        public string? Role { get; set; }
        public string? Bio { get; set; }
        public bool IsActive{ get; set; } 
        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 
        

        public static implicit operator AppUser(string v)
        {
            throw new NotImplementedException();
        }
    }
}