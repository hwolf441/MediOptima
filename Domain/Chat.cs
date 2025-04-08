using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Chat
    {
        public Chat()
        {
            Responses = new HashSet<Chat>();
        }

        public Guid Id { get; set; }
        public string? SenderId { get; set; }
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsFromUser { get; set; }
        public Guid? ResponseToId { get; set; }
        
        // Navigation properties with proper initialization
        public virtual Chat? ResponseTo { get; set; }
        public virtual ICollection<Chat> Responses { get; private set; }
    }
}