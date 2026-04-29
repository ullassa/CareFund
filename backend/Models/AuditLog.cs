using System.ComponentModel.DataAnnotations;

namespace CareFund.Models
{
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        public int? UserId { get; set; }

        [MaxLength(32)]
        public string UserRole { get; set; } = string.Empty;

        [MaxLength(32)]
        public string Action { get; set; } = string.Empty;

        [MaxLength(64)]
        public string EntityName { get; set; } = string.Empty;

        public int? EntityId { get; set; }

        [MaxLength(1000)]
        public string Details { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
