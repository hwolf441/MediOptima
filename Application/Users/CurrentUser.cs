using System.Net;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace Application.Users
{
    public class CurrentUser
    {
           public class Query: IRequest<User>
             {
        
             }
                public class Handler : IRequestHandler<Query, User>
                {
                  private readonly UserManager<AppUser> _userManager;
                  private readonly IJwtGenerator _jwtGenerator;
                  private readonly IUserAccesor _userAccesor;
                 
                
                    public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, 
                    IUserAccesor userAccesor)
                    {
                       
                        _userAccesor = userAccesor;
                        _jwtGenerator = jwtGenerator;
                         _userManager = userManager;
                       
                    }
        
                    public async Task<User> Handle(Query request, CancellationToken cancellationToken)
                    { 
                       var username = _userAccesor.GetCurrentUsername();
                       List<string> Role; 
                       if (username != null)
                     {
                     
                      var user = await _userManager.FindByNameAsync(username);
                    
                       if (user == null)
                       {
                         throw new RestException(HttpStatusCode.NotFound, "Current user not found");
                       }
                    
                      Role = !string.IsNullOrEmpty(user.Role)
                       ? new List<string> { user.Role }
                       : new List<string>();

                    
                  

                       return new User
                       {
                        FullName = user.FullName,
                        Role= user.Role,
                        StaffId = user.StaffId,
                        PhoneNumber = user.PhoneNumber,
                        Username = user.UserName,
                        Email = user.Email,
                        
                       };

                     }
                     throw new RestException(HttpStatusCode.NotFound, "Current username not found");
                    }
                }
    }
}