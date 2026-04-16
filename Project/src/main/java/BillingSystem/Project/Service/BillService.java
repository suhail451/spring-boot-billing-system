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
//        bill ka object bnao
            Bill bill=new Bill();
            bill.setDate(LocalDate.now());

//            bill ko save krlo
        return br.save(bill);
    }


    public Bill ShowBill(Long bill_id){
// repo say bill find kro is id wala or wo return kro
        return br.findById(bill_id).get();

    }




}
