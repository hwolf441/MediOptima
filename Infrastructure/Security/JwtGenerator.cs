using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain; 
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly SymmetricSecurityKey _key;

        public JwtGenerator( IConfiguration config)
        { 
           _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]!));
        }

        public string CreateToken(AppUser user, IList<string> Role)
        { 
            var claims = new List<Claim>
            {
                new Claim("username", user.UserName!)
                
            };

             if (Role != null && Role.Any())
            {
              claims.AddRange(Role.Select(type => new Claim("Role", type)));
            }
            
        
          var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
          var tokenDescriptor = new SecurityTokenDescriptor
          {
             Subject = new ClaimsIdentity(claims),
             Expires = DateTime.Now.AddDays(7),
             SigningCredentials = creds

           }; 

           var tokenHandler= new JwtSecurityTokenHandler();
           var token = tokenHandler.CreateToken(tokenDescriptor);
           return tokenHandler.WriteToken(token);
        }
    }
}