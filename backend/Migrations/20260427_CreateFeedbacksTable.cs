using CareFund.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CareFund.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260427_CreateFeedbacksTable")]
    public partial class CreateFeedbacksTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF OBJECT_ID('dbo.Feedbacks', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Feedbacks] (
        [FeedbackId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [UserId] INT NULL,
        [DonationId] INT NULL,
        [CharityName] NVARCHAR(200) NOT NULL DEFAULT(''),
        [Amount] DECIMAL(18,2) NULL,
        [PaymentMethod] NVARCHAR(50) NOT NULL DEFAULT(''),
        [PaymentReference] NVARCHAR(120) NOT NULL DEFAULT(''),
        [Rating] INT NOT NULL,
        [Experience] NVARCHAR(2000) NOT NULL,
        [Suggestion] NVARCHAR(2000) NOT NULL DEFAULT(''),
        [CreatedAt] DATETIME2 NOT NULL DEFAULT(SYSUTCDATETIME())
    );
END");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF OBJECT_ID('dbo.Feedbacks', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[Feedbacks];
END");
        }
    }
}