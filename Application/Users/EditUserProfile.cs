using System.Net;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class EditUserProfile
    {
         public class Command: IRequest 
               {
                
                 public string? username { get; set;}
                 public string? bio { get; set; }
                
            
                
               }
                public class Handler : IRequestHandler<Command>
                {   
                 private readonly DataContext _context;
                 private readonly UserManager<AppUser> _userManager;
               
                    public Handler(DataContext context, UserManager<AppUser> userManager)
                    {
                      _userManager = userManager;
                      _context = context;
                    
                    }
        
                    public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                    { 
                     var username = await _context.Users.SingleOrDefaultAsync(x=> x.UserName== request.username);
                       if (username == null)
                       {
                        throw new Exception ("User not found");
                       }

                        var editUserProfile = await _userManager.FindByNameAsync(request.username!);
                       
                        if (editUserProfile==null)
                          throw new RestException (HttpStatusCode.NotFound, new {userprofile= "Not found"});
                        
                             editUserProfile.Bio = request.bio?? editUserProfile.Bio;
                             
                            
                         var success = await _context.SaveChangesAsync()>0;
                         if (success)return Unit.Value;
                         throw new Exception("Problem saving changes");
                      
                    }
                }
    }
} 

 
        