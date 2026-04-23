using System.Security.Claims;
using CareFund.Data;
using CareFund.Enums;
using CareFund.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareFund.Controllers;

[ApiController]
[Route("api/feedback")]
[Authorize]
public class FeedbackController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FeedbackController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackRequest request)
    {
        if (request == null)
            return BadRequest(new { success = false, message = "Feedback payload is required." });

        if (request.Rating < 1 || request.Rating > 5)
            return BadRequest(new { success = false, message = "Rating must be between 1 and 5." });

        if (string.IsNullOrWhiteSpace(request.Experience))
            return BadRequest(new { success = false, message = "Experience is required." });

        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrWhiteSpace(userEmail))
            return Unauthorized(new { success = false, message = "Invalid token claims." });

        var normalizedEmail = userEmail.Trim().ToLowerInvariant();

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (user == null)
            return NotFound(new { success = false, message = "User account not found." });

        int? donationId = null;

        if (!string.IsNullOrWhiteSpace(request.PaymentReference) && user.UserRole == UserRole.Customer)
        {
            donationId = await _context.Donations
                .AsNoTracking()
                .Include(d => d.Payment)
                .Include(d => d.Customer)
                .Where(d => d.Customer != null && d.Customer.UserId == user.UserId)
                .Where(d => d.Payment != null && d.Payment.TransactionReference == request.PaymentReference)
                .Select(d => (int?)d.DonationId)
                .FirstOrDefaultAsync();
        }

        var feedback = new Feedback
        {
            UserId = user.UserId,
            DonationId = donationId,
            CharityName = request.CharityName?.Trim() ?? string.Empty,
            Amount = request.Amount,
            PaymentMethod = request.PaymentMethod?.Trim() ?? string.Empty,
            PaymentReference = request.PaymentReference?.Trim() ?? string.Empty,
            Rating = request.Rating,
            Experience = request.Experience.Trim(),
            Suggestion = request.Suggestion?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Feedback could not be saved due to a server issue.",
                detail = ex.Message
            });
        }

        return Ok(new { success = true, feedbackId = feedback.FeedbackId, message = "Feedback submitted successfully." });
    }
}

public class CreateFeedbackRequest
{
    public string? CharityName { get; set; }
    public decimal? Amount { get; set; }
    public string? PaymentMethod { get; set; }
    public string? PaymentReference { get; set; }
    public int Rating { get; set; }
    public string Experience { get; set; } = string.Empty;
    public string? Suggestion { get; set; }
}
