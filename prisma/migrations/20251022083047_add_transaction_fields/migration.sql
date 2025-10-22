/*
  Warnings:

  - You are about to drop the column `created_by` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `created_by_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "payment_method" SET DEFAULT 'CASH';

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
