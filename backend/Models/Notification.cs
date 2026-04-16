using System.ComponentModel.DataAnnotations; 

using System.ComponentModel.DataAnnotations.Schema; 

using CareFund.Enums; 

  

namespace CareFund.Models 

{ 

    public class Notification 

    { 

        [Key] 

        public int NotificationId { get; set; } 

  

  

 

  

        [Required] 

        public int UserId { get; set; } 

  

  

     

  

        public int? DonationId { get; set; } 

  

  

         

  

        [Required(ErrorMessage = "Message cannot be empty")] 

        [StringLength(1000)] 

        public string Message { get; set; } = string.Empty; 

  

  

  

        [Required] 

        public NotificationType NotificationType { get; set; } 

  

  

        public DateTime SentAt { get; set; } = DateTime.UtcNow; 

  

  

        

  

        [ForeignKey("UserId")] 

        public User? User { get; set; } 

  

  

        [ForeignKey("DonationId")] 

        public Donation? Donation { get; set; } 

    } 

} 