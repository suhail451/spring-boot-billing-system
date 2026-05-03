package BillingSystem.Project.Service;


import BillingSystem.Project.Entity.Bill;
import BillingSystem.Project.Repositories.BillRepo;
import BillingSystem.Project.Repositories.BillitemRepo;
import BillingSystem.Project.Repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class BillService {


    @Autowired
    private BillRepo br;

    @Autowired
    private ProductRepo sr;

    @Autowired
    private BillitemRepo bi;


    public Bill createBill(){
            Bill bill=new Bill();
            bill.setDate(LocalDate.now());
        return br.save(bill);
    }


    public Bill ShowBill(Long bill_id){
        return br.findById(bill_id).get();
    }

    // Aaj ki total sales calculate karo
    public Double getTodayTotalSales(){
        Double total = br.getTotalSalesByDate(LocalDate.now());
        return total != null ? total : 0.0;
    }


    public Double getWeeklySales(){
        LocalDate start=LocalDate.now().minusDays(7);
        LocalDate end=LocalDate.now();
        Double total=br.getTotalSalesByDateRange(start,end);
        return total != null ? total : 0.0;
    }

    public Double getMonthlySales(){

        int month = LocalDate.now().getMonthValue(); // 5 (May)
        int year = LocalDate.now().getYear();        // 2026
        Double total = br.getTotalSalesByMonth(month, year);
        return total != null ? total : 0.0;
    }




}
