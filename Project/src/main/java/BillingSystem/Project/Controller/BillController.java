package BillingSystem.Project.Controller;


import BillingSystem.Project.Entity.Bill;
import BillingSystem.Project.Service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://127.0.0.1:5500") // CRITICAL: This allows your frontend to access the API
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

}
