using System.Net;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class AdminSeeder
    {
        public class Command : IRequest<User>
        {
            public string? fullName { get; set; }
            public string? staffId { get; set; }
            public string? phoneNumber { get; set; }
            public string? username { get; set; }
            public string? role { get; set; }
            public string? email { get; set; }
            public string? password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.fullName).NotEmpty();
                RuleFor(x => x.phoneNumber).NotEmpty();
                RuleFor(x => x.staffId).NotEmpty();
                RuleFor(x => x.username).NotEmpty();
                RuleFor(x => x.role).NotEmpty();
                RuleFor(x => x.email).NotEmpty();
                RuleFor(x => x.password!).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
          
            private readonly DataContext Context;
            private readonly IJwtGenerator JwtGenerator;
            private readonly UserManager<AppUser> UserManager;
            public Handler(
                DataContext context,
                UserManager<AppUser> userManager,
                IJwtGenerator jwtGenerator
            )
            {
                JwtGenerator = jwtGenerator;
                UserManager = userManager;
                Context = context;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await Context.Users.AnyAsync(x => x.Email == request.email))
                {
                    throw new RestException(
                        HttpStatusCode.BadRequest,
                        new { Email = "Email is already registered." }
                    );
                }

                if (await Context.Users.AnyAsync(x => x.UserName == request.username))
                {
                    throw new RestException(
                        HttpStatusCode.BadRequest,
                        new { UserName = "Username is already taken." }
                    );
                }

                if (await Context.Users.AnyAsync(x => x.StaffId == request.staffId))
                {
                    throw new RestException(
                        HttpStatusCode.BadRequest,
                        new { StaffId = "Staff ID is already taken." }
                    );
                }
              

                var user = new AppUser
                {
                    FullName = request.fullName,
                    StaffId = request.staffId,
                    PhoneNumber = request.phoneNumber,
                    UserName = request.username,
                    Role = request.role,
                    Email = request.email,
                    IsActive = true
                    
                };

                var result = await UserManager.CreateAsync(user, request.password!);
                List<string> Role;
                if (result.Succeeded)
                {
                    Role = !string.IsNullOrEmpty(user.Role)
                        ? new List<string> { user.Role }
                        : new List<string>();

                       return new User
                    {
                        FullName = user.FullName,
                        StaffId = user.StaffId,
                        PhoneNumber = user.PhoneNumber,
                        Token = JwtGenerator.CreateToken(user, Role),
                        Username = user.UserName!,
                        Email = user.Email,
                        IsActive = user.IsActive,
                    };
                }
                else
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    throw new RestException(HttpStatusCode.BadRequest, new { Errors = errors });
                }
            }
        }
    }
}
