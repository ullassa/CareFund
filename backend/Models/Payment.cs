using System.ComponentModel.DataAnnotations; 

using CareFund.Enums; 

  

namespace CareFund.Models 

{ 

    public class Payment 

    { 

        [Key] 

        public int PaymentId { get; set; } 

  

  

         

  

        [Required] 

        public PaymentMethod PaymentMethod { get; set; } 

  

  

         

  

        [StringLength(200)] 

        public string? TransactionReference { get; set; } 

  

  

         

  

        public DateTime PaymentDate { get; set; } = DateTime.UtcNow; 

  

  

        

  

        public Donation? Donation { get; set; } 

    } 

} 