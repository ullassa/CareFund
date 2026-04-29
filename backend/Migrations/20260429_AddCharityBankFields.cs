using CareFund.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CareFund.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260429_AddCharityBankFields")]
    public partial class AddCharityBankFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccountHolderName",
                table: "Charities",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AccountNumber",
                table: "Charities",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "Charities",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IFSCCode",
                table: "Charities",
                type: "nvarchar(11)",
                maxLength: 11,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountHolderName",
                table: "Charities");

            migrationBuilder.DropColumn(
                name: "AccountNumber",
                table: "Charities");

            migrationBuilder.DropColumn(
                name: "BankName",
                table: "Charities");

            migrationBuilder.DropColumn(
                name: "IFSCCode",
                table: "Charities");
        }
    }
}
