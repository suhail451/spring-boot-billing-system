package BillingSystem.Project.Controller;


import BillingSystem.Project.Entity.Bill;
import BillingSystem.Project.Service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://127.0.0.1:5500") // CRITICAL: This allows your frontend to access the API
@RestController
@RequestMapping("/api/bills")
public class BillController {


    @Autowired
    private BillService bs;

    @PostMapping("create")
    public Bill newbill(){

       return bs.createBill();
    }

   @GetMapping("/{bill_id}")
    public Bill show(@PathVariable Long bill_id){

       return bs.ShowBill(bill_id);

   }

}
