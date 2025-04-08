using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class SuspendStaff
    {
          public class Command: IRequest <Unit>
               {
                public string? staffId { get; set; }
                public string? suspensionReason { get; set; }
                public bool? IsActive { get; set; }
                
            
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
                      var suspendstaff = await _context.Users.SingleOrDefaultAsync(x=> x.StaffId== request.staffId);
                     
                        if (suspendstaff==null)
                          throw new RestException (HttpStatusCode.NotFound, new {staffmember = "Not found"});
                        
                             suspendstaff.IsActive = request.IsActive?? suspendstaff.IsActive;
                             suspendstaff.SuspensionReason = request.suspensionReason?? suspendstaff.SuspensionReason;
                         
                         var success = await _context.SaveChangesAsync()>0;
                         if (success)return Unit.Value;
                         throw new Exception("Problem saving changes");
                      
                    }
                }
    }
}


