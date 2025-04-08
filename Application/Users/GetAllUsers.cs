
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class GetAllUsers
    {
           public class Query: IRequest<List<UserDto>>
             {
        
             }
                public class Handler : IRequestHandler<Query, List<UserDto>>
                {
                private readonly DataContext _context;
                    public Handler(DataContext context, IMapper mapper)
                    {
                        _context = context;
                        _mapper = mapper;
                    }
                    private readonly IMapper _mapper;
                    public async Task<List<UserDto>> Handle(Query request, CancellationToken cancellationToken)
                    {
                        var users = await _context.Users.ToListAsync(cancellationToken);
                        return _mapper.Map<List<UserDto>>(users);
                    }
                }
        
            
                }
    }
