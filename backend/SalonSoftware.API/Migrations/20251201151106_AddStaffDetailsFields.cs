using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonSoftware.API.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffDetailsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AadharNumber",
                table: "Staff",
                type: "nvarchar(12)",
                maxLength: 12,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Staff",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Staff",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 1, 15, 11, 5, 551, DateTimeKind.Utc).AddTicks(1766), new DateTime(2025, 12, 1, 15, 11, 5, 551, DateTimeKind.Utc).AddTicks(1766) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AadharNumber",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Staff");

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 30, 11, 19, 9, 959, DateTimeKind.Utc).AddTicks(930), new DateTime(2025, 11, 30, 11, 19, 9, 959, DateTimeKind.Utc).AddTicks(931) });
        }
    }
}
