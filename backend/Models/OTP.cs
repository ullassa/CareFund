using System.ComponentModel.DataAnnotations; 

using System.ComponentModel.DataAnnotations.Schema; 

using CareFund.Enums; 

  

namespace CareFund.Models 

{ 

    public class Otp 

    { 

        [Key] 

        public int OtpId { get; set; } 

  

  

        // user requesting OTP 

  

        [Required] 

        public int UserId { get; set; } 

  

  

        // generated OTP code 

  

        [Required] 

        [StringLength(10)] 

        public string OtpCode { get; set; } = string.Empty; 

  

  

        // email or phone verification 

  

        [Required] 

        public OtpType OtpType { get; set; } 

  

  

        // expiry time (example: 5 minutes) 

  

        [Required] 

        public DateTime ExpiryTime { get; set; } 

  

  

        // when OTP created 

  

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 

  

  

        // whether OTP already used 

  

        public bool IsUsed { get; set; } = false; 

  

  

        // navigation 

  

        [ForeignKey("UserId")] 

        public User? User { get; set; } 

    } 

} 