using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonSoftware.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductStockManagementFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CurrentStockDate",
                table: "Products",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentStockQuantity",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OpeningStockDate",
                table: "Products",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OpeningStockQuantity",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ProductWeight",
                table: "Products",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductWeightUnit",
                table: "Products",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "SalonName", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 6, 14, 13, 13, 402, DateTimeKind.Utc).AddTicks(1888), "Cheap&Best Salon", new DateTime(2025, 12, 6, 14, 13, 13, 402, DateTimeKind.Utc).AddTicks(1889) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentStockDate",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CurrentStockQuantity",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OpeningStockDate",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OpeningStockQuantity",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductWeight",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductWeightUnit",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "SalonName", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 1, 15, 11, 5, 551, DateTimeKind.Utc).AddTicks(1766), "Elegant Salon", new DateTime(2025, 12, 1, 15, 11, 5, 551, DateTimeKind.Utc).AddTicks(1766) });
        }
    }
}
