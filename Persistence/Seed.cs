using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData ( DataContext context, UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        FullName = "hwolf",
                        StaffId = "PA107/G/7485/19",
                        UserName = "hwolf",
                        Email = "hsteve972@gmail.com",
                        Role = "ADMIN",
                        IsActive = true,
                    },
                };

                foreach(var user in users )
                {
                    await userManager.CreateAsync(user, "Aduzaka54@@29@#");
                }
            }
        }
    }
}