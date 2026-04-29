using CareFund.Data;
using CareFund.Enums;
using CareFund.Models;
using System.Globalization;

namespace CareFund.Services.AuditLogs
{
    public class AuditLogService : IAuditLogService
    {
        private readonly ApplicationDbContext _context;

        public AuditLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(int? userId, UserRole? role, string action, string entityName, int? entityId, string details)
        {
            var indianTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            var indianTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indianTimeZone);

            var log = new AuditLog
            {
                UserId = userId,
                UserRole = role?.ToString() ?? string.Empty,
                Action = action?.Trim() ?? string.Empty,
                EntityName = entityName?.Trim() ?? string.Empty,
                EntityId = entityId,
                Details = details?.Trim() ?? string.Empty,
                Timestamp = indianTime
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
