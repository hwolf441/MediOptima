using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;


namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccesor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
           
        }

       
        public string GetCurrentUsername()
       {
        
             var username = _httpContextAccessor.HttpContext?.User?.Claims
             ?.FirstOrDefault(x => x.Type == "username");
             return username?.Value ?? string.Empty;
            
  
       }

    }
}