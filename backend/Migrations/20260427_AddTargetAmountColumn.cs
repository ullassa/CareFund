using CareFund.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CareFund.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260427_AddTargetAmountColumn")]
    public partial class AddTargetAmountColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF OBJECT_ID('dbo.Charities', 'U') IS NOT NULL
  AND COL_LENGTH('dbo.Charities', 'TargetAmount') IS NULL
BEGIN
    ALTER TABLE [dbo].[Charities]
    ADD [TargetAmount] decimal(18,2) NOT NULL DEFAULT(100000);
END");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF OBJECT_ID('dbo.Charities', 'U') IS NOT NULL
  AND COL_LENGTH('dbo.Charities', 'TargetAmount') IS NOT NULL
BEGIN
    ALTER TABLE [dbo].[Charities]
    DROP COLUMN [TargetAmount];
END");
        }
    }
}