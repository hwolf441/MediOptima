using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Users
{
    public class UserDto
    {
        
        public string?  FullName { get; set; }
        public string? Email { get; set; }
        public string? StaffId { get; set; }
        public string? Role { get; set; }
        public bool IsActive{ get; set; } 
    }
}