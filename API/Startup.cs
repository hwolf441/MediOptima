using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using API.Middleware;
using Application.Interfaces;
using Application.Users;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persistence;


namespace API
{
    public class Startup
    {
        
        public Startup(IConfiguration configuration )
        {
           
            Configuration = configuration;
            
        }

        public IConfiguration Configuration { get; }
       

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]!));
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt. Filters.Add(new AuthorizeFilter(policy));
            });
           services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        opt.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                  if (!string.IsNullOrEmpty(accessToken) &&
                     (path.StartsWithSegments("/message")))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

             services.AddAuthorization(options =>
           {
              options.AddPolicy("AdminPolicy", policy => policy.RequireClaim("Role", "ADMIN"));
              options.AddPolicy("DoctorPolicy",  policy => policy.RequireClaim("Role", "DOCTOR"));
              options.AddPolicy("DoctorPolicy", policy => policy.RequireClaim("Role", "CLINICIAN"));
              options.AddPolicy("ReceptionistPolicy", policy => policy.RequireClaim("Role", "RECEPTIONIST"));
              options.AddPolicy("ProcurementPolicy", policy => policy.RequireClaim("Role", "PROCUREMENT"));
   
           });
            services.AddFluentValidationAutoValidation().AddFluentValidationClientsideAdapters();
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddHttpClient();
            services.AddSingleton<TimeProvider>(TimeProvider.System);
            services.AddScoped <IUserAccesor, UserAccessor>();
            services.AddScoped<IBotService, BotService>();
            services.AddScoped<IQueueService, QueueService>();
            
          
            services.AddDbContext<DataContext>(options =>
                options.UseSqlite(
                    Configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly("Persistence")
                )
            );
          
          services.AddAutoMapper(typeof(UserMappingProfile).Assembly);
          services.AddMediatR(typeof(Login.Handler).Assembly);
         
          
          services.AddCors(opt=>
          {opt.AddPolicy("CorsPolicy", policy=>
          policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173").AllowCredentials());}
          );
          var builder = services.AddIdentityCore<AppUser>();
          var identityBuilder = new IdentityBuilder(typeof(AppUser), builder.Services);
          identityBuilder.AddEntityFrameworkStores<DataContext>();  
          identityBuilder.AddSignInManager<SignInManager<AppUser>>();
       
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
             app.UseMiddleware<ErrorHandlingMiddleware>();
            if (env.IsDevelopment())
            {
              
                  
            }
            else 
            {
                app.UseHsts();
            }
             

            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt=> opt.NoReferrer());
            app.UseXXssProtection(opt=> opt.EnabledWithBlockMode());
            app.UseXfo(opt=>opt.Deny());


            app.UseHttpsRedirection();
            //app.UseDefaultFiles();
            //app.UseStaticFiles();
            app.UseRouting();
            app.UseCors("CorsPolicy");
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                
                //endpoints.MapFallbackToController("Index", "Fallback");
               
            });
        }
    }
}
