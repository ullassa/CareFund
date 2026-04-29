using CareFund.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CareFund.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260427_CreateFavoriteCharitiesTable")]
    public partial class CreateFavoriteCharitiesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF OBJECT_ID('dbo.FavoriteCharities', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[FavoriteCharities] (
        [FavoriteCharityId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CustomerId] INT NOT NULL,
        [CharityRegistrationId] INT NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT(SYSUTCDATETIME())
    );

    CREATE UNIQUE INDEX [IX_FavoriteCharities_CustomerId_CharityRegistrationId]
        ON [dbo].[FavoriteCharities]([CustomerId], [CharityRegistrationId]);
END");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF OBJECT_ID('dbo.FavoriteCharities', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[FavoriteCharities];
END");
        }
    }
}