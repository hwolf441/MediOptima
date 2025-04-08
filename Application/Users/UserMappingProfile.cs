using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Users
{
    public class UserMappingProfile : AutoMapper.Profile
    {
        public UserMappingProfile()
        {
            CreateMap<AppUser, UserDto>()
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(d => d.StaffId, o => o.MapFrom(s => s.StaffId))
                .ForMember(d => d.Role, o => o.MapFrom(s => s.Role))
                .ForMember(d => d.IsActive, o => o.MapFrom(s => s.IsActive));
        }
    }

}