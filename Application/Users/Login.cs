using System.Net;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Users
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public string? staffId { get; set; }
            public string ? password { get; set; }

            
        }

        public class CommandValidator : AbstractValidator<Query>
        {
            public CommandValidator()
            {
                RuleFor(x => x.staffId).NotEmpty();
                RuleFor(x => x.password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> UserManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly IJwtGenerator JwtGenerator;
            

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
            {
               
                JwtGenerator = jwtGenerator;
                _signInManager = signInManager;
                UserManager = userManager;
            }
           
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await UserManager.Users.FirstOrDefaultAsync(u => u.StaffId == request.staffId);

                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, "User not found");
                if (!user.IsActive)
                    throw new RestException(HttpStatusCode.Forbidden, "You cannot log in as you have been suspended. Please contact admin.");

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.password!, false);
                List<string> Role; 
                if (result.Succeeded)
                {  
                    
                    await UserManager.UpdateAsync(user);
                   Role = !string.IsNullOrEmpty(user.Role)
                    ? new List<string> { user.Role }
                   : new List<string>();
 
                    return new User
                    {
                        FullName = user.FullName,
                        StaffId = user.StaffId,
                        PhoneNumber = user.PhoneNumber,
                        Token = JwtGenerator.CreateToken(user, Role),
                        Username = user.UserName,
                        Email = user.Email,
                        Role = user.Role,
                    };
                }

                // Authentication failed, handle accordingly (throw an exception, return null, etc.).
                throw new RestException(HttpStatusCode.Unauthorized, "Invalid password");
            }
        }
    }
}
