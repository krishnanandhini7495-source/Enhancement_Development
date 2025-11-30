using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonSoftware.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBranchDetailsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BranchAddresses",
                table: "SalonSettings",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)",
                oldMaxLength: 2000);

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 30, 10, 42, 35, 750, DateTimeKind.Utc).AddTicks(1369), new DateTime(2025, 11, 30, 10, 42, 35, 750, DateTimeKind.Utc).AddTicks(1370) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BranchAddresses",
                table: "SalonSettings",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(4000)",
                oldMaxLength: 4000);

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 29, 12, 3, 46, 329, DateTimeKind.Utc).AddTicks(1488), new DateTime(2025, 11, 29, 12, 3, 46, 329, DateTimeKind.Utc).AddTicks(1489) });
        }
    }
}
