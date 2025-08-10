import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from "typeorm"

export class CreateVendorTables1723276800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create vendor table
        await queryRunner.createTable(
            new Table({
                name: "vendor",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "address",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "city",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "state",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "zip_code",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "country",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "farm_name",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "farm_description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "farm_logo",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "commission_rate",
                        type: "decimal",
                        precision: 5,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: "verified_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        )

        // Add vendor_id to product table
        await queryRunner.addColumn(
            "product",
            {
                name: "vendor_id",
                type: "varchar",
                isNullable: true,
            }
        )

        await queryRunner.addColumn(
            "product",
            {
                name: "vendor_price",
                type: "decimal",
                precision: 10,
                scale: 2,
                isNullable: true,
            }
        )

        await queryRunner.addColumn(
            "product",
            {
                name: "platform_commission",
                type: "decimal",
                precision: 5,
                scale: 2,
                isNullable: true,
            }
        )

        await queryRunner.addColumn(
            "product",
            {
                name: "vendor_approved",
                type: "boolean",
                default: false,
            }
        )

        // Create indexes
        await queryRunner.createIndex(
            "vendor",
            new Index("IDX_vendor_email", ["email"])
        )

        await queryRunner.createIndex(
            "product",
            new Index("IDX_product_vendor_id", ["vendor_id"])
        )

        // Create foreign key constraint
        await queryRunner.createForeignKey(
            "product",
            new ForeignKey({
                columnNames: ["vendor_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "vendor",
                onDelete: "SET NULL",
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key
        const table = await queryRunner.getTable("product")
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("vendor_id") !== -1)
        if (foreignKey) {
            await queryRunner.dropForeignKey("product", foreignKey)
        }

        // Remove indexes
        await queryRunner.dropIndex("product", "IDX_product_vendor_id")
        await queryRunner.dropIndex("vendor", "IDX_vendor_email")

        // Remove columns from product table
        await queryRunner.dropColumn("product", "vendor_approved")
        await queryRunner.dropColumn("product", "platform_commission")
        await queryRunner.dropColumn("product", "vendor_price")
        await queryRunner.dropColumn("product", "vendor_id")

        // Drop vendor table
        await queryRunner.dropTable("vendor")
    }
}
