
-- AlterTable
ALTER TABLE `Invoice` MODIFY `paidDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Order` 
    MODIFY `paymentGateway` ENUM('CASHFREE', 'STRIPE', 'RAZORPAY') NULL;
