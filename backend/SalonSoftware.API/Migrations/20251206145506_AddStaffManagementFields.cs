using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalonSoftware.API.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffManagementFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BankAccountNumber",
                table: "Staff",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "Staff",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IfscCode",
                table: "Staff",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StaffCategory",
                table: "Staff",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "StaffSalaryHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BasicSalary = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    EffectiveFromDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EffectiveToDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffSalaryHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StaffSalaryHistory_Staff_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Staff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 6, 14, 55, 5, 622, DateTimeKind.Utc).AddTicks(9398), new DateTime(2025, 12, 6, 14, 55, 5, 622, DateTimeKind.Utc).AddTicks(9399) });

            migrationBuilder.CreateIndex(
                name: "IX_StaffSalaryHistory_StaffId",
                table: "StaffSalaryHistory",
                column: "StaffId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StaffSalaryHistory");

            migrationBuilder.DropColumn(
                name: "BankAccountNumber",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "BankName",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "IfscCode",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "StaffCategory",
                table: "Staff");

            migrationBuilder.UpdateData(
                table: "SalonSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 12, 6, 14, 13, 13, 402, DateTimeKind.Utc).AddTicks(1888), new DateTime(2025, 12, 6, 14, 13, 13, 402, DateTimeKind.Utc).AddTicks(1889) });
        }
    }
}
