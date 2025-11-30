using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonSoftware.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSalonSettingsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BranchAddress",
                table: "SalonSettings",
                newName: "MainAddress");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "SalonSettings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BranchAddresses",
                table: "SalonSettings",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "SalonSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "BranchAddresses", "CreatedAt", "Email", "LogoUrl", "MainAddress", "Phone", "UpdatedAt" },
                values: new object[] { "[]", new DateTime(2025, 11, 29, 12, 3, 46, 329, DateTimeKind.Utc).AddTicks(1488), "info@elegantsalon.com", null, "123 Beauty Street, City, State - 400001", "+91 98765 43210", new DateTime(2025, 11, 29, 12, 3, 46, 329, DateTimeKind.Utc).AddTicks(1489) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BranchAddresses",
                table: "SalonSettings");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "SalonSettings");

            migrationBuilder.RenameColumn(
                name: "MainAddress",
                table: "SalonSettings",
                newName: "BranchAddress");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "SalonSettings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "BranchAddress", "CreatedAt", "Email", "Phone", "UpdatedAt" },
                values: new object[] { "123 Beauty Street, City", new DateTime(2025, 11, 29, 10, 3, 31, 882, DateTimeKind.Utc).AddTicks(1429), null, null, new DateTime(2025, 11, 29, 10, 3, 31, 882, DateTimeKind.Utc).AddTicks(1430) });
        }
    }
}
