namespace CareFund.DTOs.Charity
{
    public class PublicCharityDto
    {
        public int CharityId { get; set; }
        public string CharityName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Cause { get; set; }
        public string? Location { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}