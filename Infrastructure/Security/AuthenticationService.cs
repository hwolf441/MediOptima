using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;

namespace Infrastructure.Security
{
    public class AuthenticationService
    {
        
        private readonly IJwtGenerator _jwtGenerator;

         public AuthenticationService(IJwtGenerator jwtGenerator)
        {
            _jwtGenerator = jwtGenerator;
           
            
        }

        public string GenerateJwtToken(AppUser user)
        {
           
            var Role = GetUserRoles(user);

            return _jwtGenerator.CreateToken(user, Role);
        }

        private IList<string> GetUserRoles(AppUser user)
        {
            return !string.IsNullOrEmpty(user.Role)
                ? new List<string> { user.Role }
                : new List<string>();
        }
    }
}
