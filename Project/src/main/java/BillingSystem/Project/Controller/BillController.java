package BillingSystem.Project.Controller;


import BillingSystem.Project.Entity.Bill;
import BillingSystem.Project.Service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/bills")
public class BillController {


    @Autowired
    private BillService bs;

    @PostMapping("create")
    public ResponseEntity<Bill> newBill(){
       Bill savedBill=bs.createBill();
       return ResponseEntity.status(HttpStatus.CREATED).body(savedBill);
    }

   @GetMapping("/{bill_id}")
    public ResponseEntity<Bill> show(@PathVariable Long bill_id){
        Bill shownBill = bs.ShowBill(bill_id);
        if(shownBill==null){
            return ResponseEntity.notFound().build();
        }
       return ResponseEntity.ok(shownBill);
   }

    // POS ke liye: Aaj ki total sales
    @GetMapping("/today-sales")
    public ResponseEntity<Double> getTodaySales(){
        Double total = bs.getTodayTotalSales();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/Weekly-sales")
    public ResponseEntity<Double> getTotalWeeklySales(){
         Double total=bs.getWeeklySales();
         return ResponseEntity.ok(total);


    }

    @GetMapping("/Monthly-sales")
    public ResponseEntity<Double> getTotalMonthlySales(){
        Double total=bs.getMonthlySales();
        return ResponseEntity.ok(total);


    }




}
