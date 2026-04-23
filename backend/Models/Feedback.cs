using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareFund.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackId { get; set; }

        public int? UserId { get; set; }

        public int? DonationId { get; set; }

        [StringLength(200)]
        public string CharityName { get; set; } = string.Empty;

        public decimal? Amount { get; set; }

        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [StringLength(120)]
        public string PaymentReference { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        [StringLength(2000)]
        public string Experience { get; set; } = string.Empty;

        [StringLength(2000)]
        public string Suggestion { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("DonationId")]
        public Donation? Donation { get; set; }
    }
}
