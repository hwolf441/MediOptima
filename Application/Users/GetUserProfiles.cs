using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class GetUserProfiles
    {
           public class Query: IRequest<UserProfiles>
             {
                 public string? username { get; set;}
                 
             }
                public class Handler : IRequestHandler<Query, UserProfiles>
                {
                private readonly DataContext _context;
               
                    public Handler(DataContext context)
                    {
                      
                      _context = context;
                    }
        
                    public async Task<UserProfiles> Handle(Query request, CancellationToken cancellationToken)
                    {
                       var user = await _context.Users.SingleOrDefaultAsync(x=> x.UserName== request.username);
                       if (user== null)
                       {
                        throw new Exception ("User not found");
                       }

                         
                      
                       return new UserProfiles
                       {
                        FullName = user.FullName,
                        StaffId = user.StaffId,
                        PhoneNumber = user.PhoneNumber,
                        Username = user.UserName,
                        Email = user.Email,
                        Bio = user.Bio,
                        
                       };
                    }
                }
    }
}