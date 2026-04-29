using CareFund.Enums;

namespace CareFund.Services.AuditLogs
{
    public interface IAuditLogService
    {
        Task LogAsync(int? userId, UserRole? role, string action, string entityName, int? entityId, string details);
    }
}
