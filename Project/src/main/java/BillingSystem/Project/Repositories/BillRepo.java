package BillingSystem.Project.Repositories;


import BillingSystem.Project.Entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface BillRepo extends JpaRepository<Bill,Long> {

    @Query("SELECT COALESCE(SUM(bi.price), 0) FROM BillItem bi WHERE bi.bill.date = :today")
    Double getTotalSalesByDate(@Param("today") LocalDate today);


    @Query("SELECT COALESCE(SUM(bi.price), 0) FROM BillItem bi WHERE bi.bill.date >= :startDate AND bi.bill.date <= :endDate")
    Double getTotalSalesByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(bi.price), 0) FROM BillItem bi WHERE MONTH(bi.bill.date) = :month AND YEAR(bi.bill.date) = :year")
    Double getTotalSalesByMonth(@Param("month") int month, @Param("year") int year);
}
